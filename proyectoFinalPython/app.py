import os
from flask import Flask, render_template, redirect, url_for, flash, request
from pymongo import MongoClient
from bson.objectid import ObjectId
from forms import PeliculaForm, RegistroForm, LoginForm
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'clave_por_defecto_insegura')

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/cine')
cliente = MongoClient(MONGO_URI)
db = cliente.get_default_database()
peliculas_collection = db.peliculas
usuarios_collection = db.usuarios

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = "Por favor, inicia sesión para acceder a esta página."
login_manager.login_message_category = "warning"

class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.email = user_data['email']

@login_manager.user_loader
def load_user(user_id):
    user_data = usuarios_collection.find_one({"_id": ObjectId(user_id)})
    if user_data:
        return User(user_data)
    return None

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if current_user.is_authenticated:
        return redirect(url_for('inicio'))
    form = RegistroForm()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data

        if usuarios_collection.find_one({"email": email}):
            flash('Este email ya está registrado', 'danger')
            return redirect(url_for('registro'))
        
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        usuarios_collection.insert_one({
            "email": email,
            "password": hashed_password
        })
        flash('Registro completado con éxito. Ahora puedes iniciar sesión.', 'success')
        return redirect(url_for('login'))
    return render_template('registro.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('inicio'))
    form = LoginForm()
    if form.validate_on_submit():
        user_data = usuarios_collection.find_one({"email": form.email.data})
        if user_data and check_password_hash(user_data['password'], form.password.data):
            user_obj = User(user_data)
            login_user(user_obj)
            flash('Inicio de sesión exitoso', 'success')
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('inicio'))
        else:
            flash('Email o contraseña incorrectos', 'danger')
    return render_template('login.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Has cerrado la sesión', 'info')
    return redirect(url_for('inicio'))

@app.route('/')
def inicio():
    total_peliculas = peliculas_collection.count_documents({})
    pipeline = [
        {"$group": {"_id": "$categoria", "count": {"$sum": 1}}}
    ]
    categorias = list(peliculas_collection.aggregate(pipeline))

    return render_template('inicio.html', total_peliculas=total_peliculas, categorias=categorias)

@app.route('/read')
def read_peliculas():
    total_peliculas = list(peliculas_collection.find())
    return render_template('read.html', peliculas=total_peliculas)

@app.route('/add', methods=['GET', 'POST'])
@login_required
def add_pelicula():
    form = PeliculaForm()
    if form.validate_on_submit():
        nueva_peli = {
            "titulo": form.titulo.data,
            "director": form.director.data,
            "precio": float(form.precio.data),
            "butacas": int(form.butacas.data),
            "categoria": form.categoria.data
        }
        peliculas_collection.insert_one(nueva_peli)
        flash('Película añadida correctamente.', 'success')
        return redirect(url_for('read_peliculas'))
    return render_template('add.html', form=form)

@app.route('/update/<id>', methods=['GET', 'POST'])
@login_required
def update_pelicula(id):
    try:
        peli = peliculas_collection.find_one({"_id": ObjectId(id)})
    except:
        flash('ID inválido', 'danger')
        return redirect(url_for('read_peliculas'))

    if not peli:
        flash('Película no encontrada.', 'danger')
        return redirect(url_for('read_peliculas'))

    form = PeliculaForm(data=peli)

    if form.validate_on_submit():
        peliculas_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": {
                "titulo": form.titulo.data,
                "director": form.director.data,
                "precio": float(form.precio.data),
                "butacas": int(form.butacas.data),
                "categoria": form.categoria.data
            }}
        )
        flash('Película actualizada correctamente.', 'info')
        return redirect(url_for('read_peliculas'))
    
    return render_template('update.html', form=form, peli_id=id)

@app.route('/remove/<id>', methods=['GET', 'POST'])
@login_required
def remove_pelicula(id):
    try:
        peli = peliculas_collection.find_one({"_id": ObjectId(id)})
    except:
        flash('ID inválido', 'danger')
        return redirect(url_for('read_peliculas'))

    if not peli:
        flash('Película no encontrada.', 'danger')
        return redirect(url_for('read_peliculas'))

    if request.method == 'POST':
        peliculas_collection.delete_one({"_id": ObjectId(id)})
        flash(f'Película "{peli.get("titulo")}" eliminada.', 'success')
        return redirect(url_for('read_peliculas'))

    return render_template('remove.html', peli=peli)

if __name__ == '__main__':
    app.run(debug=True)
