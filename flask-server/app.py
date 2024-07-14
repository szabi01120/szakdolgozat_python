from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS 
from flask_bcrypt import Bcrypt
from flask_session import Session
from werkzeug.utils import secure_filename
from dbConfig import app, db, Termekek, Felhasznalok
import urllib.request
import os

CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})

bcrypt = Bcrypt(app)
server_session = Session(app)

UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

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
    

# endpoints - upload image

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS    

@app.route("/api/img_upload", methods=["POST"])
def upload_file():
    # megnézzük hogy a req tartalmazza e a file-t
    if 'files[]' not in request.files:
        resp = jsonify({
            "message": "A kérés nem tartalmaz fájlt",
            "status": 'failed'
        })
        resp.status_code = 400
        return resp
    
    files = request.files.getlist('files[]') # body-ban lévő files[]-t lekérjük
    print(files)
    
    success = False
    
    for file in files: # végigmegyünk a files[]-on megvizsgáljuk hogy megfelelő formátumú e
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            
            success = True
        else:
            resp = jsonify({
                "message": "Nem megfelelő fájl formátum",
                "status": 'failed'
            })
            resp.status_code = 400
            return resp
    
    if success: # ha minden rendben van akkor visszaküldjük a választ
        resp = jsonify({
            "message": "Sikeres fájl feltöltés",
            "status": 'success'
        })
        resp.status_code = 201
        return resp

@app.route("/")
def index():
    # lekerdezzuk 
    with app.app_context():
        termekek = Termekek.query.all()
    return render_template("index.html", termekek=termekek)

@app.route("/active_user")
def get_current_user():
    user_id = session.get("user_id")

    print("userid:", user_id)
    if not user_id:
        return jsonify({"error": "Nincs bejelentkezve!"}), 401
    
    user = Felhasznalok.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "username": user.username,
    }), 200

# @app.route("/register", methods=["POST"])
# def register_user():
#     username = request.json["username"]
#     password = request.json["password"]

#     user_exists = Felhasznalok.query.filter_by(username=username).first() is not None

#     if user_exists:
#         return jsonify({"error": "A felhasználónév már foglalt!"}), 409

#     hashed_password = bcrypt.generate_password_hash(password)
#     new_user = Felhasznalok(username=username, password=hashed_password)
#     db.session.add(new_user)
#     db.session.commit()

#     return jsonify({
#         "id": new_user.id,
#         "username": new_user.username
#     }), 201 # létrehozva válasz kód

@app.route("/login", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    user = Felhasznalok.query.filter_by(username=username).first() 
    print("user: ", user.id)

    if user is None:
        return jsonify({"error": "Nincs ilyen felhasználó!"}), 404
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Hibás jelszó!"}), 401
    
    session["user_id"] = user.id
    print("session: ", session["user_id"])
    print("sessionid: ", session.get("user_id"))

    return jsonify({
        "id": user.id,
        "username": user.username
    }), 200

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return jsonify({"message": "Sikeres kijelentkezés!"}), 200

if __name__ == '__main__':
    app.run(debug=True)