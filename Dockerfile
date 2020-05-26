# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.7-slim

# Copy local code to the container image.
ENV APP_HOME /app
ENV AUTH_REDIRECT_URI http://localhost/callback
ENV BASE_URI http://localhost
ENV CLIENT_ID <YOURS GOES HERE>
ENV CLIENT_SECRET <YOURS GOES HERE>
ENV SQLALCHEMY_DATABASE_URI <YOURS GOES HERE>
ENV FLASK_SECRET_KEY <YOURS GOES HERE>
WORKDIR $APP_HOME
COPY ./app/requirements.txt /app
RUN pip install -r requirements.txt
RUN pip install gunicorn
COPY ./app /app


CMD exec gunicorn --bind :80 --workers 1 --threads 8 --timeout 0 app:app
