# Import szükséges modulok és csomagok
from flask import Flask, render_template, request, jsonify, session, send_from_directory
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt
from flask_session import Session
from werkzeug.utils import secure_filename
from flask_marshmallow import Marshmallow
from flask_mail import Mail, Message

import traceback
import shutil
from dbConfig import app, db, Products, Image, Templates, Users
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
        fields = ("id", "product_id", "title")

image_schema = ImageSchema(many=True)

# Flask-Mail konfigurálása (ha emailt is szeretnél küldeni)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'tesztflasktesztflask@gmail.com'
app.config['MAIL_PASSWORD'] = os.environ["MAIL_PASSWORD"]
mail = Mail(app)

# ------------------------------------- ENDPOINT FRONTEND ------------------------------------- #

# Termékek lekérdezése
@app.route("/api/products", methods=["GET"])
def get_products():
    with app.app_context():
        products = Products.query.all()
        return jsonify([{
            "id": product.id,
            "product_name": product.product_name,
            "product_type": product.product_type,
            "product_size": product.product_size,
            "quantity": product.quantity,
            "manufacturer": product.manufacturer,
            "price": product.price,
            "currency": product.currency
        } for product in products]), 200

# Termék frissítése
@app.route("/api/update_product/<int:id>", methods=["PUT"])
def update_product(id):
    productName = request.json.get("product_name")
    productType = request.json.get("product_type")
    productSize = request.json.get("product_size")
    productQuantity = request.json.get("product_quantity")
    productManufacturer = request.json.get("product_manufacturer")
    productPrice = request.json.get("product_price")
    productCurrency = request.json.get("product_currency")

    with app.app_context():
        product = Products.query.get(id)
        if product is None:
            return jsonify({"error": "Nincs ilyen termék!"}), 404
        
        product.product_name = productName
        product.product_type = productType
        product.product_size = productSize
        product.quantity = int(productQuantity)
        product.manufacturer = productManufacturer
        product.price = float(productPrice)
        product.currency = productCurrency
        
        db.session.commit()
        
        return jsonify({"message": "Termék sikeresen frissítve!"}), 200

# Termék törlése
@app.route("/api/delete_product/<int:id>", methods=["DELETE"])
def delete_product(id):
    with app.app_context():
        product = Products.query.get(id)
        product_img = Image.query.filter_by(product_id=id).all()
        
        if product is None:
            return jsonify({"error": "Nincs ilyen termék!"}), 404
        db.session.delete(product)
        db.session.commit()
        print("TERMEK KEP:", product_img)
        
        # id mappa törlés ha van kép
        if product_img is not None:
            folder_path = os.path.join(app.config['UPLOAD_FOLDER'], str(id))
            if os.path.exists(folder_path):
                shutil.rmtree(folder_path)
                
            for image in product_img: # product_img egy listát ad vissza, végigteráljuk
                db.session.delete(image)
            db.session.commit()
        
        return jsonify({"message": "Termék sikeresen törölve!"}), 200

