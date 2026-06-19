from PIL import Image
from rembg import remove 
import aspose.words as aw
import os

base_path = os.path.dirname(__file__)

def borrar_fondo(imgin, imgout):
    path_in = os.path.join(base_path, imgin)
    path_out = os.path.join(base_path, imgout)
    
    foto = Image.open(path_in)
    salida = remove(foto)
    salida.save(path_out)
    print(f"Imagen sin fondo guardada en: {path_out}")

# CONVERSOR
def png_to_svg(imgin, imgout):
    path_in = os.path.join(base_path, imgin)
    path_out = os.path.join(base_path, imgout)
    
    doc = aw.Document()
    builder = aw.DocumentBuilder(doc)
    shape = builder.insert_image(path_in)
    shape.get_shape_renderer().save(path_out, aw.saving.ImageSaveOptions(aw.SaveFormat.SVG))
    print(f"SVG generado en: {path_out}")

# FUNCIÓN QUE UNE AMBOS PROCESOS
def convert_to_svg(archivo_inicial, resultado_final):
    sin_fondo = "sin_fondo.png"
    borrar_fondo(archivo_inicial, sin_fondo)
    png_to_svg(sin_fondo, resultado_final)

try:
    convert_to_svg("entrada.jpg", "resultado.svg")
    print("¡Proceso completado con éxito!")
except Exception as e:
    print(f"Error: {e}")
    print("Asegúrate de tener la imagen 'entrada.jpg' en la misma carpeta que el script.")
