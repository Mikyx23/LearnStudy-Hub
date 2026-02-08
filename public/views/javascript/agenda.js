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
let estadosDisponibles = [];

// Paginación
let paginaActual = 1;
const elementosPorPagina = 6;

const configuracionPorcentajes = {
    corte1: { max: 30, colorClass: 'bg-red-50 border-red-200 text-red-700', nombre: 'Corte 1' },
    corte2: { max: 30, colorClass: 'bg-yellow-50 border-yellow-200 text-yellow-700', nombre: 'Corte 2' },
    corte3: { max: 40, colorClass: 'bg-green-50 border-green-200 text-green-700', nombre: 'Corte 3' }
};

// Configuración de iconos Lucide (sustituimos las SVGs por elementos Lucide)
const iconosLucide = {
    clock: `<i data-lucide="clock" class="w-4 h-4"></i>`,
    'check-circle': `<i data-lucide="check-circle" class="w-4 h-4"></i>`,
    star: `<i data-lucide="star" class="w-4 h-4"></i>`,
    edit: `<i data-lucide="pencil" class="w-4 h-4"></i>`,
    trash: `<i data-lucide="trash-2" class="w-4 h-4"></i>`,
    calendar: `<i data-lucide="calendar" class="w-4 h-4"></i>`,
    book: `<i data-lucide="book-open" class="w-4 h-4"></i>`,
    'arrow-right': `<i data-lucide="chevron-right" class="w-4 h-4"></i>`,
    percent: `<i data-lucide="percent" class="w-4 h-4"></i>`,
    'layers': `<i data-lucide="layers" class="w-4 h-4"></i>`,
    'file-text': `<i data-lucide="file-text" class="w-4 h-4"></i>`,
    'plus-circle': `<i data-lucide="plus-circle" class="w-4 h-4"></i>`,
    lock: `<i data-lucide="lock" class="w-4 h-4"></i>`
};

// =========================================
// 2. SELECTORES DEL DOM
// =========================================
const listaExamenes = document.getElementById('lista-examenes');
const mesActualElement = document.getElementById('mes-actual');
const calendarioDias = document.getElementById('calendario-dias');
const formularioEvaluaciones = document.getElementById('formulario-evaluaciones');
const asignaturaInput = document.getElementById('asignatura');
const corteSelect = document.getElementById('corte');
const fechaEvaluacionInput = document.getElementById('fecha_evaluacion');
const descripcionInput = document.getElementById('descripcion_evaluacion');
const porcentajeInput = document.getElementById('porcentaje');
const filtroMes = document.getElementById('filtro-mes');
const btnHoy = document.getElementById('btn-hoy');
const btnPrevMes = document.getElementById('btn-prev-mes');
const btnNextMes = document.getElementById('btn-next-mes');
const btnPrevPag = document.getElementById('btn-prev-pag');
const btnNextPag = document.getElementById('btn-next-pag');
const numerosPaginas = document.getElementById('numeros-paginas');

// =========================================
// 3. FUNCIONES DE APOYO
// =========================================
function extraerFechaISO(dateString) {
    if (!dateString) return null;
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
    }
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

function getDayName(date) {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
}
function getEstadoInfo(estado) {
    const estados = {
        'PENDIENTE': { 
            class: 'bg-blue-100 text-blue-700 border-blue-200', 
            texto: 'Pendiente',
            icono: 'clock',
            siguiente: 'ENTREGADA',
            estadosPermitidos: ['ENTREGADA', 'CALIFICADA'], // Puede cambiar a Entregada o Calificada
            bloqueado: false
        },
        'ENTREGADA': { 
            class: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
            texto: 'Entregada',
            icono: 'check-circle',
            siguiente: 'CALIFICADA',
            estadosPermitidos: ['CALIFICADA'], // Solo puede cambiar a Calificada
            bloqueado: false
        },
        'CALIFICADA': { 
            class: 'bg-purple-100 text-purple-700 border-purple-200', 
            texto: 'Calificada',
            icono: 'star',
            siguiente: null, // No tiene siguiente estado
            estadosPermitidos: [], // No puede cambiar a ningún otro estado
            bloqueado: true // Estado bloqueado
        }
    };
    return estados[estado] || estados['PENDIENTE'];
}

