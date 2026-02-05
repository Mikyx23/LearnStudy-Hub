// --- ESTADO GLOBAL ---
// Vector para almacenar todas las clases (inicial + agregadas)
let scheduleData = initialScheduleData.map(clase => ({
    ...clase,
    startTime: clase.startTime ? clase.startTime.substring(0, 5) : "",
    endTime: clase.endTime ? clase.endTime.substring(0, 5) : ""
}));

const diasSemanaMap = {
    'lunes': 1, 'martes': 2, 'miércoles': 3, 'jueves': 4, 'viernes': 5, 'sábado': 6
};

// Mapa de colores para las materias
const colorMap = {
    "Cálculo Diferencial": { bg: "#ebf4ff", accent: "#3b82f6" },
    "Programación I":      { bg: "#ecfdf5", accent: "#10b981" },
    "Física Mecánica":     { bg: "#fff7ed", accent: "#f59e0b" },
    "Historia del Arte":   { bg: "#fef2f2", accent: "#ef4444" },
    "Electiva: Fotografía":{ bg: "#ecfeff", accent: "#06b6d4" },
    "Álgebra Lineal":      { bg: "#fdf4ff", accent: "#a855f7" },
    "Inglés Técnico":      { bg: "#f8fafc", accent: "#64748b" },
    "Química General":     { bg: "#f0fdfa", accent: "#14b8a6" },
    "default":             { bg: "#f3f4f6", accent: "#6b7280" }
};

// --- UTILIDADES DE NORMALIZACIÓN ---

/**
 * Genera una firma única para una clase. 
 * Esto es lo que evita que se envíen duplicados al servidor.
 */
function generarHuella(clase) {
    const diaNum = typeof clase.day === 'string' 
        ? (diasSemanaMap[clase.day.toLowerCase()] || 1) 
        : (clase.dia_semana || 1);
    
    return JSON.stringify({
        id_curso: parseInt(clase.id_curso),
        dia_semana: diaNum,
        hora_inicio: clase.startTime.substring(0, 5)
    });
}

// Inicialización del Set de persistencia con los datos que ya vienen de la BD
let clasesYaGuardadas = new Set();
initialScheduleData.forEach(clase => {
    clasesYaGuardadas.add(generarHuella(clase));
});

// --- FUNCIONES DE INTERFAZ ---

function populateSubjectSelect() {
    const subjectSelect = document.getElementById('subject');
    while (subjectSelect.options.length > 1) { subjectSelect.remove(1); }
    
    materiasConIDs.forEach(materia => {
        const option = document.createElement('option');
        option.value = materia.id;
        option.textContent = materia.nombre;
        option.setAttribute('data-nombre', materia.nombre);
        subjectSelect.appendChild(option);
    });
}

function generateTimeOptions() {
    const times = [];
    let currentHour = 7;
    let currentMinute = 45;
    while (currentHour < 21 || (currentHour === 21 && currentMinute <= 15)) {
        const hh = currentHour.toString().padStart(2, '0');
        const mm = currentMinute.toString().padStart(2, '0');
        times.push(`${hh}:${mm}`);
        currentMinute += 45;
        if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
            currentMinute = currentMinute % 60;
        }
    }
    return times;
}

function populateTimeSelects() {
    const times = generateTimeOptions();
    const startSelect = document.getElementById('start-time');
    const endSelect = document.getElementById('end-time');
    startSelect.innerHTML = ''; endSelect.innerHTML = '';
    
    times.forEach(time => {
        startSelect.appendChild(new Option(time, time));
        endSelect.appendChild(new Option(time, time));
    });
    startSelect.value = "07:45";
    endSelect.value = "08:30";
}

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function checkConflict(day, newStart, newEnd) {
    const newStartMins = timeToMinutes(newStart);
    const newEndMins = timeToMinutes(newEnd);
    return scheduleData.find(clase => {
        if (clase.day.toLowerCase() !== day.toLowerCase()) return false;
        const existingStartMins = timeToMinutes(clase.startTime);
        const existingEndMins = timeToMinutes(clase.endTime);
        return (newStartMins < existingEndMins && newEndMins > existingStartMins);
    });
}

function getSubjectNameById(id) {
    const materia = materiasConIDs.find(m => m.id === parseInt(id));
    return materia ? materia.nombre : "Materia";
}

// --- RENDERIZADO Y LÓGICA DE NEGOCIO ---

