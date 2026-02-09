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
const semesterSelectHistory = document.getElementById('semester-select-history');
const subjectSelectHistory = document.getElementById('subject-select-history');
const historyForm = document.getElementById('history-form');
const historyTableBody = document.getElementById('history-table-body');

// Colores para los cursos (degradados modernos)
const courseColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
];

// Tab Switching Logic
function switchTab(tabId) {
    // Hide all contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    // Remove active styles from tabs
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('border-primary', 'text-primary', 'dark:border-white', 'dark:text-white');
        btn.classList.add('border-transparent', 'text-text-sub');
    });
    // Show selected content
    document.getElementById('view-' + tabId).classList.add('active');
    // Add active styles to clicked tab
    const activeTab = document.getElementById('tab-' + tabId);
    activeTab.classList.remove('border-transparent', 'text-text-sub');
    activeTab.classList.add('border-primary', 'text-primary', 'dark:border-white', 'dark:text-white');
}

// Cargar cursos en la página
function loadCourses() {
    coursesContainer.innerHTML = '';
    
    if (studentCourses.length === 0) {
        return;
    }
    
    studentCourses.forEach((course, index) => {
        const colorIndex = index % courseColors.length;
        const courseCard = document.createElement('div');
        courseCard.className = 'group relative overflow-hidden rounded-xl bg-white dark:bg-surface-dark border border-border-color dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer';
        courseCard.dataset.id = course.id_curso;
        
        courseCard.innerHTML = `
            <div class="p-6" style="background: ${courseColors[colorIndex]}">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <div class="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">${course.codigo_asignatura}</div>
                        <h3 class="text-white text-lg font-bold leading-tight mb-2">${course.nombre_romano}</h3>
                    </div>
                </div>
            </div>
            <div class="p-6 bg-white dark:bg-surface-dark">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-xs text-text-sub font-medium mb-1">Promedio</div>
                        <div class="text-3xl font-bold ${course.promedio === null || course.promedio === 0 ? 'text-gray-400' : 'text-primary dark:text-white'}">
                            ${course.promedio !== null && course.promedio !== 0 ? Number(course.promedio).toFixed(1) : '--'}
                        </div>
                    </div>
                    <button class="view-details flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors" data-id="${course.id_curso}">
                        <span class="material-symbols-outlined text-lg">visibility</span>
                        <span>Ver Detalles</span>
                    </button>
                </div>
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
    document.querySelectorAll('.course-card, [data-id]').forEach(card => {
        if (!card.classList.contains('view-details')) {
            card.addEventListener('click', function() {
                const courseId = parseInt(this.dataset.id);
                if (courseId) {
                    openCourseModal(courseId);
                }
            });
        }
    });

    // Actualizar estadísticas
    updateStatistics();
}

// Actualizar estadísticas en la parte superior
function updateStatistics() {
    // Calcular promedio acumulado
    let totalWeightedGrade = 0;
    let totalWeight = 0;
    
    studentCourses.forEach(course => {
        if (course.promedio !== null && course.promedio !== 0) {
            totalWeightedGrade += course.promedio;
            totalWeight++;
        }
    });
    
    const promedioAcumulado = totalWeight > 0 ? (totalWeightedGrade / totalWeight).toFixed(1) : '--';
    document.getElementById('promedio-acumulado').textContent = promedioAcumulado;
    
    // Materias activas
    document.getElementById('materias-activas').textContent = studentCourses.length;
    
    // Evaluaciones pendientes
    let pendingEvaluations = 0;
    Object.values(courseEvaluations).forEach(evaluations => {
        evaluations.forEach(evaluation => {
            if (evaluation.calificacion === null) {
                pendingEvaluations++;
            }
        });
    });
    document.getElementById('evaluaciones-pendientes').textContent = pendingEvaluations;
}

// Abrir modal con las evaluaciones del curso
function openCourseModal(courseId) {
    currentCourseId = courseId;
    const course = studentCourses.find(c => c.id_curso === courseId);
    
    if (!course) return;
    
    // Actualizar información del curso en el modal
    document.getElementById('modal-course-name').textContent = course.nombre_romano;
    document.getElementById('modal-course-code').textContent = course.codigo_asignatura;
    document.getElementById('modal-course-grade').textContent = course.promedio !== null && course.promedio !== 0 ? course.promedio.toFixed(1) : 'N/A';
    
    // Cargar evaluaciones del curso
    loadCourseEvaluations(courseId);
    
    // Mostrar modal con animación
    courseModal.classList.remove('invisible', 'opacity-0');
    courseModal.classList.add('opacity-100');
    setTimeout(() => {
        courseModal.querySelector('.bg-surface-light').classList.remove('translate-y-8');
    }, 10);
    document.body.style.overflow = 'hidden';
}

// Cerrar modal de curso
function closeCourseModal() {
    courseModal.querySelector('.bg-surface-light').classList.add('translate-y-8');
    setTimeout(() => {
        courseModal.classList.add('invisible', 'opacity-0');
        courseModal.classList.remove('opacity-100');
        document.body.style.overflow = 'auto';
    }, 300);
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
        evaluationsContainer.innerHTML = `
            <div class="text-center py-12 text-text-sub">
                <span class="material-symbols-outlined text-6xl mb-4 opacity-30">assignment</span>
                <p class="text-lg">No hay evaluaciones registradas para este curso.</p>
            </div>
        `;
        return;
    }
    
    // Crear sección para cada corte
    Object.keys(evaluationsByCorte).sort().forEach(corte => {
        const corteContainer = document.createElement('div');
        corteContainer.className = 'mb-8';
        
        corteContainer.innerHTML = `
            <h3 class="text-lg font-bold text-secondary dark:text-emerald-400 mb-4 pb-2 border-b-2 border-secondary/30">
                Corte ${corte}
            </h3>
            <div class="space-y-3" id="corte-${corte}"></div>
        `;
        
        evaluationsContainer.appendChild(corteContainer);
        
        const corteList = document.getElementById(`corte-${corte}`);
        
        // Añadir cada evaluación del corte
        evaluationsByCorte[corte].forEach(evaluation => {
            const evaluationItem = document.createElement('div');
            evaluationItem.className = 'bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors';
            evaluationItem.dataset.id = evaluation.id_evaluacion;
            
            const hasGrade = evaluation.calificacion !== null;
            
            evaluationItem.innerHTML = `
                <div class="flex-1">
                    <div class="font-semibold text-text-main dark:text-white mb-1">${evaluation.descripcion}</div>
                    <div class="text-sm text-primary dark:text-blue-400 font-bold">${evaluation.porcentaje}% del total</div>
                </div>
                <div class="flex items-center gap-3">
                    <div class="text-right">
                        <div class="text-2xl font-bold ${hasGrade ? 'text-secondary' : 'text-gray-400'}">
                            ${hasGrade ? evaluation.calificacion.toFixed(1) : '--'}
                        </div>
                        <div class="text-xs text-text-sub">
                            ${hasGrade ? 'Calificado' : 'Sin calificar'}
                        </div>
                    </div>
                    ${!hasGrade ? 
                        `<button class="add-grade-btn flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary-hover text-white text-sm font-semibold transition-colors" data-id="${evaluation.id_evaluacion}">
                            <span class="material-symbols-outlined text-lg">add</span>
                            <span>Agregar</span>
                        </button>` 
                        : ''
                    }
                </div>
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
    
    gradeInputModal.classList.remove('hidden');
}

// Cerrar modal de curso
closeModalBtn.addEventListener('click', closeCourseModal);

// Cerrar modal al hacer clic fuera de él
courseModal.addEventListener('click', (e) => {
    if (e.target === courseModal) {
        closeCourseModal();
    }
});

// Manejar envío del formulario de calificación
gradeForm.addEventListener('submit', async (e) => { 
    e.preventDefault();
    
    const gradeInput = document.getElementById('grade-input');
    const grade = parseFloat(gradeInput.value);
    
    // Validaciones básicas
    if (isNaN(grade) || grade < 0 || grade > 20) {
        Swal.fire({
            icon: "warning",
            title: "Calificación inválida",
            text: "Por favor ingrese una calificación válida entre 0 y 20.",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Entendido"
        });
        return;
    }
    
    // Preparar datos
    const datos = new FormData(e.target);
    const datosJSON = Object.fromEntries(datos.entries());
    
    datosJSON.id_curso = currentCourseId;
    datosJSON.id_evaluacion = currentEvaluationId;
    datosJSON.calificacion = grade;

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
                title: "Error al registrar la calificación",
                text: "No pudimos registrar la calificación en la base de datos. Por favor, inténtalo de nuevo en unos momentos.",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Entendido"
            });
            return;
        }

        // Cerrar modal de calificación
        gradeInputModal.classList.add('hidden');

        // Actualizar datos locales
        for (const courseId in courseEvaluations) {
            const evaluation = courseEvaluations[courseId].find(e => e.id_evaluacion === currentEvaluationId);
            if (evaluation) {
                evaluation.calificacion = grade;
                break;
            }
        }

        // Recalcular promedio del curso
        recalculateCourseAverage(currentCourseId);
        
        // Actualizar vista
        loadCourseEvaluations(currentCourseId);
        loadCourses();

        // Mostrar notificación de éxito
        Swal.fire({
            icon: "success",
            title: "¡Calificación registrada!",
            text: "La calificación se ha guardado correctamente.",
            timer: 2000,
            showConfirmButton: false
        });

        // Redirección opcional
        if (datosRespuesta.redirectUrl) {
            setTimeout(() => {
                window.location.href = datosRespuesta.redirectUrl;
            }, 2000);
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
    gradeInputModal.classList.add('hidden');
});

