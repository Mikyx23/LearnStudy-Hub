// Vector para almacenar todas las clases (inicial + agregadas)
let scheduleData = initialScheduleData.map(clase => ({
    ...clase,
    startTime: clase.startTime ? clase.startTime.substring(0, 5) : "",
    endTime: clase.endTime ? clase.endTime.substring(0, 5) : ""
}));

const diasSemanaMap = {
    'lunes': 1, 'martes': 2, 'miércoles': 3, 'jueves': 4, 'viernes': 5, 'sábado': 6
};

// Mapa de colores para las materias (Color de fondo claro, y color de acento oscuro)
const colorMap = {
    "Cálculo Diferencial": { bg: "#ebf4ff", accent: "#3b82f6" }, // Azul
    "Programación I":      { bg: "#ecfdf5", accent: "#10b981" }, // Verde
    "Física Mecánica":     { bg: "#fff7ed", accent: "#f59e0b" }, // Naranja
    "Historia del Arte":   { bg: "#fef2f2", accent: "#ef4444" }, // Rojo
    "Electiva: Fotografía":{ bg: "#ecfeff", accent: "#06b6d4" }, // Cian
    "Álgebra Lineal":      { bg: "#fdf4ff", accent: "#a855f7" }, // Púrpura
    "Inglés Técnico":      { bg: "#f8fafc", accent: "#64748b" }, // Gris azulado
    "Química General":     { bg: "#f0fdfa", accent: "#14b8a6" }, // Verde azulado
    "default":             { bg: "#f3f4f6", accent: "#6b7280" }  // Gris por defecto
};


// Función para poblar el select de materias con IDs
function populateSubjectSelect() {
    const subjectSelect = document.getElementById('subject');
    
    while (subjectSelect.options.length > 1) {
        subjectSelect.remove(1);
    }
    
    materiasConIDs.forEach(materia => {
        const option = document.createElement('option');
        option.value = materia.id;
        option.textContent = materia.nombre;
        option.setAttribute('data-nombre', materia.nombre);
        subjectSelect.appendChild(option);
    });
}

// --- MANTENEMOS ESTAS FUNCIONES PARA LOS SELECTS DEL FORMULARIO ---
// (Aunque el diseño nuevo sugiere input type="time", mantenemos esto para no romper funcionalidad existente)
function generateTimeOptions() {
    const times = [];
    let currentHour = 7;
    let currentMinute = 45;
    
    // 21:15 es el límite (9:15 PM)
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
    
    // Limpiar y llenar
    startSelect.innerHTML = '';
    endSelect.innerHTML = '';
    
    times.forEach(time => {
        startSelect.appendChild(new Option(time, time));
        endSelect.appendChild(new Option(time, time));
    });
    
    startSelect.value = "07:45";
    endSelect.value = "08:30";
}
// ------------------------------------------------------------------

// Convertir hora HH:MM a minutos (útil para ordenar y validar)
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// --- VALIDACIÓN DE CHOQUE DE HORARIOS ---
function checkConflict(day, newStart, newEnd) {
    const newStartMins = timeToMinutes(newStart);
    const newEndMins = timeToMinutes(newEnd);

    // Buscamos si alguna clase existente en el mismo día se solapa
    return scheduleData.find(clase => {
        if (clase.day.toLowerCase() !== day.toLowerCase()) return false;

        const existingStartMins = timeToMinutes(clase.startTime);
        const existingEndMins = timeToMinutes(clase.endTime);

        // Lógica de solapamiento: (InicioA < FinB) Y (FinA > InicioB)
        return (newStartMins < existingEndMins && newEndMins > existingStartMins);
    });
}

// Obtener nombre de materia (si viene de la DB inicial)
function getSubjectNameById(id) {
    const materia = materiasConIDs.find(m => m.id === parseInt(id));
    return materia ? materia.nombre : "Materia";
}

// Formatear nombre (Capitalizar)
function formatSubjectName(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
}


// --- NUEVA FUNCIÓN PRINCIPAL DE RENDERIZADO ---
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

