from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, IntegerField, SelectField, DateField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length, Email, EqualTo, Optional, ValidationError, NumberRange
import re

# Custom validator for NIE/NIF
def validate_nie_nif(form, field):
    value = field.data.upper()
    nif_regex = r'^[0-9]{8}[A-Z]$'  # Example: 12345678A
    nie_regex = r'^[XYZ][0-9]{7}[A-Z]$'  # Example: X1234567L
    if not (re.match(nif_regex, value) or re.match(nie_regex, value)):
        raise ValidationError("El NIE/NIF no es válido. Debe tener un formato correcto.")

# =====================================================
# USUARIO (Registro/Login)
# =====================================================

class RegisterForm(FlaskForm):
    username = StringField('Usuario', validators=[DataRequired(), Length(min=3, max=25)])
    nombre = StringField('Nombre', validators=[DataRequired()])
    apellidos = StringField('Apellidos', validators=[DataRequired()])
    id_personal = StringField('DNI / Email', validators=[DataRequired()])
    password = PasswordField('Contraseña', validators=[DataRequired(), Length(min=6)])
    confirm = PasswordField('Repetir contraseña', validators=[DataRequired(), EqualTo('password', message='Las contraseñas deben coincidir')])
    role = SelectField('Rol', choices=[('alumno', 'Alumno'), ('profesor', 'Profesor')], validators=[DataRequired()])
    submit = SubmitField('Guardar registro')

class LoginForm(FlaskForm):
    username = StringField('Usuario', validators=[DataRequired()])
    password = PasswordField('Contraseña', validators=[DataRequired()])
    submit = SubmitField('Iniciar sesión')

class PerfilForm(FlaskForm):
    username = StringField('Usuario', validators=[DataRequired(), Length(min=3, max=25)])
    nombre = StringField('Nombre', validators=[Optional()])
    apellidos = StringField('Apellidos', validators=[Optional()])
    id_personal = StringField('DNI / Email', validators=[Optional()])
    role = SelectField('Rol', choices=[('alumno', 'Alumno'), ('profesor', 'Profesor'), ('admin', 'Administrador')], validators=[DataRequired()])
    password = PasswordField('Nueva Contraseña', validators=[Optional(), Length(min=6)])
    confirm = PasswordField('Repetir Contraseña', validators=[EqualTo('password', message='Las contraseñas deben coincidir')])
    submit = SubmitField('Actualizar Perfil')

# =====================================================
# ALUMNO
# =====================================================

class AlumnoForm(FlaskForm):
    dni = StringField("DNI/NIE", validators=[DataRequired(), Length(min=9, max=9), validate_nie_nif])
    nombre = StringField("Nombre", validators=[DataRequired()])
    apellidos = StringField("Apellidos", validators=[DataRequired()])
    alergias = StringField("Alergias")

# =====================================================
# PROFESOR
# =====================================================

class ProfesorForm(FlaskForm):
    nombre = StringField("Nombre", validators=[DataRequired()])
    apellidos = StringField("Apellidos", validators=[DataRequired()])
    email = StringField("Email", validators=[DataRequired(), Email()])
    telefono = StringField("Teléfono", validators=[Optional(), Length(max=20)])

# =====================================================
# EXCURSION
# =====================================================

class ExcursionForm(FlaskForm):
    destino = StringField("Destino", validators=[DataRequired()])
    fecha = DateField("Fecha", validators=[DataRequired()])
    coste = DecimalField("Coste", validators=[DataRequired(), NumberRange(min=0, max=200000, message="El coste debe estar entre 0 y 200,000.")])
    cupo_maximo = IntegerField("Cupo Máximo", validators=[DataRequired()])
    profesor = SelectField("Profesor", coerce=str)

# =====================================================
# INSCRIPCION
# =====================================================

class InscripcionForm(FlaskForm):
    alumno = SelectField("Alumno", coerce=str)
    excursion = SelectField("Excursión", coerce=str)
    estado_pago = SelectField(
        "Estado Pago",
        choices=[("N", "Pendiente"), ("S", "Pagado")]
    )
    submit = SubmitField('Guardar')
