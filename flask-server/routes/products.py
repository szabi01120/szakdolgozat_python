from flask import Blueprint, request, jsonify
from dbConfig import db, Products, Image, SoldProducts
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
        "incoming_invoice": product.incoming_invoice,
        "product_name": product.product_name,
        "product_type": product.product_type,
        "product_size": product.product_size,
        "quantity": product.quantity,
        "manufacturer": product.manufacturer,
        "price": product.price,
        "currency": product.currency,
    } for product in products]), 200

# Termék frissítése
@products_bp.route("/api/update_product/<int:id>", methods=["PUT"])
def update_product(id):
    incomingInvoice = request.json.get("incoming_invoice")
    productName = request.json.get("product_name")
    productType = request.json.get("product_type")
    productSize = request.json.get("product_size")
    productQuantity = request.json.get("product_quantity")
    productManufacturer = request.json.get("product_manufacturer")
    productPrice = request.json.get("product_price")

    product = Products.query.get(id)
    if product is None:
        return jsonify({"error": "Nincs ilyen termék!"}), 404
    
    product.incoming_invoice = incomingInvoice
    product.product_name = productName
    product.product_type = productType
    product.product_size = productSize
    product.quantity = int(productQuantity)
    product.manufacturer = productManufacturer
    product.price = float(productPrice)
    
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
    incomingInvoice = request.json.get("incoming_invoice")
    productName = request.json.get("product_name")
    productType = request.json.get("product_type")
    productSize = request.json.get("product_size")
    productQuantity = request.json.get("quantity")
    productManufacturer = request.json.get("manufacturer")
    productPrice = request.json.get("price")
    productCurrency = request.json.get("currency")

    product = Products(incoming_invoice=incomingInvoice, product_name=productName, product_type=productType, product_size=productSize, quantity=productQuantity, manufacturer=productManufacturer, price=productPrice, currency=productCurrency)
    db.session.add(product)
    db.session.commit()
    
    product_id = product.id
    return jsonify({
        "message": "Termék sikeresen hozzáadva!",
        "product_id": product_id
    }), 200

# Termékek áthelyezése a sold_products táblába
@products_bp.route("/api/update_product_status", methods=["POST"])
def update_product_status():
    product_ids = request.json
    if not isinstance(product_ids, list):
        return jsonify({"error": "Érvénytelen kérésformátum!"}), 400

    # Áthelyezendő termékek lekérdezése
    products_to_move = Products.query.filter(Products.id.in_(product_ids)).all()

    for product in products_to_move:
        # Új rekord létrehozása a sold_products táblában
        sold_product = SoldProducts(
            product_id=product.id,
            incoming_invoice=product.incoming_invoice,
            outgoing_invoice="asd",
            product_name=product.product_name,
            product_type=product.product_type,
            product_size=product.product_size,
            quantity=product.quantity,
            manufacturer=product.manufacturer,
            price=product.price,
            currency=product.currency,
            date=db.func.now()
        )
        db.session.add(sold_product)
        db.session.delete(product)

    try:
        db.session.commit()
        return jsonify({"message": "Termékek sikeresen áthelyezve."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Hiba történt az áthelyezés során: {str(e)}"}), 500
    
# SoldProducts tábla lekérdezése
@products_bp.route("/api/sold_products", methods=["GET"])
def get_sold_products():
    sold_products = SoldProducts.query.all()
    return jsonify([{
        "id": product.product_id,
        "incoming_invoice": product.incoming_invoice,
        "outgoing_invoice": product.outgoing_invoice,
        "product_name": product.product_name,
        "product_type": product.product_type,
        "product_size": product.product_size,
        "quantity": product.quantity,
        "manufacturer": product.manufacturer,
        "price": product.price,
        "currency": product.currency,
        "date": product.date.strftime("%Y-%m-%d %H:%M:%S")
    } for product in sold_products]), 200

# SoldProducts tábla frissítése
@products_bp.route("/api/update_sold_product/<int:id>", methods=["PUT"])
def update_sold_product(id):
    incomingInvoice = request.json.get("incoming_invoice")
    outgoingInvoice = request.json.get("outgoing_invoice")
    productName = request.json.get("product_name")
    productType = request.json.get("product_type")
    productSize = request.json.get("product_size")
    productQuantity = request.json.get("product_quantity")
    productManufacturer = request.json.get("product_manufacturer")
    productPrice = request.json.get("product_price")

    product = SoldProducts.query.get(id)
    if product is None:
        return jsonify({"error": "Nincs ilyen termék!"}), 404
    
    product.incoming_invoice = incomingInvoice
    product.outgoing_invoice = outgoingInvoice
    product.product_name = productName
    product.product_type = productType
    product.product_size = productSize
    product.quantity = int(productQuantity)
    product.manufacturer = productManufacturer
    product.price = float(productPrice)
    
    db.session.commit()
    
    return jsonify({"message": "Termék sikeresen frissítve!"}), 200

@products_bp.route("/api/delete_sold_product/<int:id>", methods=["DELETE"])
def delete_sold_product(id):
    product = SoldProducts.query.get(id)
    product_img = Image.query.filter_by(product_id=id).all()
    
    if product is None:
        return jsonify({"error": "Nincs ilyen termék!"}), 404
    
    db.session.delete(product)
    db.session.commit()
    
    # Ellenőrizzük, hogy van-e kép az adott termékhez
    if product_img:
        folder_path = os.path.join(config.UPLOAD_FOLDER, str(id))
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)
        
        for image in product_img:
            db.session.delete(image)
        db.session.commit()
    
    return jsonify({"message": "Termék sikeresen törölve!"}), 200