function getCorteInfo(corte) {
    return configuracionPorcentajes[`corte${corte}`] || configuracionPorcentajes.corte1;
}

function getIcono(nombre) {
    return iconosLucide[nombre] || '';
}

// Función para inicializar iconos Lucide
function inicializarIconosLucide() {
    if (window.lucide) {
        lucide.createIcons();
    }
}

// =========================================
// 4. FUNCIONES PARA CARGAR Y MANEJAR DATOS
// =========================================
async function cargarEstadosDisponibles() {
    try {
        const response = await fetch('/api/agenda/estados', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.estados) {
                estadosDisponibles = data.estados;
                console.log('Estados cargados:', estadosDisponibles);
            }
        }
    } catch (error) {
        console.error('Error al cargar estados:', error);
        estadosDisponibles = [
            { id: 'PENDIENTE', nombre: 'Pendiente', color: 'blue', icono: 'clock' },
            { id: 'ENTREGADA', nombre: 'Entregada', color: 'emerald', icono: 'check-circle' },
            { id: 'CALIFICADA', nombre: 'Calificada', color: 'purple', icono: 'star' }
        ];
    }
}

function inicializarDatos() {
    console.log('Inicializando datos...');
    
    if (typeof DATOS_INICIALES_DEL_SERVIDOR !== 'undefined' && Array.isArray(DATOS_INICIALES_DEL_SERVIDOR)) {
        todasLasEvaluaciones = DATOS_INICIALES_DEL_SERVIDOR.map(ev => ({
            ...ev,
            fecha: extraerFechaISO(ev.fecha)
        }));
        console.log('Datos cargados desde servidor:', todasLasEvaluaciones.length);
        
        actualizarContadores(todasLasEvaluaciones.length);
        renderizarCalendario();
        renderizarLista();
        inicializarIconosLucide();
        
        if (fechaEvaluacionInput) {
            fechaEvaluacionInput.min = getLocalDateString(new Date());
            fechaEvaluacionInput.value = getLocalDateString(new Date());
        }
    } else {
        console.warn('No se encontraron datos iniciales del servidor');
        renderizarCalendario();
        renderizarLista();
        inicializarIconosLucide();
    }
}

async function cargarEvaluacionesDesdeAPI() {
    try {
        console.log('Cargando evaluaciones desde API...');
        const response = await fetch('/api/agenda/api/evaluaciones', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (response.status === 401) {
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.evaluaciones)) {
            todasLasEvaluaciones = data.evaluaciones.map(ev => ({
                ...ev,
                fecha: extraerFechaISO(ev.fecha)
            }));
            
            console.log('Evaluaciones cargadas desde API:', todasLasEvaluaciones.length);
            
            actualizarContadores(todasLasEvaluaciones.length);
            renderizarCalendario();
            renderizarLista();
            inicializarIconosLucide();
            
            return true;
        } else {
            throw new Error(data.message || 'Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error al cargar evaluaciones desde API:', error);
        
        if (!error.message.includes('Failed to fetch')) {
            swalClaro.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudieron cargar las evaluaciones',
                confirmButtonColor: '#3b82f6'
            });
        }
        
        return false;
    }
}

