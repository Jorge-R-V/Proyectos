# ===============================
# IMPORTS Y DEPENDENCIAS
# ===============================
from flask import Flask, render_template, redirect, url_for, send_file, flash, request
from flask_wtf import CSRFProtect
from flask_pymongo import PyMongo
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from bson.objectid import ObjectId
from bson.errors import InvalidId
from dotenv import load_dotenv
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import os
import io
import threading

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.lib.pagesizes import A4

from forms import AlumnoForm, ProfesorForm, ExcursionForm, InscripcionForm, RegisterForm, LoginForm, PerfilForm

# =====================================================
# CONFIGURACIÓN
# =====================================================

load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

mongo = PyMongo(app)
csrf = CSRFProtect(app)

# =====================================================
# LOGIN MANAGER
# =====================================================

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

from functools import wraps

class User(UserMixin):
    def __init__(self, user_doc):
        self.id = str(user_doc["_id"])
        self.username = user_doc["username"]
        self.password = user_doc["password"]
        self.role = user_doc.get("role", "alumno")

@login_manager.user_loader
def load_user(user_id):
    user_doc = mongo.db.usuarios.find_one({"_id": ObjectId(user_id)})
    return User(user_doc) if user_doc else None

def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                return login_manager.unauthorized()
            if current_user.role not in roles:
                flash("No tienes permisos para acceder a esta página", "error")
                return redirect(url_for("dashboard"))
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# =====================================================
# AUTENTICACIÓN
# =====================================================

@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        if mongo.db.usuarios.find_one({"username": form.username.data}):
            flash("El usuario ya existe", "error")
            return render_template("auth/register.html", form=form)

        hashed_pw = generate_password_hash(form.password.data)
        user_data = {
            "username": form.username.data,
            "password": hashed_pw,
            "role": form.role.data
        }
        user_id = mongo.db.usuarios.insert_one(user_data).inserted_id

        # Crear registro en la colección correspondiente
        if form.role.data == "alumno":
            mongo.db.alumnos.insert_one({
                "dni": form.id_personal.data,
                "nombre": form.nombre.data,
                "apellidos": form.apellidos.data,
                "alergias": "",
                "usuario_id": user_id
            })
        elif form.role.data == "profesor":
            mongo.db.profesores.insert_one({
                "nombre": form.nombre.data,
                "apellidos": form.apellidos.data,
                "email": form.id_personal.data,
                "telefono": "",
                "usuario_id": user_id
            })

        login_user(User(mongo.db.usuarios.find_one({"_id": user_id})))
        return redirect(url_for("dashboard"))

    return render_template("auth/register.html", form=form)


@app.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_doc = mongo.db.usuarios.find_one({"username": form.username.data})
        if user_doc and check_password_hash(user_doc["password"], form.password.data):
            login_user(User(user_doc))
            return redirect(url_for("dashboard"))
        flash("Usuario o contraseña incorrectos", "error")
    return render_template("auth/login.html", form=form)


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))

@app.route("/perfil", methods=["GET", "POST"])
@login_required
def perfil():
    form = PerfilForm()
    if request.method == 'GET':
        form.username.data = current_user.username
        form.role.data = current_user.role
        if current_user.role == 'alumno':
            alumno = mongo.db.alumnos.find_one({"usuario_id": ObjectId(current_user.id)})
            if alumno:
                form.nombre.data = alumno.get("nombre", "")
                form.apellidos.data = alumno.get("apellidos", "")
                form.id_personal.data = alumno.get("dni", "")
        elif current_user.role == 'profesor':
            profesor = mongo.db.profesores.find_one({"usuario_id": ObjectId(current_user.id)})
            if profesor:
                form.nombre.data = profesor.get("nombre", "")
                form.apellidos.data = profesor.get("apellidos", "")
                form.id_personal.data = profesor.get("email", "")

    if form.validate_on_submit():
        # Verificar si el nombre de usuario ya existe (si se ha cambiado)
        if form.username.data != current_user.username:
            if mongo.db.usuarios.find_one({"username": form.username.data}):
                flash("El nombre de usuario ya existe", "error")
                return render_template("auth/register.html", form=form)

        # Solo los administradores pueden cambiar roles y username, los demás solo ven el suyo
        if current_user.role == 'admin':
            update_data = {
                "username": form.username.data,
                "role": form.role.data
            }
        else:
            update_data = {}
            
        if form.password.data:
            update_data["password"] = generate_password_hash(form.password.data)

        if update_data:
            mongo.db.usuarios.update_one({"_id": ObjectId(current_user.id)}, {"$set": update_data})
        
        flash("Perfil actualizado correctamente", "success")
        return redirect(url_for("dashboard"))

    return render_template("auth/perfil.html", form=form, titulo="Editar Perfil")