// Cerrar modal de calificación al hacer clic fuera de él
gradeInputModal.addEventListener('click', (e) => {
    if (e.target === gradeInputModal) {
        gradeInputModal.classList.add('hidden');
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

    // Actualizar el promedio en el modal
    const course = studentCourses[courseIndex];
    if (course) {
        document.getElementById('modal-course-grade').textContent = 
            course.promedio !== null && course.promedio !== 0 ? course.promedio.toFixed(1) : 'N/A';
    }
}

// ============================================
// FUNCIONALIDAD DEL HISTORIAL ACADÉMICO
// ============================================

// Cargar semestres únicos
// 1. Cargar los 10 semestres fijos
function loadSemesters() {
    if (!semesterSelectHistory) return;
    
    semesterSelectHistory.innerHTML = '<option value="">Seleccionar semestre</option>';
    for (let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Semestre ${i}`;
        semesterSelectHistory.appendChild(option);
    }
}

// Cargar materias según el semestre seleccionado
semesterSelectHistory.addEventListener('change', function() {
    const selectedSem = parseInt(this.value);
    subjectSelectHistory.innerHTML = '<option value="">Seleccionar materia</option>';
    
    if (!selectedSem) {
        subjectSelectHistory.disabled = true;
        return;
    }

    // Filtramos del arreglo que vino de la base de datos
    const materiasDelSemestre = pensumData.filter(m => m.semestre === selectedSem);

    if (materiasDelSemestre.length > 0) {
        subjectSelectHistory.disabled = false;
        materiasDelSemestre.forEach(m => {
            const option = document.createElement('option');
            option.value = m.id_materia; // ID único de la base de datos
            option.textContent = `${m.codigo} - ${m.nombre}`;
            // Guardamos el nombre en un data-attribute para facilitar el renderizado local
            option.dataset.nombre = m.nombre; 
            option.dataset.codigo = m.codigo;
            subjectSelectHistory.appendChild(option);
        });
    } else {
        subjectSelectHistory.disabled = true;
    }
});

// Cargar historial académico en la tabla
function loadAcademicHistory() {
    historyTableBody.innerHTML = '';
    
    // Verificar si hay datos en academicHistory
    if (!academicHistory || academicHistory.length === 0) {
        historyTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center gap-3">
                        <span class="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">history_edu</span>
                        <p class="text-text-sub">No hay materias registradas en el historial académico.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    // Renderizar cada registro del historial
    academicHistory.forEach((record, index) => {
        const row = document.createElement('tr');
        row.className = `hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${index % 2 === 0 ? '' : 'bg-gray-50/30 dark:bg-gray-800/10'}`;
        
        const isApproved = record.estado === 'Aprobada';
        
        row.innerHTML = `
            <td class="px-6 py-4 font-medium text-text-sub">${record.periodo}</td>
            <td class="px-6 py-4 text-text-sub">${record.codigo}</td>
            <td class="px-6 py-4 font-bold text-text-main dark:text-white">${record.materia}</td>
            <td class="px-6 py-4 text-center font-bold ${isApproved ? 'text-secondary' : 'text-red-600'}">${record.nota}</td>
            <td class="px-6 py-4 text-right">
                <span class="inline-flex items-center gap-1 rounded-full ${isApproved ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'} px-2.5 py-0.5 text-xs font-bold border">
                    ${record.estado}
                </span>
            </td>
        `;
        
        historyTableBody.appendChild(row);
    });
}

// Manejar envío del formulario de historial
// 3. Función para GUARDAR en el historial (Servidor)
historyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const selectedOption = subjectSelectHistory.options[subjectSelectHistory.selectedIndex];
    
    const formData = {
        id_materia: subjectSelectHistory.value,
        periodo: document.getElementById('period-history')?.value || "2024-1",
        nota: parseFloat(document.getElementById('grade-history').value),
        estado: document.querySelector('input[name="status"]:checked').value
    };

    // Validación
    if (!formData.id_materia || isNaN(formData.nota)) {
        Swal.fire("Atención", "Completa todos los campos obligatorios", "warning");
        return;
    }

    try {
        const response = await fetch('/api/calificaciones/historial-guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            Swal.fire({ icon: "success", title: "¡Guardado!", timer: 1500, showConfirmButton: false });

            // Actualizar tabla localmente para no recargar
            academicHistory.unshift({
                periodo: formData.periodo,
                codigo: selectedOption.dataset.codigo,
                materia: selectedOption.dataset.nombre,
                nota: formData.nota,
                estado: formData.estado
            });

            loadAcademicHistory(); // Volver a renderizar la tabla
            historyForm.reset();
            subjectSelectHistory.disabled = true;
        } else {
            throw new Error("Error en el servidor");
        }
    } catch (error) {
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
});

// Inicializar la página
loadCourses();
loadSemesters();
loadAcademicHistory();

// Animación de entrada para las tarjetas
setTimeout(() => {
    document.querySelectorAll('[data-id]').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}, 100);