# Termék hozzáadása
@app.route("/api/add_product", methods=["POST"])
def add_product():
    productName = request.json.get("product_name")
    productType = request.json.get("product_type")
    productSize = request.json.get("product_size")
    productQuantity = request.json.get("quantity")
    productManufacturer = request.json.get("manufacturer")
    productPrice = request.json.get("price")
    productCurrency = request.json.get("currency")

    with app.app_context():
        product = Products(product_name=productName, product_type=productType, product_size=productSize, quantity=productQuantity, manufacturer=productManufacturer, price=productPrice, currency=productCurrency)
        db.session.add(product)
        db.session.commit()
        
        product_id = product.id
        return jsonify({
            "message": "Termék sikeresen hozzáadva!",
            "product_id": product_id
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
            
            newFile = Image(title=filename, product_id=product_id)
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

# Kép lekérdezése id alapján majd küldés a frontendnek
@app.route('/api/images/<int:id>', methods=['GET'])
def image(id):
    # A termék képeinek mappája az UPLOAD_FOLDER alapján
    product_folder = os.path.join(UPLOAD_FOLDER, str(id))

    # Ellenőrizzük, hogy a mappa létezik-e
    if not os.path.exists(product_folder):
        return jsonify({"error": "A megadott termékhez nem találhatóak képek."})

    # összes listázás
    images = []
    for filename in os.listdir(product_folder):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            image_url = os.path.join(product_folder, filename)
            image_id = Image.query.filter_by(title=filename).first().id
            images.append({"id": image_id, "url": image_url})

    return jsonify(images), 200

# Adott kép törlése id alapján
@app.route('/api/delete_image/<int:id>', methods=['DELETE'])
def delete_image(id):
    image = Image.query.get(id)
    if image is None:
        return jsonify({"error": "Nincs ilyen kép!"}), 404
    
    product_folder = os.path.join(app.config['UPLOAD_FOLDER'], str(image.product_id))
    image_path = os.path.join(product_folder, image.title)
    
    if not os.path.exists(image_path):
        return jsonify({"error": "A megadott kép nem található!"}), 404
    
    os.remove(image_path)

    db.session.delete(image)
    db.session.commit()

    return jsonify({"message": "Kép sikeresen törölve!"}), 200

# Sablon hozzáadása (POST kérés)
@app.route("/api/add_template", methods=["POST"])
def add_template():
    template_name = request.json.get("template_name")
    template_content = request.json.get("template_content")

    print("template_name: ", template_name)
    print("template_content: ", template_content)
    print(not template_name)
    if not template_name or not template_content:
        return jsonify({"error": "Hiányzó adatok!"}), 400
    
    template_path = os.path.join('email_templates', f'{template_name}_template.txt')

    try:
        with open(template_path, 'w', encoding='utf-8') as file:
            file.write(template_content)
        template = Templates(template_name=template_name)
        db.session.add(template)
        db.session.commit()
        
        return jsonify({"message": "Sablon sikeresen hozzáadva!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Sablonok lekérdezése
@app.route("/api/templates", methods=["GET"])
def get_templates():
    templates = Templates.query.all() 
    template_names = [template.template_name for template in templates]
    
    return jsonify(template_names), 200

# Sablon törlése
@app.route("/api/delete_template", methods=["DELETE"])
def delete_template():
    template_name = request.json.get("template_name")
    if not template_name:
        return jsonify({"error": "Hiányzó adatok!"}), 400
    
    template_path = os.path.join('email_templates', f'{template_name}_template.txt')
    if not os.path.isfile(template_path):
        return jsonify({"error": "A megadott sablon nem található!"}), 404 # fájlokban nem található
    
    os.remove(template_path)
    
    template = Templates.query.filter_by(template_name=template_name).first()
    if not template:
        return jsonify({"error": "A megadott sablon nem található!"}), 404 # adatbázisban nem található
    
    db.session.delete(template)
    db.session.commit()
    
    return jsonify({"message": "Sablon sikeresen törölve!"}), 200

def load_template(template_name):
    template_path = os.path.join('email_templates', f'{template_name}_template.txt')
    if not os.path.isfile(template_path):
        raise FileNotFoundError(f"A sablon nem található: {template_name}")
    
    with open(template_path, 'r', encoding='utf-8') as file:
        template_content = file.read()
    return template_content

@app.route('/api/send_quotation', methods=['POST'])
def send_quotation():
    data = request.json
    customer_name = data.get('customerName')
    customer_email = data.get('customerEmail')
    product_name = data.get('productName')
    product_price = data.get('productPrice')
    quantity = data.get('quantity')
    template = data.get('template')
    print(data)
    
    if not all([customer_name, customer_email, product_name, product_price, quantity, template]):
        return jsonify({"message": "Hiányzó adat(ok)!"}), 400
    
    try:
        # betöltjük a sablont a fájlból
        template_content = load_template(template)
        
        # kiszedjük a requestből az adatokat
        email_body = template_content.format(
            customer_name=customer_name,
            product_name=product_name,
            product_price=product_price,
            quantity=quantity,
            total_price=int(product_price) * int(quantity)
        )
        # E-mail küldése
        msg = Message(f"Árajánlat: {product_name}",
                      sender=app.config['MAIL_USERNAME'],
                      recipients=[customer_email])
        msg.body = email_body
        mail.send(msg)

        return jsonify({"message": "Az ajánlat sikeresen elküldve!"}), 200

    except FileNotFoundError:
        return jsonify({"message": f"A sablon nem található: {template}"}), 404
    except Exception as e:
        print(template_content)
        print(app.config['MAIL_USERNAME'])
        print("hiba", e)
        print(traceback.format_exc())
        return jsonify({"message": "Hiba történt az ajánlat küldése során."}), 500

# ------------------------------------- ENDPOINT FRONTEND END ------------------------------------- #

# Kezdőoldal renderelése
@app.route("/")
def index():
    with app.app_context():
        products = Products.query.all()
    return render_template("index.html", products=products)

# Aktív felhasználó lekérdezése
@app.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")
    print("session from @me: ", user_id)
    print("user.id: ", Users.query.filter_by(id=user_id).first())
    if not user_id:
        return jsonify({"error": "Nincs bejelentkezve!"}), 401
    
    user = Users.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id, 
        "username": user.username
    }), 200
    
@app.route("/register", methods=["POST"])
def register_user():
    username = request.json["username"]
    password = request.json["password"]

    user_exists = Users.query.filter_by(username=username).first() is not None

    if user_exists:
        return jsonify({"error": "Ez a felhasználó már létezik!"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = Users(username=username, password=hashed_password)
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
@app.route("/logout", methods=["POST"])
def logout_user():
    print("session from logout: ", session.get("user_id"))
    session.pop("user_id")
    return jsonify({"message": "Sikeres kijelentkezés!"}), 200

# Fő program
if __name__ == '__main__':
    app.run(debug=True)