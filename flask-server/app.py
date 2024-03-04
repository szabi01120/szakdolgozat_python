from flask import Flask, render_template, request, redirect, url_for, jsonify, json
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

# database init
db = SQLAlchemy(app)

# database model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)

# database create
with app.app_context():
    db.create_all()

# ------------------------------------- ENDPOINT FRONTEND ------------------------------------- #
# endpoints - get users
@app.route("/api/users", methods=["GET"])
def get_users():
    with app.app_context():
        users = User.query.all()
        users = [{"id": user.id, "username": user.username} for user in users]
    return jsonify(users)

#endpoints - add user
@app.route("/api/add_user", methods=["POST"])
def add_user_endp():
    if request.method == "POST":
        username = request.json.get("username")
        new_user = User(username=username)

        with app.app_context():
            db.session.add(new_user)
            db.session.commit()
    return jsonify({"message": "user added"})

# endpoints - delete user
@app.route("/api/delete_user", methods=["DELETE"])
def delete_user():
    if request.method == "DELETE":
        userId = request.json.get("id")
        with app.app_context():
            user = User.query.filter_by(userId=userId).first()
            db.session.delete(user)
            db.session.commit()
    return jsonify({"message": "user deleted"})
# ------------------------------------- ENDPOINT FRONTEND ------------------------------------- #

# add user BACKEND - REGISTER HTML
@app.route("/add_user", methods=["POST"])
def add_user():
    if request.method == "POST":
        username = request.form["username"]
        new_user = User(username=username)

        with app.app_context():
            db.session.add(new_user)
            db.session.commit()
    return redirect(url_for('index'))

@app.route("/")
def index():
    # lekerdezzuk 
    with app.app_context():
        users = User.query.all()
    return render_template("index.html", users=users)
    
@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member33"]}

if __name__ == '__main__':
    app.run(debug=True)