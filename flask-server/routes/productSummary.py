from flask import Blueprint, jsonify
from dbConfig import db, SoldProducts, Products

productSummary_bp = Blueprint('productSummary', __name__)

# Termék quantity összesítés
@productSummary_bp.route("/api/products/quantity", methods=["GET"])
def get_products_quantity():
    try:
        total_quantity = db.session.query(db.func.sum(Products.quantity)).scalar()

        # ha nincs akk 0
        total_quantity = total_quantity or 0

        return jsonify({"total_quantity": total_quantity}), 200
    except Exception as e:
        return jsonify({"error": str(e), "total_quantity": 0}), 500

# SoldProducts tábla quantity visszaküldése
@productSummary_bp.route("/api/sold_products/quantity", methods=["GET"])
def get_sold_products_quantity():
    try:
        total_quantity = db.session.query(db.func.sum(SoldProducts.quantity)).scalar()

        # ha nincs akk 0
        total_quantity = total_quantity or 0

        return jsonify({"total_quantity": total_quantity}), 200
    except Exception as e:
        return jsonify({"error": str(e), "total_quantity": 0}), 500
    
# SoldProducts jövedelem összesítése - HUF & EUR
@productSummary_bp.route("/api/sold_products/income", methods=["GET"])
def get_sold_products_income():
    try:
        total_income_huf = db.session.query(db.func.sum((SoldProducts.selling_price - SoldProducts.incoming_price) * SoldProducts.quantity)).filter(SoldProducts.currency == "HUF").scalar()
        total_income_eur = db.session.query(db.func.sum((SoldProducts.selling_price - SoldProducts.incoming_price) * SoldProducts.quantity)).filter(SoldProducts.currency == "EUR").scalar()
        total_income_usd = db.session.query(db.func.sum((SoldProducts.selling_price - SoldProducts.incoming_price) * SoldProducts.quantity)).filter(SoldProducts.currency == "USD").scalar()

        # ha nincs akk 0
        total_income_huf = total_income_huf or 0
        total_income_eur = total_income_eur or 0
        total_income_usd = total_income_usd or 0

        return jsonify({
            "total_income_huf": total_income_huf,
            "total_income_eur": total_income_eur,
            "total_income_usd": total_income_usd
        }), 200
    except Exception as e:
        return jsonify({
            "error": str(e), 
            "total_income_huf": 0, 
            "total_income_eur": 0,
            "total_income_usd": 0
        }), 500
    
# SoldProducts legutóbb eladott termék
@productSummary_bp.route("/api/sold_products/latest", methods=["GET"])
def get_latest_sold_product():
    try:
        latest_sold_product = db.session.query(SoldProducts).order_by(SoldProducts.date.desc()).first()

        if latest_sold_product:
            return jsonify({
                "product_name": latest_sold_product.product_name
            }), 200
        else:
            return jsonify({"message": "Nincs termék!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# SoldProducts legutóbbi vásárló neve
@productSummary_bp.route("/api/sold_products/latest_customer", methods=["GET"])
def get_latest_customer():
    try:
        latest_customer = db.session.query(SoldProducts.customer_name).order_by(SoldProducts.date.desc()).first()

        if latest_customer:
            return jsonify({
                "customer_name": latest_customer[0]
            }), 200
        else:
            return jsonify({"message": "Nincs vásárló!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# SoldProducts legutóbbi 5 vásárlás: dátum, termék, vásárló neve, ár, pénznem
@productSummary_bp.route("/api/sold_products/last_five_customer", methods=["GET"])
def get_last_five_customers():
    try:
        last_five_customers = db.session.query(SoldProducts.date, SoldProducts.product_name, SoldProducts.customer_name, SoldProducts.selling_price, SoldProducts.currency).order_by(SoldProducts.date.desc()).limit(5).all()

        if last_five_customers:
            return jsonify({
                "last_five_customers": [{"date": customer.date, "product_name": customer.product_name, "customer_name": customer.customer_name, "selling_price": customer.selling_price, "currency": customer.currency} for customer in last_five_customers]
            }), 200
        else:
            return jsonify({"message": "Nincs vásárló!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500