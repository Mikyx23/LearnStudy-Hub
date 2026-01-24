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
        currentObjective.textContent = examName;
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