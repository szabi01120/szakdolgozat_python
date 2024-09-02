from flask import Blueprint, request, jsonify
from dbConfig import db
from dbConfig import Templates
from flask_mail import Mail, Message
from config import ApplicationConfig
import extensions
import os

templates_bp = Blueprint('templates', __name__)

# Sablon hozzáadása
@templates_bp.route("/api/add_template", methods=["POST"])
def add_template():
    template_name = request.json.get("template_name")
    template_content = request.json.get("template_content")

    print("template_name: ", template_name)
    print("template_content: ", template_content)
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
@templates_bp.route('/api/templates', methods=['GET'])
def get_templates():
    templates = Templates.query.all() 
    template_names = [template.template_name for template in templates]
    
    return jsonify(template_names), 200

# Sablon törlése
@templates_bp.route("/api/delete_template", methods=["DELETE"])
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