# =====================================================
# MANEJO DE ERRORES
# =====================================================

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(InvalidId)
def handle_invalid_id(e):
    return render_template('404.html'), 404

# =====================================================
# DASHBOARD
# =====================================================

@app.route("/")
@login_required
def dashboard():
    alumnos_dash = list(mongo.db.alumnos.find().limit(5))
    profesores_dash = list(mongo.db.profesores.find().limit(5))
    excursiones_dash = list(mongo.db.excursiones.find().limit(5))
    inscripciones_dash = []
    for ins in mongo.db.inscripciones.find().limit(5):
        alumno = mongo.db.alumnos.find_one({"_id": ins["alumno_id"]})
        excursion = mongo.db.excursiones.find_one({"_id": ins["excursion_id"]})
        inscripciones_dash.append({
            "alumno_nombre": alumno["nombre"] if alumno else "-",
            "excursion_destino": excursion["destino"] if excursion else "-",
            "estado_pago": ins.get("estado_pago", "")
        })
    return render_template(
        "dashboard/dashboard.html",
        total_alumnos=mongo.db.alumnos.count_documents({}),
        total_profesores=mongo.db.profesores.count_documents({}),
        total_excursiones=mongo.db.excursiones.count_documents({}),
        total_inscripciones=mongo.db.inscripciones.count_documents({}),
        alumnos_dash=alumnos_dash,
        profesores_dash=profesores_dash,
        excursiones_dash=excursiones_dash,
        inscripciones_dash=inscripciones_dash
    )

# =====================================================
# ALUMNOS
# =====================================================

@app.route("/alumnos", methods=["GET", "POST"])
@login_required
@role_required("admin", "profesor")
def alumnos_list():
    if request.method == "POST":
        dni = request.form.get("dni")
        if not dni:
            flash("Por favor, ingrese un DNI para buscar.", "error")
            return redirect(url_for("alumnos_list"))

        alumno = mongo.db.alumnos.find_one({"dni": dni})
        if not alumno:
            flash("No se encontró ningún alumno con el DNI proporcionado.", "error")
            return redirect(url_for("alumnos_list"))
        
        # Obtener historial de excursiones del alumno
        inscripciones = list(mongo.db.inscripciones.find({"alumno_id": alumno["_id"]}))
        excursiones_alumno = []
        for ins in inscripciones:
            exc = mongo.db.excursiones.find_one({"_id": ins["excursion_id"]})
            if exc:
                profesor = mongo.db.profesores.find_one({"_id": exc.get("profesor_id")})
                exc["profesor_nombre"] = profesor["nombre"] if profesor else None
                exc["estado_pago"] = ins.get("estado_pago", "N")
                excursiones_alumno.append(exc)

        return render_template("alumnos/alumno_detail.html", alumno=alumno, excursiones=excursiones_alumno)

    alumnos = list(mongo.db.alumnos.find().sort("apellidos", 1))
    return render_template("alumnos/alumnos_list.html", alumnos=alumnos)

@app.route("/alumnos/nuevo", methods=["GET", "POST"])
@login_required
@role_required("admin")
def alumno_form():
    form = AlumnoForm()
    if form.validate_on_submit():
        mongo.db.alumnos.insert_one({
            "dni": form.dni.data,
            "nombre": form.nombre.data,
            "apellidos": form.apellidos.data,
            "alergias": form.alergias.data
        })
        return redirect(url_for("alumnos_list"))
    return render_template("alumnos/alumno_form.html", form=form)

# Editar Alumno
@app.route("/alumnos/<id>/editar", methods=["GET", "POST"])
@login_required
@role_required("admin")
def alumno_editar(id):
    alumno = mongo.db.alumnos.find_one({"_id": ObjectId(id)})
    if not alumno:
        flash("Alumno no encontrado", "error")
        return redirect(url_for("alumnos_list"))
    form = AlumnoForm(data=alumno)
    if form.validate_on_submit():
        mongo.db.alumnos.update_one({"_id": ObjectId(id)}, {"$set": {
            "dni": form.dni.data,
            "nombre": form.nombre.data,
            "apellidos": form.apellidos.data,
            "alergias": form.alergias.data
        }})
        flash("Alumno actualizado correctamente", "success")
        return redirect(url_for("alumnos_list"))
    return render_template("alumnos/alumno_form.html", form=form, editar=True)

