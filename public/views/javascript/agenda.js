// =============================
// CONFIG GLOBAL SWEETALERT TEMA CLARO
// =============================
const swalClaro = Swal.mixin({
    background: '#ffffff',
    color: '#1e293b',
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#64748b'
});

// =========================================
// 1. VARIABLES DE ESTADO (Globales)
// =========================================
let todasLasEvaluaciones = [];
let fechaActual = new Date();
let mesSeleccionado = fechaActual.getMonth();
let anioSeleccionado = fechaActual.getFullYear();

// Paginación
let paginaActual = 1;
const elementosPorPagina = 6;

const configuracionPorcentajes = {
    corte1: { max: 30, colorClass: 'bg-red-50 border-red-200 text-red-700', nombre: 'Corte 1' },
    corte2: { max: 30, colorClass: 'bg-yellow-50 border-yellow-200 text-yellow-700', nombre: 'Corte 2' },
    corte3: { max: 40, colorClass: 'bg-green-50 border-green-200 text-green-700', nombre: 'Corte 3' }
};

// =========================================
// 2. SELECTORES DEL DOM (Adaptados al HTML)
// =========================================
const listaExamenes = document.getElementById('lista-examenes');
const mesActualElement = document.getElementById('mes-actual');
const calendarioDias = document.getElementById('calendario-dias');

// Formularios e Inputs - Adaptados a los IDs del HTML
const formularioEvaluaciones = document.getElementById('formulario-evaluaciones');
const asignaturaInput = document.getElementById('asignatura');
const corteSelect = document.getElementById('corte');
const fechaEvaluacionInput = document.getElementById('fecha_evaluacion');
const descripcionInput = document.getElementById('descripcion_evaluacion'); // Cambiado a ID correcto
const descripcionDetalleInput = document.getElementById('descripcion_detalle');

// Filtros y Botones
const filtroMes = document.getElementById('filtro-mes');
const btnHoy = document.getElementById('btn-hoy');
const btnPrevMes = document.getElementById('btn-prev-mes');
const btnNextMes = document.getElementById('btn-next-mes');

// Paginación
const btnPrevPag = document.getElementById('btn-prev-pag');
const btnNextPag = document.getElementById('btn-next-pag');
const numerosPaginas = document.getElementById('numeros-paginas');

// =========================================
// 3. FUNCIONES DE APOYO
// =========================================

// Función para extraer solo la fecha de un string ISO (eliminar hora)
function extraerFechaISO(dateString) {
    if (!dateString) return null;
    // Si ya es YYYY-MM-DD, retornar tal cual
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
    }
    // Si es ISO con tiempo, extraer solo la fecha
    if (dateString.includes('T')) {
        return dateString.split('T')[0];
    }
    return dateString;
}

function parseLocalDate(dateString) {
    try {
        const fechaLimpia = extraerFechaISO(dateString);
        const [year, month, day] = fechaLimpia.split('-').map(Number);
        return new Date(year, month - 1, day);
    } catch (e) {
        console.error('Error parseando fecha:', dateString, e);
        return new Date();
    }
}

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatShortDate(dateString) {
    try {
        const fechaLimpia = extraerFechaISO(dateString);
        const [year, month, day] = fechaLimpia.split('-').map(Number);
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    } catch (e) {
        console.error('Error formateando fecha:', dateString, e);
        return dateString;
    }
}

function formatLongDate(dateString) {
    try {
        const fecha = parseLocalDate(dateString);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return fecha.toLocaleDateString('es-ES', options);
    } catch (e) {
        return formatShortDate(dateString);
    }
}

function getDayName(date) {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
}

function getEstadoInfo(estado) {
    const estados = {
        'PENDIENTE': { class: 'bg-blue-100 text-blue-700 border-blue-200', texto: 'Pendiente' },
        'ENTREGADA': { class: 'bg-emerald-100 text-emerald-700 border-emerald-200', texto: 'Entregada' },
        'CALIFICADA': { class: 'bg-purple-100 text-purple-700 border-purple-200', texto: 'Calificada' }
    };
    return estados[estado] || estados['PENDIENTE'];
}

function getCorteInfo(corte) {
    return configuracionPorcentajes[`corte${corte}`] || configuracionPorcentajes.corte1;
}

// =========================================
// 4. RENDERIZADO DEL CALENDARIO MEJORADO
// =========================================