// Añadir nueva clase (Lógica de validación casi idéntica, solo quitamos la restricción de 45min)
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

    // EJECUCIÓN DE VALIDACIÓN DE CHOQUE
    const conflict = checkConflict(day, startTime, endTime);
    if (conflict) {
        const conflictName = conflict.subject || getSubjectNameById(conflict.id_curso);
        Swal.fire({
            icon: "error",
            title: "Choque de Horario",
            html: `Esta clase coincide con <b>${conflictName}</b><br>(${conflict.startTime} - ${conflict.endTime})`,
            confirmButtonColor: "#ef4444"
        });
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

// --- FUNCIÓN DE GUARDADO (Permanece exactamente igual a tu original) ---
let clasesYaGuardadas = new Set();
initialScheduleData.forEach(clase => {
    clasesYaGuardadas.add(JSON.stringify(clase));
});

async function enviarHorarioABaseDeDatos() {
    const clasesNuevas = scheduleData.filter(clase => {
        const clave = JSON.stringify(clase);
        return !clasesYaGuardadas.has(clave);
    });
    
    if (clasesNuevas.length === 0) {
        Swal.fire({
            icon: "info",
            title: "Sin cambios",
            text: "No hay clases nuevas que guardar.",
            confirmButtonColor: "#3b82f6"
        });
        return;
    }
    
    const datosHorarios = clasesNuevas.map(clase => {
        return {
            id_curso: clase.id_curso,
            dia_semana: diasSemanaMap[clase.day] || 1,
            aula: clase.classroom,
            hora_inicio: clase.startTime,
            hora_final: clase.endTime
        };
    });
    
    try {
        const botonGuardar = document.getElementById('btn-guardar');
        const textoOriginal = botonGuardar.innerHTML;
        botonGuardar.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Guardando...'; // Añadí un spinner visual si quieres
        botonGuardar.disabled = true;
        if (typeof lucide !== "undefined") lucide.createIcons();

        
        const respuesta = await fetch('/api/horario/guardar', {
            method: 'POST',
            body: JSON.stringify(datosHorarios),
            headers: { 'Content-Type': 'application/json' }
        });

        const datosRespuesta = await respuesta.json();
        
        if (!respuesta.ok) {
            throw new Error("Error en respuesta del servidor");
        } else {
            clasesNuevas.forEach(clase => clasesYaGuardadas.add(JSON.stringify(clase)));
            
            Swal.fire({
                icon: "success",
                title: "¡Guardado!",
                text: "Tu horario se ha actualizado correctamente.",
                confirmButtonColor: "#10b981",
                allowOutsideClick: false
                }).then((result) => {
                if (result.isConfirmed && datosRespuesta.redirectUrl) {
                    window.location.href = datosRespuesta.redirectUrl;
                }
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo guardar el horario. Intenta nuevamente.",
            confirmButtonColor: "#ef4444",
        });
    } finally {
        const botonGuardar = document.getElementById('btn-guardar');
        botonGuardar.innerHTML = 'Save Schedule';
        botonGuardar.disabled = false;
    }
}

async function eliminarHorarioCompleto() {
    // 1. Confirmación con SweetAlert2
    const confirmacion = await Swal.fire({
        title: '¿Borrar todo el horario?',
        text: "Esta acción eliminará permanentemente todas tus clases registradas en la base de datos.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, eliminar todo',
        cancelButtonText: 'Cancelar'
    });

    if (confirmacion.isConfirmed) {
        try {
            // Mostrar estado de carga
            Swal.fire({
                title: 'Eliminando...',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            // 2. Petición DELETE al servidor
            const respuesta = await fetch('/api/horario/eliminar', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (respuesta.ok) {
                // 3. Limpiar datos localmente y refrescar interfaz
                scheduleData = []; 
                renderSchedule(); 

                Swal.fire({
                    icon: 'success',
                    title: 'Horario eliminado',
                    text: 'Se han borrado todos los registros exitosamente.',
                    confirmButtonColor: '#10b981'
                });
            } else {
                throw new Error('Error al eliminar');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo completar la eliminación. Intenta de nuevo.',
                confirmButtonColor: '#ef4444'
            });
        }
    }
}

// Inicialización: Agregar el listener al botón (dentro del DOMContentLoaded)

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    populateSubjectSelect();
    populateTimeSelects();
    renderSchedule();
    document.getElementById('add-btn').addEventListener('click', addClass);
    document.getElementById('btn-guardar').addEventListener('click', enviarHorarioABaseDeDatos);
    const deleteBtn = document.getElementById('btn-delete-all');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', eliminarHorarioCompleto);
    }
});

function getSubjectNameById(id) {
    const materia = materiasConIDs.find(m => m.id === parseInt(id));
    return materia ? materia.nombre : "Materia";
}