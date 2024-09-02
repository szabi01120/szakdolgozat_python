from flask import Flask
from dbConfig import db
from extensions import bcrypt, mail, server_session
from routes import register_routes
from config import ApplicationConfig
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

CORS(app, resources={r"/api/*": {"origins": "*"}})
CORS(app, supports_credentials=True)

bcrypt.init_app(app)
mail.init_app(app)
server_session.init_app(app)
db.init_app(app)

register_routes(app)

if __name__ == '__main__':
    app.run(debug=True)