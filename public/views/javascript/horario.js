// Vector para almacenar todas las clases (inicial + agregadas)
let scheduleData = [...initialScheduleData];

// Mapeo de días de la semana a números para la base de datos
const diasSemanaMap = {
    'lunes': 1,
    'martes': 2,
    'miércoles': 3,
    'jueves': 4,
    'viernes': 5,
    'sábado': 6
};

// Función para poblar el select de materias con IDs
function populateSubjectSelect() {
    const subjectSelect = document.getElementById('subject');
    
    // Limpiar opciones existentes (excepto la primera)
    while (subjectSelect.options.length > 1) {
        subjectSelect.remove(1);
    }
    
    // Agregar opciones con IDs
    materiasConIDs.forEach(materia => {
        const option = document.createElement('option');
        option.value = materia.id; // El value será el ID
        option.textContent = materia.nombre; // El texto mostrará el nombre
        option.setAttribute('data-nombre', materia.nombre); // Guardamos también el nombre en un atributo
        subjectSelect.appendChild(option);
    });
}

// Generar opciones de horas desde las 7:45 hasta las 21:15 con bloques de 45 minutos
function generateTimeOptions() {
    const startHour = 7;
    const startMinute = 45;
    const endHour = 21;
    const endMinute = 15;
    const interval = 45; // minutos
    
    const times = [];
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        times.push(timeString);
        
        // Añadir 45 minutos
        currentMinute += interval;
        if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
            currentMinute = currentMinute % 60;
        }
    }
    
    return times;
}

// Rellenar los select de hora de inicio y fin
function populateTimeSelects() {
    const times = generateTimeOptions();
    const startSelect = document.getElementById('start-time');
    const endSelect = document.getElementById('end-time');
    
    times.forEach(time => {
        const option1 = document.createElement('option');
        option1.value = time;
        option1.textContent = time;
        startSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = time;
        option2.textContent = time;
        endSelect.appendChild(option2);
    });
    
    // Establecer valores predeterminados
    startSelect.value = '07:45';
    endSelect.value = '08:30';
}

// Convertir hora en formato HH:MM a minutos desde la medianoche
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Determinar cuántas filas ocupa una clase
function getRowSpan(startTime, endTime) {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const duration = endMinutes - startMinutes;
    
    // Duración en bloques de 45 minutos
    return Math.floor(duration / 45);
}

// Encontrar el índice del slot de tiempo para una hora específica
function findTimeSlotIndex(timeStr, timeSlots) {
    const targetMinutes = timeToMinutes(timeStr);
    
    for (let i = 0; i < timeSlots.length - 1; i++) {
        const slotStart = timeToMinutes(timeSlots[i]);
        const slotEnd = timeToMinutes(timeSlots[i + 1]);
        
        if (targetMinutes >= slotStart && targetMinutes < slotEnd) {
            return i;
        }
    }
    
    // Para el último slot
    const lastSlotStart = timeToMinutes(timeSlots[timeSlots.length - 1]);
    if (targetMinutes >= lastSlotStart) {
        return timeSlots.length - 1;
    }
    
    return -1;
}

// Obtener el nombre de la materia por su ID
function getSubjectNameById(id) {
    const materia = materiasConIDs.find(m => m.id === parseInt(id));
    return materia ? materia.nombre : "Materia Desconocida";
}

function formatSubjectName(text) {
    if (!text) return "";
    return text.toLowerCase().replace(/(^|\s)\S/g, function(l) {
        return l.toUpperCase();
    });
}

function formatTime(timeStr) {
    if (!timeStr) return "";
    return timeStr.substring(0, 5);
}

