from flask import Flask, render_template, request, redirect, url_for, jsonify, json
from flask_cors import CORS
from dbConfig import app, Termekek, db

# ------------------------------------- ENDPOINT FRONTEND ------------------------------------- #
# endpoints - get termekek
@app.route("/api/termekek", methods=["GET"])
def get_termekek():
    with app.app_context():
        termekek = Termekek.query.all()
        return jsonify([{"id": termek.id, 
                        "termeknev": termek.termeknev, 
                        "tipus": termek.tipus, 
                        "meretek": termek.meretek} for termek in termekek]), 200

# endpoints - update product
@app.route("/api/update_termek/<int:id>", methods=["PUT"])
def update_termek(id):
    termeknev = request.json.get("termeknev")
    tipus = request.json.get("tipus")
    meretek = request.json.get("meret")

    with app.app_context():
        termek = Termekek.query.get(id)
        if termek is None:
            return jsonify({"error": "Nincs ilyen termék!"}), 404
        termek.termeknev = termeknev
        termek.tipus = tipus
        termek.meretek = meretek
        db.session.commit()
        return jsonify({"message": "Termék sikeresen frissítve!"}), 200
    
# endpoints - delete product
@app.route("/api/delete_termek/<int:id>", methods=["DELETE"])
def delete_termek(id):
    with app.app_context():
        termek = Termekek.query.get(id)
        if termek is None:
            return jsonify({"error": "Nincs ilyen termék!"}), 404
        db.session.delete(termek)
        db.session.commit()
        return jsonify({"message": "Termék sikeresen törölve!"}), 200

# endpoints - add product
@app.route("/api/add_termek", methods=["POST"])
def add_termek():
    termeknev = request.json.get("termeknev")
    tipus = request.json.get("tipus")
    meretek = request.json.get("meret")

    with app.app_context():
        termek = Termekek(termeknev=termeknev, tipus=tipus, meretek=meretek)
        db.session.add(termek)
        db.session.commit()
        return jsonify({"message": "Termék sikeresen hozzáadva!"}), 200

@app.route("/")
def index():
    # lekerdezzuk 
    with app.app_context():
        termekek = Termekek.query.all()
    return render_template("index.html", termekek=termekek)
    
@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member33"]}

if __name__ == '__main__':
    app.run(debug=True)