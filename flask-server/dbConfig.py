from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import ApplicationConfig
from uuid import uuid4

def get_uuid():
    return uuid4().hex

def create_app(): 
    app = Flask(__name__)
    CORS(app, resources={r"*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
    # database config
    app.config.from_object(ApplicationConfig)

    return app

app = create_app()
db = SQLAlchemy(app)

class Termekek(db.Model):
    __tablename__ = 'termekek'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    termeknev = db.Column(db.String(255), nullable=False)
    tipus = db.Column(db.String(255), nullable=False)
    meretek = db.Column(db.String(255), nullable=False)

class Felhasznalok(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(255), nullable=False)
    password = db.Column(db.Text, nullable=False)

# database create
with app.app_context():
    db.create_all()