// =========================================
// 5. FUNCIÓN PARA CAMBIAR ESTADO
// =========================================
async function cambiarEstadoEvaluacion(evaluacionId, nuevoEstado) {
    try {
        console.log(`Cambiando estado de evaluación ${evaluacionId} a ${nuevoEstado}`);
        
        // Validación frontend adicional
        const evaluacion = todasLasEvaluaciones.find(ev => ev.id == evaluacionId);
        if (!evaluacion) {
            throw new Error('Evaluación no encontrada');
        }
        
        const estadoActual = evaluacion.estado;
        const estadoInfo = getEstadoInfo(estadoActual);
        
        // Validación de transiciones no permitidas
        if (estadoActual === 'CALIFICADA') {
            throw new Error('No se puede cambiar el estado de una evaluación calificada.');
        }
        
        if (estadoActual === 'ENTREGADA' && nuevoEstado === 'PENDIENTE') {
            throw new Error('Una evaluación entregada no puede volver a estado pendiente.');
        }
        
        // Verificar si el nuevo estado está en los estados permitidos
        if (!estadoInfo.estadosPermitidos.includes(nuevoEstado) && nuevoEstado !== estadoActual) {
            throw new Error(`Transición no permitida: ${estadoActual} → ${nuevoEstado}`);
        }
        
        const response = await fetch(`/api/agenda/estado/${evaluacionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                estado: nuevoEstado,
                estado_actual: estadoActual // Enviar estado actual para validación en backend
            }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al cambiar estado');
        }

        const result = await response.json();
        
        if (result.success) {
            const index = todasLasEvaluaciones.findIndex(ev => ev.id == evaluacionId);
            if (index !== -1) {
                todasLasEvaluaciones[index].estado = nuevoEstado;
                renderizarCalendario();
                renderizarLista();
                inicializarIconosLucide();
            }
            
            const nuevoEstadoInfo = getEstadoInfo(nuevoEstado);
            swalClaro.fire({
                icon: 'success',
                title: '¡Estado actualizado!',
                html: `
                    <div class="flex items-center justify-center gap-3 py-2">
                        <div class="w-10 h-10 flex items-center justify-center rounded-full ${nuevoEstadoInfo.class}">
                            ${getIcono(nuevoEstadoInfo.icono)}
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-lg">${result.message}</div>
                            <div class="text-sm text-gray-600">La evaluación ahora está marcada como <span class="font-semibold">${nuevoEstadoInfo.texto}</span></div>
                        </div>
                    </div>
                `,
                timer: 2000,
                showConfirmButton: false
            });
            
            return true;
        } else {
            throw new Error(result.message || 'Error al cambiar estado');
        }
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        swalClaro.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo cambiar el estado de la evaluación',
            confirmButtonColor: '#3b82f6'
        });
        return false;
    }
}

function mostrarMenuCambioEstado(evaluacion, boton) {
    const estadoActual = evaluacion.estado;
    const estadoInfo = getEstadoInfo(estadoActual);
    
    // Si el estado está bloqueado (CALIFICADA), mostrar mensaje y salir
    if (estadoInfo.bloqueado) {
        swalClaro.fire({
            icon: 'info',
            title: 'Estado bloqueado',
            html: `
                <div class="flex items-center justify-center gap-3 py-2">
                    <div class="w-10 h-10 flex items-center justify-center rounded-full ${estadoInfo.class}">
                        ${getIcono(estadoInfo.icono)}
                    </div>
                    <div class="text-left">
                        <div class="font-bold text-lg">No se puede modificar</div>
                        <div class="text-sm text-gray-600">Una evaluación calificada no puede cambiar de estado</div>
                    </div>
                </div>
            `,
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }

    const menu = document.createElement('div');
    menu.className = 'absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50';
    
    let opcionesHTML = '';
    
    // Solo mostrar los estados permitidos
    const estadosDisponibles = [
        { id: 'PENDIENTE', nombre: 'Pendiente', icono: 'clock', color: 'blue' },
        { id: 'ENTREGADA', nombre: 'Entregada', icono: 'check-circle', color: 'emerald' },
        { id: 'CALIFICADA', nombre: 'Calificada', icono: 'star', color: 'purple' }
    ];
    
    estadosDisponibles.forEach(estado => {
        // Verificar si este estado está permitido para la transición actual
        const estaPermitido = estadoInfo.estadosPermitidos.includes(estado.id);
        const esEstadoActual = estadoActual === estado.id;
        
        if (estaPermitido || esEstadoActual) {
            const clasesColor = {
                'PENDIENTE': 'bg-blue-100 text-blue-600',
                'ENTREGADA': 'bg-emerald-100 text-emerald-600',
                'CALIFICADA': 'bg-purple-100 text-purple-600'
            };
            
            opcionesHTML += `
                <button class="cambiar-estado-btn w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                    data-estado="${estado.id}" 
                    data-evaluacion-id="${evaluacion.id}"
                    ${!estaPermitido && !esEstadoActual ? 'disabled' : ''}>
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 flex items-center justify-center rounded-full ${clasesColor[estado.id] || 'bg-gray-100 text-gray-600'}">
                            ${getIcono(estado.icono)}
                        </div>
                        <span class="font-medium ${esEstadoActual ? `text-${estado.color}-600` : 'text-gray-700'}">
                            ${estado.nombre}
                            ${!estaPermitido && estado.id !== 'CALIFICADA' ? '<span class="text-xs text-gray-500 ml-2">(No permitido)</span>' : ''}
                        </span>
                    </div>
                    ${esEstadoActual ? '<span class="text-blue-600 font-bold">✓</span>' : ''}
                </button>
            `;
        }
    });

    menu.innerHTML = `
        <div class="p-4">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 flex items-center justify-center rounded-full ${estadoInfo.class}">
                    ${getIcono(estadoInfo.icono)}
                </div>
                <div>
                    <div class="font-semibold text-gray-900">Estado actual</div>
                    <div class="text-sm ${estadoInfo.class.split(' ')[1]}">${estadoInfo.texto}</div>
                </div>
            </div>
            
            <div class="space-y-2">
                ${opcionesHTML || '<p class="text-center text-gray-500 text-sm py-4">No hay opciones disponibles</p>'}
            </div>
            
            ${estadoInfo.siguiente ? `
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <button class="cambio-rapido-btn w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        data-estado="${estadoInfo.siguiente}" 
                        data-evaluacion-id="${evaluacion.id}">
                        ${getIcono(getEstadoInfo(estadoInfo.siguiente).icono)}
                        Marcar como ${getEstadoInfo(estadoInfo.siguiente).texto}
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    const rect = boton.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + window.scrollY}px`;
    menu.style.right = `${window.innerWidth - rect.right}px`;
    
    document.body.appendChild(menu);
    inicializarIconosLucide();
    
    const cerrarMenu = () => {
        if (document.body.contains(menu)) {
            document.body.removeChild(menu);
        }
        document.removeEventListener('click', cerrarMenuExterno);
    };
    
    const cerrarMenuExterno = (e) => {
        if (!menu.contains(e.target) && e.target !== boton) {
            cerrarMenu();
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', cerrarMenuExterno);
    }, 100);
    
    // Event listeners con validación adicional
    menu.querySelectorAll('.cambiar-estado-btn:not([disabled]), .cambio-rapido-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const nuevoEstado = btn.dataset.estado;
            const evaluacionId = btn.dataset.evaluacionId;
            
            cerrarMenu();
            
            if (nuevoEstado !== estadoActual) {
                // Validación adicional
                if (estadoActual === 'CALIFICADA') {
                    swalClaro.fire({
                        icon: 'error',
                        title: 'No permitido',
                        text: 'Una evaluación calificada no puede cambiar de estado.',
                        confirmButtonColor: '#3b82f6'
                    });
                    return;
                }
                
                if (estadoActual === 'ENTREGADA' && nuevoEstado === 'PENDIENTE') {
                    swalClaro.fire({
                        icon: 'error',
                        title: 'No permitido',
                        text: 'Una evaluación entregada no puede volver a estado pendiente.',
                        confirmButtonColor: '#3b82f6'
                    });
                    return;
                }
                
                await cambiarEstadoEvaluacion(evaluacionId, nuevoEstado);
            }
        });
    });
}

