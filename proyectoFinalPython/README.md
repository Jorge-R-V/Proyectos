# CRUD de Películas y Gestión de Cine (proyectoFinalPython)

Aplicación web integral desarrollada en **Python con Flask** y **MongoDB**, estructurada para gestionar de forma eficiente el catálogo de películas de un cine (CRUD completo) con un sistema de autenticación de usuarios. Incluye soporte para contenedorización con **Docker**.

---

## Funcionalidades Principales

- **Gestión de Películas (CRUD)**: 
  - Crear nuevas fichas de películas (Título, Director, Precio, Butacas, Categoría).
  - Listar catálogo disponible en tiempo real con recuento de películas y agrupación por categorías.
  - Editar campos de películas existentes.
  - Eliminar registros con ventana de confirmación previa.
- **Autenticación de Usuarios**:
  - Registro de usuarios con contraseñas cifradas en base de datos mediante hashing seguro (`pbkdf2:sha256` vía Werkzeug).
  - Inicio de sesión seguro integrado con **Flask-Login**.
  - Control de acceso: La visualización del catálogo es pública, pero las operaciones de inserción, actualización y borrado requieren inicio de sesión obligatorio.
- **Validación de Formularios**: Implementación robusta de formularios mediante **WTForms** (con Flask-WTF) para validar campos y tipos de datos (como emails válidos y números positivos).

---

## Requisitos e Infraestructura

- **Python 3.10+** o **Docker Desktop**
- **MongoDB** (Servidor local o instancia en Atlas)

---

## Instalación y Uso

### Opción A: Ejecución Local

1. **Crear e Iniciar Entorno Virtual**:
   ```bash
   python -m venv .venv
   # En Windows:
   .venv\Scripts\activate
   # En Linux/macOS:
   source .venv/bin/activate
   ```
2. **Instalar Dependencias**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configurar Variables de Entorno**:
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   SECRET_KEY=clave_secreta_muy_segura
   MONGO_URI=mongodb://localhost:27017/cine
   ```
4. **Ejecutar la Aplicación**:
   ```bash
   python app.py
   ```
   Abre tu navegador en `http://127.0.0.1:5000`.

### Opción B: Despliegue con Docker

El proyecto incluye un `Dockerfile` y un `docker-compose.yml` listos para levantar la aplicación web y una base de datos MongoDB de manera coordinada.

1. Asegúrate de tener **Docker** y **Docker Compose** instalados.
2. Ejecuta en la raíz del proyecto:
   ```bash
   docker-compose up --build
   ```
3. Docker creará los contenedores de la aplicación y la base de datos, y expondrá la aplicación en `http://localhost:5000`.
