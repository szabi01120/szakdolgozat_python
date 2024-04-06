from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

def create_app(): 
    app = Flask(__name__)
    CORS(app, resources={r"*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
    # database config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['JSON_AS_ASCII'] = False

    return app

app = create_app()
db = SQLAlchemy(app)

class Termekek(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    termeknev = db.Column(db.String(255), nullable=False)
    tipus = db.Column(db.String(255), nullable=False)
    meretek = db.Column(db.String(255), nullable=False)

# database create
with app.app_context():
    db.create_all()
