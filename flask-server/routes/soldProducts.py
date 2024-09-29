from flask import Blueprint, request, jsonify
from dbConfig import db, SoldProducts, Image
import config
import os
import shutil

soldProducts_bp = Blueprint('soldProducts', __name__)

# SoldProducts tábla lekérdezése
@soldProducts_bp.route("/api/sold_products", methods=["GET"])
def get_sold_products():
    sold_products = SoldProducts.query.all()
    return jsonify([{
        "id": product.id,
        "product_id": product.product_id,
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

# SoldProducts táblából törlés
@soldProducts_bp.route("/api/delete_sold_product/<int:id>", methods=["DELETE"])
def delete_sold_product(id):
    product = SoldProducts.query.get(id)
    product_img = Image.query.filter_by(product_id=id).all()
    
    if product is None:
        return jsonify({"error": "Nincs ilyen termék!"}), 404
    
    db.session.delete(product)
    db.session.commit()
    
    # van e kép a termékhez
    if product_img:
        folder_path = os.path.join(config.UPLOAD_FOLDER, str(id))
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)
        
        for image in product_img:
            db.session.delete(image)
        db.session.commit()
    
    return jsonify({"message": "Termék sikeresen törölve!"}), 200

# Termék frissítése
@soldProducts_bp.route("/api/update_sold_product/<int:id>", methods=["PUT"])
def update_sold_product(id):
    incomingInvoice = request.json.get("incoming_invoice")
    outgoingInvoice = request.json.get("outgoing_invoice")
    productName = request.json.get("product_name")
    productType = request.json.get("product_type")
    productSize = request.json.get("product_size")
    productQuantity = request.json.get("quantity") # KI LESZ TÖRÖLVE
    productManufacturer = request.json.get("manufacturer")
    productPrice = request.json.get("price")
    productCurrency = request.json.get("currency")

    product = SoldProducts.query.get(id)
    if product is None:
        return jsonify({"error": "Nincs ilyen termék!"}), 404
    
    product.incoming_invoice = incomingInvoice
    product.outgoing_invoice = outgoingInvoice
    product.product_name = productName
    product.product_type = productType
    product.product_size = productSize
    product.quantity = productQuantity
    product.manufacturer = productManufacturer
    product.price = productPrice
    product.currency = productCurrency
    
    db.session.commit()
    
    return jsonify({"message": "Termék sikeresen frissítve!"}), 200