from flask_sqlalchemy import SQLAlchemy
import config
from uuid import uuid4

def get_uuid():
    return uuid4().hex

app = config.create_app()
db = SQLAlchemy(app)

class Image(db.Model):
    __tablename__ = 'images'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    title = db.Column(db.String(120), index=True)
    
class ProductTypes(db.Model):
    __tablename__ = 'product_types'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_type = db.Column(db.String(255), nullable=False)
    
class ProductManufacturers(db.Model):
    __tablename__ = 'product_manufacturers'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    manufacturer = db.Column(db.String(255), nullable=False)
    
class Products(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    incoming_invoice = db.Column(db.String(255), nullable=False) 
    product_name = db.Column(db.String(255), nullable=False)
    product_type = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    manufacturer = db.Column(db.String(255), nullable=False)
    incoming_price = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(255), nullable=False)
    sold = db.Column(db.Boolean, default=False) 
    shipped = db.Column(db.Boolean, default=False)  
    hasPhotos = db.Column(db.Boolean, default=False)
    
class Templates(db.Model):
    __tablename__ = 'templates'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    template_name = db.Column(db.String(255), nullable=False)

class SoldProducts(db.Model):
    __tablename__ = 'sold_products'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    incoming_invoice = db.Column(db.String(255), nullable=False)
    outgoing_invoice = db.Column(db.String(255), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    product_type = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    customer_name = db.Column(db.String(255), nullable=False)
    manufacturer = db.Column(db.String(255), nullable=False)
    incoming_price = db.Column(db.Float, nullable=False)
    selling_price = db.Column(db.Float, nullable=False)
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