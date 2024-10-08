from flask import Blueprint, request, jsonify
from dbConfig import db, SoldProducts, Image
import services.file_service as f
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
        "quantity": product.quantity,
        "customer_name": product.customer_name,
        "manufacturer": product.manufacturer,
        "incoming_price": product.incoming_price,
        "selling_price": product.selling_price,
        "currency": product.currency,
        "date": product.date.strftime("%Y-%m-%d")
    } for product in sold_products]), 200

# SoldProducts táblából törlés
@soldProducts_bp.route("/api/delete_sold_product/<int:id>", methods=["DELETE"])
def delete_sold_product(id):
    product = SoldProducts.query.get(id)
    product_img = Image.query.filter_by(product_id=id).all()
    
    if product is None:
        return jsonify({"error": "Nincs ilyen termék!"}), 404
    
    try:
        db.session.delete(product)
        db.session.commit()
        
        # van e kép a termékhez
        if product_img:
            folder_path = os.path.join(f.UPLOAD_FOLDER, str(id))
            if os.path.exists(folder_path):
                shutil.rmtree(folder_path)
            
            for image in product_img:
                db.session.delete(image)
            db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify({"message": "Termék sikeresen törölve!"}), 200

# Termék frissítése
@soldProducts_bp.route("/api/update_sold_product/<int:id>", methods=["PUT"])
def update_sold_product(id):
    incomingInvoice = request.json.get("incoming_invoice")
    outgoingInvoice = request.json.get("outgoing_invoice")
    productName = request.json.get("product_name")
    productType = request.json.get("product_type")
    quantity = request.json.get("quantity")
    customer_name = request.json.get("customer_name") 
    productManufacturer = request.json.get("manufacturer")
    productIncomingPrice = request.json.get("incoming_price")
    productSellingPrice = request.json.get("selling_price")
    productCurrency = request.json.get("currency")

    product = SoldProducts.query.get(id)
    if product is None:
        return jsonify({"error": "Nincs ilyen termék!"}), 404
    
    try:
        product.incoming_invoice = incomingInvoice
        product.outgoing_invoice = outgoingInvoice
        product.product_name = productName
        product.product_type = productType
        product.quantity = quantity
        product.customer_name = customer_name
        product.manufacturer = productManufacturer
        product.incoming_price = productIncomingPrice
        product.selling_price = productSellingPrice
        product.currency = productCurrency
        
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify({"message": "Termék sikeresen frissítve!"}), 200