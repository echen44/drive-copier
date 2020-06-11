from flask import Flask, render_template, request, jsonify, url_for, session, redirect
import flask
from time import time
from oauthlib.oauth2 import WebApplicationClient
import requests
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from utils import extractIds
from copier import Copier
from json import dumps
from config import Config
from database import db
from flask_migrate import Migrate


ACCESS_TOKEN = 'access_token'
STATE = 'state'
EXPIRES_AT = 'expires_at'
EXPIRES_IN = 'expires_in'
EMAIL = 'email'
ID_TOKEN = 'id_token'
REFRESH_TOKEN = 'refresh_token'
SUB = 'sub'


app = Flask(__name__, static_url_path='/static')
app.config.from_object(Config)
app.secret_key = app.config['SECRET_KEY']
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {"pool_pre_ping": True}
client = WebApplicationClient(app.config['CLIENT_ID'])
db.init_app(app)
migrate = Migrate(app, db)

from user import User


def get_google_provider_cfg():
    return requests.get(app.config['GOOGLE_DISCOVERY_URL']).json()


def is_logged_in():
    return SUB in session


def has_refresh_token():
    return session.get(REFRESH_TOKEN, None)


def is_token_valid():
    if session[EXPIRES_AT]:
        return time() < session[EXPIRES_AT]
    else:
        return False


@app.route('/')
def home():
    if is_logged_in():
        if is_token_valid():
            return render_template('drive.html')
        else:
            if has_refresh_token():
                return flask.redirect(url_for('refresh'), code=302)
            else:
                return render_template('login.html')
    else:
        return render_template('login.html')


@app.route('/login')
def login():
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    url, headers, body = client.prepare_authorization_request(
        authorization_endpoint,
        redirect_url=app.config['AUTH_REDIRECT_URI'],
        scope=app.config['AUTHORIZATION_SCOPE'],
        access_type='offline'
    )

    session[STATE] = client.state
    return redirect(url)


@app.route('/refresh')
def refresh():
    assert(is_logged_in())
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    url, headers, body = client.prepare_refresh_token_request(token_endpoint,
                                                              client_id=app.config['CLIENT_ID'],
                                                              client_secret=app.config['CLIENT_SECRET'],
                                                              refresh_token=session[REFRESH_TOKEN],
                                                              )

    token_response = requests.post(url,
                                   headers=headers,
                                   data=body)

    access_token = token_response.json()[ACCESS_TOKEN]
    expires_at = token_response.json()[EXPIRES_IN] + int(time())
    User.update_token(session[SUB], access_token, expires_at)
    session[ACCESS_TOKEN] = access_token
    session[EXPIRES_AT] = expires_at
    return redirect(app.config['BASE_URI'])


@app.route('/callback')
def callback():
    response_state = request.args.get(STATE, default=None, type=None)

    if response_state != flask.session[STATE]:
        response = flask.make_response('Invalid state parameter', 401)
        return response

    code = request.args.get("code")
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    url, headers, body = client.prepare_token_request(token_endpoint,
                                                      # authorization_response=new_auth,
                                                      redirect_url=app.config['AUTH_REDIRECT_URI'],
                                                      code=code,
                                                      client_secret=app.config['CLIENT_SECRET']
                                                      )

    token_response = requests.post(url,
                                   headers=headers,
                                   data=body)

    expires_at = token_response.json()[EXPIRES_IN] + int(time())

    client.parse_request_body_response(dumps(token_response.json()))

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    sub = userinfo_response.json()[SUB]
    access_token = token_response.json()[ACCESS_TOKEN]

    # https://developers.google.com/identity/protocols/oauth2/openid-connect#refresh-tokens
    refresh_token = token_response.json().get(REFRESH_TOKEN, None)

    user = User.get(sub)
    if not user:
        user = User.create(sub, access_token=access_token, expires_at=expires_at, refresh_token=refresh_token)
    else:
        user = User.update_token(sub, access_token=access_token, expires_at=expires_at, refresh_token=refresh_token)

    session[SUB] = sub
    session[ACCESS_TOKEN] = access_token
    session[EXPIRES_AT] = expires_at

    if refresh_token:
        session[REFRESH_TOKEN] = refresh_token
    else:
        session[REFRESH_TOKEN] = user.refresh_token

    flask.session.permanent = True
    return redirect('/')


@app.route('/token')
def token():
    response = {
        ACCESS_TOKEN: session[ACCESS_TOKEN]
    }
    return jsonify(response)


@app.route('/signout')
def sign_out():
    session.pop(SUB, None)
    session.pop(ACCESS_TOKEN, None)
    session.pop(EXPIRES_AT, None)
    session.pop(REFRESH_TOKEN, None)
    return redirect(app.config['BASE_URI'], code=302)


@app.route('/go', methods=['GET', 'POST'])
def go():
    """
    Requests from users go here
    :return:
    """
    if request.method == 'POST':
        # extract all details from user request
        json = request.get_json()
        public = json['public']
        links = json['links']
        folder_id = json['folderId']
        cred = Credentials(session[ACCESS_TOKEN])
        service = build('drive', 'v3', credentials=cred)

        # extract ids from links
        # match pattern is 25 words or dash characters, might change this later
        pattern = '[-\w]{25,}'
        file_ids = extractIds(pattern, links)

        response_body = dict()
        response_body['response'] = []

        c = Copier(service)

        response_body['response'] = c.make_copies(file_ids, public=public, destination=folder_id)
        return jsonify(response_body), 200

    else:
        # fun
        message = {'greeting': 'Hello boss'}
        return jsonify(message)


if __name__ == "__main__":
    app.run(host='localhost', ssl_context="adhoc")
