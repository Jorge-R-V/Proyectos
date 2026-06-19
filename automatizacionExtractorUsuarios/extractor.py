import instaloader
import time
import random
import csv
import os
from instaloader.exceptions import LoginRequiredException, ProfileNotExistsException, ConnectionException, BadCredentialsException

# --- CONFIGURACIÓN ---
USUARIO_SECUNDARIO = "p42025574"
CONTRASENA = "Pa$$w0rd"
CUENTA_OBJETIVO = "xprin_impresorasdtf"
ARCHIVO_SESION = f"session_{USUARIO_SECUNDARIO}"
ARCHIVO_OUTPUT = f"seguidores_{CUENTA_OBJETIVO}.csv"

# --- INICIALIZACIÓN ---
L = instaloader.Instaloader()

def login_instagram():
    """Maneja el login verificando que la sesión sea VÁLIDA."""
    intentar_login = False
    
    if os.path.exists(ARCHIVO_SESION):
        try:
            L.load_session_from_file(USUARIO_SECUNDARIO, filename=ARCHIVO_SESION)
            # VERIFICACIÓN CRUCIAL: ¿Realmente funciona la sesión?
            print("Verificando validez de la sesión guardada...")
            L.test_login() 
            print("Sesión válida y activa.")
        except Exception as e:
            print(f"La sesión guardada ya no es válida: {e}")
            os.remove(ARCHIVO_SESION) # Borramos la sesión muerta
            intentar_login = True
    else:
        intentar_login = True

    if intentar_login:
        print(f"Iniciando sesión nueva para {USUARIO_SECUNDARIO}...")
        try:
            L.login(USUARIO_SECUNDARIO, CONTRASENA)
            L.save_session_to_file(filename=ARCHIVO_SESION)
            print("Nueva sesión iniciada y guardada correctamente.")
            time.sleep(5)
        except BadCredentialsException:
            print("ERROR: Contraseña incorrecta. Por favor, revísala en el código.")
            return False
        except Exception as e:
            print(f"Error crítico al iniciar sesión: {e}")
            return False
    return True

def obtener_perfil_robusto(username):
    """Estrategia para encontrar el perfil una vez logueados corectamente."""
    username = username.strip()
    try:
        print(f"Buscando perfil '{username}'...")
        return instaloader.Profile.from_username(L.context, username)
    except ProfileNotExistsException:
        # Si falla el directo, intentamos buscarlo un poco más despacio
        time.sleep(2)
        try:
            for hit in instaloader.TopSearchResults(L.context, username).get_profiles():
                if hit.username.lower() == username.lower():
                    return hit
        except Exception:
            pass
        return None

def extraer_seguidores():
    if not login_instagram():
        return

    try:
        perfil = obtener_perfil_robusto(CUENTA_OBJETIVO)
        
        if not perfil:
            print(f"ERROR: No se encuentra '{CUENTA_OBJETIVO}'.")
            return

        if perfil.is_private and not perfil.followed_by_viewer:
            print(f"ERROR: '{CUENTA_OBJETIVO}' es PRIVADA y no la sigues.")
            return

        with open(ARCHIVO_OUTPUT, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['Username', 'Full Name', 'User ID', 'Is Verified', 'Is Private'])
            
            print(f"Extrayendo seguidores de {perfil.username}...")
            
            contador = 0
            # Usamos un try-except dentro del bucle por si Instagram nos corta a mitad
            try:
                for seguidor in perfil.get_followers():
                    datos = [seguidor.username, seguidor.full_name, seguidor.userid, seguidor.is_verified, seguidor.is_private]
                    writer.writerow(datos)
                    file.flush()
                    contador += 1
                    print(f"[{contador}] {seguidor.username}")
                    time.sleep(random.uniform(4, 7)) # Pausa para seguridad
            except Exception as e:
                print(f"\nLa extracción se detuvo inesperadamente: {e}")
                print("Se han guardado los datos obtenidos hasta ahora.")

    except Exception as e:
        print(f"Error inesperado: {e}")

if __name__ == "__main__":
    extraer_seguidores()
    print(f"\nProceso finalizado. Archivo: {ARCHIVO_OUTPUT}")