# =====================================================
# PROFESORES
# =====================================================

@app.route("/profesores")
@login_required
@role_required("admin", "profesor")
def profesores_list():
    profesores = mongo.db.profesores.find().sort("apellidos", 1)
    return render_template("profesores/profesores_list.html", profesores=profesores)

@app.route("/profesores/nuevo", methods=["GET", "POST"])
@login_required
@role_required("admin")
def profesor_form():
    form = ProfesorForm()
    if form.validate_on_submit():
        mongo.db.profesores.insert_one({
            "nombre": form.nombre.data,
            "apellidos": form.apellidos.data,
            "email": form.email.data,
            "telefono": form.telefono.data
        })
        return redirect(url_for("profesores_list"))
    return render_template("profesores/profesor_form.html", form=form)

# Editar Profesor
@app.route("/profesores/<id>/editar", methods=["GET", "POST"])
@login_required
@role_required("admin")
def profesor_editar(id):
    profesor = mongo.db.profesores.find_one({"_id": ObjectId(id)})
    if not profesor:
        flash("Profesor no encontrado", "error")
        return redirect(url_for("profesores_list"))
    form = ProfesorForm(data=profesor)
    if form.validate_on_submit():
        mongo.db.profesores.update_one({"_id": ObjectId(id)}, {"$set": {
            "nombre": form.nombre.data,
            "apellidos": form.apellidos.data,
            "email": form.email.data,
            "telefono": form.telefono.data
        }})
        flash("Profesor actualizado correctamente", "success")
        return redirect(url_for("profesores_list"))
    return render_template("profesores/profesor_form.html", form=form, editar=True)

# =====================================================
# EXCURSIONES
# =====================================================

@app.route("/excursiones")
@login_required
def excursiones_list():
    excursiones = list(mongo.db.excursiones.find().sort("fecha", 1))
    for e in excursiones:
        # Contar inscritos (no en reserva)
        e["inscritos"] = mongo.db.inscripciones.count_documents({
            "excursion_id": e["_id"],
            "estado_pago": {"$ne": "R"}
        })
        # Contar reservas
        e["reservas"] = mongo.db.inscripciones.count_documents({
            "excursion_id": e["_id"],
            "estado_pago": "R"
        })
        # Obtener nombre del profesor
        profesor = mongo.db.profesores.find_one({"_id": e.get("profesor_id")})
        e["profesor"] = profesor["nombre"] if profesor else None
    return render_template("excursiones/excursiones_list.html", excursiones=excursiones)

@app.route("/excursiones/nueva", methods=["GET", "POST"])
@login_required
@role_required("profesor", "admin")
def excursion_form():
    form = ExcursionForm()
    profesores = list(mongo.db.profesores.find())
    form.profesor.choices = [(str(p["_id"]), p["nombre"]) for p in profesores]

    if form.validate_on_submit():
        if form.fecha.data < datetime.now().date():
            flash("Fecha inválida")
            return redirect(url_for("excursion_form"))

        mongo.db.excursiones.insert_one({
            "destino": form.destino.data,
            "fecha": datetime.combine(form.fecha.data, datetime.min.time()),
            "coste": float(form.coste.data),
            "cupo_maximo": form.cupo_maximo.data,
            "profesor_id": ObjectId(form.profesor.data)
        })

        return redirect(url_for("excursiones_list"))

    return render_template("excursiones/excursion_form.html", form=form)


# Detalle de Excursión
@app.route("/excursiones/<id>")
@login_required
def excursion_detail(id):
    excursion = mongo.db.excursiones.find_one({"_id": ObjectId(id)})
    if not excursion:
        flash("Excursión no encontrada", "error")
        return redirect(url_for("excursiones_list"))
    profesor = mongo.db.profesores.find_one({"_id": excursion.get("profesor_id")})
    # Alumnos inscritos (no reservas)
    inscripciones = list(mongo.db.inscripciones.find({
        "excursion_id": excursion["_id"],
        "estado_pago": {"$ne": "R"}
    }))
    alumnos = []
    for ins in inscripciones:
        alumno = mongo.db.alumnos.find_one({"_id": ins["alumno_id"]})
        if alumno:
            alumno = dict(alumno)
            alumno["estado_pago"] = ins.get("estado_pago", "N")
            alumno["inscripcion_id"] = str(ins["_id"])
            alumnos.append(alumno)
    return render_template(
        "excursiones/excursion_detail.html",
        excursion=excursion,
        profesor=profesor,
        alumnos=alumnos,
        inscritos=len(alumnos)
    )