// =========================================
// 6. RENDERIZADO DEL CALENDARIO
// =========================================
function renderizarCalendario() {
    if (!calendarioDias) {
        console.error('Elemento calendario-dias no encontrado');
        return;
    }

    const primerDia = new Date(anioSeleccionado, mesSeleccionado, 1);
    const ultimoDia = new Date(anioSeleccionado, mesSeleccionado + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const primerDiaSemana = primerDia.getDay();

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    if (mesActualElement) {
        mesActualElement.textContent = `${meses[mesSeleccionado]} ${anioSeleccionado}`;
    }

    calendarioDias.innerHTML = '';

    for (let i = 0; i < primerDiaSemana; i++) {
        const diaVacio = document.createElement('div');
        diaVacio.className = 'h-24 bg-gray-50/50 rounded-lg border border-transparent';
        calendarioDias.appendChild(diaVacio);
    }

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

        const evaluacionesDia = todasLasEvaluaciones.filter(ev => {
            const fechaEv = extraerFechaISO(ev.fecha);
            return fechaEv === fechaString;
        });

        let clases = 'h-24 p-2 rounded-lg border transition-all duration-200 relative overflow-hidden';

        if (esHoy(dia)) {
            clases += ' border-blue-500 bg-blue-50 shadow-sm';
        } else if (evaluacionesDia.length > 0) {
            clases += ' border-slate-200 bg-white hover:bg-slate-50';
        } else {
            clases += ' border-slate-100 bg-slate-50/50 hover:bg-white';
        }

        diaElement.className = clases;

        let contenido = `
            <div class="flex justify-between items-start mb-1">
                <span class="text-sm font-semibold ${esHoy(dia) ? 'text-blue-600' : 'text-gray-700'}">${dia}</span>
                <span class="text-xs ${esHoy(dia) ? 'text-blue-500' : 'text-gray-500'}">${getDayName(fechaDia)}</span>
            </div>
        `;

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

            if (evaluacionesDia.length > 2) {
                contenido += `
                    <div class="mt-1 text-center text-xs text-gray-500">
                        +${evaluacionesDia.length - 2} más
                    </div>
                `;
            }
        }

        diaElement.innerHTML = contenido;

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
                    <span class="px-2 py-1 rounded text-xs font-semibold ${corteInfo.colorClass} flex items-center gap-1">
                        ${getIcono('layers')}
                        Corte ${ev.corte} • ${ev.porcentaje}%
                    </span>
                </div>
                <div class="text-sm text-gray-700 mt-2 flex items-center gap-2">
                    ${getIcono('book')}
                    ${nombre}
                </div>
                <div class="text-xs text-gray-500 mt-3 flex justify-between items-center">
                    <span class="flex items-center gap-1">
                        ${getIcono('calendar')}
                        ${formatShortDate(ev.fecha)}
                    </span>
                    <span class="${estadoInfo.class} px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        ${getIcono(estadoInfo.icono)}
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
    }).then(() => {
        inicializarIconosLucide();
    });
}

