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
    id_evaluacion: null,
    courseName: '',
    examName: '',
    workSessions: 0,
    breakSessions: 0,
    startTime: null,
    descripcion_sesion: ''
};

// Guardar sesión en la base de datos
async function saveSessionToDatabase() {
    if (currentSession.workSessions === 0 || !currentSession.id_evaluacion) {
        return { success: false };
    }

    const horaFinal = new Date();
    const descripcion = `${currentSession.workSessions} Pomodoro(s) completado(s), ${currentSession.breakSessions} descanso(s) tomado(s)`;

    const datosJSON = {
        id_evaluacion: currentSession.id_evaluacion,
        descripcion_sesion: descripcion,
        hora_inicio: currentSession.startTime.toISOString(),
        hora_final: horaFinal.toISOString(),
        completada: true
    };

    try {
        const respuesta = await fetch('/api/pomodoro/registrar', {
            method: 'POST',
            body: JSON.stringify(datosJSON),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const datosRespuesta = await respuesta.json();

        if (!respuesta.ok) {
            console.error('Error al guardar la sesión en la base de datos');
            alert('Error al guardar la sesión en la base de datos');
            return { success: false };
        } else {
            console.log('Sesión guardada exitosamente:', datosRespuesta);
            
            // Agregar la nueva sesión al array de historial
            const nuevaSesion = {
                id_sesion: datosRespuesta.id_sesion,
                courseName: currentSession.courseName,
                examName: currentSession.examName,
                workSessions: currentSession.workSessions,
                breakSessions: currentSession.breakSessions,
                totalMinutes: currentSession.workSessions * 25,
                fecha_sesion: horaFinal.toISOString(),
                hora_inicio: currentSession.startTime.toISOString(),
                hora_final: horaFinal.toISOString()
            };
            
            historyData.unshift(nuevaSesion);
            
            return { success: true };
        }
    } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        alert('Ha ocurrido un error al guardar la sesión');
        return { success: false };
    }
}

// Renderizar historial desde el servidor
function renderHistory() {
    const historySection = document.getElementById('history-section');
    
    if (!historyData || historyData.length === 0) {
        historySection.innerHTML = `
            <div class="empty-history">
                <div class="empty-history-icon">📋</div>
                <p>No hay sesiones registradas aún</p>
            </div>
        `;
    } else {
        historySection.innerHTML = historyData.map(session => {
            const date = new Date(session.fecha_sesion);
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

    updateStatsSummary(historyData);
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
        const examId = parseInt(e.target.value);
        const examName = e.target.options[e.target.selectedIndex].text;
        const courseName = courseSelect.options[courseSelect.selectedIndex].text;
        
        currentObjective.textContent = examName;
        currentSession.id_evaluacion = examId;
        currentSession.examName = examName;
        currentSession.courseName = courseName;
        currentSession.workSessions = 0;
        currentSession.breakSessions = 0;
        currentSession.startTime = null;
        startBtn.disabled = false;
    } else {
        currentObjective.textContent = 'Selecciona una evaluación para comenzar';
        currentSession.id_evaluacion = null;
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

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            
            if (isWorkMode) {
                currentSession.workSessions++;
            } else {
                currentSession.breakSessions++;
            }
            
            switchMode();
        }
    }, 1000);
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

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    
    // Guardar sesión si hubo al menos un pomodoro completado
    if (currentSession.workSessions > 0) {
        addSessionToHistory();
    }
    
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
    startBtn.disabled = examSelect.value === '';
    pauseBtn.textContent = 'Pausar';
    pauseBtn.disabled = true;
    
    // Resetear sesión actual
    currentSession.id_evaluacion = examSelect.value ? parseInt(examSelect.value) : null;
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

// window.addEventListener('beforeunload', (event) => {
//     if (currentSession.workSessions > 0 && timerInterval) {
//         saveSessionToDatabase();
//         event.preventDefault();
//         event.returnValue = '';
//     }
// });

updateDisplay();
renderHistory();