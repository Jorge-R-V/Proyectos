from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, IntegerField, SelectField, SubmitField, PasswordField
from wtforms.validators import DataRequired, NumberRange, Email, Length

class PeliculaForm(FlaskForm):
    titulo = StringField('Título', validators=[DataRequired(message="El título es obligatorio")])
    director = StringField('Director', validators=[DataRequired(message="El director es obligatorio")])
    precio = DecimalField('Precio de Entrada (€)', places=2, validators=[
        DataRequired(message="Introduce un precio válido"),
        NumberRange(min=0.1, message="El precio debe ser positivo")
    ])
    butacas = IntegerField('Butacas Disponibles', validators=[
        DataRequired(message="Introduce el número de butacas"),
        NumberRange(min=0, message="Las butacas no pueden ser negativas")
    ])
    categoria = SelectField('Categoría', choices=[
        ('Acción', 'Acción'),
        ('Comedia', 'Comedia'),
        ('Drama', 'Drama'),
        ('Ciencia Ficción', 'Ciencia Ficción'),
        ('Terror', 'Terror'),
        ('Animación', 'Animación')
    ], validators=[DataRequired()])
    submit = SubmitField('Guardar Película')

class RegistroForm(FlaskForm):
    email = StringField('Email', validators=[
        DataRequired(message="El email es obligatorio"), 
        Email(message="Introduce un email válido")
    ])
    password = PasswordField('Contraseña', validators=[
        DataRequired(message="La contraseña es obligatoria"),
        Length(min=6, message="La contraseña debe tener al menos 6 caracteres")
    ])
    submit = SubmitField('Registrarse')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[
        DataRequired(message="El email es obligatorio"), 
        Email(message="Introduce un email válido")
    ])
    password = PasswordField('Contraseña', validators=[
        DataRequired(message="La contraseña es obligatoria")
    ])
    submit = SubmitField('Iniciar Sesión')
