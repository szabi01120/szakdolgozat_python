from flask import Flask, render_template, request, redirect, url_for, jsonify, json, abort
from flask_cors import CORS 
from flask_bcrypt import Bcrypt
from dbConfig import app, db, Termekek, Felhasznalok

bcrypt = Bcrypt(app)

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
    meretek = request.json.get("meretek")

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
def register_user():
    username = request.json["username"]
    password = request.json["password"]

    user_exists = Felhasznalok.query.filter_by(username=username).first() is not None

    if user_exists:
        abort(409, description="Felhasználó már létezik!")

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = Felhasznalok(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "id": new_user.id,
        "username": new_user.username
    }), 201 # létrehozva válasz kód

@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member33"]}

if __name__ == '__main__':
    app.run(debug=True)