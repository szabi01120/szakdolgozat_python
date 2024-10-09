from flask import Blueprint, request, jsonify, session
from dbConfig import db, Products, Image, SoldProducts, ProductTypes, ProductManufacturers
import services.file_service as f
import os
import shutil
import pytz

from datetime import datetime

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
        "quantity": product.quantity,
        "manufacturer": product.manufacturer,
        "incoming_price": product.incoming_price,
        "currency": product.currency,
        "sold": product.sold,
        "shipped": product.shipped,
        "hasPhotos": product.hasPhotos
    } for product in products]), 200

# Termék frissítése
@products_bp.route("/api/update_product/<int:id>", methods=["PUT"])
def update_product(id):
    incomingInvoice = request.json.get("incoming_invoice")
    productName = request.json.get("product_name")
    productType = request.json.get("product_type")
    productQuantity = request.json.get("quantity")
    productManufacturer = request.json.get("manufacturer")
    productIncomingPrice = request.json.get("incoming_price")
    productCurrency = request.json.get("currency")
    stateSold = request.json.get("sold")
    stateShipped = request.json.get("shipped")

    product = Products.query.get(id)
    if product is None:
        return jsonify({"error": "Nincs ilyen termék!"}), 404
    
    try:
        product.incoming_invoice = incomingInvoice
        product.product_name = productName
        product.product_type = productType
        product.quantity = productQuantity
        product.manufacturer = productManufacturer
        product.incoming_price = productIncomingPrice
        product.currency = productCurrency
        product.sold = stateSold
        product.shipped = stateShipped
        
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Hiba történt a frissítés során: {str(e)}"}), 500
    
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
        folder_path = os.path.join(f.UPLOAD_FOLDER, str(id))
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
    productQuantity = request.json.get("quantity")
    productManufacturer = request.json.get("manufacturer")
    productIncomingPrice = request.json.get("incoming_price")
    productCurrency = request.json.get("currency")
    hasPhotos = request.json.get("hasPhotos")

    try:
        product = Products(
            incoming_invoice=incomingInvoice, 
            product_name=productName, 
            product_type=productType, 
            quantity=productQuantity, 
            manufacturer=productManufacturer, 
            incoming_price=productIncomingPrice, 
            currency=productCurrency,
            hasPhotos=hasPhotos
        )
        db.session.add(product)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Hiba történt a hozzáadás során: {str(e)}"}), 500
    
    product_id = product.id
    return jsonify({
        "message": "Termék sikeresen hozzáadva!",
        "product_id": product_id
    }), 200
    
# Termék checkbox state frissítése
@products_bp.route("/api/update_checkbox_state/<int:id>", methods=["PUT"])
def update_checkbox_state(id):
    product_state = request.json
    if product_state is None:
        return jsonify({"error": "Érvénytelen kérésformátum!"}), 400

    product_to_update = Products.query.get(id)
    
    if product_to_update is None:
        return jsonify({"error": "Nincs ilyen termék!"}), 404
    
    try:
        if "sold" in product_state:
            product_to_update.sold = product_state.get("sold")
            
        if "shipped" in product_state:
            product_to_update.shipped = product_state.get("shipped")
            
        db.session.commit()
        return jsonify({"message": "Termék státusz sikeresen frissítve!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Hiba történt a frissítés során: {str(e)}"}), 500

