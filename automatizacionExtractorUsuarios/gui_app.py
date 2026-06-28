import customtkinter as ctk
from tkinter import filedialog, messagebox
import threading
import queue
import os
import extractor
import extractor_selenium

# Configuración básica de CustomTkinter
ctk.set_appearance_mode("System")
ctk.set_default_color_theme("blue")

class App(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Extractor de Seguidores de Instagram")
        self.geometry("600x650")
        
        # Forzar que la ventana aparezca al frente
        self.attributes('-topmost', True)
        self.after(2000, lambda: self.attributes('-topmost', False))
        
        self.log_queue = queue.Queue()
        self.driver = None # Para selenium

        # --- TÍTULO ---
        self.title_label = ctk.CTkLabel(self, text="Instagram Extractor", font=ctk.CTkFont(size=24, weight="bold"))
        self.title_label.pack(pady=20)

        # --- OPCIONES DE MÉTODO ---
        self.method_var = ctk.StringVar(value="Instaloader")
        self.method_label = ctk.CTkLabel(self, text="Método de Extracción:", font=ctk.CTkFont(weight="bold"))
        self.method_label.pack(pady=(10, 0))
        
        self.radio_frame = ctk.CTkFrame(self)
        self.radio_frame.pack(pady=10)
        self.radio_instaloader = ctk.CTkRadioButton(self.radio_frame, text="Instaloader (Rápido, requiere login)", variable=self.method_var, value="Instaloader", command=self.update_ui)
        self.radio_instaloader.pack(side="left", padx=10)
        self.radio_selenium = ctk.CTkRadioButton(self.radio_frame, text="Selenium (Modo manual profundo)", variable=self.method_var, value="Selenium", command=self.update_ui)
        self.radio_selenium.pack(side="left", padx=10)

        # --- CAMPOS DE ENTRADA ---
        self.inputs_frame = ctk.CTkFrame(self)
        self.inputs_frame.pack(pady=10, padx=20, fill="x")

        self.target_label = ctk.CTkLabel(self.inputs_frame, text="Cuenta Objetivo:")
        self.target_label.pack(pady=(10, 0))
        self.target_entry = ctk.CTkEntry(self.inputs_frame, placeholder_text="Ej: dtf.nometro")
        self.target_entry.pack(pady=5, padx=20, fill="x")

        self.user_label = ctk.CTkLabel(self.inputs_frame, text="Tu Usuario (Secundario):")
        self.user_label.pack(pady=(10, 0))
        self.user_entry = ctk.CTkEntry(self.inputs_frame, placeholder_text="Tu usuario")
        self.user_entry.pack(pady=5, padx=20, fill="x")

        self.pass_label = ctk.CTkLabel(self.inputs_frame, text="Tu Contraseña:")
        self.pass_label.pack(pady=(10, 0))
        self.pass_entry = ctk.CTkEntry(self.inputs_frame, show="*")
        self.pass_entry.pack(pady=5, padx=20, fill="x")

        # --- BOTONES SELENIUM ---
        self.selenium_frame = ctk.CTkFrame(self.inputs_frame)
        self.btn_open_browser = ctk.CTkButton(self.selenium_frame, text="1. Abrir Navegador e Iniciar Sesión", command=self.open_browser)
        self.btn_open_browser.pack(pady=5, fill="x")
        self.lbl_selenium_instructions = ctk.CTkLabel(self.selenium_frame, text="Una vez logueado y en la lista de seguidores de la cuenta objetivo:")
        self.lbl_selenium_instructions.pack(pady=(10, 0))

        # --- GUARDAR ARCHIVO ---
        self.save_frame = ctk.CTkFrame(self)
        self.save_frame.pack(pady=10, padx=20, fill="x")
        
        self.output_path = ctk.StringVar()
        self.btn_save = ctk.CTkButton(self.save_frame, text="Elegir Dónde Guardar (.csv)", command=self.choose_file)
        self.btn_save.pack(side="left", padx=20, pady=10)
        self.lbl_save = ctk.CTkLabel(self.save_frame, textvariable=self.output_path, text_color="gray")
        self.lbl_save.pack(side="left", fill="x", expand=True)

        # --- ACCIÓN PRINCIPAL ---
        self.btn_start = ctk.CTkButton(self, text="INICIAR EXTRACCIÓN", font=ctk.CTkFont(weight="bold"), command=self.start_extraction)
        self.btn_start.pack(pady=10)

        # --- CONSOLA / LOGS ---
        self.textbox = ctk.CTkTextbox(self, state="disabled")
        self.textbox.pack(pady=10, padx=20, fill="both", expand=True)

        self.update_ui()
        self.check_queue()

    def update_ui(self):
        method = self.method_var.get()
        if method == "Instaloader":
            self.user_label.pack(pady=(10, 0))
            self.user_entry.pack(pady=5, padx=20, fill="x")
            self.pass_label.pack(pady=(10, 0))
            self.pass_entry.pack(pady=5, padx=20, fill="x")
            self.selenium_frame.pack_forget()
            self.btn_start.configure(text="INICIAR EXTRACCIÓN")
        else:
            self.user_label.pack_forget()
            self.user_entry.pack_forget()
            self.pass_label.pack_forget()
            self.pass_entry.pack_forget()
            self.selenium_frame.pack(pady=10, padx=20, fill="x")
            self.btn_start.configure(text="2. EMPEZAR A ESCANEAR")

    def log(self, message):
        self.log_queue.put(message)

    def check_queue(self):
        try:
            while True:
                msg = self.log_queue.get_nowait()
                self.textbox.configure(state="normal")
                self.textbox.insert("end", msg + "\n")
                self.textbox.see("end")
                self.textbox.configure(state="disabled")
        except queue.Empty:
            pass
        self.after(100, self.check_queue)

    def choose_file(self):
        filename = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")],
            title="Guardar resultados como"
        )
        if filename:
            self.output_path.set(filename)

    def open_browser(self):
        self.log("Preparando Selenium...")
        try:
            self.driver = extractor_selenium.configurar_driver(log_callback=self.log)
            self.log("Navegador abierto. Por favor, inicia sesión en Instagram, ve al perfil objetivo y abre su lista de seguidores. Luego presiona '2. EMPEZAR A ESCANEAR'.")
        except Exception as e:
            self.log(f"Error al abrir navegador: {e}")

    def start_extraction(self):
        target = self.target_entry.get().strip()
        out_path = self.output_path.get().strip()

        if not target:
            messagebox.showwarning("Faltan datos", "Por favor ingresa la Cuenta Objetivo.")
            return
        
        if not out_path:
            messagebox.showwarning("Faltan datos", "Por favor elige dónde guardar el archivo CSV.")
            return

        method = self.method_var.get()
        
        self.btn_start.configure(state="disabled")

        if method == "Instaloader":
            user = self.user_entry.get().strip()
            password = self.pass_entry.get().strip()
            if not user or not password:
                messagebox.showwarning("Faltan datos", "Por favor ingresa tu usuario y contraseña para Instaloader.")
                self.btn_start.configure(state="normal")
                return
            
            threading.Thread(target=self.run_instaloader, args=(user, password, target, out_path), daemon=True).start()
        else:
            if not self.driver:
                messagebox.showwarning("Navegador no abierto", "Primero debes abrir el navegador con el paso 1.")
                self.btn_start.configure(state="normal")
                return
            
            threading.Thread(target=self.run_selenium, args=(target, out_path), daemon=True).start()

    def run_instaloader(self, user, password, target, out_path):
        self.log("--- INICIANDO INSTALOADER ---")
        extractor.extraer_seguidores(user, password, target, out_path, log_callback=self.log)
        self.log("--- FIN DEL PROCESO ---")
        self.btn_start.configure(state="normal")

    def run_selenium(self, target, out_path):
        self.log("--- INICIANDO SELENIUM ---")
        extractor_selenium.extraer_seguidores_selenium(self.driver, target, out_path, log_callback=self.log)
        self.log("--- FIN DEL PROCESO ---")
        self.btn_start.configure(state="normal")

if __name__ == "__main__":
    app = App()
    app.mainloop()
