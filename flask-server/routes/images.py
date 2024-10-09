# routes/images.py
import os
from flask import Blueprint, request, jsonify, session
from dbConfig import db, app, Image, Products
from werkzeug.utils import secure_filename
from flask_marshmallow import Marshmallow
import services.file_service as f
import config

ma = Marshmallow(app)

# Marshmallow az Image-hez
class ImageSchema(ma.Schema):
    class Meta:
        fields = ("id", "product_id", "title")

image_schema = ImageSchema(many=True)

images_bp = Blueprint('images', __name__)

@images_bp.route("/api/img_upload/<int:product_id>", methods=["POST"])
def upload_file(product_id):
    if not session.get("user_id"):
        return jsonify({"error": "Nincs bejelentkezve!"}), 401

    if 'files[]' not in request.files:
        return jsonify({
            "message": "A kérés nem tartalmaz fájlt", 
            "status": 'failed'
        }), 400
    
    files = request.files.getlist('files[]')
    for file in files:
        if not f.allowed_file(file.filename):
            return jsonify({
                "message": "Nem megfelelő fájl formátum",
                "status": 'failed'
            }), 415

    total_size = sum([file.seek(0, os.SEEK_END) or file.tell() for file in files])

    for file in files: # vissza az elejére
        file.seek(0, 0)

    if total_size > config.MAX_CONTENT_LENGTH:
        return jsonify({
            "message": "A fájlok teljes mérete túl nagy!",
            "status": 'failed'
        }), 413

    product_folder = os.path.join(f.UPLOAD_FOLDER, str(product_id))
    if not os.path.exists(product_folder):
        os.makedirs(product_folder)
    
    success = False
    
    for file in files:
        if file and f.allowed_file(file.filename):
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
            }), 415
    
    if success:
        return jsonify({
            "message": "Sikeres fájl feltöltés",
            "status": 'success'
        }), 201

@images_bp.route('/api/images', methods=['GET'])
def images():
    if not session.get("user_id"):
        return jsonify({"error": "Nincs bejelentkezve!"}), 401
    
    all_images = Image.query.all()
    results = image_schema.dump(all_images)
    return jsonify(results)

@images_bp.route('/api/images/<int:id>', methods=['GET'])
def image(id):
    if not session.get("user_id"):
        return jsonify({"error": "Nincs bejelentkezve!"}), 401
    
    # A termék képeinek mappája az UPLOAD_FOLDER alapján
    product_folder = os.path.join(f.UPLOAD_FOLDER, str(id))
    print("product folder:",product_folder)

    # létezik-e a mappa
    if not os.path.exists(product_folder):
        return jsonify({"error": "A megadott termékhez nem találhatóak képek."}), 404

    # összes listázás
    images = []
    for filename in os.listdir(product_folder):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            image_url = os.path.join(product_folder, filename)
            image_id = Image.query.filter_by(title=filename).first().id
            images.append({"id": image_id, "url": image_url})

    return jsonify(images), 200

@images_bp.route('/api/delete_image/<int:id>', methods=['DELETE'])
def delete_image(id):
    if not session.get("user_id"):
        return jsonify({"error": "Nincs bejelentkezve!"}), 401
    
    image = Image.query.get(id)
    if image is None:
        return jsonify({"error": "Nincs ilyen kép!"}), 404

    product_folder = os.path.join(f.UPLOAD_FOLDER, str(image.product_id))
    if not os.path.exists(product_folder):
        return jsonify({"error": "A megadott mappa nem létezik"}), 404
    
    image_path = os.path.join(product_folder, image.title)
    if not os.path.exists(image_path):
        return jsonify({"error": "A megadott kép nem található!"}), 404

    try:
        os.remove(image_path)

        # Ha már nincs fotó a termékhez, akkor töröljük a mappát is és adatbázisba false 
        remaining_images = os.listdir(product_folder)
        if len(remaining_images) == 0:
            os.rmdir(product_folder)
            product = Products.query.get(image.product_id)
            product.hasPhotos = False
            db.session.commit()

        db.session.delete(image)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": "Kép sikeresen törölve!"}), 200