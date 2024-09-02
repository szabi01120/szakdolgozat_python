from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_mail import Mail

bcrypt = Bcrypt()
mail = Mail()
server_session = Session()