# Editar Excursión
@app.route("/excursiones/<id>/editar", methods=["GET", "POST"])
@login_required
@role_required("profesor", "admin")
def excursion_editar(id):
    excursion = mongo.db.excursiones.find_one({"_id": ObjectId(id)})
    if not excursion:
        flash("Excursión no encontrada", "error")
        return redirect(url_for("excursiones_list"))
    form = ExcursionForm(data=excursion)
    profesores = list(mongo.db.profesores.find())
    form.profesor.choices = [(str(p["_id"]), p["nombre"]) for p in profesores]
    if form.validate_on_submit():
        mongo.db.excursiones.update_one({"_id": ObjectId(id)}, {"$set": {
            "destino": form.destino.data,
            "fecha": datetime.combine(form.fecha.data, datetime.min.time()),
            "coste": float(form.coste.data),
            "cupo_maximo": form.cupo_maximo.data,
            "profesor_id": ObjectId(form.profesor.data)
        }})
        flash("Excursión actualizada correctamente", "success")
        return redirect(url_for("excursiones_list"))
    return render_template("excursiones/excursion_form.html", form=form, editar=True, excursion=excursion)

# =====================================================
# INSCRIPCIONES
# =====================================================

@app.route("/inscripciones")
@login_required
@role_required("admin", "profesor")
def inscripciones_list():
    inscripciones_cursor = mongo.db.inscripciones.find()
    inscripciones = []
    for ins in inscripciones_cursor:
        alumno = mongo.db.alumnos.find_one({"_id": ins["alumno_id"]})
        excursion = mongo.db.excursiones.find_one({"_id": ins["excursion_id"]})
        
        # Solo mostramos si existen ambos (por consistencia)
        if alumno and excursion:
            inscripciones.append({
                "_id": ins["_id"],
                "alumno": alumno,
                "excursion": excursion,
                "estado_pago": ins.get("estado_pago", "N")
            })
    return render_template("inscripciones/inscripciones_list.html", inscripciones=inscripciones)

@app.route("/inscripciones/nueva", methods=["GET", "POST"])
@login_required
def inscripcion_form():
    form = InscripcionForm()

    # Si es alumno, solo puede inscribirse a sí mismo
    if current_user.role == 'alumno':
        alumno_vinculado = mongo.db.alumnos.find_one({"usuario_id": ObjectId(current_user.id)})
        if not alumno_vinculado:
            flash("No tienes un perfil de alumno vinculado. Contacta con un administrador.", "error")
            return redirect(url_for("dashboard"))
        form.alumno.choices = [(str(alumno_vinculado["_id"]), f"{alumno_vinculado['nombre']} {alumno_vinculado['apellidos']}")]
        form.alumno.data = str(alumno_vinculado["_id"])
    else:
        # Administradores y profesores ven a todos los alumnos
        alumnos = list(mongo.db.alumnos.find().sort("nombre", 1))
        form.alumno.choices = [(str(a["_id"]), f"{a['nombre']} {a['apellidos']} ({a['dni']})") for a in alumnos]

    excursiones = list(mongo.db.excursiones.find().sort("fecha", -1))
    form.excursion.choices = [(str(e["_id"]), f"{e['destino']} - {e['fecha'].strftime('%d/%m/%Y')}") for e in excursiones]

    if form.validate_on_submit():
        alumno_id = ObjectId(form.alumno.data)
        
        # Validación extra de seguridad en el POST
        if current_user.role == 'alumno':
            alumno_vinculado = mongo.db.alumnos.find_one({"usuario_id": ObjectId(current_user.id)})
            if str(alumno_id) != str(alumno_vinculado["_id"]):
                flash("No tienes permisos para inscribir a otro alumno", "error")
                return redirect(url_for("dashboard"))

        excursion_id = ObjectId(form.excursion.data)

        # Comprobar si ya existe inscripción para ese alumno y excursión (incluyendo reservas)
        ya_inscrito = mongo.db.inscripciones.find_one({
            "alumno_id": alumno_id,
            "excursion_id": excursion_id
        })
        if ya_inscrito:
            flash("El alumno ya está inscrito en esta excursión (incluyendo reservas)", "error")
            return redirect(url_for("inscripcion_form"))

        excursion = mongo.db.excursiones.find_one({"_id": excursion_id})
        inscritos = mongo.db.inscripciones.count_documents({
            "excursion_id": excursion_id,
            "estado_pago": {"$ne": "R"}
        })

        # Si el cupo está lleno, inscribe en reserva (estado_pago = 'R')
        estado_pago = form.estado_pago.data
        if inscritos >= excursion["cupo_maximo"]:
            estado_pago = 'R'
            flash("Cupo lleno: el alumno ha sido inscrito en reserva", "warning")

        mongo.db.inscripciones.insert_one({
            "alumno_id": alumno_id,
            "excursion_id": excursion_id,
            "estado_pago": estado_pago
        })

        flash("Inscripción realizada correctamente", "success")
        return redirect(url_for("inscripciones_list"))

    return render_template("inscripciones/inscripcion_form.html", form=form)


