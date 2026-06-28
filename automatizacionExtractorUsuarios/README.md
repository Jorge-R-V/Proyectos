# DataExtractor - Automatización de Instagram

Una potente herramienta de automatización diseñada para extraer de forma eficiente listas de seguidores de perfiles de Instagram. El sistema está construido en Python y ofrece **dos interfaces profesionales** (Web y Escritorio) para adaptarse a tus preferencias.

## Características Principales

1. **Interfaz Web Premium (Dashboard):** Un panel de control moderno tipo SaaS con tema oscuro (`Dark Mode`), barra lateral y animaciones limpias. 
   - **Historial Integrado:** Guarda un registro de todas las extracciones exitosas y permite descargar los archivos CSV en cualquier momento.
   - **Ajustes:** Permite guardar tus credenciales por defecto para que los formularios se autocompleten y ahorres tiempo.
2. **Aplicación de Escritorio Nativa:** Una ventana de sistema ligera y rápida (creada con `customtkinter`) que incluye un selector de archivos visual para elegir exactamente dónde guardar tus datos.
3. **Múltiples Métodos de Extracción:**
   - **Automático (API / Instaloader):** Extracción directa a la máxima velocidad.
   - **Escaneo Profundo (Selenium):** Ideal para extracciones seguras simulando navegación humana. Controlado por navegador Chrome.

---

## Instalación Automática (Recomendada)

Hemos preparado un instalador automatizado que preparará todo el entorno y creará iconos de acceso rápido para ti:

1. Asegúrate de tener instalado **Python 3.8 o superior**.
2. Entra en la carpeta del proyecto.
3. Haz doble clic en el archivo `instalar.bat`.
4. El sistema instalará automáticamente todas las librerías necesarias y al finalizar **creará dos accesos directos en tu Escritorio**:
   - `Extractor de Seguidores (Escritorio)`
   - `Extractor de Seguidores (Web)`

## 🚀 Uso Rápido

¡Una vez finalizada la instalación, ya no necesitas usar la consola! Simplemente usa los iconos que aparecieron en tu escritorio:

- **Para usar la Interfaz Web:** Haz doble clic en el acceso directo del escritorio **"Extractor de Seguidores (Web)"**. Esto iniciará el servidor en segundo plano y te abrirá tu navegador automáticamente en la dirección correcta.
- **Para usar la Interfaz de Escritorio:** Haz doble clic en **"Extractor de Seguidores (Escritorio)"**. Se abrirá una ventana limpia en el centro de tu pantalla (sin molestas consolas negras detrás).

## Instalador para Terceros (.exe)

Si deseas compartir esta herramienta con otras personas (clientes, equipo) que **no tienen conocimientos técnicos ni Python instalado**, puedes enviarles el instalador independiente:

1. Ve a la carpeta `Output/` dentro de este proyecto.
2. Copia el archivo `Setup_DataExtractor.exe` y envíalo a quien lo necesite.
3. Este archivo es un instalador clásico de Windows que le preguntará al usuario dónde quiere instalar el programa y le creará accesos directos automáticamente. *¡No requiere instalar nada más!*

---

## Ejecución Manual (Para Desarrolladores)

Si prefieres lanzar las herramientas manualmente desde la consola de comandos, abre la terminal en esta carpeta y utiliza:

- **Para la versión Web:**
  ```bash
  python app.py
  ```
  *(Luego entra a http://127.0.0.1:5000 en tu navegador)*

- **Para la versión de Escritorio:**
  ```bash
  python gui_app.py
  ```

### Dependencias (Si se instalan manualmente)
```bash
pip install instaloader selenium webdriver-manager flask customtkinter
```

---
*Herramienta desarrollada para automatización de análisis de datos y OSINT en redes sociales.*
