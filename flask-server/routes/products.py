from flask import Blueprint, request, jsonify
from dbConfig import db, Products, Image
import config
import os
import shutil

products_bp = Blueprint('products', __name__)

# Termékek lekérdezése
@products_bp.route("/api/products", methods=["GET"])
def get_products():
    products = Products.query.all()
    return jsonify([{
        "id": product.id,
        "product_name": product.product_name,
        "product_type": product.product_type,
        "product_size": product.product_size,
        "quantity": product.quantity,
        "manufacturer": product.manufacturer,
        "price": product.price,
        "currency": product.currency
    } for product in products]), 200

# Termék frissítése
@products_bp.route("/api/update_product/<int:id>", methods=["PUT"])
def update_product(id):
    productName = request.json.get("product_name")
    productType = request.json.get("product_type")
    productSize = request.json.get("product_size")
    productQuantity = request.json.get("product_quantity")
    productManufacturer = request.json.get("product_manufacturer")
    productPrice = request.json.get("product_price")
    productCurrency = request.json.get("product_currency")

    product = Products.query.get(id)
    if product is None:
        return jsonify({"error": "Nincs ilyen termék!"}), 404
    
    product.product_name = productName
    product.product_type = productType
    product.product_size = productSize
    product.quantity = int(productQuantity)
    product.manufacturer = productManufacturer
    product.price = float(productPrice)
    product.currency = productCurrency
    
    db.session.commit()
    
    return jsonify({"message": "Termék sikeresen frissítve!"}), 200

# Termék törlése
@products_bp.route("/api/delete_product/<int:id>", methods=["DELETE"])
def delete_product(id):
    product = Products.query.get(id)
    product_img = Image.query.filter_by(product_id=id).all()
    
    if product is None:
        return jsonify({"error": "Nincs ilyen termék!"}), 404
    db.session.delete(product)
    db.session.commit()
    print("TERMEK KEP:", product_img)
    
    # id mappa törlés ha van kép
    if product_img is not None:
        folder_path = os.path.join(config.UPLOAD_FOLDER, str(id))
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)
            
        for image in product_img: # product_img egy listát ad vissza, végigteráljuk
            db.session.delete(image)
        db.session.commit()
    
    return jsonify({"message": "Termék sikeresen törölve!"}), 200

# Termék hozzáadása
@products_bp.route("/api/add_product", methods=["POST"])
def add_product():
    productName = request.json.get("product_name")
    productType = request.json.get("product_type")
    productSize = request.json.get("product_size")
    productQuantity = request.json.get("quantity")
    productManufacturer = request.json.get("manufacturer")
    productPrice = request.json.get("price")
    productCurrency = request.json.get("currency")

    product = Products(product_name=productName, product_type=productType, product_size=productSize, quantity=productQuantity, manufacturer=productManufacturer, price=productPrice, currency=productCurrency)
    db.session.add(product)
    db.session.commit()
    
    product_id = product.id
    return jsonify({
        "message": "Termék sikeresen hozzáadva!",
        "product_id": product_id
    }), 200
