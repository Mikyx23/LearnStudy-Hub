// Variables globales
let currentCourseId = null;
let currentEvaluationId = null;

// DOM Elements
const coursesContainer = document.getElementById('courses-container');
const courseModal = document.getElementById('course-modal');
const closeModalBtn = document.getElementById('close-modal');
const evaluationsContainer = document.getElementById('evaluations-container');
const gradeInputModal = document.getElementById('grade-input-modal');
const gradeForm = document.getElementById('grade-form');
const cancelGradeBtn = document.getElementById('cancel-grade-btn');
const semesterSelect = document.getElementById('semester-select');

// Colores para los cursos
const courseColors = [
    '#4361ee', '#7209b7', '#f72585', '#4cc9f0', 
    '#3a0ca3', '#4895ef', '#560bad', '#b5179e'
];

// Cargar cursos en la página
function loadCourses() {
    coursesContainer.innerHTML = '';
    
    studentCourses.forEach((course, index) => {
        const colorIndex = index % courseColors.length;
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card';
        courseCard.dataset.id = course.id_curso;
        
        courseCard.innerHTML = `
            <div class="course-header" style="background: ${courseColors[colorIndex]}">
                <div class="course-code">${course.codigo_asignatura}</div>
                <h3 class="course-name">${course.nombre_romano}</h3>
                <span class="course-credits">${course.uc_asignatura} UC</span>
            </div>
            <div class="course-footer">
                <div>
                    <div class="course-grade ${course.promedio === null ? 'pending' : ''}">
                        ${course.promedio !== null ? (Number(course.promedio) || 0).toFixed(1) : 'Sin calificaciones'}
                    </div>
                </div>
                <button class="view-details" data-id="${course.id_curso}">
                    <i class="fas fa-chart-line"></i> Ver Evaluaciones
                </button>
            </div>
        `;
        
        coursesContainer.appendChild(courseCard);
    });
    
    // Añadir event listeners a los botones de ver detalles
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const courseId = parseInt(this.dataset.id);
            openCourseModal(courseId);
        });
    });
    
    // Añadir event listeners a las tarjetas de curso
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', function() {
            const courseId = parseInt(this.dataset.id);
            openCourseModal(courseId);
        });
    });
}

// Abrir modal con las evaluaciones del curso
function openCourseModal(courseId) {
    currentCourseId = courseId;
    const course = studentCourses.find(c => c.id_curso === courseId);
    
    if (!course) return;
    
    // Actualizar información del curso en el modal
    document.getElementById('modal-course-name').textContent = course.nombre_romano;
    document.getElementById('modal-course-code').textContent = course.codigo_asignatura;
    document.getElementById('modal-course-credits').textContent = course.uc_asignatura;
    document.getElementById('modal-course-grade').textContent = course.promedio !== null ? course.promedio.toFixed(1) : 'N/A';
    
    // Cargar evaluaciones del curso
    loadCourseEvaluations(courseId);
    
    // Mostrar modal
    courseModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Cargar evaluaciones del curso en el modal
function loadCourseEvaluations(courseId) {
    const evaluations = courseEvaluations[courseId] || [];
    evaluationsContainer.innerHTML = '';
    
    // Agrupar evaluaciones por corte
    const evaluationsByCorte = {};
    
    evaluations.forEach(evaluation => {
        if (!evaluationsByCorte[evaluation.corte]) {
            evaluationsByCorte[evaluation.corte] = [];
        }
        evaluationsByCorte[evaluation.corte].push(evaluation);
    });
    
    // Si no hay evaluaciones
    if (Object.keys(evaluationsByCorte).length === 0) {
        evaluationsContainer.innerHTML = '<div class="no-evaluations">No hay evaluaciones registradas para este curso.</div>';
        return;
    }
    
    // Crear sección para cada corte
    Object.keys(evaluationsByCorte).sort().forEach(corte => {
        const corteContainer = document.createElement('div');
        corteContainer.className = 'corte-container';
        
        corteContainer.innerHTML = `
            <h3 class="corte-title">Corte ${corte}</h3>
            <div class="evaluations-list" id="corte-${corte}"></div>
        `;
        
        evaluationsContainer.appendChild(corteContainer);
        
        const corteList = document.getElementById(`corte-${corte}`);
        
        // Añadir cada evaluación del corte
        evaluationsByCorte[corte].forEach(evaluation => {
            const evaluationItem = document.createElement('div');
            evaluationItem.className = 'evaluation-item';
            evaluationItem.dataset.id = evaluation.id_evaluacion;
            
            const hasGrade = evaluation.calificacion !== null;
            
            evaluationItem.innerHTML = `
                <div class="evaluation-info">
                    <div class="evaluation-name">${evaluation.descripcion}</div>
                    <div class="evaluation-percentage">${evaluation.porcentaje}%</div>
                </div>
                <div class="evaluation-grade ${hasGrade ? '' : 'pending'}">
                    ${hasGrade ? evaluation.calificacion.toFixed(1) : 'Sin calificar'}
                </div>
                ${!hasGrade ? 
                    `<button class="add-grade-btn" data-id="${evaluation.id_evaluacion}">
                        <i class="fas fa-plus"></i> Agregar
                    </button>` 
                    : ''
                }
            `;
            
            corteList.appendChild(evaluationItem);
        });
    });
    
    // Añadir event listeners a los botones de agregar calificación
    document.querySelectorAll('.add-grade-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const evaluationId = parseInt(this.dataset.id);
            openGradeInputModal(evaluationId);
        });
    });
}

