from flask import Flask, render_template, request, jsonify, send_file
import threading
import uuid
import os
import json
import datetime
import extractor
import extractor_selenium

app = Flask(__name__)
tasks = {}

HISTORY_FILE = 'history.json'
SETTINGS_FILE = 'settings.json'

def load_json(filepath, default):
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return default
    return default

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)

def add_to_history(task_id, target, method, count, out_path):
    history = load_json(HISTORY_FILE, [])
    history.append({
        "id": task_id,
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "target": target,
        "method": method,
        "count": count,
        "file": out_path
    })
    save_json(HISTORY_FILE, history)

@app.route('/api/history', methods=['GET'])
def get_history():
    return jsonify(load_json(HISTORY_FILE, []))

@app.route('/api/settings', methods=['GET', 'POST'])
def manage_settings():
    if request.method == 'POST':
        save_json(SETTINGS_FILE, request.json)
        return jsonify({"status": "success"})
    return jsonify(load_json(SETTINGS_FILE, {"defaultUser": "", "defaultPassword": ""}))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start', methods=['POST'])
def start():
    data = request.json
    method = data.get('method')
    target = data.get('target')
    
    if method == 'Selenium_Scan':
        # Reusing existing task for Selenium Scan phase
        task_id = data.get('task_id')
        if task_id not in tasks:
            return jsonify({"error": "Task not found"}), 404
        
        driver = tasks[task_id]['driver']
        out_path = tasks[task_id]['out_path']
        
        def run_selenium():
            tasks[task_id]['status'] = 'running'
            def log_cb(m): tasks[task_id]['logs'].append(m)
            def prog_cb(c, u): tasks[task_id]['progress'] = c
            
            log_cb("--- INICIANDO SELENIUM ---")
            extractor_selenium.extraer_seguidores_selenium(driver, target, out_path, log_cb, prog_cb)
            log_cb("--- FIN DEL PROCESO ---")
            tasks[task_id]['status'] = 'completed'
            add_to_history(task_id, target, 'Selenium', tasks[task_id]['progress'], out_path)
            
        threading.Thread(target=run_selenium, daemon=True).start()
        return jsonify({"task_id": task_id})
    
    # For new tasks
    task_id = str(uuid.uuid4())
    out_path = f"temp_{task_id}.csv"
    
    tasks[task_id] = {
        'status': 'starting',
        'logs': [],
        'progress': 0,
        'out_path': out_path,
        'driver': None
    }
    
    def log_callback(msg):
        tasks[task_id]['logs'].append(msg)
        
    def progress_callback(count, username):
        tasks[task_id]['progress'] = count

    if method == 'Instaloader':
        user = data.get('user')
        password = data.get('password')
        
        def run_instaloader():
            tasks[task_id]['status'] = 'running'
            log_callback("--- INICIANDO INSTALOADER ---")
            success = extractor.extraer_seguidores(user, password, target, out_path, log_callback, progress_callback)
            log_callback("--- FIN DEL PROCESO ---")
            if success:
                tasks[task_id]['status'] = 'completed'
                add_to_history(task_id, target, 'Instaloader', tasks[task_id]['progress'], out_path)
            else:
                tasks[task_id]['status'] = 'error'
            
        threading.Thread(target=run_instaloader, daemon=True).start()
        
    elif method == 'Selenium_Prepare':
        def run_selenium_prepare():
            try:
                driver = extractor_selenium.configurar_driver(log_callback)
                tasks[task_id]['driver'] = driver
                tasks[task_id]['status'] = 'browser_ready'
                log_callback("Navegador abierto. Por favor, inicia sesión, ve al perfil objetivo y abre su lista de seguidores.")
            except Exception as e:
                log_callback(f"Error al abrir navegador: {e}")
                tasks[task_id]['status'] = 'error'
                
        threading.Thread(target=run_selenium_prepare, daemon=True).start()

    return jsonify({"task_id": task_id})

@app.route('/status/<task_id>')
def status(task_id):
    if task_id in tasks:
        task = tasks[task_id]
        logs = list(task['logs'])
        task['logs'].clear()
        return jsonify({
            'status': task['status'],
            'logs': logs,
            'progress': task['progress']
        })
    return jsonify({'status': 'not_found'}), 404

@app.route('/download/<task_id>')
def download(task_id):
    if task_id in tasks and os.path.exists(tasks[task_id]['out_path']):
        # Send file allows browser to prompt user where to save
        return send_file(tasks[task_id]['out_path'], as_attachment=True, download_name=f"seguidores_{task_id[:6]}.csv")
    return "File not found", 404

if __name__ == '__main__':
    print("Iniciando servidor Flask en http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
