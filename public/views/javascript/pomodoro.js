/* ===========================
        VARIABLES
=========================== */

// let time = 25 * 60;
// let interval = null;
// let sessionCounter = 0;

// const timerDisplay = document.getElementById("timer-display");
// const sessionList = document.getElementById("session-list");
// const modeToggle = document.getElementById("mode-toggle");
// const timeSelector = document.getElementById("time-selector");

// const startBtn = document.getElementById("start-btn");
// const pauseBtn = document.getElementById("pause-btn");
// const resetBtn = document.getElementById("reset-btn");

/* ===========================
        TIMER FUNCTIONS
=========================== */

// function updateDisplay() {
//     let m = Math.floor(time / 60);
//     let s = time % 60;
//     timerDisplay.textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
// }

// function startTimer() {
//     if (interval) return;

//     timerDisplay.classList.remove("paused");
//     timerDisplay.classList.add("pulse");

//     interval = setInterval(() => {
//         time--;
//         updateDisplay();

        // FIN DEL CICLO
        // if (time <= 0) {
        //     clearInterval(interval);
        //     interval = null;

        //     timerDisplay.classList.remove("pulse");
        //     timerDisplay.classList.add("paused");

        //     // RESETEAR TIEMPO AL ACTUAL DEL SELECTOR
        //     time = timeSelector.value * 60;
        //     updateDisplay();

        //     sessionCounter++;
        //     addSession(sessionCounter);
        // }
   // }, 1000);
//}

// function pauseTimer() {
//     clearInterval(interval);
//     interval = null;

//     timerDisplay.classList.remove("pulse");
//     timerDisplay.classList.add("paused");
// }

// function resetTimer() {
//     clearInterval(interval);
//     interval = null;

//     time = timeSelector.value * 60;
//     timerDisplay.classList.remove("pulse");
//     timerDisplay.classList.remove("paused");
//     updateDisplay();
// }

// function addSession(num) {
//     const item = document.createElement("div");
//     item.classList.add("session-item");
//     item.textContent = `Sesión completada #${num}`;
//     sessionList.prepend(item);
// }

/* ===========================
        MODE TOGGLE
=========================== */

// modeToggle.addEventListener("click", () => {
//     document.body.classList.toggle("dark-mode");
//     document.body.classList.toggle("light-mode");

//     modeToggle.innerHTML = document.body.classList.contains("dark-mode")
//         ? `<i class="fas fa-sun"></i>`
//         : `<i class="fas fa-moon"></i>`;
// });

/* ===========================
        TIME SELECTOR
=========================== */

// timeSelector.addEventListener("change", () => {
//     time = timeSelector.value * 60;
//     resetTimer();
// });

/* ===========================
        BUTTON EVENTS
=========================== */

// startBtn.addEventListener("click", startTimer());
// pauseBtn.addEventListener("click", pauseTimer());
// resetBtn.addEventListener("click", resetTimer());

// INIT DISPLAY
// updateDisplay();
/* ===========================
        VARIABLES
=========================== */

let time = 25 * 60;
let interval = null;
let sessionCounter = 0;

const timerDisplay = document.getElementById("timer-display");
const sessionList = document.getElementById("session-list");
const modeToggle = document.getElementById("mode-toggle");
const timeSelector = document.getElementById("time-selector");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

/* ===========================
        TIMER FUNCTIONS
=========================== */

function updateDisplay() {
    let m = Math.floor(time / 60);
    let s = time % 60;
    timerDisplay.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function startTimer() {
    if (interval) return;

    timerDisplay.classList.remove("paused");
    timerDisplay.classList.add("pulse");

    interval = setInterval(() => {
        time--;
        updateDisplay();

        // FIN DEL CICLO
        if (time <= 0) {
            clearInterval(interval);
            interval = null;

            timerDisplay.classList.remove("pulse");
            timerDisplay.classList.add("paused");

            // RESETEAR TIEMPO AL ACTUAL DEL SELECTOR
            time = timeSelector.value * 60;
            updateDisplay();

            sessionCounter++;
            addSession(sessionCounter);
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(interval);
    interval = null;

    timerDisplay.classList.remove("pulse");
    timerDisplay.classList.add("paused");
}

function resetTimer() {
    clearInterval(interval);
    interval = null;

    time = timeSelector.value * 60;
    timerDisplay.classList.remove("pulse");
    timerDisplay.classList.remove("paused");
    updateDisplay();
}

function addSession(num) {
    const item = document.createElement("div");
    item.classList.add("session-item");
    item.textContent = `Sesión completada #${num}`;
    sessionList.prepend(item);
}

/* ===========================
        MODE TOGGLE
=========================== */

if (modeToggle) {
    modeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        document.body.classList.toggle("light-mode");

        modeToggle.innerHTML = document.body.classList.contains("dark-mode")
            ? `<i class="fas fa-sun"></i>`
            : `<i class="fas fa-moon"></i>`;
    });
}

/* ===========================
        TIME SELECTOR
=========================== */

if (timeSelector) {
    timeSelector.addEventListener("change", () => {
        time = timeSelector.value * 60;
        resetTimer();
    });
}

/* ===========================
        BUTTON EVENTS
=========================== */

if (startBtn) {
    startBtn.addEventListener("click", startTimer);
}

if (pauseBtn) {
    pauseBtn.addEventListener("click", pauseTimer);
}

if (resetBtn) {
    resetBtn.addEventListener("click", resetTimer);
}

// INIT DISPLAY
updateDisplay();


