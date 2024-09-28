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
        total_income_huf = db.session.query(db.func.sum(SoldProducts.price * SoldProducts.quantity)).filter(SoldProducts.currency == "HUF").scalar()
        total_income_eur = db.session.query(db.func.sum(SoldProducts.price * SoldProducts.quantity)).filter(SoldProducts.currency == "EUR").scalar()
        total_income_usd = db.session.query(db.func.sum(SoldProducts.price * SoldProducts.quantity)).filter(SoldProducts.currency == "USD").scalar()

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