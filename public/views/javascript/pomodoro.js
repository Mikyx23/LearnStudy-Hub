const courseSelect = document.getElementById('course-select');
const examSelect = document.getElementById('exam-select');
const currentObjective = document.getElementById('current-objective');
const timerDisplay = document.getElementById('timer-display');
const modeIndicator = document.getElementById('mode-indicator');
const progressBar = document.getElementById('progress-bar');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

let timerInterval = null;
let timeRemaining = 1500;
let totalTime = 1500;
let isWorkMode = true;
let isPaused = false;
let currentSession = {
    courseName: '',
    examName: '',
    workSessions: 0,
    breakSessions: 0,
    startTime: null
};

// Cargar historial del storage persistente
async function loadHistory() {
    try {
        const result = await window.storage.get('pomodoro-history');
        return result ? JSON.parse(result.value) : [];
    } catch (error) {
        return [];
    }
}

// Guardar historial en storage persistente
async function saveHistory(history) {
    try {
        await window.storage.set('pomodoro-history', JSON.stringify(history));
    } catch (error) {
        console.error('Error saving history:', error);
    }
}

// Agregar sesión al historial
async function addSessionToHistory() {
    if (currentSession.workSessions === 0) return;

    const history = await loadHistory();
    const session = {
        id: Date.now(),
        courseName: currentSession.courseName,
        examName: currentSession.examName,
        workSessions: currentSession.workSessions,
        breakSessions: currentSession.breakSessions,
        totalMinutes: currentSession.workSessions * 25,
        date: new Date().toISOString()
    };

    history.unshift(session);
    await saveHistory(history);
    renderHistory();
}

// Renderizar historial
async function renderHistory() {
    const history = await loadHistory();
    const historySection = document.getElementById('history-section');
    
    if (history.length === 0) {
        historySection.innerHTML = `
            <div class="empty-history">
                <div class="empty-history-icon">📋</div>
                <p>No hay sesiones registradas aún</p>
            </div>
        `;
    } else {
        historySection.innerHTML = history.map(session => {
            const date = new Date(session.date);
            const dateStr = date.toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            });
            const timeStr = date.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            return `
                <div class="session-card">
                    <div class="session-header">
                        <div>
                            <div class="session-title">${session.examName}</div>
                            <div class="session-course">${session.courseName}</div>
                        </div>
                        <div class="session-date">
                            ${dateStr}<br>${timeStr}
                        </div>
                    </div>
                    <div class="session-stats">
                        <div class="stat-item">
                            <span class="stat-value">${session.workSessions}</span>
                            <span class="stat-label">Pomodoros</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${session.totalMinutes}</span>
                            <span class="stat-label">Minutos</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${session.breakSessions}</span>
                            <span class="stat-label">Descansos</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateStatsSummary(history);
}

// Actualizar resumen de estadísticas
function updateStatsSummary(history) {
    const totalSessions = history.reduce((sum, s) => sum + s.workSessions, 0);
    const totalMinutes = history.reduce((sum, s) => sum + s.totalMinutes, 0);
    const totalBreaks = history.reduce((sum, s) => sum + s.breakSessions, 0);

    document.getElementById('total-sessions').textContent = totalSessions;
    document.getElementById('total-minutes').textContent = totalMinutes;
    document.getElementById('total-breaks').textContent = totalBreaks;
}

// Limpiar historial
async function clearHistory() {
    if (confirm('¿Estás seguro de que quieres eliminar todo el historial?')) {
        await window.storage.delete('pomodoro-history');
        renderHistory();
    }
}

// Sistema de pestañas
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        if (tabName === 'history') {
            renderHistory();
        }
    });
});

document.getElementById('clear-history-btn').addEventListener('click', clearHistory);

studyData.courses.forEach(course => {
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = course.name;
    courseSelect.appendChild(option);
});

courseSelect.addEventListener('change', (e) => {
    const courseId = parseInt(e.target.value);
    examSelect.innerHTML = '<option value="">Selecciona una evaluación</option>';
    examSelect.disabled = true;
    startBtn.disabled = true;
    currentObjective.textContent = 'Selecciona una evaluación para comenzar';

    if (courseId && !isNaN(courseId)) {
        const course = studyData.courses.find(c => c.id === courseId);
        if (course) {
            let exams = course.exams;
            
            // Si exams es un string (viene de MySQL JSON_ARRAYAGG), parsearlo
            if (typeof exams === 'string') {
                try {
                    exams = JSON.parse(exams);
                } catch (error) {
                    console.error('Error parsing exams:', error);
                    exams = [];
                }
            }
            
            // Verificar que sea un array válido
            if (Array.isArray(exams) && exams.length > 0) {
                exams.forEach(exam => {
                    const option = document.createElement('option');
                    option.value = exam.id;
                    option.textContent = exam.name;
                    examSelect.appendChild(option);
                });
                examSelect.disabled = false;
            }
        }
    }
});

examSelect.addEventListener('change', (e) => {
    if (e.target.value) {
        const examName = e.target.options[e.target.selectedIndex].text;
        const courseName = courseSelect.options[courseSelect.selectedIndex].text;
        currentObjective.textContent = examName;
        currentSession.examName = examName;
        currentSession.courseName = courseName;
        currentSession.workSessions = 0;
        currentSession.breakSessions = 0;
        currentSession.startTime = null;
        startBtn.disabled = false;
    } else {
        currentObjective.textContent = 'Selecciona una evaluación para comenzar';
        startBtn.disabled = true;
    }
});

function updateDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const progress = ((totalTime - timeRemaining) / totalTime) * 100;
    progressBar.style.width = `${progress}%`;
}

function startTimer() {
    if (timerInterval) return;

    if (!currentSession.startTime) {
        currentSession.startTime = new Date();
    }
    
    startBtn.textContent = 'En progreso';
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    timerDisplay.classList.add('active');

    // --- NUEVO CÓDIGO: Calcular la hora exacta en que debe terminar ---
    const now = Date.now();
    const endTime = now + (timeRemaining * 1000);

        timerInterval = setInterval(() => {
            // En lugar de restar 1, calculamos cuánto falta para llegar a endTime
            const secondsLeft = Math.round((endTime - Date.now()) / 1000);
            
            // Actualizamos la variable global con el tiempo real restante
            timeRemaining = secondsLeft;
            
            // Aseguramos que no baje de 0 visualmente antes de detenerse
            if (timeRemaining < 0) timeRemaining = 0;

            updateDisplay();

            if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            
            // Reproducir sonido
            const alarm = document.getElementById('alarm-sound');
            if (alarm) alarm.play();

            // Alerta visual
            Swal.fire({
                title: isWorkMode ? '¡Tiempo de descanso!' : '¡A estudiar!',
                text: isWorkMode ? 'Buen trabajo, tómate un respiro.' : 'Es hora de volver a enfocarse.',
                icon: 'info',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#a78bfa'
            });

            if (isWorkMode) currentSession.workSessions++;
            else currentSession.breakSessions++;
            
            switchMode();
        }
    }, 1000); // El intervalo sigue siendo 1 segundo para actualizar la UI
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        pauseBtn.textContent = 'Reanudar';
        startBtn.textContent = 'Iniciar';
        startBtn.disabled = false;
        timerDisplay.classList.remove('active');
    } else {
        startTimer();
        pauseBtn.textContent = 'Pausar';
    }
}

function formatMySQLDate(date) {
    if (!date) return new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const pad = (n) => n < 10 ? '0' + n : n;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

async function resetTimer() {
    // Si el temporizador está corriendo, lo pausamos para la validación
    clearInterval(timerInterval);
    timerInterval = null;

    // VALIDACIÓN: Solo guardar si se completó al menos 1 ciclo (Pomodoro)
    if (currentSession.workSessions > 0) {
        const { value: confirmSave } = await Swal.fire({
            title: '¿Terminar sesión?',
            text: `Has completado ${currentSession.workSessions} ciclos. ¿Deseas guardar el progreso en tu historial?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#a78bfa',
            cancelButtonColor: '#f87171',
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'No, solo reiniciar'
        });

        if (confirmSave) {
            // Mostramos un loader mientras se envía el fetch
            Swal.fire({
                title: 'Guardando...',
                didOpen: () => { Swal.showLoading(); }
            });

            const endTime = new Date();
            const sessionData = {
                id_evaluacion: document.getElementById('exam-select').value,
                descripcion_sesion: `Estudio para ${currentSession.examName}`,
                hora_inicio: formatMySQLDate(currentSession.startTime),
                hora_final: formatMySQLDate(endTime),
                ciclos: currentSession.workSessions
            };

            try {
                const response = await fetch('/api/guardar-pomodoro', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sessionData)
                });

                if (response.ok) {
                    addSessionToHistory(); // Actualizar lista visual
                    Swal.fire({
                        title: '¡Guardado!',
                        text: 'Tu sesión ha sido registrada correctamente.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else {
                    throw new Error();
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
            }
        }
    } else {
        // Si no completó ni un pomodoro, preguntamos si está seguro de reiniciar sin guardar
        const { isConfirmed } = await Swal.fire({
            title: '¿Reiniciar cronómetro?',
            text: "No has completado ningún ciclo todavía.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, reiniciar',
            cancelButtonText: 'Cancelar'
        });
        
        if (!isConfirmed) return; // Si cancela, no hace nada
    }

    // --- Lógica de reseteo de la interfaz (se ejecuta después de guardar o si no hubo ciclos) ---
    aplicarResetVisual();
}