// =========================================
// 7. RENDERIZADO DE LA TABLA CON ACCIONES
// =========================================
function renderizarLista() {
    if (!listaExamenes) {
        console.error('Elemento lista-examenes no encontrado');
        return;
    }

    listaExamenes.innerHTML = '';

    if (todasLasEvaluaciones.length === 0) {
        listaExamenes.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-16 text-gray-500">
                    <div class="flex flex-col items-center justify-center">
                        <i data-lucide="clipboard-list" class="w-16 h-16 text-gray-400 mb-4"></i>
                        <p class="text-lg text-gray-600 font-medium">No hay evaluaciones registradas</p>
                        <p class="text-sm text-gray-500 mt-2">Agrega tu primera evaluación usando el formulario</p>
                    </div>
                </td>
            </tr>
        `;
        actualizarContadores(0);
        inicializarIconosLucide();
        return;
    }

    const evaluacionesOrdenadas = [...todasLasEvaluaciones].sort((a, b) => {
        const fechaA = parseLocalDate(extraerFechaISO(a.fecha));
        const fechaB = parseLocalDate(extraerFechaISO(b.fecha));
        return fechaA - fechaB;
    });

    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const evaluacionesPaginadas = evaluacionesOrdenadas.slice(inicio, fin);

    evaluacionesPaginadas.forEach((evaluacion, index) => {
        const estadoInfo = getEstadoInfo(evaluacion.estado);
        const corteInfo = getCorteInfo(evaluacion.corte);
        const nombre = evaluacion.nombre || evaluacion.descripcion || 'Sin nombre';

        const fila = document.createElement('tr');
        fila.className = 'border-b border-gray-200 hover:bg-blue-50 transition-all duration-200 group';

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
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1.5 rounded-full text-xs font-semibold border ${estadoInfo.class} flex items-center gap-1.5">
                        ${getIcono(estadoInfo.icono)}
                        ${estadoInfo.texto}
                    </span>
                </div>
            </td>
            <td class="py-4 px-4 text-gray-700 max-w-xs truncate" title="${nombre}">
                <div class="flex items-center gap-2">
                    ${getIcono('book')}
                    ${nombre}
                </div>
            </td>
            <td class="py-4 px-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${corteInfo.colorClass} flex items-center gap-1.5">
                    ${getIcono('percent')}
                    ${evaluacion.porcentaje}%
                </span>
            </td>
            <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                    ${getIcono('calendar')}
                    <span class="text-gray-600 font-medium">${formatShortDate(evaluacion.fecha)}</span>
                </div>
            </td>
            <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                    <button class="btn-cambiar-estado p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition relative"
                        data-evaluacion-id="${evaluacion.id}"
                        title="Cambiar estado">
                        ${getIcono('edit')}
                    </button>
                    <button class="btn-detalles p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                        data-evaluacion-id="${evaluacion.id}"
                        title="Ver detalles">
                        ${getIcono('arrow-right')}
                    </button>
                </div>
            </td>
        `;

        const btnCambiarEstado = fila.querySelector('.btn-cambiar-estado');
        const btnDetalles = fila.querySelector('.btn-detalles');

        if (btnCambiarEstado) {
            btnCambiarEstado.addEventListener('click', (e) => {
                e.stopPropagation();
                mostrarMenuCambioEstado(evaluacion, btnCambiarEstado);
            });
        }

        if (btnDetalles) {
            btnDetalles.addEventListener('click', (e) => {
                e.stopPropagation();
                mostrarDetallesEvaluacion(evaluacion);
            });
        }

        fila.addEventListener('click', () => {
            mostrarDetallesEvaluacion(evaluacion);
        });

        listaExamenes.appendChild(fila);
    });

    renderizarPaginacion(evaluacionesOrdenadas.length);
    inicializarIconosLucide();
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

    let inicio = Math.max(1, paginaActual - 2);
    let fin = Math.min(totalPaginas, inicio + 4);

    if (fin - inicio < 4) {
        inicio = Math.max(1, fin - 4);
    }

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