# Cancelar inscripción (dar de baja a un alumno de una excursión)
@app.route("/inscripciones/<inscripcion_id>/cancelar", methods=["POST"])
@login_required
def cancelar_inscripcion(inscripcion_id):
    inscripcion = mongo.db.inscripciones.find_one({"_id": ObjectId(inscripcion_id)})
    if not inscripcion:
        flash("Inscripción no encontrada", "error")
        return redirect(url_for("dashboard"))
        
    # Seguridad: Un alumno solo puede cancelar su propia inscripción
    if current_user.role == 'alumno':
        alumno_vinculado = mongo.db.alumnos.find_one({"usuario_id": ObjectId(current_user.id)})
        if not alumno_vinculado or inscripcion["alumno_id"] != alumno_vinculado["_id"]:
            flash("No tienes permisos para cancelar esta inscripción", "error")
            return redirect(url_for("dashboard"))

    excursion_id = inscripcion["excursion_id"]
    mongo.db.inscripciones.delete_one({"_id": ObjectId(inscripcion_id)})

    # Buscar si hay reservas para esta excursión
    reserva = mongo.db.inscripciones.find_one({
        "excursion_id": excursion_id,
        "estado_pago": "R"
    })
    if reserva:
        # Promocionar la primera reserva a inscrito normal (estado_pago = 'N')
        mongo.db.inscripciones.update_one({"_id": reserva["_id"]}, {"$set": {"estado_pago": "N"}})
        flash("Se ha dado de alta a un alumno de la reserva.", "success")
    else:
        flash("Inscripción cancelada correctamente.", "success")

    return redirect(request.referrer or url_for("dashboard"))

# Cambiar estado de pago de una inscripción
@app.route("/inscripciones/<inscripcion_id>/pago", methods=["POST"])
@login_required
@role_required("profesor", "admin")
def cambiar_pago(inscripcion_id):
    inscripcion = mongo.db.inscripciones.find_one({"_id": ObjectId(inscripcion_id)})
    if not inscripcion:
        flash("Inscripción no encontrada", "error")
        return redirect(request.referrer or url_for("dashboard"))
    
    nuevo_estado = "S" if inscripcion.get("estado_pago", "N") in ["N", "R"] else "N"
    mongo.db.inscripciones.update_one({"_id": ObjectId(inscripcion_id)}, {"$set": {"estado_pago": nuevo_estado}})
    
    flash("Estado de pago actualizado correctamente", "success")
    return redirect(request.referrer or url_for("dashboard"))

@app.route("/excursiones/<id>/eliminar", methods=["POST"])
@login_required
@role_required("profesor", "admin")
def excursion_eliminar(id):
    excursion = mongo.db.excursiones.find_one({"_id": ObjectId(id)})
    if not excursion:
        flash("Excursión no encontrada", "error")
        return redirect(url_for("excursiones_list"))
    
    # Eliminar inscripciones asociadas
    mongo.db.inscripciones.delete_many({"excursion_id": ObjectId(id)})
    # Eliminar la excursión
    mongo.db.excursiones.delete_one({"_id": ObjectId(id)})
    
    flash("Excursión y sus inscripciones eliminadas correctamente", "success")
    return redirect(url_for("excursiones_list"))