function renderSchedule() {
    const daysMap = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    daysMap.forEach(day => {
        const columnContainer = document.getElementById(`col-${day}`);
        if (!columnContainer) return;

        let daysClasses = scheduleData.filter(clase => clase.day.toLowerCase() === day);
        daysClasses.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
        
        columnContainer.innerHTML = daysClasses.map(clase => {
            const subjectName = clase.subject || getSubjectNameById(clase.id_curso);
            const colors = colorMap[subjectName] || colorMap["default"];
            return `
                <div class="course-card" style="--accent-color: ${colors.accent}; --bg-color: ${colors.bg};">
                    <span class="course-badge">Clase</span>
                    <h4 class="course-title">${subjectName}</h4>
                    <div class="course-details">
                        <div class="detail-item"><i data-lucide="clock"></i><span>${clase.startTime} - ${clase.endTime}</span></div>
                        <div class="detail-item"><i data-lucide="map-pin"></i><span>${clase.classroom}</span></div>
                    </div>
                </div>`;
        }).join('');
    });
    if (typeof lucide !== "undefined") lucide.createIcons();
}

function addClass() {
    const subjectSelect = document.getElementById('subject');
    const id_curso = subjectSelect.value;
    const day = document.getElementById('day').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const classroom = document.getElementById('classroom').value;
    
    if (!id_curso || !classroom) {
        Swal.fire({ icon: "warning", title: "Atención", text: "Completa todos los campos." });
        return;
    }
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
        Swal.fire({ icon: "error", title: "Error", text: "La hora de fin debe ser mayor a la de inicio." });
        return;
    }

    if (checkConflict(day, startTime, endTime)) {
        Swal.fire({ icon: "error", title: "Choque de Horario", text: "Esta clase coincide con otra materia ya agregada." });
        return;
    }
    
    scheduleData.push({
        id_curso: parseInt(id_curso),
        subject: subjectSelect.options[subjectSelect.selectedIndex].getAttribute('data-nombre'),
        day, startTime, endTime, classroom
    });
    
    renderSchedule();
    document.getElementById('classroom').value = '';
}

// --- PERSISTENCIA (GUARDADO Y ELIMINACIÓN) ---

async function enviarHorarioABaseDeDatos() {
    const botonGuardar = document.getElementById('btn-guardar');
    
    // FILTRADO: Solo pasamos lo que no tenga una huella en el Set
    const clasesNuevas = scheduleData.filter(clase => {
        return !clasesYaGuardadas.has(generarHuella(clase));
    });
    
    if (clasesNuevas.length === 0) {
        Swal.fire({ icon: "info", title: "Sin cambios", text: "No hay clases nuevas que guardar." });
        return;
    }
    
    const datosParaEnviar = clasesNuevas.map(clase => ({
        id_curso: clase.id_curso,
        dia_semana: diasSemanaMap[clase.day.toLowerCase()] || 1,
        aula: clase.classroom,
        hora_inicio: clase.startTime,
        hora_final: clase.endTime
    }));
    
    try {
        botonGuardar.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Guardando...';
        botonGuardar.disabled = true;

        const respuesta = await fetch('/api/horario/guardar', {
            method: 'POST',
            body: JSON.stringify(datosParaEnviar),
            headers: { 'Content-Type': 'application/json' }
        });

        const datosRespuesta = await respuesta.json();
        if (!respuesta.ok) throw new Error(datosRespuesta.error || "Error en el servidor");

        // Actualizamos el Set para que estas clases ya no se consideren "nuevas"
        clasesNuevas.forEach(clase => clasesYaGuardadas.add(generarHuella(clase)));
        
        Swal.fire({
            icon: "success",
            title: "¡Guardado!",
            text: "Cambios persistidos correctamente.",
            confirmButtonColor: "#10b981"
        }).then((result) => {
            if (result.isConfirmed && datosRespuesta.redirectUrl) {
                window.location.href = datosRespuesta.redirectUrl;
            }
        });

    } catch (error) {
        Swal.fire({ icon: "error", title: "Error", text: error.message });
    } finally {
        botonGuardar.innerHTML = 'Guardar Horario';
        botonGuardar.disabled = false;
        if (typeof lucide !== "undefined") lucide.createIcons();
    }
}

async function eliminarHorarioCompleto() {
    const confirmacion = await Swal.fire({
        title: '¿Borrar todo el horario?',
        text: "Se eliminarán permanentemente todos los registros.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Sí, eliminar todo'
    });

    if (confirmacion.isConfirmed) {
        try {
            Swal.fire({ title: 'Eliminando...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
            const respuesta = await fetch('/api/horario/eliminar', { method: 'DELETE' });

            if (respuesta.ok) {
                scheduleData = [];
                clasesYaGuardadas.clear();
                renderSchedule(); 
                Swal.fire({ icon: 'success', title: 'Horario eliminado' });
            } else {
                throw new Error('Error al eliminar');
            }
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo completar la acción.' });
        }
    }
}

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', function() {
    populateSubjectSelect();
    populateTimeSelects();
    renderSchedule();
    
    document.getElementById('add-btn').addEventListener('click', addClass);
    document.getElementById('btn-guardar').addEventListener('click', enviarHorarioABaseDeDatos);
    
    const deleteBtn = document.getElementById('btn-delete-all');
    if (deleteBtn) deleteBtn.addEventListener('click', eliminarHorarioCompleto);
});