function renderizarCalendario() {
    if (!calendarioDias) return;

    const primerDia = new Date(anioSeleccionado, mesSeleccionado, 1);
    const ultimoDia = new Date(anioSeleccionado, mesSeleccionado + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const primerDiaSemana = primerDia.getDay();

    // Actualizar título del mes
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    if (mesActualElement) {
        mesActualElement.textContent = `${meses[mesSeleccionado]} ${anioSeleccionado}`;
    }

    // Limpiar calendario
    calendarioDias.innerHTML = '';

    // Días vacíos antes del primer día del mes
    for (let i = 0; i < primerDiaSemana; i++) {
        const diaVacio = document.createElement('div');
        diaVacio.className = 'h-24 bg-gray-50/50 rounded-lg border border-transparent';
        calendarioDias.appendChild(diaVacio);
    }

    // Días del mes
    const hoy = new Date();
    const esHoy = (dia) => {
        return dia === hoy.getDate() &&
            mesSeleccionado === hoy.getMonth() &&
            anioSeleccionado === hoy.getFullYear();
    };

    for (let dia = 1; dia <= diasEnMes; dia++) {
        const diaElement = document.createElement('div');
        const fechaDia = new Date(anioSeleccionado, mesSeleccionado, dia);
        const fechaString = getLocalDateString(fechaDia);

        // Obtener evaluaciones de este día (comparando solo fecha, sin hora)
        const evaluacionesDia = todasLasEvaluaciones.filter(ev => {
            const fechaEv = extraerFechaISO(ev.fecha);
            return fechaEv === fechaString;
        });

        // Clases base del día
        let clases = 'h-24 p-2 rounded-lg border transition-all duration-200 relative overflow-hidden';

        if (esHoy(dia)) {
            clases += ' border-blue-500 bg-blue-50 shadow-sm';
        } else if (evaluacionesDia.length > 0) {
            clases += ' border-slate-200 bg-white hover:bg-slate-50';
        } else {
            clases += ' border-slate-100 bg-slate-50/50 hover:bg-white';
        }

        diaElement.className = clases;

        // Contenido del día
        let contenido = `
            <div class="flex justify-between items-start mb-1">
                <span class="text-sm font-semibold ${esHoy(dia) ? 'text-blue-600' : 'text-gray-700'}">${dia}</span>
                <span class="text-xs ${esHoy(dia) ? 'text-blue-500' : 'text-gray-500'}">${getDayName(fechaDia)}</span>
            </div>
        `;

        // Mostrar evaluaciones (máximo 2)
        if (evaluacionesDia.length > 0) {
            evaluacionesDia.slice(0, 2).forEach((ev, index) => {
                const corteInfo = getCorteInfo(ev.corte);
                const nombre = ev.nombre || ev.descripcion || 'Evaluación';
                const nombreCorto = nombre.length > 15 ? nombre.substring(0, 15) + '...' : nombre;
                contenido += `
                    <div class="mt-1 p-1 rounded text-xs truncate ${corteInfo.colorClass} border">
                        ${nombreCorto}
                    </div>
                `;
            });

            // Indicador de más evaluaciones
            if (evaluacionesDia.length > 2) {
                contenido += `
                    <div class="mt-1 text-center text-xs text-gray-500">
                        +${evaluacionesDia.length - 2} más
                    </div>
                `;
            }
        }

        diaElement.innerHTML = contenido;

        // Click para ver evaluaciones del día
        if (evaluacionesDia.length > 0) {
            diaElement.addEventListener('click', () => mostrarEvaluacionesDia(fechaString));
            diaElement.style.cursor = 'pointer';
            diaElement.classList.add('hover:shadow-md', 'hover:border-blue-300');
        } else {
            diaElement.style.cursor = 'default';
        }

        calendarioDias.appendChild(diaElement);
    }
}

function mostrarEvaluacionesDia(fecha) {
    const evaluacionesDia = todasLasEvaluaciones.filter(ev => {
        const fechaEv = extraerFechaISO(ev.fecha);
        return fechaEv === fecha;
    });

    if (evaluacionesDia.length === 0) {
        swalClaro.fire({
            title: `No hay evaluaciones`,
            text: `No hay evaluaciones programadas para el ${formatShortDate(fecha)}`,
            icon: 'info',
            confirmButtonColor: '#3b82f6',
            confirmButtonText: 'Cerrar'
        });
        return;
    }

    let mensaje = `<div class="text-left space-y-3 max-h-96 overflow-y-auto pr-2">`;
    evaluacionesDia.forEach(ev => {
        const corteInfo = getCorteInfo(ev.corte);
        const estadoInfo = getEstadoInfo(ev.estado);
        const nombre = ev.nombre || ev.descripcion || 'Sin nombre';
        
        mensaje += `
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition">
                <div class="flex justify-between items-start mb-2">
                    <div class="font-semibold text-gray-900 text-lg">${ev.asignatura_nombre || 'Sin asignatura'}</div>
                    <span class="px-2 py-1 rounded text-xs font-semibold ${corteInfo.colorClass}">
                        Corte ${ev.corte} • ${ev.porcentaje}%
                    </span>
                </div>
                <div class="text-sm text-gray-700 mt-2">${nombre}</div>
                <div class="text-xs text-gray-500 mt-3 flex justify-between items-center">
                    <span>${formatShortDate(ev.fecha)}</span>
                    <span class="${estadoInfo.class} px-2 py-1 rounded-full text-xs">
                        ${estadoInfo.texto}
                    </span>
                </div>
            </div>
        `;
    });
    mensaje += `</div>`;

    swalClaro.fire({
        title: `Evaluaciones - ${formatShortDate(fecha)}`,
        html: mensaje,
        showConfirmButton: false,
        showCloseButton: true,
        width: '500px'
    });
}

// =========================================
// 5. RENDERIZADO DE LA LISTA/TABLA MEJORADO
// =========================================

function renderizarLista() {
    if (!listaExamenes) return;

    listaExamenes.innerHTML = '';

    if (todasLasEvaluaciones.length === 0) {
        listaExamenes.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-16 text-gray-500">
                    <div class="flex flex-col items-center justify-center">
                        <svg class="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        <p class="text-lg text-gray-600">No hay evaluaciones registradas</p>
                        <p class="text-sm text-gray-500 mt-2">Agrega tu primera evaluación usando el formulario</p>
                    </div>
                </td>
            </tr>
        `;
        actualizarContadores(0);
        return;
    }

    // Ordenar por fecha (más próximas primero)
    const evaluacionesOrdenadas = [...todasLasEvaluaciones].sort((a, b) => {
        const fechaA = parseLocalDate(extraerFechaISO(a.fecha));
        const fechaB = parseLocalDate(extraerFechaISO(b.fecha));
        return fechaA - fechaB;
    });

    // Paginación
    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const evaluacionesPaginadas = evaluacionesOrdenadas.slice(inicio, fin);

    evaluacionesPaginadas.forEach((evaluacion, index) => {
        const estadoInfo = getEstadoInfo(evaluacion.estado);
        const corteInfo = getCorteInfo(evaluacion.corte);
        const nombre = evaluacion.nombre || evaluacion.descripcion || 'Sin nombre';

        const fila = document.createElement('tr');
        fila.className = 'border-b border-gray-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer group';

        // Alternar colores de fila
        if (index % 2 === 0) {
            fila.className += ' bg-gray-50/50';
        }

        fila.innerHTML = `
            <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full ${corteInfo.colorClass.split(' ')[0]} border ${corteInfo.colorClass.includes('border') ? '' : 'border-gray-300'}"></div>
                    <span class="font-medium text-gray-800">${evaluacion.asignatura_nombre || 'Sin asignatura'}</span>
                </div>
            </td>
            <td class="py-4 px-4">
                <span class="px-3 py-1.5 rounded-full text-xs font-semibold border ${estadoInfo.class}">
                    ${estadoInfo.texto}
                </span>
            </td>
            <td class="py-4 px-4 text-gray-700 max-w-xs truncate" title="${nombre}">
                ${nombre}
            </td>
            <td class="py-4 px-4">
                <div class="flex items-center justify-between">
                    <span class="text-gray-600 font-medium">${formatShortDate(evaluacion.fecha)}</span>
                    <svg class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </div>
            </td>
        `;

        // Click para ver detalles
        fila.addEventListener('click', () => mostrarDetallesEvaluacion(evaluacion));

        listaExamenes.appendChild(fila);
    });

    renderizarPaginacion(evaluacionesOrdenadas.length);
    actualizarContadores(evaluacionesOrdenadas.length);
}

function actualizarContadores(totalElementos) {
    const totalEvaluaciones = document.getElementById('total-evaluaciones');
    const totalElementosSpan = document.getElementById('total-elementos');
    const elementosMostrados = document.getElementById('elementos-mostrados');
    const paginaActualSpan = document.getElementById('pagina-actual');
    const totalPaginas = document.getElementById('total-paginas');

    const inicio = totalElementos > 0 ? (paginaActual - 1) * elementosPorPagina + 1 : 0;
    const fin = Math.min(paginaActual * elementosPorPagina, totalElementos);
    const totalPags = Math.ceil(totalElementos / elementosPorPagina);

    if (totalEvaluaciones) totalEvaluaciones.textContent = totalElementos;
    if (totalElementosSpan) totalElementosSpan.textContent = totalElementos;
    if (elementosMostrados) elementosMostrados.textContent = totalElementos > 0 ? `${inicio}-${fin}` : '0-0';
    if (paginaActualSpan) paginaActualSpan.textContent = paginaActual;
    if (totalPaginas) totalPaginas.textContent = totalPags;
}

function renderizarPaginacion(totalElementos) {
    const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);

    if (!numerosPaginas) return;

    numerosPaginas.innerHTML = '';

    // Mostrar máximo 5 números de página
    let inicio = Math.max(1, paginaActual - 2);
    let fin = Math.min(totalPaginas, inicio + 4);

    if (fin - inicio < 4) {
        inicio = Math.max(1, fin - 4);
    }

    // Botón primera página
    if (inicio > 1) {
        const botonPrimera = document.createElement('button');
        botonPrimera.textContent = '1';
        botonPrimera.className = 'w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 transition';
        botonPrimera.addEventListener('click', () => {
            paginaActual = 1;
            renderizarLista();
        });
        numerosPaginas.appendChild(botonPrimera);

        if (inicio > 2) {
            const puntos = document.createElement('span');
            puntos.textContent = '...';
            puntos.className = 'px-2 text-gray-500';
            numerosPaginas.appendChild(puntos);
        }
    }

    // Números de página
    for (let i = inicio; i <= fin; i++) {
        const botonPagina = document.createElement('button');
        botonPagina.textContent = i;
        botonPagina.className = i === paginaActual
            ? 'w-8 h-8 rounded-lg bg-blue-600 text-white font-semibold transition shadow-lg shadow-blue-600/30'
            : 'w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 transition';

        botonPagina.addEventListener('click', () => {
            paginaActual = i;
            renderizarLista();
        });

        numerosPaginas.appendChild(botonPagina);
    }

    // Botón última página
    if (fin < totalPaginas) {
        if (fin < totalPaginas - 1) {
            const puntos = document.createElement('span');
            puntos.textContent = '...';
            puntos.className = 'px-2 text-gray-500';
            numerosPaginas.appendChild(puntos);
        }

        const botonUltima = document.createElement('button');
        botonUltima.textContent = totalPaginas;
        botonUltima.className = 'w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 transition';
        botonUltima.addEventListener('click', () => {
            paginaActual = totalPaginas;
            renderizarLista();
        });
        numerosPaginas.appendChild(botonUltima);
    }

    // Deshabilitar botones si es necesario
    if (btnPrevPag) {
        btnPrevPag.disabled = paginaActual === 1;
        btnPrevPag.className = btnPrevPag.disabled
            ? 'bg-gray-100 text-gray-400 px-4 py-2 rounded-xl font-medium transition cursor-not-allowed border-2 border-gray-300'
            : 'bg-gray-200 hover:bg-gray-300 text-blue-700 px-4 py-2 rounded-xl font-medium transition border-2 border-gray-300';
    }

    if (btnNextPag) {
        btnNextPag.disabled = paginaActual === totalPaginas || totalPaginas === 0;
        btnNextPag.className = btnNextPag.disabled
            ? 'bg-gray-100 text-gray-400 px-4 py-2 rounded-xl font-medium transition cursor-not-allowed border-2 border-gray-300'
            : 'bg-gray-200 hover:bg-gray-300 text-blue-700 px-4 py-2 rounded-xl font-medium transition border-2 border-gray-300';
    }
}

function mostrarDetallesEvaluacion(evaluacion) {
    const estadoInfo = getEstadoInfo(evaluacion.estado);
    const corteInfo = getCorteInfo(evaluacion.corte);
    const fechaEv = parseLocalDate(extraerFechaISO(evaluacion.fecha));
    const nombre = evaluacion.nombre || evaluacion.descripcion || 'Sin nombre';

    swalClaro.fire({
        title: 'Detalles de la Evaluación',
        html: `
            <div class="text-left space-y-4">
                <div class="flex items-center justify-between border-b border-gray-300 pb-3">
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">${evaluacion.asignatura_nombre || 'Sin asignatura'}</h3>
                        <p class="text-gray-600 mt-1">${nombre}</p>
                    </div>
                    <span class="px-3 py-1.5 rounded-full text-sm font-semibold ${corteInfo.colorClass}">
                        Corte ${evaluacion.corte}
                    </span>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-100 p-3 rounded-lg">
                        <div class="text-sm text-gray-600">Estado</div>
                        <div class="mt-1">
                            <span class="px-3 py-1 rounded-full text-xs font-semibold ${estadoInfo.class}">
                                ${estadoInfo.texto}
                            </span>
                        </div>
                    </div>
                    <div class="bg-gray-100 p-3 rounded-lg">
                        <div class="text-sm text-gray-600">Porcentaje</div>
                        <div class="mt-1 text-2xl font-bold text-blue-600">${evaluacion.porcentaje}%</div>
                    </div>
                </div>
                
                <div class="bg-gray-100 p-3 rounded-lg">
                    <div class="text-sm text-gray-600">Fecha de entrega</div>
                    <div class="mt-1 text-lg font-semibold text-blue-700">${formatShortDate(evaluacion.fecha)}</div>
                    <div class="text-xs text-gray-500 mt-1">
                        ${getDayName(fechaEv)} • 
                        ${fechaEv.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                
                <div class="text-xs text-gray-500 italic">
                    ID: ${evaluacion.id} • Curso ID: ${evaluacion.curso_id || 'N/A'}
                </div>
            </div>
        `,
        width: '500px',
        showCancelButton: true,
        confirmButtonText: '<i class="mr-2">🗑️</i> Eliminar',
        cancelButtonText: 'Cerrar',
        showCloseButton: true,
        customClass: {
            closeButton: 'text-gray-400 hover:text-gray-600'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarEvaluacion(evaluacion.id);
        }
    });
}

// =========================================
// 6. FUNCIONES DE GESTIÓN DE EVALUACIONES
// =========================================

async function cargarEvaluaciones() {
    try {
        if (typeof DATOS_INICIALES_DEL_SERVIDOR !== 'undefined' && DATOS_INICIALES_DEL_SERVIDOR.length > 0) {
            // Normalizar las fechas ISO a solo fecha
            todasLasEvaluaciones = DATOS_INICIALES_DEL_SERVIDOR.map(ev => ({
                ...ev,
                fecha: extraerFechaISO(ev.fecha) // Extraer solo la parte de fecha
            }));
        } else {
            const response = await fetch('/api/agenda/listar');
            if (!response.ok) throw new Error('Error al cargar evaluaciones');
            const data = await response.json();
            todasLasEvaluaciones = (data.evaluaciones || []).map(ev => ({
                ...ev,
                fecha: extraerFechaISO(ev.fecha)
            }));
        }

        // Establecer fecha mínima en el input de fecha (hoy)
        if (fechaEvaluacionInput) {
            fechaEvaluacionInput.min = getLocalDateString(new Date());
        }

        renderizarCalendario();
        renderizarLista();
    } catch (error) {
        console.error('Error al cargar evaluaciones:', error);
        swalClaro.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las evaluaciones',
            confirmButtonColor: '#3b82f6'
        });
    }
}

async function eliminarEvaluacion(id) {
    const confirm = await swalClaro.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#475569',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
        const response = await fetch(`/api/agenda/eliminar/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar');

        swalClaro.fire({
            icon: 'success',
            title: '¡Eliminada!',
            text: 'La evaluación ha sido eliminada correctamente',
            timer: 2000,
            showConfirmButton: false
        });

        await cargarEvaluaciones();
    } catch (error) {
        console.error('Error al eliminar:', error);
        swalClaro.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la evaluación',
        });
    }
}

