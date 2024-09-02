from .auth import auth_blueprint
from .products import products_bp
from .images import images_bp
from .templates import templates_bp


def register_routes(app):
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(products_bp)
    app.register_blueprint(images_bp)
    app.register_blueprint(templates_bp)

