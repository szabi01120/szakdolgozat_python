from dotenv import load_dotenv
from flask import Flask
import os
import redis
from flask_cors import CORS

load_dotenv()

MAX_CONTENT_LENGTH = 512 * 1024 * 1024

def create_app(): 
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    # database config
    app.config.from_object(ApplicationConfig)
    app.config['SESSION_COOKIE_HTTPONLY'] = False

    return app

# Flask konfiguráció
class ApplicationConfig:
    SECRET_KEY = os.environ["SECRET_KEY"]

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    JSON_AS_ASCII = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"

    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url("redis://redis:6379")

    # Flask-Mail konfiguráció
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'tesztflasktesztflask@gmail.com'
    MAIL_PASSWORD = os.environ["MAIL_PASSWORD"]