// =========================================
// 7. EVENT LISTENERS MEJORADOS
// =========================================

// Contador de caracteres para la descripción de evaluación
if (descripcionInput) {
    descripcionInput.addEventListener('input', (e) => {
        const contador = document.getElementById('contador-caracteres');
        if (contador) {
            const length = e.target.value.length;
            contador.textContent = `${length}/30 caracteres`;
            contador.className = length > 25
                ? 'text-sm mt-2 text-red-500 font-medium'
                : 'text-sm mt-2 text-blue-600';
        }
    });
}

// Formulario con validación mejorada
if (formularioEvaluaciones) {
    formularioEvaluaciones.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = formularioEvaluaciones.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            // Deshabilitar botón durante el envío
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="animate-spin mr-2">⟳</i> Procesando...';

            const formData = new FormData(formularioEvaluaciones);

            // Asegurarse de que el campo se llama 'nombre' en lugar de 'descripcion'
            // Si el backend espera 'nombre', lo agregamos desde el input de descripción
            const nombreValue = document.getElementById('descripcion_evaluacion').value;
            formData.append('nombre', nombreValue);

            const response = await fetch('/api/agenda/registrar', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar');
            }

            swalClaro.fire({
                icon: 'success',
                title: '¡Registrada!',
                text: 'La evaluación ha sido registrada exitosamente',
                timer: 2000,
                showConfirmButton: false,
                iconColor: '#10b981'
            });

            // Resetear formulario
            formularioEvaluaciones.reset();
            const contador = document.getElementById('contador-caracteres');
            if (contador) {
                contador.textContent = '0/30 caracteres';
                contador.className = 'text-sm mt-2 text-blue-600';
            }

            // Recargar las evaluaciones
            await cargarEvaluaciones();

        } catch (error) {
            console.error('Error al registrar:', error);
            swalClaro.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo registrar la evaluación',
                confirmButtonColor: '#3b82f6'
            });
        } finally {
            // Rehabilitar botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Navegación del calendario
if (btnPrevMes) {
    btnPrevMes.addEventListener('click', () => {
        mesSeleccionado--;
        if (mesSeleccionado < 0) {
            mesSeleccionado = 11;
            anioSeleccionado--;
        }
        renderizarCalendario();
    });
}

if (btnNextMes) {
    btnNextMes.addEventListener('click', () => {
        mesSeleccionado++;
        if (mesSeleccionado > 11) {
            mesSeleccionado = 0;
            anioSeleccionado++;
        }
        renderizarCalendario();
    });
}

if (btnHoy) {
    btnHoy.addEventListener('click', () => {
        const hoy = new Date();
        mesSeleccionado = hoy.getMonth();
        anioSeleccionado = hoy.getFullYear();
        renderizarCalendario();

        // Feedback visual
        btnHoy.classList.add('bg-blue-600');
        setTimeout(() => btnHoy.classList.remove('bg-blue-600'), 500);
    });
}

// Filtro de mes mejorado
if (filtroMes) {
    // Establecer mes actual por defecto
    filtroMes.value = mesSeleccionado;

    filtroMes.addEventListener('change', (e) => {
        if (e.target.value === 'todos') {
            // No aplicar filtro en el calendario
            return;
        } else {
            mesSeleccionado = parseInt(e.target.value);
            anioSeleccionado = fechaActual.getFullYear();
        }
        renderizarCalendario();
    });
}

// Paginación
if (btnPrevPag) {
    btnPrevPag.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarLista();
        }
    });
}

if (btnNextPag) {
    btnNextPag.addEventListener('click', () => {
        const totalPaginas = Math.ceil(todasLasEvaluaciones.length / elementosPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarLista();
        }
    });
}

// Eventos de teclado para navegación
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        if (btnPrevMes) btnPrevMes.click();
    } else if (e.key === 'ArrowRight' && e.ctrlKey) {
        e.preventDefault();
        if (btnNextMes) btnNextMes.click();
    }
});

// =========================================
// 8. INICIALIZACIÓN
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar fecha actual en input
    if (fechaEvaluacionInput) {
        fechaEvaluacionInput.value = getLocalDateString(new Date());
        fechaEvaluacionInput.min = getLocalDateString(new Date());
    }

    // Cargar evaluaciones
    cargarEvaluaciones();

    // Actualizar cada minuto para cambios en tiempo real
    setInterval(() => {
        const ahora = new Date();
        if (ahora.getSeconds() === 0) {
            // Verificar si hay cambios cada minuto
            cargarEvaluaciones();
        }
    }, 60000);
});

// Inicializar botón de exportación
document.addEventListener('DOMContentLoaded', agregarBotonExportacion);