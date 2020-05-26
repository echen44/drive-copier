import os


class Config(object):
    ACCESS_TOKEN_URI = 'https://www.googleapis.com/oauth2/v4/token'
    AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent'
    AUTHORIZATION_SCOPE = ['openid', 'https://www.googleapis.com/auth/drive']
    AUTH_REDIRECT_URI = os.environ.get("AUTH_REDIRECT_URI", default=False)
    BASE_URI = os.environ.get("BASE_URI", default=False)
    CLIENT_ID = os.environ.get("CLIENT_ID", default=False)
    CLIENT_SECRET = os.environ.get("CLIENT_SECRET", default=False)
    SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", default=False)
    GOOGLE_DISCOVERY_URL = (
        "https://accounts.google.com/.well-known/openid-configuration"
    )
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI", default=False)
    SQLALCHEMY_TRACK_MODIFICATIONS = False