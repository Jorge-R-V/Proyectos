# Extractor de Usuarios de Instagram (automatizacionExtractorUsuarios)

Script desarrollado en **Python** que utiliza la biblioteca `instaloader` para extraer de manera automatizada y estructurada la lista de seguidores de una cuenta de Instagram específica, exportándolos directamente a un archivo CSV.

---

## Funcionalidades Principales

- **Inicio de Sesión Persistente**: Guarda la sesión del usuario secundario en un archivo local (`session_[usuario]`) para evitar inicios de sesión repetidos y reducir el riesgo de bloqueos por parte de Instagram.
- **Validación Automática de Sesión**: Comprueba la validez de la sesión guardada y solicita un nuevo inicio de sesión automáticamente en caso de haber caducado.
- **Búsqueda Robusta de Perfiles**: Estrategia de búsqueda que intenta encontrar el perfil por nombre de usuario directo o mediante los mejores resultados de búsqueda en caso de errores de API.
- **Medidas de Seguridad**: Añade un retardo aleatorio (entre 4 y 7 segundos por usuario extraído) para emular comportamiento humano y mitigar el límite de solicitudes de la API de Instagram (Rate Limiting).
- **Exportación en CSV**: Genera archivos CSV estructurados con los campos:
  - `Username` (Nombre de usuario)
  - `Full Name` (Nombre completo)
  - `User ID` (ID único de usuario)
  - `Is Verified` (Si la cuenta está verificada)
  - `Is Private` (Si la cuenta es privada)

---

## Requisitos Técnicos

- **Python 3.8+**
- Biblioteca `instaloader`

---

## Instalación y Uso

### 1. Clonar e Instalar Dependencias
Instala la biblioteca requerida:
```bash
pip install instaloader
```

### 2. Configurar el Script
Abre el archivo `extractor.py` (o `extractor_selenium.py`) y configura las variables del bloque de configuración:
```python
USUARIO_SECUNDARIO = "tu_usuario_instagram"
CONTRASENA = "tu_contrasena"
CUENTA_OBJETIVO = "cuenta_a_extraer_seguidores"
```
> [!WARNING]
> Se recomienda encarecidamente utilizar una **cuenta secundaria** (de prueba o "bot") para realizar la extracción, ya que Instagram puede penalizar el uso de scripts automatizados si se superan los límites de consultas permitidos.

### 3. Ejecución
Ejecuta el script desde tu terminal:
```bash
python extractor.py
```
Al finalizar, se guardará un archivo llamado `seguidores_[cuenta_objetivo].csv` en el directorio actual.