// Abrir modal para agregar calificación
function openGradeInputModal(evaluationId) {
    currentEvaluationId = evaluationId;
    
    // Buscar la evaluación para mostrar su nombre
    let evaluationName = "Evaluación";
    for (const courseId in courseEvaluations) {
        const evaluation = courseEvaluations[courseId].find(e => e.id_evaluacion === evaluationId);
        if (evaluation) {
            evaluationName = evaluation.descripcion;
            break;
        }
    }
    
    document.getElementById('grade-evaluation-name').textContent = `Calificar: ${evaluationName}`;
    document.getElementById('grade-input').value = '';
    
    gradeInputModal.classList.add('active');
}

// Cerrar modal de curso
closeModalBtn.addEventListener('click', () => {
    courseModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Cerrar modal al hacer clic fuera de él
courseModal.addEventListener('click', (e) => {
    if (e.target === courseModal) {
        courseModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Manejar envío del formulario de calificación
gradeForm.addEventListener('submit', async (e) => { 
    e.preventDefault();
    
    const gradeInput = document.getElementById('grade-input');
    const grade = parseFloat(gradeInput.value);
    
    // 1. Validaciones básicas
    if (isNaN(grade) || grade < 0 || grade > 20) {
        alert('Por favor ingrese una calificación válida entre 0 y 20.');
        return;
    }
    
    // 2. Preparar datos combinando el formulario con nuestras variables globales
    const datos = new FormData(e.target);
    const datosJSON = Object.fromEntries(datos.entries());
    
    // Agregamos manualmente los IDs que el servidor necesita
    datosJSON.id_curso = currentCourseId;
    datosJSON.id_evaluacion = currentEvaluationId;
    datosJSON.calificacion = grade; // Aseguramos que el nombre coincida con tu backend

    try {
        const respuesta = await fetch(`/api/calificaciones/registrar`, {
            method: 'POST',
            body: JSON.stringify(datosJSON),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const datosRespuesta = await respuesta.json();

        if (!respuesta.ok) {
            Swal.fire({
                icon: "error",
                title: "Error al registrar la calificacion",
                text: "No pudimos registrar la califcacion en la base de datos. Por favor, inténtalo de nuevo en unos momentos.",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Entendido"
            });
            return;
        }

        // 9. Redirección opcional (si tu backend la pide)
        if (datosRespuesta.redirectUrl) {
            setTimeout(() => {
                window.location.href = datosRespuesta.redirectUrl;
            }, 1500);
        }

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "¡Error de conexión!",
            text: "No se pudo establecer comunicación con el servidor. Por favor, verifica tu internet.",
            confirmButtonText: "Reintentar",
            confirmButtonColor: "#d33",
        });
    }
});

// Cancelar agregar calificación
cancelGradeBtn.addEventListener('click', () => {
    gradeInputModal.classList.remove('active');
});

// Cerrar modal de calificación al hacer clic fuera de él
gradeInputModal.addEventListener('click', (e) => {
    if (e.target === gradeInputModal) {
        gradeInputModal.classList.remove('active');
    }
});

// Recalcular el promedio de un curso
function recalculateCourseAverage(courseId) {
    const evaluations = courseEvaluations[courseId];
    if (!evaluations) return;
    
    let totalWeightedGrade = 0;
    let totalWeight = 0;
    let hasGrades = false;
    
    evaluations.forEach(evaluation => {
        if (evaluation.calificacion !== null) {
            totalWeightedGrade += evaluation.calificacion * evaluation.porcentaje;
            totalWeight += evaluation.porcentaje;
            hasGrades = true;
        }
    });
    
    // Actualizar el promedio en los datos del curso
    const courseIndex = studentCourses.findIndex(c => c.id_curso === courseId);
    if (courseIndex !== -1 && hasGrades) {
        studentCourses[courseIndex].promedio = totalWeightedGrade / totalWeight;
    } else if (courseIndex !== -1) {
        studentCourses[courseIndex].promedio = null;
    }
}

// Actualizar la tarjeta del curso en la página principal
function updateCourseCard(courseId) {
    const course = studentCourses.find(c => c.id_curso === courseId);
    if (!course) return;
    
    const courseCard = document.querySelector(`.course-card[data-id="${courseId}"]`);
    if (!courseCard) return;
    
    const gradeElement = courseCard.querySelector('.course-grade');
    gradeElement.textContent = course.promedio !== null ? course.promedio.toFixed(1) : 'Sin calificaciones';
    
    if (course.promedio !== null) {
        gradeElement.classList.remove('pending');
    } else {
        gradeElement.classList.add('pending');
    }
}

// Mostrar notificación
function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 2000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    
    // Añadir keyframe para la animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Eliminar notificación después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Cambiar lapso académico
// semesterSelect.addEventListener('change', function() {
//     showNotification(`Lapso académico cambiado a: ${this.options[this.selectedIndex].text}`, 'success');
    
//     // En una implementación real, aquí se cargarían los cursos del lapso seleccionado
//     // Por ahora solo simulamos cambiando algunos cursos
//     setTimeout(() => {
//         // Simular cambio de datos
//         const updatedCourses = [...studentCourses];
//         // Cambiar algunos promedios para simular datos diferentes
//         updatedCourses.forEach(course => {
//             if (course.id_curso % 2 === 0) {
//                 course.promedio = course.promedio !== null ? 
//                     Math.min(20, course.promedio + (Math.random() * 2 - 1)) : 
//                     null;
//             }
//         });
        
//         // Recargar cursos
//         loadCourses();
//     }, 500);
// });

// Inicializar la página
loadCourses();
    
    // Simular datos cargados
    setTimeout(() => {
        // Añadir efecto de carga inicial
        document.querySelectorAll('.course-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }, 100);