// =========================================
// 1. VARIABLES DE ESTADO (Globales)
// =========================================
let todasLasEvaluaciones = [];
let porcentajesUsados = { corte1: 0, corte2: 0, corte3: 0 };
let fechaActual = new Date();
let mesSeleccionado = fechaActual.getMonth();
let anioSeleccionado = fechaActual.getFullYear();

const configuracionPorcentajes = {
    corte1: { max: 30, colorClass: 'corte1', nombre: 'Corte 1' },
    corte2: { max: 30, colorClass: 'corte2', nombre: 'Corte 2' },
    corte3: { max: 40, colorClass: 'corte3', nombre: 'Corte 3' }
};

// =========================================
// 2. SELECTORES DEL DOM
// =========================================
// Contenedores principales
const corte1Total = document.getElementById('corte1-total');
const corte2Total = document.getElementById('corte2-total');
const corte3Total = document.getElementById('corte3-total');
const listaExamenes = document.getElementById('lista-examenes');
const mesActualElement = document.getElementById('mes-actual');
const calendarioDias = document.getElementById('calendario-dias');
const listaProximas = document.getElementById('lista-proximas');

// Formularios e Inputs
const formularioEvaluaciones = document.getElementById('formulario-evaluaciones');
const asignaturaInput = document.getElementById('asignatura');
const corteSelect = document.getElementById('corte');
const fechaEvaluacion1Input = document.getElementById('fecha_evaluacion1');
const fechaEvaluacion2Input = document.getElementById('fecha_evaluacion2');

// Filtros y Botones
const filtroMes = document.getElementById('filtro-mes');
const filtroAsignatura = document.getElementById('filtro-asignatura');
const filtroCorte = document.getElementById('filtro-corte');
const btnHoy = document.getElementById('btn-hoy');
const btnPrevMes = document.getElementById('btn-prev-mes');
const btnNextMes = document.getElementById('btn-next-mes');
const btnVistaMes = document.getElementById('btn-vista-mes');
const btnVistaSemana = document.getElementById('btn-vista-semana');

// =========================================
// 3. FUNCIONES DE APOYO (Lógica de Fechas)
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