// =========================================
// 8. FUNCIÓN DE DETALLES MEJORADA
// =========================================
function mostrarDetallesEvaluacion(evaluacion) {
    const estadoActual = evaluacion.estado;
    const estadoInfo = getEstadoInfo(estadoActual);
    const corteInfo = getCorteInfo(evaluacion.corte);
    const fechaEv = parseLocalDate(extraerFechaISO(evaluacion.fecha));
    const nombre = evaluacion.nombre || evaluacion.descripcion || 'Sin nombre';
    const siguienteEstado = estadoInfo.siguiente;
    const siguienteEstadoInfo = siguienteEstado ? getEstadoInfo(siguienteEstado) : null;
    const diasRestantes = Math.ceil((fechaEv - new Date()) / (1000 * 60 * 60 * 24));

    // Determinar si se puede cambiar de estado
    const puedeCambiarEstado = !estadoInfo.bloqueado && siguienteEstado !== null;

    let botonCambioEstadoHTML = '';
    if (puedeCambiarEstado && siguienteEstadoInfo) {
        botonCambioEstadoHTML = `
            <button id="btn-cambiar-estado-detalle" 
                class="p-3 rounded-lg ${estadoInfo.class} hover:opacity-90 transition flex items-center gap-2 font-medium"
                data-evaluacion-id="${evaluacion.id}"
                data-estado-actual="${evaluacion.estado}">
                ${getIcono(siguienteEstadoInfo.icono)}
                Cambiar a ${siguienteEstadoInfo.texto}
            </button>
        `;
    } else if (estadoInfo.bloqueado) {
        botonCambioEstadoHTML = `
            <div class="p-3 rounded-lg bg-gray-100 text-gray-500 flex items-center gap-2 font-medium cursor-not-allowed">
                ${getIcono('lock')}
                Estado bloqueado
            </div>
        `;
    }

    swalClaro.fire({
        title: 'Detalles de la Evaluación',
        html: `
            <div class="text-left space-y-6">
                <div class="flex items-center justify-between border-b border-gray-300 pb-4">
                    <div>
                        <div class="flex items-center gap-3">
                            ${getIcono('book')}
                            <h3 class="text-xl font-bold text-gray-900">${evaluacion.asignatura_nombre || 'Sin asignatura'}</h3>
                        </div>
                        <p class="text-gray-600 mt-2 ml-8">${nombre}</p>
                    </div>
                    <span class="px-3 py-1.5 rounded-full text-sm font-semibold ${corteInfo.colorClass} flex items-center gap-2">
                        ${getIcono('layers')}
                        Corte ${evaluacion.corte} • ${evaluacion.porcentaje}%
                    </span>
                </div>
                
                <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm text-gray-600 mb-2">Estado actual</div>
                            <div class="flex items-center gap-3">
                                <div class="w-12 h-12 flex items-center justify-center rounded-full ${estadoInfo.class}">
                                    ${getIcono(estadoInfo.icono)}
                                </div>
                                <div>
                                    <div class="text-xl font-bold ${estadoInfo.class.split(' ')[1]}">${estadoInfo.texto}</div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        ${estadoInfo.bloqueado ? 'Estado final - No se puede modificar' : 'Haz clic para cambiar'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ${botonCambioEstadoHTML}
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <div class="text-sm text-gray-600 mb-2 flex items-center gap-2">
                            ${getIcono('calendar')}
                            Fecha de entrega
                        </div>
                        <div class="mt-1 text-lg font-semibold text-blue-700">${formatShortDate(evaluacion.fecha)}</div>
                        <div class="text-xs text-gray-500 mt-1">
                            ${getDayName(fechaEv)} • 
                            ${fechaEv.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                    <div class="bg-gray-100 p-4 rounded-lg">
                        <div class="text-sm text-gray-600 mb-2">Días restantes</div>
                        <div class="mt-1 text-2xl font-bold ${fechaEv < new Date() ? 'text-red-600' : 'text-emerald-600'}">
                            ${Math.abs(diasRestantes)} días
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                            ${fechaEv < new Date() ? 'Vencida' : 'Por vencer'}
                        </div>
                    </div>
                </div>
                
                <div class="text-xs text-gray-500 italic pt-4 border-t border-gray-200">
                    <div class="flex items-center gap-4">
                        <span>ID: ${evaluacion.id}</span>
                        <span>•</span>
                        <span>Curso ID: ${evaluacion.curso_id || 'N/A'}</span>
                    </div>
                </div>
            </div>
        `,
        width: '600px',
        showCancelButton: true,
        confirmButtonText: `${getIcono('trash')} Eliminar`,
        cancelButtonText: 'Cerrar',
        showCloseButton: true,
        customClass: {
            closeButton: 'text-gray-400 hover:text-gray-600'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarEvaluacion(evaluacion.id);
        }
    }).then(() => {
        inicializarIconosLucide();
    });

    // Event listener para botón de cambio de estado en el modal
    setTimeout(() => {
        const btnCambiarEstado = document.getElementById('btn-cambiar-estado-detalle');
        if (btnCambiarEstado && puedeCambiarEstado) {
            btnCambiarEstado.addEventListener('click', async () => {
                // Validación antes de cambiar
                if (estadoActual === 'CALIFICADA') {
                    swalClaro.fire({
                        icon: 'error',
                        title: 'No permitido',
                        text: 'Una evaluación calificada no puede cambiar de estado.',
                        confirmButtonColor: '#3b82f6'
                    });
                    return;
                }
                
                if (estadoActual === 'ENTREGADA' && siguienteEstado === 'PENDIENTE') {
                    swalClaro.fire({
                        icon: 'error',
                        title: 'No permitido',
                        text: 'Una evaluación entregada no puede volver a estado pendiente.',
                        confirmButtonColor: '#3b82f6'
                    });
                    return;
                }
                
                await cambiarEstadoEvaluacion(evaluacion.id, siguienteEstado);
                Swal.close();
            });
        }
        inicializarIconosLucide();
    }, 100);
}
// =========================================
// 9. FUNCIONES DE GESTIÓN
// =========================================
async function eliminarEvaluacion(id) {
    const confirm = await swalClaro.fire({
        title: '¿Estás seguro?',
        text: 'Esta evaluación será eliminada permanentemente',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#475569',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
        const response = await fetch(`/api/agenda/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar evaluación');
        }

        const result = await response.json();
        
        if (result.success) {
            swalClaro.fire({
                icon: 'success',
                title: '¡Eliminada!',
                text: 'La evaluación ha sido eliminada correctamente',
                timer: 2000,
                showConfirmButton: false
            });

            setTimeout(() => {
                cargarEvaluacionesDesdeAPI();
            }, 500);
        } else {
            throw new Error(result.message || 'Error al eliminar');
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
        swalClaro.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo eliminar la evaluación',
        });
    }
}

// =========================================
// 10. EVENT LISTENERS
// =========================================
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

if (formularioEvaluaciones) {
    formularioEvaluaciones.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = formularioEvaluaciones.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="animate-spin mr-2">⟳</i> Procesando...';

            const formData = {
                asignatura_id: parseInt(asignaturaInput.value),
                descripcion: descripcionInput.value,
                corte: parseInt(corteSelect.value),
                porcentaje: parseInt(porcentajeInput.value || 0),
                fecha: fechaEvaluacionInput.value
            };

            if (!formData.asignatura_id || !formData.descripcion || !formData.corte || !formData.porcentaje || !formData.fecha) {
                throw new Error('Todos los campos son obligatorios');
            }

            if (formData.porcentaje < 1 || formData.porcentaje > 100) {
                throw new Error('El porcentaje debe estar entre 1 y 100%');
            }

            const corteConfig = configuracionPorcentajes[`corte${formData.corte}`];
            if (formData.porcentaje > corteConfig.max) {
                throw new Error(`El porcentaje máximo para ${corteConfig.nombre} es ${corteConfig.max}%`);
            }

            const response = await fetch('/api/agenda/registrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al registrar evaluación');
            }

            const result = await response.json();
            
            if (result.success) {
                swalClaro.fire({
                    icon: 'success',
                    title: '¡Registrada!',
                    text: 'La evaluación ha sido registrada exitosamente',
                    timer: 2000,
                    showConfirmButton: false,
                    iconColor: '#10b981'
                });

                formularioEvaluaciones.reset();
                const contador = document.getElementById('contador-caracteres');
                if (contador) {
                    contador.textContent = '0/30 caracteres';
                    contador.className = 'text-sm mt-2 text-blue-600';
                }

                await cargarEvaluacionesDesdeAPI();
            } else {
                throw new Error(result.message || 'Error al registrar');
            }

        } catch (error) {
            console.error('Error al registrar:', error);
            swalClaro.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'No se pudo registrar la evaluación',
                confirmButtonColor: '#3b82f6'
            });
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

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

        btnHoy.classList.add('bg-blue-600');
        setTimeout(() => btnHoy.classList.remove('bg-blue-600'), 500);
    });
}

if (filtroMes) {
    filtroMes.value = mesSeleccionado;
    filtroMes.addEventListener('change', (e) => {
        if (e.target.value === 'todos') {
            return;
        } else {
            mesSeleccionado = parseInt(e.target.value);
            anioSeleccionado = fechaActual.getFullYear();
        }
        renderizarCalendario();
    });
}

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
// 11. INICIALIZACIÓN
// =========================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando agenda...');
    
    await cargarEstadosDisponibles();
    inicializarDatos();
    
    if (fechaEvaluacionInput) {
        fechaEvaluacionInput.value = getLocalDateString(new Date());
        fechaEvaluacionInput.min = getLocalDateString(new Date());
    }
    
    if (corteSelect && porcentajeInput) {
        corteSelect.addEventListener('change', (e) => {
            const corte = parseInt(e.target.value);
            const configCorte = configuracionPorcentajes[`corte${corte}`];
            
            if (configCorte) {
                porcentajeInput.max = configCorte.max;
                porcentajeInput.placeholder = `Máximo ${configCorte.max}%`;
                
                if (parseInt(porcentajeInput.value) > configCorte.max) {
                    porcentajeInput.value = configCorte.max;
                    swalClaro.fire({
                        icon: 'warning',
                        title: 'Porcentaje ajustado',
                        text: `El porcentaje ha sido ajustado al máximo permitido para ${configCorte.nombre}: ${configCorte.max}%`,
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            }
        });
    }
    
    setTimeout(() => {
        cargarEvaluacionesDesdeAPI();
    }, 1000);
    
    inicializarIconosLucide();
});

// Función para depuración
async function verificarRutas() {
    const rutas = [
        '/api/agenda/api/evaluaciones',
        '/api/agenda/registrar',
        '/api/agenda/estados'
    ];
    
    for (const ruta of rutas) {
        try {
            const response = await fetch(ruta, {
                method: 'GET',
                credentials: 'include'
            });
            console.log(`Ruta ${ruta}: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.error(`Error en ruta ${ruta}:`, error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(verificarRutas, 2000);
});