from PIL import Image
from rembg import remove 
import svgwrite
from itertools import product
import os

def borrar_fondo(imgin, imgout):
    print(f"Quitando fondo de {imgin}...")
    input_image = Image.open(imgin)
    output_image = remove(input_image)
    output_image.save(imgout)
    print(f"Imagen sin fondo guardada en {imgout}")

def png_to_svg(imgin, imgout):
    print(f"Convirtiendo {imgin} a SVG...")
    img = Image.open(imgin).convert("RGBA")
    width, height = img.size
    dwg = svgwrite.Drawing(imgout, size=(width, height))
    
    pixels = img.load()
    
    for x, y in product(range(width), range(height)):
        r, g, b, a = pixels[x, y]
        if a > 0:  # Solo procesar píxeles no transparentes
            dwg.add(dwg.rect(insert=(x, y), size=(1, 1), 
                            fill=f"rgb({r},{g},{b})",
                            fill_opacity=a/255.0))
    
    dwg.save()
    print(f"SVG guardado en {imgout}")

def convert_to_svg(input_path, output_svg_path):
    output_png = "sin_fondo.png"
    borrar_fondo(input_path, output_png)
    png_to_svg(output_png, output_svg_path)
    print(f"Proceso completado. Se han generado '{output_png}' y '{output_svg_path}'.")

if __name__ == "__main__":
    # Ejemplo de uso (puedes cambiar los nombres de los archivos aquí)
    archivo_entrada = "entrada.jpg"
    archivo_salida = "resultado.svg"
    
    if os.path.exists(archivo_entrada):
        convert_to_svg(archivo_entrada, archivo_salida)
    else:
        print(f"Error: No se encontró el archivo '{archivo_entrada}'. Asegúrate de que exista.")
