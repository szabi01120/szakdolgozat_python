from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import ApplicationConfig
from uuid import uuid4

def get_uuid():
    return uuid4().hex

def create_app(): 
    app = Flask(__name__)
    CORS(app, resources={r"*": {"origins": "http://localhost:3000", "supports_credentials":True }})
    # database config
    app.config.from_object(ApplicationConfig)
    app.config['SESSION_COOKIE_HTTPONLY'] = False

    return app

app = create_app()
db = SQLAlchemy(app)

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    title = db.Column(db.String(120), index=True)

class Products(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String(255), nullable=False)
    product_type = db.Column(db.String(255), nullable=False)
    product_size = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    manufacturer = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(255), nullable=False)
    
class Templates(db.Model):
    __tablename__ = 'templates'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    template_name = db.Column(db.String(255), nullable=False)

class SoldProducts(db.Model):
    __tablename__ = 'sold_products'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    product_name = db.Column(db.String(255), nullable=False)
    product_type = db.Column(db.String(255), nullable=False)
    product_size = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    manufacturer = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(255), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    
class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    username = db.Column(db.String(345), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    
# database create
with app.app_context():
    db.create_all()