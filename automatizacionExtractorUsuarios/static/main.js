document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('extractorForm');
    const radios = document.querySelectorAll('input[name="method"]');
    const credentialsFields = document.getElementById('credentialsFields');
    const userField = document.getElementById('user');
    const passField = document.getElementById('password');
    const btnStart = document.getElementById('btnStart');
    const seleniumActions = document.getElementById('seleniumActions');
    const btnScan = document.getElementById('btnScan');
    
    const formPanel = document.getElementById('formPanel');
    const progressPanel = document.getElementById('progressPanel');
    const historyPanel = document.getElementById('historyPanel');
    const settingsPanel = document.getElementById('settingsPanel');
    
    const statusText = document.getElementById('statusText');
    const countValue = document.getElementById('countValue');
    const terminal = document.getElementById('terminal');
    const spinner = document.getElementById('spinner');
    const resultActions = document.getElementById('resultActions');
    const btnDownload = document.getElementById('btnDownload');
    const btnNew = document.getElementById('btnNew');

    const navBtns = document.querySelectorAll('.nav-btn');
    const mainTitle = document.getElementById('mainTitle');
    const mainSubtitle = document.getElementById('mainSubtitle');

    let currentTaskId = null;
    let pollInterval = null;

    // Load Settings on Start
    loadSettings();

    // Navigation Logic
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.getAttribute('data-target');
            document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
            document.getElementById(target).style.display = 'block';

            if(target === 'formPanel') {
                mainTitle.textContent = 'Extracción de Seguidores';
                mainSubtitle.textContent = 'Configure los parámetros para iniciar la recolección de datos.';
            } else if(target === 'historyPanel') {
                mainTitle.textContent = 'Historial de Tareas';
                mainSubtitle.textContent = 'Revise sus extracciones anteriores y descargue los resultados.';
                loadHistory();
            } else if(target === 'settingsPanel') {
                mainTitle.textContent = 'Ajustes del Sistema';
                mainSubtitle.textContent = 'Configure credenciales predeterminadas para mayor velocidad.';
            }
        });
    });

    // Settings Logic
    const settingsForm = document.getElementById('settingsForm');
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const defaultUser = document.getElementById('defaultUser').value;
        const defaultPassword = document.getElementById('defaultPassword').value;
        
        await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ defaultUser, defaultPassword })
        });
        alert('Ajustes guardados correctamente.');
    });

    async function loadSettings() {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if(data.defaultUser) {
            document.getElementById('defaultUser').value = data.defaultUser;
            userField.value = data.defaultUser;
        }
        if(data.defaultPassword) {
            document.getElementById('defaultPassword').value = data.defaultPassword;
            passField.value = data.defaultPassword;
        }
    }

    // History Logic
    async function loadHistory() {
        const res = await fetch('/api/history');
        const data = await res.json();
        const tbody = document.getElementById('historyTableBody');
        tbody.innerHTML = '';
        data.reverse().forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding:12px; border-bottom:1px solid var(--border-color);">${item.date}</td>
                <td style="padding:12px; border-bottom:1px solid var(--border-color); font-weight:600;">${item.target}</td>
                <td style="padding:12px; border-bottom:1px solid var(--border-color);"><span class="badge badge-secondary">${item.method}</span></td>
                <td style="padding:12px; border-bottom:1px solid var(--border-color);">${item.count}</td>
                <td style="padding:12px; border-bottom:1px solid var(--border-color);">
                    <a href="/download/${item.id}" class="btn btn-primary" style="padding:4px 12px; font-size:0.8rem; text-decoration:none;">Descargar</a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Extractor Form Logic
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Instaloader') {
                credentialsFields.style.display = 'block';
                userField.required = true;
                passField.required = true;
                btnStart.textContent = 'Iniciar Proceso';
                seleniumActions.style.display = 'none';
            } else {
                credentialsFields.style.display = 'none';
                userField.required = false;
                passField.required = false;
                btnStart.textContent = '1. Abrir Navegador (Selenium)';
                seleniumActions.style.display = 'block';
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const method = document.querySelector('input[name="method"]:checked').value;
        const target = document.getElementById('target').value;
        const user = document.getElementById('user').value;
        const password = document.getElementById('password').value;

        let requestData = {
            method: method === 'Selenium' ? 'Selenium_Prepare' : 'Instaloader',
            target,
            user,
            password
        };

        try {
            btnStart.disabled = true;
            btnStart.textContent = 'Iniciando...';
            
            const response = await fetch('/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            
            const data = await response.json();
            currentTaskId = data.task_id;
            
            if (method === 'Instaloader') {
                showProgressPanel();
                startPolling();
            } else {
                btnScan.disabled = false;
                btnStart.textContent = 'Navegador Abierto';
                startPolling(true);
                showProgressPanel();
            }
            
        } catch (error) {
            alert('Error al iniciar el proceso.');
            btnStart.disabled = false;
            btnStart.textContent = 'Iniciar Proceso';
        }
    });

    btnScan.addEventListener('click', async () => {
        btnScan.disabled = true;
        const target = document.getElementById('target').value;
        try {
            await fetch('/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ method: 'Selenium_Scan', target: target, task_id: currentTaskId })
            });
        } catch (error) {
            alert('Error al iniciar el escaneo.');
            btnScan.disabled = false;
        }
    });

    function showProgressPanel() {
        document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
        progressPanel.style.display = 'block';
        terminal.innerHTML = '';
        countValue.textContent = '0';
        resultActions.style.display = 'none';
        spinner.style.display = 'inline-block';
        statusText.innerHTML = '<div class="spinner" id="spinner" style="display:inline-block; margin-right:8px; width:12px; height:12px; border:2px solid rgba(255,255,255,0.2); border-top-color:#fff; border-radius:50%; animation:spin 1s linear infinite;"></div> Procesando';
        statusText.style.color = 'var(--text-main)';
    }

    function addLog(msg) {
        const p = document.createElement('p');
        p.textContent = msg;
        terminal.appendChild(p);
        terminal.scrollTop = terminal.scrollHeight;
    }

    function startPolling(isSeleniumPrepare = false) {
        if (pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(async () => {
            if (!currentTaskId) return;
            try {
                const response = await fetch(`/status/${currentTaskId}`);
                const data = await response.json();
                
                if (data.status === 'not_found') { clearInterval(pollInterval); return; }
                
                if (data.logs && data.logs.length > 0) data.logs.forEach(addLog);
                if (data.progress !== undefined) countValue.textContent = data.progress;
                
                if (data.status === 'completed') {
                    clearInterval(pollInterval);
                    statusText.innerHTML = '¡Completado!';
                    statusText.style.color = 'var(--success)';
                    resultActions.style.display = 'flex';
                } else if (data.status === 'error') {
                    clearInterval(pollInterval);
                    statusText.innerHTML = 'Ocurrió un error';
                    statusText.style.color = 'var(--error)';
                    resultActions.style.display = 'flex';
                    btnDownload.style.display = 'none';
                } else if (data.status === 'browser_ready') {
                    statusText.innerHTML = 'Esperando a que presiones Capturar Datos...';
                }
            } catch (error) { console.error("Error polling:", error); }
        }, 1000);
    }

    btnDownload.addEventListener('click', () => {
        if (currentTaskId) window.location.href = `/download/${currentTaskId}`;
    });

    btnNew.addEventListener('click', () => {
        progressPanel.style.display = 'none';
        formPanel.style.display = 'block';
        btnStart.disabled = false;
        const method = document.querySelector('input[name="method"]:checked').value;
        if (method === 'Instaloader') { btnStart.textContent = 'Iniciar Proceso'; } 
        else { btnStart.textContent = '1. Abrir Navegador (Selenium)'; btnScan.disabled = true; }
        currentTaskId = null;
        if (pollInterval) clearInterval(pollInterval);
    });
});