# Termékek áthelyezése a sold_products táblába
@products_bp.route("/api/update_product_status", methods=["POST"])
def update_product_status():
    product_data = request.json  # frontendről id és darabszám

    if not isinstance(product_data, list):
        return jsonify({"error": "Érvénytelen kérésformátum!"}), 400

    for product_info in product_data:
        product_id = product_info.get("id")

        product = Products.query.get(product_id)
        if product is None:
            return jsonify({"error": f"Nincs ilyen termék: {product_id}!"}), 404

        tz = pytz.timezone('Europe/Budapest')
        current_time = datetime.now(tz)

        try:
            # eladott terméket sold_products táblába rakjuk
            sold_product = SoldProducts(
                product_id=product.id,
                incoming_invoice=product.incoming_invoice,
                outgoing_invoice="ÜRES",
                product_name=product.product_name,
                product_type=product.product_type,
                quantity=1,
                customer_name="ÜRES",  
                manufacturer=product.manufacturer,
                incoming_price=product.incoming_price,
                selling_price=0,
                currency=product.currency,
                date=current_time
            )
            db.session.add(sold_product)

            # Csökkentjük a termék darabszámát
            product.quantity -= 1
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Hiba történt az áthelyezés során: {str(e)}"}), 500

        # Ha a darabszám 0, töröljük a terméket
        if product.quantity <= 0:
            try:
                print("product.id:", product.id)
                print("product_id", product_id)
                images = Image.query.filter_by(product_id=product.id).all()

                if images is not None:
                    folder_path = os.path.join(f.UPLOAD_FOLDER, str(product.id))
                if os.path.exists(folder_path):
                    shutil.rmtree(folder_path)
                    
                for image in images: # images egy listát ad vissza, végigteráljuk
                    db.session.delete(image)

                db.session.delete(product)
                db.session.commit()
            except Exception as e:
                print(f"Hiba történt a képek törlésekor: {str(e)}")
                db.session.rollback()
                return jsonify({"error": f"Hiba történt a képek törlésekor: {str(e)}"}), 500
        else:
            # ha nem 0 akkor a checkboxot kinullázzuk
            product.sold = False
            product.shipped = False

    try:
        db.session.commit()
        return jsonify({"message": "Termékek sikeresen áthelyezve és frissítve."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Hiba történt az áthelyezés során: {str(e)}"}), 500
    
# Termék típus hozzáadása
@products_bp.route("/api/add_product_type", methods=["POST"])
def add_product_type():
    productType = request.json.get("product_type")
    
    if not productType:
        return jsonify({"error": "Érvénytelen request!"}), 400
    try:
        product_type = ProductTypes(product_type=productType)
        db.session.add(product_type)
        db.session.commit()
        return jsonify({
            "message": "Termék típus sikeresen hozzáadva!",
            "product_type": {
                "id": product_type.id,
                "product_type": product_type.product_type
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        print(f"Hiba történt a hozzáadás során: {str(e)}")
        return jsonify({"error": f"Hiba történt a hozzáadás során: {str(e)}"}), 500
    
# Termék típus lekérdezése
@products_bp.route("/api/product_types", methods=["GET"])
def get_product_types():
    product_types = ProductTypes.query.all()
    
    if not product_types:
        return jsonify({"error": "Nincs termék típus!"}), 404
    
    return jsonify([{
        "id": product_type.id,
        "product_type": product_type.product_type,
    } for product_type in product_types]), 200

# Termék típus törlése
@products_bp.route("/api/delete_product_type/<int:id>", methods=["DELETE"])
def delete_product_type(id):
    product_type = ProductTypes.query.get(id)
    
    if product_type is None:
        return jsonify({"error": "Nincs ilyen típus!"}), 404
    
    try:
        db.session.delete(product_type)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Hiba történt a törlés során: {str(e)}"}), 500
    
    return jsonify({"message": "Típus sikeresen törölve!"}), 200
    
# Termék gyártó hozzáadása
@products_bp.route("/api/add_product_manufacturer", methods=["POST"])
def add_product_manufacturer():
    productManufacturer = request.json.get("manufacturer")
    
    if not productManufacturer:
        return jsonify({"error": "Érvénytelen request!"}), 400
    try:
        product_manufacturer = ProductManufacturers(manufacturer=productManufacturer)
        db.session.add(product_manufacturer)
        db.session.commit()
        return jsonify({
            "message": "Termék gyártó sikeresen hozzáadva!",
            "product_manufacturer": {
                "id": product_manufacturer.id,
                "manufacturer": product_manufacturer.manufacturer
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Hiba történt a hozzáadás során: {str(e)}"}), 500
    
# Termék gyártó lekérdezése
@products_bp.route("/api/product_manufacturers", methods=["GET"])
def get_product_manufacturers():
    product_manufacturers = ProductManufacturers.query.all()
    
    if not product_manufacturers:
        return jsonify({"error": "Nincs termék gyártó!"}), 404
    
    return jsonify([{
        "id": product_manufacturer.id,
        "manufacturer": product_manufacturer.manufacturer,
    } for product_manufacturer in product_manufacturers]), 200

# Termék gyártó törlése
@products_bp.route("/api/delete_product_manufacturer/<int:id>", methods=["DELETE"])
def delete_product_manufacturer(id):
    product_manufacturer = ProductManufacturers.query.get(id)
    
    if product_manufacturer is None:
        return jsonify({"error": "Nincs ilyen gyártó!"}), 404
    
    try:
        db.session.delete(product_manufacturer)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Hiba történt a törlés során: {str(e)}"}), 500
    
    return jsonify({"message": "Gyártó sikeresen törölve!"}), 200