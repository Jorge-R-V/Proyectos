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

def configurar_driver(log_callback=print):
    log_callback("Abriendo Google Chrome...")
    chrome_options = Options()
    # Para que el navegador no se cierre inmediatamente si hay un error
    chrome_options.add_experimental_option("detach", True)
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    return driver

def extraer_seguidores_selenium(driver, cuenta_objetivo, output_file, log_callback=print, progress_callback=None):
    lista_usuarios = set()
    log_callback("\nESCANEANDO CADA RINCÓN DEL CÓDIGO... (Buscando patrones)")
    
    try:
        with open(output_file, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['Username'])
            
            for i in range(200):
                # OBTENEMOS TODO EL HTML
                html = driver.page_source
                
                # PATRONES DE BÚSQUEDA MÚLTIPLES:
                matches = re.findall(r'href="/([a-zA-Z0-9\._]+)/"', html)
                matches += re.findall(r'"username":"([a-zA-Z0-9\._]+)"', html)
                
                nuevos = 0
                for uname in matches:
                    if uname not in ["reels", "explore", "direct", "accounts", "emails", "legal", "about", "p", "tv", "tags", cuenta_objetivo]:
                        if 3 < len(uname) < 30 and uname not in lista_usuarios:
                            lista_usuarios.add(uname)
                            writer.writerow([uname])
                            file.flush()
                            nuevos += 1
                            
                            log_callback(f"[{len(lista_usuarios)}] {uname}")
                            if progress_callback:
                                progress_callback(len(lista_usuarios), uname)
                
                # SCROLL AGRESIVO
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

    except Exception as e:
        log_callback(f"Error: {e}")
    finally:
        log_callback(f"\nEXTRACCIÓN COMPLETADA. Resultados temporales guardados.")

