from flask import Blueprint, jsonify, request, session
from dbConfig import db, Users
from extensions import bcrypt

auth_blueprint = Blueprint('auth', __name__)

# Aktív felhasználó lekérdezése
@auth_blueprint.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")
    print("session from @me: ", user_id)
    print("user.id: ", Users.query.filter_by(id=user_id).first())
    if not user_id:
        return jsonify({"error": "Nincs bejelentkezve!"}), 401
    
    user = Users.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id, 
        "username": user.username,
        "name": user.name
    }), 200

@auth_blueprint.route("/register", methods=["POST"])
def register_user():
    username = request.json["username"]
    password = request.json["password"]
    name = request.json["name"]

    user_exists = Users.query.filter_by(username=username).first() is not None

    if user_exists:
        return jsonify({"error": "Ez a felhasználó már létezik!"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = Users(username=username, password=hashed_password, name=name)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "username": new_user.username,
        "name": new_user.name
    })
    
# Bejelentkezés kezelése
@auth_blueprint.route("/login", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    user = Users.query.filter_by(username=username).first()
    if user is None:
        return jsonify({"error": "Nincs ilyen felhasználó!"}), 404
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Hibás jelszó!"}), 401
    
    session["user_id"] = user.id
    print("session from login_user: ", session)
    
    return jsonify({
        "id": user.id, 
        "username": user.username
    }), 200

# Kijelentkezés kezelése
@auth_blueprint.route("/logout", methods=["POST"])
def logout_user():
    print("session from logout: ", session.get("user_id"))
    session.pop("user_id")
    return jsonify({"message": "Sikeres kijelentkezés!"}), 200
