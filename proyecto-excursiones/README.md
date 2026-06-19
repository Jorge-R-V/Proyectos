# Sistema de Gestión de Excursiones (ExcursionesApp)

Aplicación web integral desarrollada en **Python con Flask** y **MongoDB**, diseñada para administrar de forma eficiente las excursiones de un centro educativo. Permite gestionar alumnos, profesores, excursiones e inscripciones con un robusto sistema de **Seguridad Basado en Roles (RBAC)**.

---

## Funcionalidades Principales

- **Autenticación Segura**: Sistema de registro y login cifrado. Integración directa con las fichas y expedientes de alumnos y profesores.
- **Gestión de Excursiones**: Alta, modificación, detalle y eliminación en cascada.
- **Inscripciones Inteligentes**: Sistema de control de cupos. Si una excursión está completa, el alumno entra automáticamente en reserva.
- **Generación de Reportes**: Exportación de listados de excursiones e inscripciones a formato estructurado PDF usando la librería `ReportLab`.
- **RBAC (Role-Based Access Control)**: Vistas y niveles de acceso totalmente diferenciados según si eres alumno, profesor o administrador.

---

## Manual de Usuario: Experimentando con los Roles

El sistema cuenta con tres roles muy diferenciados para garantizar la privacidad y seguridad de los datos. Si acabas de desplegar la plataforma y quieres probar todas sus posibilidades, sigue esta guía:

### 1. Rol: Alumno
*Experiencia pensada para el estudiante, enfocada en la consulta e inscripción simple.*
*Usuario: [alumno_perez]*
*Contraseña: [123456]*

1. **Cómo probarlo**:
   - Accede a la pantalla de **Registro** (`/register`).
   - Selecciona la opción **Rol: Alumno**.
   - Rellena tus datos personales e introduce un DNI inventado.
   - Inicia sesión con la cuenta recién creada.
2. **¿Qué puedes hacer?**
   - **Dashboard**: Vista resumida de tus próximas excursiones.
   - **Excursiones**: Consultar el catálogo completo de excursiones disponibles (solo lectura) y exportarlas a PDF.
   - **Inscripciones**: Puedes ir al menú "Inscripción", desplegar las actividades e **inscribirte únicamente a ti mismo**. Si llegas tarde y no hay cupo, te pondrá "en reserva". 
   - Puedes cancelar **tus propias** inscripciones en cualquier momento.
3. **Restricciones de Seguridad**: No verás enlaces de administración. El sistema te bloqueará si intentas registrar a otro compañero o si intentas acceder a los listados privados escribiendo la URL manualmente.

### 2. Rol: Profesor
*Experiencia pensada para la organización y gestión de salidas escolares.*
*Usuario: [prof_garcia]*
*Contraseña: [123456]*

1. **Cómo probarlo**:
   - Cierra tu sesión actual de alumno.
   - Crea una nueva cuenta en **Registro**, esta vez seleccionando **Rol: Profesor** e introduciendo un Email corporativo.
   - Inicia sesión.
2. **¿Qué puedes hacer?**
   - **Gestión Total de Salidas**: En la pestaña de Excursiones ahora visualizarás botones nuevos: **Nueva Excursión**, **Editar** y **Eliminar**.
   - **Configuración**: Puedes dar de alta recursos definiendo destinos, profesores responsables, coste, fecha y los cupos máximos de asistencia.
   - **Control**: Tienes acceso global a la pestaña de **Inscripciones** para comprobar qué alumnos van a cada actividad.
3. **Restricciones de Seguridad**: El profesorado organiza los eventos, pero por privacidad no puede gestionar la base general de datos de alumnos y otros profesores.



### 3. Rol: Administrador
*Control maestro de toda la academia o instituto.*
*Usuario: [admin]*
*Contraseña: [123456]*

1. **Cómo probarlo**:
   - Por motivos de seguridad pura, el rol de Administrador **no está disponible en el formulario de registro público**.
   - Para ser administrador debes abrir tu cliente de base de datos (por ejemplo, **MongoDB Compass**).
   - Entra en la base de datos de tu proyecto y ve a la colección `usuarios`.
   - Busca tu usuario de prueba (alumno o profesor) y edita su documento cambiando `"role": "alumno"` por `"role": "admin"`.
   - Guarda los cambios y vuelve a iniciar sesión en la página web.
2. **¿Qué puedes hacer?**
   - Mágicamente se desbloquearán las pestañas rectoras de **Alumnos** y **Profesores** en la barra de navegación.
   - Podrás crear a mano el expediente de nuevos colegas de trabajo, consultar DNIs de alumnos, ver si tienen alergias y editar/borrar cualquier perfil a nivel de sistema.
   - Si entras en tu propio Perfil superior izquierdo, verás que ahora tienes un selector que solo tú posees para **cambiar a voluntad el rol del resto de usuarios**.

---

## Técnicos e Instalación

### 1. Preparación del Entorno
- **Python 3.10+**
- **MongoDB** (Servidor local en el puerto 27017 o mediante MongoDB Atlas)

Abre una terminal en la raíz del proyecto e instala las librerías necesarias:
```bash
pip install -r requirements.txt
```

### 2. Variables de Entorno
Crea un archivo `.env` en la ruta principal de tu proyecto. El sistema lo leerá al ejecutarse para mantener seguros tus credenciales:
```env
MONGO_URI=mongodb://localhost:27017/db_excursiones
SECRET_KEY=mi_super_clave_secreta_en_produccion
```

### 3. Ejecución
Inicia el servidor backend de desarrollo de Flask:
```bash
python app.py
```
Finalmente, abre tu navegador preferido e ingresa a `http://localhost:5000` para comenzar a utilizar la aplicación web.
