from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time
import csv
import os
import re
import random

# --- CONFIGURACIÓN ---
CUENTA_OBJETIVO = "dtf.nometro"
ARCHIVO_OUTPUT = f"seguidores_TOTAL_{CUENTA_OBJETIVO}.csv"

def configurar_driver():
    print("Abriendo Google Chrome...")
    chrome_options = Options()
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    return driver

def captura_profunda(driver):
    print("\n" + "@"*60)
    print(" ¡EXTRACCIÓN PROFUNDA ACTIVADA! ")
    print("@"*60)
    print("1. Logueate e ir al perfil.")
    print(f"2. Abre la lista de SEGUIDORES.")
    print("@"*60)
    input("\nCUANDO LA LISTA ESTÉ EN PANTALLA, presiona ENTER AQUÍ...")

    lista_usuarios = set()
    print("\nESCANEANDO CADA RINCÓN DEL CÓDIGO... (Buscando patrones)")
    
    try:
        with open(ARCHIVO_OUTPUT, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['Username'])
            
            for i in range(200):
                # OBTENEMOS TODO EL HTML
                html = driver.page_source
                
                # PATRONES DE BÚSQUEDA MÚLTIPLES:
                # 1. Links: href="/usuario/"
                # 2. JSON: "username":"usuario"
                # 3. Textos sueltos que parecen usuarios
                matches = re.findall(r'href="/([a-zA-Z0-9\._]+)/"', html)
                matches += re.findall(r'"username":"([a-zA-Z0-9\._]+)"', html)
                
                nuevos = 0
                for uname in matches:
                    if uname not in ["reels", "explore", "direct", "accounts", "emails", "legal", "about", "p", "tv", "tags", CUENTA_OBJETIVO]:
                        if 3 < len(uname) < 30 and uname not in lista_usuarios:
                            lista_usuarios.add(uname)
                            writer.writerow([uname])
                            file.flush()
                            nuevos += 1
                            print(f"[{len(lista_usuarios)}] {uname}")
                
                # SCROLL AGRESIVO
                # Intentamos scroll en la página y en cualquier modal
                driver.execute_script("window.scrollBy(0, 600);")
                driver.execute_script(
                    "document.querySelectorAll('div[role=\"dialog\"] div').forEach(d => {"
                    "if(d.scrollHeight > d.clientHeight) d.scrollBy(0, 600);"
                    "});"
                )
                
                time.sleep(random.uniform(2, 4))
                
                # Si no hay nada nuevo, forzamos un scroll interactivo
                if nuevos == 0 and i > 5:
                    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    except KeyboardInterrupt:
        print("\nGuardando...")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    browser = configurar_driver()
    try:
        captura_profunda(browser)
    finally:
        print(f"\nEXTRACCIÓN COMPLETADA. Resultados en: {ARCHIVO_OUTPUT}")
        print(f"Total usuarios extraídos: {len(os.listdir('.'))}")
        input("\nPresiona ENTER para cerrar...")
        browser.quit()
