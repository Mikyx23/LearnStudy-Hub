const courseSelect = document.getElementById('course-select');
const examSelect = document.getElementById('exam-select');
const currentObjective = document.getElementById('current-objective');
const timerDisplay = document.getElementById('timer-display');
const modeIndicator = document.getElementById('mode-indicator');
const progressBar = document.getElementById('progress-bar');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// --- CONFIGURACIÓN POMODORO (25/5) ---
const STUDY_TIME = 25 * 60; 
const BREAK_TIME = 5 * 60;  

let timerInterval = null;
let timeRemaining = STUDY_TIME; 
let totalTime = STUDY_TIME;
let isWorkMode = true;

// --- PAGINACIÓN ---
let currentPage = 1;
const itemsPerPage = 5;

let currentSession = {
    courseName: '',
    examName: '',
    workSessions: 0,
    startTime: null
};

// --- RENDERIZADO DE HISTORIAL ---
function renderHistory() {
    const historySection = document.getElementById('history-section');
    const history = studyData.history || [];
    
    if (history.length === 0) {
        historySection.innerHTML = `
            <div class="empty-history">
                <div class="empty-history-icon">📋</div>
                <p>No hay sesiones registradas aún</p>
            </div>`;
        updateStatsSummary([]);
        return;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = history.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(history.length / itemsPerPage);

    historySection.innerHTML = paginatedItems.map((session, index) => {
        const date = new Date(session.date);
        const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        const timeStr = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="session-card ${index % 2 === 0 ? 'card-even' : 'card-odd'}">
                <button class="delete-single-btn" onclick="deleteSession(${session.id})" title="Eliminar sesión">×</button>
                <div class="session-header">
                    <div>
                        <div class="session-title">${session.examName}</div>
                        <div class="session-course">${session.courseName}</div>
                    </div>
                    <div class="session-date">${dateStr}<br>${timeStr}</div>
                </div>
                <div class="session-stats">
                    <div class="stat-item">
                        <span class="stat-value">${session.workSessions}</span>
                        <span class="stat-label">Ciclos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${session.totalMinutes || 0}</span>
                        <span class="stat-label">Minutos</span>
                    </div>
                </div>
            </div>`;
    }).join('');

    renderPagination(totalPages);
    updateStatsSummary(history);
}

function renderPagination(totalPages) {
    let container = document.getElementById('pagination-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'pagination-container';
        document.getElementById('history-tab').appendChild(container);
    }
    if (totalPages <= 1) { container.innerHTML = ''; return; }

    container.innerHTML = `
        <div class="pagination">
            <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">←</button>
            <span>Página ${currentPage} de ${totalPages}</span>
            <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">→</button>
        </div>`;
}

window.changePage = (p) => { currentPage = p; renderHistory(); };

// --- ACCIONES FETCH (ELIMINAR Y LIMPIAR) ---

// Eliminar una sola sesión
window.deleteSession = async (id) => {
    const { isConfirmed } = await Swal.fire({
        title: '¿Eliminar sesión?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Sí, eliminar'
    });

    if (isConfirmed) {
        try {
            const res = await fetch(`/api/pomodoro/eliminar/${id}`, { method: 'DELETE' });
            if (res.ok) {
                Swal.fire({
                icon: "success", // Cambiado de "Limpio" a "success" para que se vea el check verde
                title: "Sesión Eliminada",
                text: "Se ha eliminado correctamente. La página se actualizará ahora.",
                confirmButtonColor: "#28a745",
                confirmButtonText: "Entendido",
                allowOutsideClick: false,
                allowEscapeKey: false // También evita que cierren con la tecla Esc
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
        } catch (e) { Swal.fire('Error', 'No se pudo eliminar.', 'error'); }
    }
};

// Limpiar todo el historial
clearHistoryBtn.addEventListener('click', async () => {
    const { isConfirmed } = await Swal.fire({
        title: '¿Limpiar todo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444'
    });

    if (isConfirmed) {
        try {
            const res = await fetch('/api/pomodoro/limpiar', { method: 'DELETE' });
            if (res.ok) {
                Swal.fire({
                    icon: "success", // Cambiado de "Limpio" a "success" para que se vea el check verde
                    title: "Historial Vaciado",
                    text: "Se ha limpiado correctamente. La página se actualizará ahora.",
                    confirmButtonColor: "#28a745",
                    confirmButtonText: "Entendido",
                    allowOutsideClick: false,
                    allowEscapeKey: false // También evita que cierren con la tecla Esc
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
        } catch (e) { console.error(e); }
    }
});

// --- TEMPORIZADOR Y DEMÁS LÓGICA ---

function updateDisplay() {
    const m = Math.floor(timeRemaining / 60);
    const s = timeRemaining % 60;
    timerDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    progressBar.style.width = `${((totalTime - timeRemaining) / totalTime) * 100}%`;
}

function startTimer() {
    if (timerInterval) return;
    if (!currentSession.startTime) currentSession.startTime = new Date();
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    const endTime = Date.now() + (timeRemaining * 1000);

    timerInterval = setInterval(() => {
        timeRemaining = Math.round((endTime - Date.now()) / 1000);
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            document.getElementById('alarm-sound').play();
            Swal.fire({ title: isWorkMode ? '¡Descanso!' : '¡A estudiar!', icon: 'info' })
                .then(() => { 
                    const a = document.getElementById('alarm-sound');
                    a.pause(); a.currentTime = 0;
                });
            if (isWorkMode) currentSession.workSessions++;
            switchMode();
        }
        updateDisplay();
    }, 1000);
}

function switchMode() {
    isWorkMode = !isWorkMode;
    timeRemaining = isWorkMode ? STUDY_TIME : BREAK_TIME;
    totalTime = timeRemaining;
    modeIndicator.textContent = isWorkMode ? 'Modo Estudio' : 'Modo Descanso';
    document.body.classList.toggle('break-mode', !isWorkMode);
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

async function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    if (currentSession.workSessions > 0) {
        const { value: save } = await Swal.fire({
            title: '¿Terminar?',
            text: `Ciclos: ${currentSession.workSessions}`,
            showCancelButton: true,
            confirmButtonText: 'Guardar y Salir'
        });
        if (save) {
            const data = {
                id_evaluacion: examSelect.value,
                descripcion_sesion: `Estudio: ${currentSession.examName}`,
                hora_inicio: currentSession.startTime.toISOString().slice(0, 19).replace('T', ' '),
                hora_final: new Date().toISOString().slice(0, 19).replace('T', ' '),
                ciclos: currentSession.workSessions
            };
            await fetch('/api/pomodoro/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            Swal.fire({
                icon: "success",
                title: "¡Guardado con éxito!",
                text: "Presiona el botón para continuar.",
                confirmButtonColor: "#28a745",
                confirmButtonText: "Ok",
                allowOutsideClick: false // Evita que cierren la alerta haciendo clic fuera
                }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
            
        }
    }
}

function updateStatsSummary(h) {
    document.getElementById('total-sessions').textContent = h.reduce((s, x) => s + parseInt(x.workSessions || 0), 0);
    document.getElementById('total-minutes').textContent = h.reduce((s, x) => s + parseInt(x.totalMinutes || 0), 0);
    document.getElementById('total-breaks').textContent = h.length;
}

// Tabs y Selects
document.querySelectorAll('.tab-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn, .tab-content').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.getElementById(`${b.dataset.tab}-tab`).classList.add('active');
    if (b.dataset.tab === 'history') renderHistory();
}));

studyData.courses.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = c.name;
    courseSelect.appendChild(o);
});

courseSelect.addEventListener('change', (e) => {
    const c = studyData.courses.find(x => x.id == e.target.value);
    examSelect.innerHTML = '<option value="">Selecciona evaluación</option>';
    if (c) {
        JSON.parse(c.exams).forEach(ex => {
            const o = document.createElement('option');
            o.value = ex.id; o.textContent = ex.name;
            examSelect.appendChild(o);
        });
        examSelect.disabled = false;
    }
});

examSelect.addEventListener('change', (e) => {
    startBtn.disabled = !e.target.value;
    currentSession.examName = e.target.options[e.target.selectedIndex]?.text;
    currentObjective.textContent = currentSession.examName || 'Selecciona evaluación';
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', () => {
    clearInterval(timerInterval); timerInterval = null; startBtn.disabled = false;
});
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
renderHistory();