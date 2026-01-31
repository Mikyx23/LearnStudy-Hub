// =========================================
// 1. VARIABLES DE ESTADO (Globales)
// =========================================
let todasLasEvaluaciones = [];
let porcentajesUsados = { corte1: 0, corte2: 0, corte3: 0 };
let fechaActual = new Date();
let mesSeleccionado = fechaActual.getMonth();
let anioSeleccionado = fechaActual.getFullYear();

// Paginación
let paginaActual = 1;
const elementosPorPagina = 10;

const configuracionPorcentajes = {
    corte1: { max: 30, colorClass: 'corte1', nombre: 'Corte 1' },
    corte2: { max: 30, colorClass: 'corte2', nombre: 'Corte 2' },
    corte3: { max: 40, colorClass: 'corte3', nombre: 'Corte 3' }
};

// =========================================
// 2. SELECTORES DEL DOM
// =========================================
// Contenedores principales
const listaExamenes = document.getElementById('lista-examenes');
const mesActualElement = document.getElementById('mes-actual');
const calendarioDias = document.getElementById('calendario-dias');
const listaProximas = document.getElementById('lista-proximas');

// Formularios e Inputs
const formularioEvaluaciones = document.getElementById('formulario-evaluaciones');
const asignaturaInput = document.getElementById('asignatura');
const corteSelect = document.getElementById('corte');
const fechaEvaluacionInput = document.getElementById('fecha_evaluacion');

// Filtros y Botones
const filtroMes = document.getElementById('filtro-mes');
const filtroAsignatura = document.getElementById('filtro-asignatura');
const filtroCorte = document.getElementById('filtro-corte');
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

function parseLocalDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatLongDate(dateString) {
    try {
        const date = parseLocalDate(dateString);
        return date.toLocaleDateString('es-ES', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
    } catch (e) { return dateString; }
}

function getEstadoInfo(estado) {
    const estados = {
        'PENDIENTE': { class: 'estado-pendiente', icon: 'fa-clock', texto: 'Pendiente' },
        'ENTREGADA': { class: 'estado-entregada', icon: 'fa-check-circle', texto: 'Entregada' },
        'CALIFICADA': { class: 'estado-calificada', icon: 'fa-star', texto: 'Calificada' }
    };
    return estados[estado] || estados['PENDIENTE'];
}

// Modal de detalles
const modalDetalles = document.createElement('div');
modalDetalles.className = 'modal-detalles';
modalDetalles.innerHTML = `
    <div class="modal-contenido">
        <button class="cerrar-modal">&times;</button>
        <h3 class="modal-titulo">Detalles de la Evaluación</h3>
        <div class="info-detalle">
            <div class="detalle-item"><span class="detalle-label">Asignatura:</span><span class="detalle-valor" id="modal-asignatura"></span></div>
            <div class="detalle-item"><span class="detalle-label">Nombre:</span><span class="detalle-valor" id="modal-nombre"></span></div>
            <div class="detalle-item"><span class="detalle-label">Estado:</span><span class="detalle-valor" id="modal-estado"></span></div>
            <div class="detalle-item"><span class="detalle-label">Porcentaje:</span><span class="detalle-valor porcentaje" id="modal-porcentaje"></span></div>
            <div class="detalle-item"><span class="detalle-label">Corte:</span><span class="detalle-valor" id="modal-corte"></span></div>
            <div class="detalle-item"><span class="detalle-label">Fecha:</span><span class="detalle-valor fecha" id="modal-fecha"></span></div>
        </div>
        <div class="modal-acciones" id="modal-acciones">
            <!-- Los botones se agregarán dinámicamente aquí -->
        </div>
    </div>`;
document.body.appendChild(modalDetalles);

// =========================================
// 4. FUNCIONES (Lista y Paginación)
// =========================================

function renderizarListaEvaluaciones() {
    if (!listaExamenes) return;
    
    // Calcular índices para paginación
    const inicio = (paginaActual - 1) * elementosPorPagina;
    const fin = inicio + elementosPorPagina;
    const evaluacionesPagina = todasLasEvaluaciones.slice(inicio, fin);
    
    listaExamenes.innerHTML = '';
    
    if (evaluacionesPagina.length === 0) {
        listaExamenes.innerHTML = '<li class="sin-evaluaciones"><p>No existen evaluaciones registradas actualmente.</p></li>';
        return;
    }
    
    evaluacionesPagina.forEach(evaluacion => {
        const estadoInfo = getEstadoInfo(evaluacion.estado);
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${evaluacion.asignatura}</span>
            <span>${evaluacion.corte.replace('corte', '')}</span>
            <span class="estado-badge ${estadoInfo.class}">
                <i class="fas ${estadoInfo.icon}"></i> ${estadoInfo.texto}
            </span>
            <span>${evaluacion.nombre}</span>
            <span>${evaluacion.porcentaje}%</span>
            <span>${new Date(evaluacion.fecha).toLocaleDateString('es-ES')}</span>
        `;
        li.onclick = (e) => {
            if (!e.target.closest('.acciones-container')) {
                mostrarDetallesEvento(evaluacion);
            }
        };
        listaExamenes.appendChild(li);
    });
    
    actualizarPaginacion();
}

function actualizarPaginacion() {
    if (!numerosPaginas || !btnPrevPag || !btnNextPag) return;
    
    const totalPaginas = Math.ceil(todasLasEvaluaciones.length / elementosPorPagina);
    
    // Botones anterior/siguiente
    btnPrevPag.disabled = paginaActual === 1;
    btnNextPag.disabled = paginaActual === totalPaginas || totalPaginas === 0;
    
    // Números de página
    numerosPaginas.innerHTML = '';
    const maxBotones = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
    let fin = Math.min(totalPaginas, inicio + maxBotones - 1);
    
    if (fin - inicio + 1 < maxBotones) {
        inicio = Math.max(1, fin - maxBotones + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
        const btn = document.createElement('button');
        btn.className = `numero-pag ${i === paginaActual ? 'activa' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            paginaActual = i;
            renderizarListaEvaluaciones();
        };
        numerosPaginas.appendChild(btn);
    }
}

// =========================================
// 5. FUNCIONES CRUD
// =========================================

async function marcarComoEntregada(id) {
    try {
        const res = await fetch(`/api/agenda/estado/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'ENTREGADA' })
        });
        
        if (res.ok) {
            const evaluacionIndex = todasLasEvaluaciones.findIndex(e => e.id === id);
            if (evaluacionIndex !== -1) {
                todasLasEvaluaciones[evaluacionIndex].estado = 'ENTREGADA';
                renderizarListaEvaluaciones();
                actualizarProximasEvaluaciones();
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Evaluación entregada!',
                    text: 'La evaluación ha sido marcada como entregada.',
                    confirmButtonText: 'Aceptar'
                });
            }
        } else {
            throw new Error('Error al actualizar el estado');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo marcar la evaluación como entregada.',
            confirmButtonText: 'Aceptar'
        });
    }
}

async function eliminarEvaluacion(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
        try {
            const res = await fetch(`/api/agenda/delete/${id}`, {
                method: 'DELETE'
            });
            
            if (res.ok) {
                const index = todasLasEvaluaciones.findIndex(e => e.id === id);
                if (index !== -1) {
                    // Actualizar porcentajes usados
                    const evaluacion = todasLasEvaluaciones[index];
                    porcentajesUsados[evaluacion.corte] -= evaluacion.porcentaje;
                    
                    // Eliminar del array
                    todasLasEvaluaciones.splice(index, 1);
                    
                    // Volver a la primera página si es necesario
                    if (paginaActual > Math.ceil(todasLasEvaluaciones.length / elementosPorPagina)) {
                        paginaActual = Math.max(1, Math.ceil(todasLasEvaluaciones.length / elementosPorPagina));
                    }
                    
                    renderizarListaEvaluaciones();
                    actualizarProximasEvaluaciones();
                    
                    Swal.fire({
                        icon: 'success',
                        title: '¡Eliminado!',
                        text: 'La evaluación ha sido eliminada.',
                        confirmButtonText: 'Aceptar'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la evaluación.',
                confirmButtonText: 'Aceptar'
            });
        }
    }
}

// =========================================
// 6. FUNCIONES (Calendario y Filtros)
// =========================================

function filtrarEvaluaciones() {
    let filtradas = [...todasLasEvaluaciones];
    if (filtroMes && filtroMes.value !== 'todos') {
        const mesFiltro = parseInt(filtroMes.value);
        filtradas = filtradas.filter(e => parseLocalDate(e.fecha).getMonth() === mesFiltro);
    }
    if (filtroAsignatura && filtroAsignatura.value !== 'todos') {
        filtradas = filtradas.filter(e => e.asignatura === filtroAsignatura.value);
    }
    if (filtroCorte && filtroCorte.value !== 'todos') {
        filtradas = filtradas.filter(e => e.corte === filtroCorte.value);
    }
    return filtradas;
}

function actualizarFiltroAsignaturas() {
    if (!filtroAsignatura) return;
    const asignaturasUnicas = [...new Set(todasLasEvaluaciones.map(e => e.asignatura))];
    const seleccionActual = filtroAsignatura.value;
    filtroAsignatura.innerHTML = '<option value="todos">Todas las asignaturas</option>';
    asignaturasUnicas.forEach(asig => {
        const opt = document.createElement('option');
        opt.value = asig; opt.textContent = asig;
        filtroAsignatura.appendChild(opt);
    });
    if (asignaturasUnicas.includes(seleccionActual)) filtroAsignatura.value = seleccionActual;
}

function generarCalendario(mes, anio) {
    if (!calendarioDias) return;
    calendarioDias.innerHTML = '';
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    mesActualElement.textContent = `${meses[mes]} ${anio}`;

    const primerDiaSemana = new Date(anio, mes, 1).getDay();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();
    const evaluacionesFiltradas = filtrarEvaluaciones();

    // Días mes anterior
    const uDiaMesAnt = new Date(anio, mes, 0).getDate();
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
        agregarDiaCalendario(null, uDiaMesAnt - i, true, evaluacionesFiltradas, mes - 1, anio);
    }
    // Días mes actual
    const hoy = new Date();
    for (let d = 1; d <= diasEnMes; d++) {
        const esHoy = hoy.getDate() === d && hoy.getMonth() === mes && hoy.getFullYear() === anio;
        agregarDiaCalendario(d, d, false, evaluacionesFiltradas, mes, anio, esHoy);
    }
    // Rellenar hasta completar 42 celdas
    const restantes = 42 - (primerDiaSemana + diasEnMes);
    for (let d = 1; d <= restantes; d++) {
        agregarDiaCalendario(null, d, true, evaluacionesFiltradas, mes + 1, anio);
    }
}

function agregarDiaCalendario(diaReal, diaMostrado, esInactivo, evFiltradas, mes, anio, esHoy) {
    const diaElement = document.createElement('div');
    diaElement.className = `dia-calendario ${esInactivo ? 'dia-inactivo' : ''} ${esHoy ? 'dia-hoy' : ''}`;
    diaElement.innerHTML = `<div class="dia-numero">${diaMostrado}</div>`;
    
    const eventosContainer = document.createElement('div');
    eventosContainer.className = 'eventos-dia';

    if (!esInactivo && diaReal) {
        const fechaStr = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(diaReal).padStart(2, '0')}`;
        const eventosDelDia = evFiltradas.filter(e => e.fecha === fechaStr);

        eventosDelDia.forEach((evento, index) => {
            const evEl = document.createElement('div');
            
            // Obtener inicial de la asignatura
            const inicial = evento.asignatura.charAt(0).toUpperCase();
            
            // Determinar color basado en el corte
            const colorClase = `evento-evaluacion${evento.corte.charAt(evento.corte.length - 1)}`;
            
            evEl.className = `evento-calendario ${colorClase}`;
            evEl.textContent = inicial; // Solo muestra la inicial
            evEl.setAttribute('data-tooltip', `${evento.asignatura}: ${truncarTexto(evento.nombre, 20)}`);
            
            evEl.onclick = (e) => { 
                e.stopPropagation(); 
                mostrarDetallesEvento(evento); 
            };
            
            eventosContainer.appendChild(evEl);
        });

        // Si hay más de 6 eventos, mostrar indicador
        if (eventosDelDia.length > 6) {
            const mas = document.createElement('div');
            mas.className = 'evento-calendario evento-multiple';
            mas.textContent = `+${eventosDelDia.length - 6}`;
            mas.setAttribute('data-tooltip', `${eventosDelDia.length} evaluaciones este día`);
            mas.onclick = (e) => { 
                e.stopPropagation(); 
                mostrarEventosDelDia(eventosDelDia, fechaStr); 
            };
            eventosContainer.appendChild(mas);
        }
    }
    diaElement.appendChild(eventosContainer);
    calendarioDias.appendChild(diaElement);
}

function truncarTexto(texto, maxLength) {
    if (!texto) return '';
    if (texto.length <= maxLength) return texto;
    return texto.substring(0, maxLength) + '...';
}

function mostrarDetallesEvento(evento) {
    const estadoInfo = getEstadoInfo(evento.estado);
    document.getElementById('modal-asignatura').textContent = evento.asignatura;
    document.getElementById('modal-nombre').textContent = evento.nombre;
    document.getElementById('modal-estado').innerHTML = `<span class="${estadoInfo.class}">${estadoInfo.texto}</span>`;
    document.getElementById('modal-porcentaje').textContent = `${evento.porcentaje}%`;
    document.getElementById('modal-corte').textContent = evento.corte.replace('corte', 'Corte ');
    document.getElementById('modal-fecha').textContent = evento.fechaLarga;
    
    // AGREGAR BOTONES AL MODAL
    const modalAcciones = document.getElementById('modal-acciones');
    modalAcciones.innerHTML = '';
    
    if (evento.estado === 'PENDIENTE') {
        const btnEntregar = document.createElement('button');
        btnEntregar.className = 'btn-accion-modal btn-entregar';
        btnEntregar.innerHTML = '<i class="fas fa-check"></i> Marcar como Entregada';
        btnEntregar.onclick = () => {
            modalDetalles.style.display = 'none';
            marcarComoEntregada(evento.id);
        };
        modalAcciones.appendChild(btnEntregar);
    }
    
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn-accion-modal btn-eliminar';
    btnEliminar.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
    btnEliminar.onclick = () => {
        modalDetalles.style.display = 'none';
        eliminarEvaluacion(evento.id);
    };
    modalAcciones.appendChild(btnEliminar);
    
    modalDetalles.style.display = 'flex';
}

function mostrarEventosDelDia(eventos, fechaStr) {
    const fechaFormateada = formatLongDate(fechaStr);
    let html = `<h4>Eventos del ${fechaFormateada}</h4>`;
    eventos.forEach(e => {
        const estadoInfo = getEstadoInfo(e.estado);
        html += `
            <div class="evento-modal">
                <strong>${e.asignatura}</strong>: ${e.nombre}
                <br><small>${e.porcentaje}% - ${e.corte.replace('corte', 'Corte ')} - 
                <span class="${estadoInfo.class}">${estadoInfo.texto}</span></small>
            </div>
        `;
    });
    
    Swal.fire({
        title: 'Eventos del día',
        html: html,
        confirmButtonText: 'Cerrar'
    });
}

function actualizarProximasEvaluaciones() {
    if (!listaProximas) return;
    const hoyStr = getLocalDateString(new Date());
    // Solo mostrar evaluaciones PENDIENTES
    const futuras = todasLasEvaluaciones
        .filter(e => e.fecha >= hoyStr && e.estado === 'PENDIENTE')
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
        .slice(0, 5);

    listaProximas.innerHTML = futuras.length ? '' : '<p>No hay evaluaciones próximas pendientes</p>';
    futuras.forEach(ev => {
        const f = parseLocalDate(ev.fecha);
        const item = document.createElement('div');
        item.className = 'item-proxima';
        item.innerHTML = `
            <div class="fecha-proxima"><div class="dia-proxima">${f.getDate()}</div><div class="mes-proxima">${f.toLocaleDateString('es-ES',{month:'short'})}</div></div>
            <div class="info-proxima"><div class="nombre-proxima">${ev.nombre}</div><div class="detalles-proxima"><span>${ev.asignatura}</span> • <span>${ev.porcentaje}%</span></div></div>`;
        item.onclick = () => mostrarDetallesEvento(ev);
        listaProximas.appendChild(item);
    });
}

// =========================================
// 7. EVENT LISTENERS
// =========================================

if (formularioEvaluaciones) {
    formularioEvaluaciones.addEventListener('submit', async (event) => {
        event.preventDefault();
        const datosJSON = Object.fromEntries(new FormData(event.target).entries());
        try {
            const res = await fetch(`/api/agenda/registrar`, {
                method: 'POST',
                body: JSON.stringify(datosJSON),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (res.ok && data.redirectUrl) {
                Swal.fire({
                    icon: "success",
                    title: "¡Guardado con éxito!",
                    text: "Presiona el botón para continuar.",
                    confirmButtonColor: "#28a745",
                    confirmButtonText: "Ok",
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = data.redirectUrl;
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error al agendar",
                    text: "No pudimos registrar la evaluación en la agenda.",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Entendido"
                });
            }
        } catch (e) {
            Swal.fire({
                icon: "error",
                title: "¡Error de conexión!",
                text: "No se pudo establecer comunicación con el servidor.",
                confirmButtonText: "Reintentar",
                confirmButtonColor: "#d33",
            });
        }
    });
}

// Eventos de paginación
if (btnPrevPag) {
    btnPrevPag.onclick = () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarListaEvaluaciones();
        }
    };
}

if (btnNextPag) {
    btnNextPag.onclick = () => {
        const totalPaginas = Math.ceil(todasLasEvaluaciones.length / elementosPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarListaEvaluaciones();
        }
    };
}

// Eventos del calendario
if (btnPrevMes) btnPrevMes.onclick = () => { 
    mesSeleccionado--; 
    if(mesSeleccionado < 0){ mesSeleccionado = 11; anioSeleccionado--; } 
    generarCalendario(mesSeleccionado, anioSeleccionado); 
};

if (btnNextMes) btnNextMes.onclick = () => { 
    mesSeleccionado++; 
    if(mesSeleccionado > 11){ mesSeleccionado = 0; anioSeleccionado++; } 
    generarCalendario(mesSeleccionado, anioSeleccionado); 
};

if (btnHoy) btnHoy.onclick = () => { 
    const h = new Date(); 
    mesSeleccionado = h.getMonth(); 
    anioSeleccionado = h.getFullYear(); 
    generarCalendario(mesSeleccionado, anioSeleccionado); 
};

if (filtroMes) filtroMes.onchange = () => generarCalendario(mesSeleccionado, anioSeleccionado);
if (filtroAsignatura) filtroAsignatura.onchange = () => generarCalendario(mesSeleccionado, anioSeleccionado);
if (filtroCorte) filtroCorte.onchange = () => generarCalendario(mesSeleccionado, anioSeleccionado);

modalDetalles.querySelector('.cerrar-modal').onclick = () => modalDetalles.style.display = 'none';

// =========================================
// 8. INICIALIZACIÓN
// =========================================

function inicializarApp(datosBrutos) {
    todasLasEvaluaciones = datosBrutos.map(ev => {
        const fLimpia = ev.fecha.split('T')[0];
        return {
            id: ev.id,
            asignatura: ev.asignatura_nombre,
            nombre: ev.nombre || ev.descripcion || 'Sin nombre',
            descripcion: ev.descripcion,
            porcentaje: ev.porcentaje,
            corte: `corte${ev.corte}`,
            fecha: fLimpia,
            estado: ev.estado || 'PENDIENTE',
            color: `corte${ev.corte}`,
            fechaLarga: formatLongDate(fLimpia)
        };
    });

    // Establecer fecha mínima para el formulario
    const todayStr = getLocalDateString(new Date());
    if (fechaEvaluacionInput) fechaEvaluacionInput.min = todayStr;

    actualizarFiltroAsignaturas();
    renderizarListaEvaluaciones();
    generarCalendario(mesSeleccionado, anioSeleccionado);
    actualizarProximasEvaluaciones();
}

function contarCaracteres(textarea) {
    const contador = document.getElementById('contador-caracteres');
    const longitud = textarea.value.length;
    const max = textarea.getAttribute('maxlength');
    contador.textContent = `${longitud}/${max} caracteres`;
    
    // Opcional: Cambiar color cuando se acerca al límite
    if (longitud > max * 0.8) {
        contador.style.color = '#ef4444';
    } else {
        contador.style.color = '#666';
    }
}

// Inicializar contador al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('descripcion_evaluacion');
    if (textarea) {
        contarCaracteres(textarea);
        textarea.addEventListener('input', function() {
            contarCaracteres(this);
        });
    }
});

// Disparo inicial
if (typeof DATOS_INICIALES_DEL_SERVIDOR !== 'undefined') {
    inicializarApp(DATOS_INICIALES_DEL_SERVIDOR);
}