function actualizarResumenCortes() {
    if (corte1Total) corte1Total.textContent = `${porcentajesUsados.corte1}%`;
    if (corte2Total) corte2Total.textContent = `${porcentajesUsados.corte2}%`;
    if (corte3Total) corte3Total.textContent = `${porcentajesUsados.corte3}%`;
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
            <div class="detalle-item"><span class="detalle-label">Evaluación:</span><span class="detalle-valor" id="modal-evaluacion"></span></div>
            <div class="detalle-item"><span class="detalle-label">Nombre:</span><span class="detalle-valor" id="modal-nombre"></span></div>
            <div class="detalle-item"><span class="detalle-label">Porcentaje:</span><span class="detalle-valor porcentaje" id="modal-porcentaje"></span></div>
            <div class="detalle-item"><span class="detalle-label">Corte:</span><span class="detalle-valor" id="modal-corte"></span></div>
            <div class="detalle-item"><span class="detalle-label">Fecha:</span><span class="detalle-valor fecha" id="modal-fecha"></span></div>
        </div>
    </div>`;
document.body.appendChild(modalDetalles);

// =========================================
// 4. FUNCIONES (Calendario y Filtros)
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
            if (index < 2) {
                const evEl = document.createElement('div');
                evEl.className = `evento-calendario ${evento.color}`;
                evEl.textContent = `${evento.asignatura}`;
                evEl.onclick = (e) => { e.stopPropagation(); mostrarDetallesEvento(evento); };
                eventosContainer.appendChild(evEl);
            }
        });

        if (eventosDelDia.length > 2) {
            const mas = document.createElement('div');
            mas.className = 'evento-calendario evento-multiple';
            mas.textContent = `+${eventosDelDia.length - 2} más`;
            mas.onclick = (e) => { e.stopPropagation(); mostrarEventosDelDia(eventosDelDia, fechaStr); };
            eventosContainer.appendChild(mas);
        }
    }
    diaElement.appendChild(eventosContainer);
    calendarioDias.appendChild(diaElement);
}

function mostrarDetallesEvento(evento) {
    document.getElementById('modal-asignatura').textContent = evento.asignatura;
    document.getElementById('modal-evaluacion').textContent = evento.tipoTexto;
    document.getElementById('modal-nombre').textContent = evento.nombre;
    document.getElementById('modal-porcentaje').textContent = `${evento.porcentaje}%`;
    document.getElementById('modal-corte').textContent = evento.corte.replace('corte', 'Corte ');
    document.getElementById('modal-fecha').textContent = evento.fechaLarga;
    modalDetalles.style.display = 'flex';
}

function actualizarProximasEvaluaciones() {
    if (!listaProximas) return;
    const hoyStr = getLocalDateString(new Date());
    const futuras = todasLasEvaluaciones
        .filter(e => e.fecha >= hoyStr)
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
        .slice(0, 5);

    listaProximas.innerHTML = futuras.length ? '' : '<p>No hay evaluaciones próximas</p>';
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
// 5. EVENT LISTENERS
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
                    allowOutsideClick: false // Evita que cierren la alerta haciendo clic fuera
                    }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = data.redirectUrl;
                    }
                });
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Error al agendar",
                    text: "No pudimos registrar la evaluación en la agenda. Por favor, inténtalo de nuevo en unos momentos.",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Entendido"
                });
            }
        } catch (e) {
            Swal.fire({
            icon: "error",
            title: "¡Error de conexión!",
            text: "No se pudo establecer comunicación con el servidor. Por favor, verifica tu internet.",
            confirmButtonText: "Reintentar",
            confirmButtonColor: "#d33",
        });
        }
    });
}

if (btnPrevMes) btnPrevMes.onclick = () => { mesSeleccionado--; if(mesSeleccionado<0){mesSeleccionado=11; anioSeleccionado--;} generarCalendario(mesSeleccionado, anioSeleccionado); };
if (btnNextMes) btnNextMes.onclick = () => { mesSeleccionado++; if(mesSeleccionado>11){mesSeleccionado=0; anioSeleccionado++;} generarCalendario(mesSeleccionado, anioSeleccionado); };
if (btnHoy) btnHoy.onclick = () => { const h=new Date(); mesSeleccionado=h.getMonth(); anioSeleccionado=h.getFullYear(); generarCalendario(mesSeleccionado, anioSeleccionado); };
if (filtroMes) filtroMes.onchange = () => generarCalendario(mesSeleccionado, anioSeleccionado);
if (filtroAsignatura) filtroAsignatura.onchange = () => generarCalendario(mesSeleccionado, anioSeleccionado);
if (filtroCorte) filtroCorte.onchange = () => generarCalendario(mesSeleccionado, anioSeleccionado);

modalDetalles.querySelector('.cerrar-modal').onclick = () => modalDetalles.style.display = 'none';

// =========================================
// 6. INICIALIZACIÓN
// =========================================
function inicializarApp(datosBrutos) {
    todasLasEvaluaciones = datosBrutos.map(ev => {
        const fLimpia = ev.fecha.split('T')[0];
        return {
            id: ev.id,
            asignatura: ev.asignatura_nombre,
            nombre: ev.nombre,
            porcentaje: ev.porcentaje,
            corte: `corte${ev.corte}`,
            fecha: fLimpia,
            tipoTexto: 'Evaluación',
            color: `corte${ev.corte}`,
            fechaLarga: formatLongDate(fLimpia)
        };
    });

    porcentajesUsados.corte1 = todasLasEvaluaciones.filter(e => e.corte === 'corte1').reduce((acc, e) => acc + e.porcentaje, 0);
    porcentajesUsados.corte2 = todasLasEvaluaciones.filter(e => e.corte === 'corte2').reduce((acc, e) => acc + e.porcentaje, 0);
    porcentajesUsados.corte3 = todasLasEvaluaciones.filter(e => e.corte === 'corte3').reduce((acc, e) => acc + e.porcentaje, 0);

    const todayStr = getLocalDateString(new Date());
    if (fechaEvaluacion1Input) fechaEvaluacion1Input.min = todayStr;
    if (fechaEvaluacion2Input) fechaEvaluacion2Input.min = todayStr;

    actualizarResumenCortes();
    actualizarFiltroAsignaturas();
    generarCalendario(mesSeleccionado, anioSeleccionado);
    actualizarProximasEvaluaciones();
}

// Disparo inicial
if (typeof DATOS_INICIALES_DEL_SERVIDOR !== 'undefined') {
    inicializarApp(DATOS_INICIALES_DEL_SERVIDOR);
}