# =====================================================
# REPORTES (PDF)
# =====================================================

@app.route("/excursiones/pdf")
@login_required
def excursiones_pdf():
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    # Asegurar que el texto no esté en blanco (usar negro)
    title_style = styles['Heading1']
    title_style.textColor = colors.black
    
    elements.append(Paragraph("Listado de Excursiones", title_style))
    elements.append(Spacer(1, 0.2 * inch))

    # Datos de la tabla
    data = [["Destino", "Fecha", "Coste", "Profesor", "Inscritos"]]
    excursiones = list(mongo.db.excursiones.find())

    for e in excursiones:
        profesor = mongo.db.profesores.find_one({"_id": e.get("profesor_id")})
        prof_nombre = profesor["nombre"] if profesor else "-"
        inscritos = mongo.db.inscripciones.count_documents({"excursion_id": e["_id"], "estado_pago": {"$ne": "R"}})
        
        data.append([
            e["destino"],
            e["fecha"].strftime("%d/%m/%Y"),
            f"{e['coste']}€",
            prof_nombre,
            str(inscritos)
        ])

    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))

    elements.append(table)
    doc.build(elements)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name="excursiones.pdf", mimetype='application/pdf')

@app.route("/excursiones/<id>/pdf")
@login_required
@role_required("admin", "profesor")
def reporte_completo_pdf(id):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    # Title
    title_style = styles['Heading1']
    title_style.textColor = colors.black
    elements.append(Paragraph("Reporte Completo de Excursión", title_style))
    elements.append(Spacer(1, 0.2 * inch))

    # Excursion details
    excursion = mongo.db.excursiones.find_one({"_id": ObjectId(id)})
    if excursion:
        elements.append(Paragraph(f"<b>Excursión:</b> {excursion.get('destino', '-')}", styles['Normal']))
        elements.append(Paragraph(f"<b>Fecha:</b> {excursion.get('fecha', '-').strftime('%d/%m/%Y') if hasattr(excursion.get('fecha'), 'strftime') else excursion.get('fecha', '-')}", styles['Normal']))
        elements.append(Paragraph(f"<b>Coste:</b> {excursion.get('coste', '-')} euros", styles['Normal']))
        elements.append(Spacer(1, 0.2 * inch))

    # Professors table
    elements.append(Paragraph("<b>Profesor asignado:</b>", styles['Heading2']))
    profesor = None
    if excursion and excursion.get("profesor_id"):
        profesor = mongo.db.profesores.find_one({"_id": excursion["profesor_id"]})
    
    if profesor:
        profesores_data = [["Nombre", "Apellidos", "Email", "Teléfono"]]
        profesores_data.append([
            profesor.get("nombre", "-"),
            profesor.get("apellidos", "-"),
            profesor.get("email", "-"),
            profesor.get("telefono", "-")
        ])
    else:
        profesores_data = [["Profesor"], ["No asignado"]]

    profesores_table = Table(profesores_data)
    profesores_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(profesores_table)
    elements.append(Spacer(1, 0.5 * inch))

    # Students table
    elements.append(Paragraph("<b>Alumnos Inscritos:</b>", styles['Heading2']))
    alumnos_data = [["Nombre", "Apellidos", "DNI", "Estado"]]
    
    # Get inscritos
    if excursion:
        inscripciones = list(mongo.db.inscripciones.find({"excursion_id": excursion["_id"]}))
        for ins in inscripciones:
            alumno = mongo.db.alumnos.find_one({"_id": ins["alumno_id"]})
            if alumno:
                estado = {"N": "Inscrito", "R": "Reserva", "P": "Pagado", "S": "Pagado"}.get(ins.get("estado_pago", "N"), ins.get("estado_pago", "N"))
                alumnos_data.append([
                    alumno.get("nombre", "-"),
                    alumno.get("apellidos", "-"),
                    alumno.get("dni", "-"),
                    estado
                ])

    if len(alumnos_data) == 1:
            alumnos_data.append(["-", "-", "-", "Sin alumnos inscritos"])

    alumnos_table = Table(alumnos_data)
    alumnos_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    elements.append(alumnos_table)

    doc.build(elements)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name=f"reporte_excursion.pdf", mimetype='application/pdf')

# =====================================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