// Crear la tabla del horario con celdas fusionadas para clases largas
function renderSchedule() {
    const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const timeSlots = generateTimeOptions();
    
    // Organizar las clases por día y por slot de tiempo
    const scheduleByDay = {};
    days.forEach(day => {
        scheduleByDay[day] = {};
        timeSlots.forEach(time => {
            scheduleByDay[day][time] = null;
        });
    });
    
    // Asignar clases a sus slots
    scheduleData.forEach(classItem => {
        const day = classItem.day.toLowerCase(); 
        const startSlotIndex = findTimeSlotIndex(classItem.startTime, timeSlots);
        const rowSpan = getRowSpan(classItem.startTime, classItem.endTime);
        
        if (startSlotIndex !== -1 && scheduleByDay[day]) {
            for (let i = 0; i < rowSpan; i++) {
                if (startSlotIndex + i < timeSlots.length) {
                    const slotTime = timeSlots[startSlotIndex + i];
                    
                    scheduleByDay[day][slotTime] = i === 0 ? {
                        ...classItem,
                        rowSpan: rowSpan,
                        subjectName: formatSubjectName(classItem.subject || getSubjectNameById(classItem.id_curso)),
                        // Mantenemos estas propiedades que ya habías agregado
                        startTimeDisp: classItem.startTime.substring(0, 5),
                        endTimeDisp: classItem.endTime.substring(0, 5)
                    } : 'occupied';
                }
            }
        }
    });
    
    let tableHTML = '<table>';
    tableHTML += '<thead><tr><th class="time-header">Hora</th>';
    dayNames.forEach(day => { tableHTML += `<th>${day}</th>`; });
    tableHTML += '</tr></thead><tbody>';
    
    for (let i = 0; i < timeSlots.length - 1; i++) {
        // 1. CAMBIO: Formatear la columna de la izquierda (la guía de horas)
        const time = timeSlots[i];
        const nextTime = timeSlots[i + 1];
        const timeSlot = `${time.substring(0, 5)} - ${nextTime.substring(0, 5)}`;
        
        tableHTML += `<tr>`;
        tableHTML += `<td class="time-header">${timeSlot}</td>`;
        
        days.forEach(day => {
            const cellContent = scheduleByDay[day][time];
            
            if (cellContent === null) {
                tableHTML += `<td class="empty-cell"></td>`;
            } else if (cellContent === 'occupied') {
                tableHTML += '';
            } else if (cellContent) {
                const colorMap = {
                    "Cálculo Diferencial": "#4a6fa5", "Programación I": "#5cb85c",
                    "Física Mecánica": "#f0ad4e", "Historia del Arte": "#d9534f",
                    "Electiva: Fotografía": "#5bc0de", "Álgebra Lineal": "#9b59b6",
                    "Inglés Técnico": "#34495e", "Química General": "#1abc9c"
                };
                
                const color = colorMap[cellContent.subjectName] || "#4a6fa5";
                const rowSpanAttr = cellContent.rowSpan > 1 ? `rowspan="${cellContent.rowSpan}"` : '';
                
                tableHTML += `<td ${rowSpanAttr}>`;
                tableHTML += `<div class="class-block" style="border-left: 4px solid ${color}; background-color: ${color}20;">`;
                tableHTML += `<div class="class-title">${cellContent.subjectName}</div>`;
                
                // 2. CAMBIO CRÍTICO: Usar Disp en lugar de las originales para quitar segundos
                tableHTML += `<div class="class-time">${cellContent.startTimeDisp} - ${cellContent.endTimeDisp}</div>`;
                
                tableHTML += `<div class="class-room">${cellContent.classroom}</div>`;
                tableHTML += `</div></td>`;
            }
        });
        tableHTML += `</tr>`;
    }
    
    tableHTML += '</tbody></table>';
    document.getElementById('schedule-table').innerHTML = tableHTML;
}

