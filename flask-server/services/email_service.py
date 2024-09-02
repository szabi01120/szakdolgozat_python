from flask import Blueprint, request, jsonify
from flask_mail import Message
from dbConfig import mail
import os
from config import Config
import extensions

send_email_bp = Blueprint('templates', __name__)

def load_template(template_name):
    template_path = os.path.join('email_templates', f'{template_name}_template.txt')
    if not os.path.isfile(template_path):
        raise FileNotFoundError(f"A sablon nem található: {template_name}")
    
    with open(template_path, 'r', encoding='utf-8') as file:
        template_content = file.read()
    return template_content

@send_email_bp.route('/api/send_quotation', methods=['POST'])
def send_quotation():
    data = request.json
    customer_name = data.get('customerName')
    customer_email = data.get('customerEmail')
    product_name = data.get('productName')
    product_price = data.get('productPrice')
    quantity = data.get('quantity')
    template = data.get('template')
    print("data:", data)
    
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
            customer_email=customer_email,
            total_price=int(product_price) * int(quantity)
        )
        # E-mail küldése
        msg = Message(f"Árajánlat: {product_name}",
                      sender=Config.MAIL_USERNAME,
                      recipients=[customer_email])
        msg.body = email_body
        extensions.mail.send(msg)

        return jsonify({"message": "Az ajánlat sikeresen elküldve!"}), 200
    except FileNotFoundError:
        return jsonify({"message": f"A sablon nem található: {template}"}), 404
    except Exception as e:
        print("template content:", template_content)
        print("mail username:", Config.MAIL_USERNAME)
        print("hiba", e)
        return jsonify({"message": "Hiba történt az ajánlat küldése során."}), 500