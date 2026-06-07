# Conversor de Imágenes y Vectorizador (conversorPNG-SVG)

Script automatizado en **Python** diseñado para procesar imágenes con fondo, removerlo utilizando inteligencia artificial y posteriormente convertir el resultado transparente a formato vectorial SVG utilizando una técnica pixelada de rectángulos individuales.

---

## Proceso en Dos Fases

1. **Eliminación del Fondo**: 
   - El script utiliza el modelo neuronal `rembg` para aislar el objeto principal de la imagen de entrada (ej. `entrada.jpg`) y guarda la versión limpia en formato transparente PNG (`sin_fondo.png`).
2. **Conversión a Vectorial SVG**:
   - Lee los píxeles de la imagen transparente resultante.
   - Itera sobre cada pixel con canal alfa mayor que cero (no transparente).
   - Genera dinámicamente un archivo SVG (`resultado.svg`) donde cada pixel coloreado es dibujado como un pequeño elemento rectangular (`rect`) SVG de tamaño 1x1 manteniendo su color RGB y opacidad originales.

---

## Requisitos Técnicos

- **Python 3.9+**
- Dependencias principales:
  - `Pillow` (para la manipulación y lectura de píxeles)
  - `rembg` (para la detección y eliminación del fondo)
  - `svgwrite` (para la creación y escritura del documento vectorial SVG)

---

## Instalación y Uso

### 1. Instalar dependencias
Instala las librerías necesarias ejecutando en la terminal:
```bash
pip install Pillow rembg svgwrite
```
> [!NOTE]
> La primera vez que ejecutes el script, la librería `rembg` descargará automáticamente un modelo preentrenado (habitualmente `u2net`) desde sus servidores oficiales. Esto puede tardar unos minutos dependiendo de tu conexión a internet.

### 2. Ejecutar la Conversión
1. Coloca una imagen de prueba en la raíz de la carpeta y nómbrala `entrada.jpg`.
2. Ejecuta el script:
   ```bash
   python fondo.py
   ```
3. Al finalizar, el script generará dos archivos:
   - `sin_fondo.png`: Imagen limpia con fondo transparente.
   - `resultado.svg`: Imagen completamente vectorizada lista para escalar sin pérdida de resolución.