// Añadir una nueva clase al horario
function addClass() {
    const subjectSelect = document.getElementById('subject');
    const selectedOption = subjectSelect.options[subjectSelect.selectedIndex];
    const id_curso = selectedOption.value;
    const subjectName = selectedOption.getAttribute('data-nombre') || selectedOption.textContent;
    
    const day = document.getElementById('day').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    const classroom = document.getElementById('classroom').value;
    
    // Validación básica
    if (!id_curso || !day || !startTime || !endTime || !classroom) {
        alert('Por favor, complete todos los campos');
        return;
    }
    
    // Validar que la hora de fin sea después de la hora de inicio
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
        alert('La hora de finalización debe ser después de la hora de inicio');
        return;
    }
    
    // Validar que la duración sea múltiplo de 45 minutos
    const duration = timeToMinutes(endTime) - timeToMinutes(startTime);
    if (duration % 45 !== 0) {
        alert('La duración de la clase debe ser múltiplo de 45 minutos');
        return;
    }
    
    // Validar que la hora esté dentro del rango permitido
    if (timeToMinutes(startTime) < timeToMinutes('07:45') || timeToMinutes(endTime) > timeToMinutes('21:15')) {
        alert('Las clases deben estar entre las 07:45 y las 21:15');
        return;
    }
    
    // Crear el objeto de la nueva clase
    const newClass = {
        id_curso: parseInt(id_curso),
        subject: subjectName,
        day,
        startTime,
        endTime,
        classroom
    };
    
    // Agregar al vector de datos
    scheduleData.push(newClass);
    
    // Volver a renderizar la tabla
    renderSchedule();
    
    // Resetear el formulario (excepto el día)
    document.getElementById('subject').value = '';
    document.getElementById('start-time').value = '07:45';
    document.getElementById('end-time').value = '08:30';
    document.getElementById('classroom').value = '';
    
    alert('Clase agregada exitosamente al horario');
}

// Función para enviar el horario a la base de datos
// Variable para llevar registro de clases ya guardadas
let clasesYaGuardadas = new Set();

// Al inicio, marcamos las clases iniciales como ya guardadas
initialScheduleData.forEach(clase => {
    clasesYaGuardadas.add(JSON.stringify(clase));
});

// Función para enviar el horario a la base de datos
async function enviarHorarioABaseDeDatos() {
    // Filtrar solo las clases NUEVAS (no guardadas aún)
    const clasesNuevas = scheduleData.filter(clase => {
        const clave = JSON.stringify(clase);
        return !clasesYaGuardadas.has(clave);
    });
    
    // Validar que haya clases nuevas para guardar
    if (clasesNuevas.length === 0) {
        alert('No hay clases nuevas para guardar. Todas las clases ya están en la base de datos.');
        return;
    }
    
    // Preparar solo los datos NUEVOS para enviar
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
        // Mostrar mensaje de carga
        const botonGuardar = document.getElementById('btn-guardar');
        botonGuardar.textContent = 'Guardando...';
        botonGuardar.disabled = true;
        
        console.log('Enviando', datosHorarios.length, 'clases nuevas');
        
        const respuesta = await fetch('/api/horario/guardar', {
            method: 'POST',
            body: JSON.stringify(datosHorarios),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const datosRespuesta = await respuesta.json();
        
        if (!respuesta.ok) {
            if (datosRespuesta.message) {
                alert(`Error al guardar: ${datosRespuesta.message}`);
            } else {
                alert('Error al guardar el horario en la base de datos');
            }
        } else {
            // Si se guardó exitosamente, marcamos las clases como ya guardadas
            clasesNuevas.forEach(clase => {
                clasesYaGuardadas.add(JSON.stringify(clase));
            });
            
            alert(`¡${clasesNuevas.length} clase(s) nueva(s) guardada(s) exitosamente en la base de datos!`);
            
            if (datosRespuesta.redirectUrl) {
                setTimeout(() => {
                    window.location.href = datosRespuesta.redirectUrl;
                }, 1500);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ha ocurrido un error inesperado al guardar el horario');
    } finally {
        // Restaurar botón
        const botonGuardar = document.getElementById('btn-guardar');
        botonGuardar.textContent = 'Guardar Horario';
        botonGuardar.disabled = false;
    }
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Llenar el select de materias con IDs
    populateSubjectSelect();
    
    // Llenar los select de horas
    populateTimeSelects();
    
    // Renderizar el horario inicial
    renderSchedule();
    
    // Configurar el botón de agregar
    document.getElementById('add-btn').addEventListener('click', addClass);
    
    // Configurar el botón de guardar
    document.getElementById('btn-guardar').addEventListener('click', enviarHorarioABaseDeDatos);
    
    // También permitir agregar con Enter en el campo de aula
    document.getElementById('classroom').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addClass();
        }
    });
});