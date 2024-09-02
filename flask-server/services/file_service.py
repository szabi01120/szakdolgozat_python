import os
from werkzeug.utils import secure_filename
from dbConfig import Image

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}
MAX_CONTENT_LENGTH = 512 * 1024 * 1024  # 512 MB max

# Fájlfeltöltés kezelése
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