// Función auxiliar para limpiar la interfaz y variables
function aplicarResetVisual() {
    isWorkMode = true;
    timeRemaining = 1500;
    totalTime = 1500;
    updateDisplay();
    
    document.body.classList.remove('break-mode');
    timerDisplay.classList.remove('break', 'active');
    progressBar.classList.remove('break');
    modeIndicator.classList.remove('break');
    modeIndicator.textContent = 'Modo Estudio';
    
    startBtn.textContent = 'Iniciar';
    const examSelect = document.getElementById('exam-select');
    startBtn.disabled = examSelect.value === '';
    
    pauseBtn.textContent = 'Pausar';
    pauseBtn.disabled = true;

    currentSession.workSessions = 0;
    currentSession.breakSessions = 0;
    currentSession.startTime = null;
}

function switchMode() {
    isWorkMode = !isWorkMode;
    
    if (isWorkMode) {
        timeRemaining = 1500;
        totalTime = 1500;
        document.body.classList.remove('break-mode');
        timerDisplay.classList.remove('break');
        progressBar.classList.remove('break');
        modeIndicator.classList.remove('break');
        modeIndicator.textContent = 'Modo Estudio';
    } else {
        timeRemaining = 300;
        totalTime = 300;
        document.body.classList.add('break-mode');
        timerDisplay.classList.add('break');
        progressBar.classList.add('break');
        modeIndicator.classList.add('break');
        modeIndicator.textContent = 'Modo Descanso';
    }
    
    updateDisplay();
    startBtn.disabled = false;
    startBtn.textContent = 'Iniciar';
    pauseBtn.textContent = 'Pausar';
    pauseBtn.disabled = true;
    timerDisplay.classList.remove('active');
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updateDisplay();
renderHistory();