from dotenv import load_dotenv
import os
import redis

UPLOAD_FOLDER = 'static/uploads'
MAX_CONTENT_LENGTH = 512 * 1024 * 1024  # 512 MB max

load_dotenv()

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

    # Használjuk a REDIS_HOST környezeti változót
    redis_host = os.environ.get("REDIS_HOST", "localhost")
    SESSION_REDIS = redis.from_url(f"redis://{redis_host}:6379")

    # Flask-Mail konfiguráció
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'tesztflasktesztflask@gmail.com'
    MAIL_PASSWORD = os.environ["MAIL_PASSWORD"]
