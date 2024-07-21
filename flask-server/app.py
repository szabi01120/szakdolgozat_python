# Import szükséges modulok és csomagok
from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_session import Session
from werkzeug.utils import secure_filename
from flask_marshmallow import Marshmallow
from dbConfig import app, db, Termekek, Felhasznalok, Image
import urllib.request
import os

# Flask bővítmények inicializálása
bcrypt = Bcrypt(app)
server_session = Session(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})
CORS(app, supports_credentials=True)
ma = Marshmallow(app)

# Feltöltési mappa és megengedett fájlméret beállítása
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 512 * 1024 * 1024  # 512 MB max

# Megengedett fájlkiterjesztések
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Marshmallow séma az Image modellhez
class ImageSchema(ma.Schema):
    class Meta:
        fields = ("id", "title")

image_schema = ImageSchema(many=True)

# ------------------------------------- ENDPOINT FRONTEND ------------------------------------- #

# Termékek lekérdezése
@app.route("/api/termekek", methods=["GET"])
def get_termekek():
    with app.app_context():
        termekek = Termekek.query.all()
        return jsonify([{
            "id": termek.id,
            "termeknev": termek.termeknev,
            "tipus": termek.tipus,
            "meretek": termek.meretek
        } for termek in termekek]), 200

# Termék frissítése
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

# Termék törlése
@app.route("/api/delete_termek/<int:id>", methods=["DELETE"])
def delete_termek(id):
    with app.app_context():
        termek = Termekek.query.get(id)
        if termek is None:
            return jsonify({"error": "Nincs ilyen termék!"}), 404
        db.session.delete(termek)
        db.session.commit()
        return jsonify({"message": "Termék sikeresen törölve!"}), 200

# Termék hozzáadása
@app.route("/api/add_termek", methods=["POST"])
def add_termek():
    termeknev = request.json.get("termeknev")
    tipus = request.json.get("tipus")
    meretek = request.json.get("meret")

    with app.app_context():
        termek = Termekek(termeknev=termeknev, tipus=tipus, meretek=meretek)
        db.session.add(termek)
        db.session.commit()
        
        termek_id = termek.id
        return jsonify({
            "message": "Termék sikeresen hozzáadva!",
            "termek_id": termek_id
        }), 200

# Fájlfeltöltés kezelése
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/api/img_upload/<int:product_id>", methods=["POST"])
def upload_file(product_id):
    if 'files[]' not in request.files:
        return jsonify({
            "message": "A kérés nem tartalmaz fájlt", 
            "status": 'failed'
        }), 400

    files = request.files.getlist('files[]')
    product_folder = os.path.join(app.config['UPLOAD_FOLDER'], str(product_id))
    if not os.path.exists(product_folder):
        os.makedirs(product_folder)
    
    success = False
    
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(product_folder, filename))
            
            newFile = Image(title=filename)
            db.session.add(newFile)
            db.session.commit()
            
            success = True
        else:
            return jsonify({
                "message": "Nem megfelelő fájl formátum",
                "status": 'failed'
            }), 400
    
    if success:
        return jsonify({
            "message": "Sikeres fájl feltöltés",
            "status": 'success'
        }), 201

# Képek lekérdezése
@app.route('/api/images', methods=['GET'])
def images():
    all_images = Image.query.all()
    results = image_schema.dump(all_images)
    return jsonify(results)

# ------------------------------------- ENDPOINT FRONTEND END ------------------------------------- #

# Kezdőoldal renderelése
@app.route("/")
def index():
    with app.app_context():
        termekek = Termekek.query.all()
    return render_template("index.html", termekek=termekek)

# Aktív felhasználó lekérdezése
@app.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")
    print("session from @me: ", user_id)
    print("user.id: ", Felhasznalok.query.filter_by(id=user_id).first())
    if not user_id:
        return jsonify({"error": "Nincs bejelentkezve!"}), 401
    
    user = Felhasznalok.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id, 
        "username": user.username
    }), 200
    
@app.route("/register", methods=["POST"])
def register_user():
    username = request.json["username"]
    password = request.json["password"]

    user_exists = Felhasznalok.query.filter_by(username=username).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = Felhasznalok(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "username": new_user.username
    })
    
# Bejelentkezés kezelése
@app.route("/login", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    user = Felhasznalok.query.filter_by(username=username).first()
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
@app.route("/logout", methods=["POST"])
def logout_user():
    print("session from logout: ", session.get("user_id"))
    session.pop("user_id")
    return jsonify({"message": "Sikeres kijelentkezés!"}), 200

# Fő program
if __name__ == '__main__':
    app.run(debug=True)