# routes/images.py
import os
from flask import Blueprint, request, jsonify
from dbConfig import db, app, Image
from services.file_service import allowed_file
from werkzeug.utils import secure_filename
from flask_marshmallow import Marshmallow
import config

ma = Marshmallow(app)

# Marshmallow séma az Image modellhez
class ImageSchema(ma.Schema):
    class Meta:
        fields = ("id", "product_id", "title")

image_schema = ImageSchema(many=True)

images_bp = Blueprint('images', __name__)

@images_bp.route("/api/img_upload/<int:product_id>", methods=["POST"])
def upload_file(product_id):
    if 'files[]' not in request.files:
        return jsonify({
            "message": "A kérés nem tartalmaz fájlt", 
            "status": 'failed'
        }), 400

    files = request.files.getlist('files[]')
    product_folder = os.path.join(config.UPLOAD_FOLDER, str(product_id)) #??????????
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
            }), 415
    
    if success:
        return jsonify({
            "message": "Sikeres fájl feltöltés",
            "status": 'success'
        }), 201

@images_bp.route('/api/images', methods=['GET'])
def images():
    all_images = Image.query.all()
    results = image_schema.dump(all_images)
    return jsonify(results)

@images_bp.route('/api/images/<int:id>', methods=['GET'])
def image(id):
    # A termék képeinek mappája az UPLOAD_FOLDER alapján
    product_folder = os.path.join(config.UPLOAD_FOLDER, str(id))

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

@images_bp.route('/api/delete_image/<int:id>', methods=['DELETE'])
def delete_image(id):
    image = Image.query.get(id)
    if image is None:
        return jsonify({"error": "Nincs ilyen kép!"}), 404

    product_folder = os.path.join(config.UPLOAD_FOLDER, str(image.product_id))
    print("product folder:",product_folder)
    image_path = os.path.join(product_folder, image.title)
    print("image path:",image_path)
    
    if not os.path.exists(image_path):
        return jsonify({"error": "A megadott kép nem található!"}), 404

    os.remove(image_path)

    db.session.delete(image)
    db.session.commit()

    return jsonify({"message": "Kép sikeresen törölve!"}), 200
