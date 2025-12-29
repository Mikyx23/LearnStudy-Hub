
        // =========================================
        // AGENDA DE EVALUACIONES
        // =========================================
        const agregarBtn = document.getElementById('agregar');
        const asignaturaInput = document.getElementById('asignatura');
        const corteSelect = document.getElementById('corte');
        const listaExamenes = document.getElementById('lista-examenes');
        
        // Elementos para evaluación 1
        const nombreEvaluacion1Input = document.getElementById('nombre_evaluacion1');
        const porcentajeEvaluacion1Input = document.getElementById('porcentaje_evaluacion1');
        const fechaEvaluacion1Input = document.getElementById('fecha_evaluacion1');
        
        // Elementos para evaluación 2
        const nombreEvaluacion2Input = document.getElementById('nombre_evaluacion2');
        const porcentajeEvaluacion2Input = document.getElementById('porcentaje_evaluacion2');
        const fechaEvaluacion2Input = document.getElementById('fecha_evaluacion2');
        
        // Elementos para el resumen de cortes
        const corte1Total = document.getElementById('corte1-total');
        const corte2Total = document.getElementById('corte2-total');
        const corte3Total = document.getElementById('corte3-total');
        
        // Configuración de porcentajes por corte
        const configuracionPorcentajes = {
            corte1: { max: 30, evaluaciones: 2, colorClass: 'corte1', nombre: 'Corte 1' },
            corte2: { max: 30, evaluaciones: 2, colorClass: 'corte2', nombre: 'Corte 2' },
            corte3: { max: 40, evaluaciones: 2, colorClass: 'corte3', nombre: 'Corte 3' }
        };
        
        // Objeto para rastrear los porcentajes por corte
        let porcentajesUsados = {
            corte1: 0,
            corte2: 0,
            corte3: 0
        };
        
        // =========================================
        // CALENDARIO DE EVALUACIONES
        // =========================================
        
        // Array global para almacenar todas las evaluaciones
        let todasLasEvaluaciones = [];
        
        // Elementos del calendario
        const filtroMes = document.getElementById('filtro-mes');
        const filtroAsignatura = document.getElementById('filtro-asignatura');
        const filtroCorte = document.getElementById('filtro-corte');
        const btnHoy = document.getElementById('btn-hoy');
        const btnPrevMes = document.getElementById('btn-prev-mes');
        const btnNextMes = document.getElementById('btn-next-mes');
        const mesActualElement = document.getElementById('mes-actual');
        const btnVistaMes = document.getElementById('btn-vista-mes');
        const btnVistaSemana = document.getElementById('btn-vista-semana');
        const calendarioDias = document.getElementById('calendario-dias');
        const listaProximas = document.getElementById('lista-proximas');
        
        // Variables del calendario
        let fechaActual = new Date();
        let mesSeleccionado = fechaActual.getMonth();
        let anioSeleccionado = fechaActual.getFullYear();
        
        // =========================================
        // FUNCIONES DE MANEJO DE FECHAS CORREGIDAS
        // =========================================

        // Función para convertir fecha YYYY-MM-DD a Date sin problemas de zona horaria
        function parseLocalDate(dateString) {
            const [year, month, day] = dateString.split('-').map(Number);
            // Crear fecha en hora local (no UTC)
            return new Date(year, month - 1, day);
        }

        // Función para formatear fecha a DD/MM/YYYY
        function formatDate(dateString) {
            const [year, month, day] = dateString.split('-');
            return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
        }

        // Función para obtener fecha en formato YYYY-MM-DD de un objeto Date
        function getLocalDateString(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // Función para formatear fecha larga (para mostrar en detalles)
        function formatLongDate(dateString) {
            const date = parseLocalDate(dateString);
            return date.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
        
        // Modal de detalles
        const modalDetalles = document.createElement('div');
        modalDetalles.className = 'modal-detalles';
        modalDetalles.innerHTML = `
            <div class="modal-contenido">
                <button class="cerrar-modal">&times;</button>
                <h3 class="modal-titulo">Detalles de la Evaluación</h3>
                <div class="info-detalle">
                    <div class="detalle-item">
                        <span class="detalle-label">Asignatura:</span>
                        <span class="detalle-valor" id="modal-asignatura"></span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Evaluación:</span>
                        <span class="detalle-valor" id="modal-evaluacion"></span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Nombre:</span>
                        <span class="detalle-valor" id="modal-nombre"></span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Porcentaje:</span>
                        <span class="detalle-valor porcentaje" id="modal-porcentaje"></span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Corte:</span>
                        <span class="detalle-valor" id="modal-corte"></span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Fecha:</span>
                        <span class="detalle-valor fecha" id="modal-fecha"></span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalDetalles);
        
        // =========================================
        // FUNCIONES DE LA AGENDA
        // =========================================
        
        // Actualizar resumen de cortes
        function actualizarResumenCortes() {
            corte1Total.textContent = `${porcentajesUsados.corte1}%`;
            corte2Total.textContent = `${porcentajesUsados.corte2}%`;
            corte3Total.textContent = `${porcentajesUsados.corte3}%`;
        }
        
        agregarBtn.addEventListener('click', agregarEvaluaciones);
        
        function agregarEvaluaciones() {
            const asignatura = asignaturaInput.value.trim();
            const corte = corteSelect.value;
            
            // Datos evaluación 1
            const nombreEvaluacion1 = nombreEvaluacion1Input.value.trim();
            const porcentajeEvaluacion1 = parseFloat(porcentajeEvaluacion1Input.value);
            const fechaEvaluacion1 = fechaEvaluacion1Input.value;
            
            // Datos evaluación 2
            const nombreEvaluacion2 = nombreEvaluacion2Input.value.trim();
            const porcentajeEvaluacion2 = parseFloat(porcentajeEvaluacion2Input.value);
            const fechaEvaluacion2 = fechaEvaluacion2Input.value;
            
            // Validaciones básicas
            if (asignatura === '' || corte === '' || 
                nombreEvaluacion1 === '' || nombreEvaluacion2 === '' ||
                fechaEvaluacion1 === '' || fechaEvaluacion2 === '') {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }
            
            // Validar que sean números
            if (isNaN(porcentajeEvaluacion1) || isNaN(porcentajeEvaluacion2)) {
                alert('Los porcentajes deben ser números válidos.');
                return;
            }
            
            // Validar que estén entre 0 y 100
            if (porcentajeEvaluacion1 < 0 || porcentajeEvaluacion1 > 100 || 
                porcentajeEvaluacion2 < 0 || porcentajeEvaluacion2 > 100) {
                alert('Los porcentajes deben estar entre 0 y 100.');
                return;
            }
            
            // Validar fechas (usando fecha local)
            const hoy = getLocalDateString(new Date()); // Obtener fecha actual en formato YYYY-MM-DD
            if (fechaEvaluacion1 < hoy || fechaEvaluacion2 < hoy) {
                alert('Las fechas no pueden ser anteriores a la fecha actual.');
                return;
            }
            
            // Validar que la suma no exceda el máximo del corte
            const totalCorte = porcentajeEvaluacion1 + porcentajeEvaluacion2;
            if (totalCorte > configuracionPorcentajes[corte].max) {
                alert(`La suma de las evaluaciones (${totalCorte}%) excede el máximo permitido para ${configuracionPorcentajes[corte].nombre} (${configuracionPorcentajes[corte].max}%).`);
                return;
            }
            
            // Validar que no se haya alcanzado el máximo del corte
            if (porcentajesUsados[corte] + totalCorte > configuracionPorcentajes[corte].max) {
                alert(`No se puede agregar porque excedería el máximo de ${configuracionPorcentajes[corte].max}% para ${configuracionPorcentajes[corte].nombre}. Ya se han usado ${porcentajesUsados[corte]}%.`);
                return;
            }
            
            // Validaciones específicas por corte según tu descripción
            if (corte === 'corte1' || corte === 'corte2') {
                // Cortes 1 y 2: deben ser 10% y 20% (en cualquier orden)
                const opcionesValidas = [[10, 20], [20, 10]];
                const esValido = opcionesValidas.some(opcion => 
                    (porcentajeEvaluacion1 === opcion[0] && porcentajeEvaluacion2 === opcion[1])
                );
                
                if (!esValido) {
                    alert(`Para ${configuracionPorcentajes[corte].nombre}, los porcentajes deben ser 10% y 20% (en cualquier orden).`);
                    return;
                }
            } else if (corte === 'corte3') {
                // Corte 3: debe ser 20% y 20%
                if (porcentajeEvaluacion1 !== 20 || porcentajeEvaluacion2 !== 20) {
                    alert('Para Corte 3, ambos porcentajes deben ser 20%.');
                    return;
                }
            }
            
            // Actualizar porcentajes usados
            porcentajesUsados[corte] += totalCorte;
            
            // Formatear fechas para mostrar (CORREGIDO)
            const fecha1Formateada = formatDate(fechaEvaluacion1); // Usar formato DD/MM/YYYY
            const fecha2Formateada = formatDate(fechaEvaluacion2);
            
            // Crear objetos de evaluación para el calendario
            const evaluacion1 = {
                id: Date.now() + 1,
                asignatura: asignatura,
                corte: corte,
                nombre: nombreEvaluacion1,
                porcentaje: porcentajeEvaluacion1,
                fecha: fechaEvaluacion1, // Mantener formato YYYY-MM-DD para cálculos
                fechaFormateada: fecha1Formateada, // Usar formato corregido
                fechaLarga: formatLongDate(fechaEvaluacion1), // Para modal de detalles
                tipo: 'Evaluación 1',
                tipoTexto: 'Evaluación 1',
                color: 'evento-evaluacion1'
            };

            const evaluacion2 = {
                id: Date.now() + 2,
                asignatura: asignatura,
                corte: corte,
                nombre: nombreEvaluacion2,
                porcentaje: porcentajeEvaluacion2,
                fecha: fechaEvaluacion2,
                fechaFormateada: fecha2Formateada,
                fechaLarga: formatLongDate(fechaEvaluacion2),
                tipo: 'Evaluación 2',
                tipoTexto: 'Evaluación 2',
                color: 'evento-evaluacion2'
            };

            // Añadir al array global
            todasLasEvaluaciones.push(evaluacion1, evaluacion2);
            
            // Crear elementos de lista para cada evaluación
            // Evaluación 1
            const li1 = document.createElement('li');
            li1.innerHTML = `
                <span>${asignatura}</span>
                <span class="${configuracionPorcentajes[corte].colorClass}">${configuracionPorcentajes[corte].nombre}</span>
                <span class="evaluacion evaluacion-1"><i class="fas fa-chart-line"></i> Evaluación 1</span>
                <span>${nombreEvaluacion1}</span>
                <span>${porcentajeEvaluacion1}%</span>
                <span>${fecha1Formateada}</span> <!-- Usar fecha formateada -->
                <button class="eliminar" data-corte="${corte}" data-porcentaje="${porcentajeEvaluacion1}" data-id="${evaluacion1.id}"><i class="fas fa-trash"></i> Eliminar</button>
            `;
            
            // Evaluación 2
            const li2 = document.createElement('li');
            li2.innerHTML = `
                <span>${asignatura}</span>
                <span class="${configuracionPorcentajes[corte].colorClass}">${configuracionPorcentajes[corte].nombre}</span>
                <span class="evaluacion evaluacion-2"><i class="fas fa-chart-bar"></i> Evaluación 2</span>
                <span>${nombreEvaluacion2}</span>
                <span>${porcentajeEvaluacion2}%</span>
                <span>${fecha2Formateada}</span> <!-- Usar fecha formateada -->
                <button class="eliminar" data-corte="${corte}" data-porcentaje="${porcentajeEvaluacion2}" data-id="${evaluacion2.id}"><i class="fas fa-trash"></i> Eliminar</button>
            `;
            
            // Agregar a la lista
            listaExamenes.appendChild(li1);
            listaExamenes.appendChild(li2);
            
            // Limpiar campos
            asignaturaInput.value = '';
            corteSelect.value = '';
            nombreEvaluacion1Input.value = '';
            porcentajeEvaluacion1Input.value = '';
            fechaEvaluacion1Input.value = '';
            nombreEvaluacion2Input.value = '';
            porcentajeEvaluacion2Input.value = '';
            fechaEvaluacion2Input.value = '';
            
            // Actualizar resumen
            actualizarResumenCortes();
            
            // Actualizar lista de asignaturas en filtros
            actualizarFiltroAsignaturas();
            
            // Actualizar calendario si está activo
            generarCalendario(mesSeleccionado, anioSeleccionado);
            actualizarProximasEvaluaciones();
            
            // Agregar eventos eliminar
            configurarEliminacion(li1, evaluacion1, corte, porcentajeEvaluacion1);
            configurarEliminacion(li2, evaluacion2, corte, porcentajeEvaluacion2);
        }
        
        function configurarEliminacion(li, evaluacion, corte, porcentaje) {
            const eliminarBtn = li.querySelector('.eliminar');
            eliminarBtn.addEventListener('click', function() {
                // Eliminar del array global
                todasLasEvaluaciones = todasLasEvaluaciones.filter(e => e.id !== evaluacion.id);
                
                // Restar del registro de porcentajes usados
                porcentajesUsados[corte] -= porcentaje;
                
                // Actualizar resumen
                actualizarResumenCortes();
                
                // Actualizar filtros
                actualizarFiltroAsignaturas();
                
                // Actualizar calendario
                generarCalendario(mesSeleccionado, anioSeleccionado);
                actualizarProximasEvaluaciones();
                
                // Eliminar el elemento de la lista
                listaExamenes.removeChild(li);
            });
        }
        
        // =========================================
        // FUNCIONES DEL CALENDARIO
        // =========================================
        
        // Actualizar filtro de asignaturas
        function actualizarFiltroAsignaturas() {
            const asignaturasUnicas = [...new Set(todasLasEvaluaciones.map(e => e.asignatura))];
            const filtroAsignaturaSelect = document.getElementById('filtro-asignatura');
            
            // Guardar selección actual
            const seleccionActual = filtroAsignaturaSelect.value;
            
            // Limpiar opciones excepto "Todas las asignaturas"
            filtroAsignaturaSelect.innerHTML = '<option value="todos">Todas las asignaturas</option>';
            
            // Agregar asignaturas únicas
            asignaturasUnicas.forEach(asignatura => {
                const option = document.createElement('option');
                option.value = asignatura;
                option.textContent = asignatura;
                filtroAsignaturaSelect.appendChild(option);
            });
            
            // Restaurar selección si aún existe
            if (asignaturasUnicas.includes(seleccionActual)) {
                filtroAsignaturaSelect.value = seleccionActual;
            }
        }
        
        // Generar calendario
        function generarCalendario(mes, anio) {
            // Limpiar calendario
            calendarioDias.innerHTML = '';
            
            // Actualizar título del mes
            const meses = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            mesActualElement.textContent = `${meses[mes]} ${anio}`;
            
            // Obtener primer y último día del mes
            const primerDia = new Date(anio, mes, 1);
            const ultimoDia = new Date(anio, mes + 1, 0);
            const primerDiaSemana = primerDia.getDay(); // 0 = Domingo, 1 = Lunes, etc.
            const diasEnMes = ultimoDia.getDate();
            
            // Aplicar filtros
            const evaluacionesFiltradas = filtrarEvaluaciones();
            
            // Agregar días del mes anterior (para completar la primera semana)
            const ultimoDiaMesAnterior = new Date(anio, mes, 0).getDate();
            for (let i = primerDiaSemana - 1; i >= 0; i--) {
                const diaNum = ultimoDiaMesAnterior - i;
                agregarDiaCalendario(null, diaNum, true, evaluacionesFiltradas, mes - 1, anio);
            }
            
            // Agregar días del mes actual
            const hoy = new Date();
            for (let dia = 1; dia <= diasEnMes; dia++) {
                const esHoy = hoy.getDate() === dia && 
                              hoy.getMonth() === mes && 
                              hoy.getFullYear() === anio;
                agregarDiaCalendario(dia, dia, false, evaluacionesFiltradas, mes, anio, esHoy);
            }
            
            // Agregar días del próximo mes (para completar la última semana)
            const diasRestantes = 42 - (primerDiaSemana + diasEnMes); // 6 semanas * 7 días
            for (let dia = 1; dia <= diasRestantes; dia++) {
                agregarDiaCalendario(null, dia, true, evaluacionesFiltradas, mes + 1, anio);
            }
        }
        
        function agregarDiaCalendario(diaReal, diaMostrado, esInactivo, evaluacionesFiltradas, mes, anio, esHoy = false) {
            const diaElement = document.createElement('div');
            diaElement.className = `dia-calendario ${esInactivo ? 'dia-inactivo' : ''} ${esHoy ? 'dia-hoy' : ''}`;
            
            // Número del día
            const diaNumero = document.createElement('div');
            diaNumero.className = 'dia-numero';
            diaNumero.textContent = diaMostrado;
            diaElement.appendChild(diaNumero);
            
            // Contenedor de eventos
            const eventosContainer = document.createElement('div');
            eventosContainer.className = 'eventos-dia';
            
            if (!esInactivo && diaReal) {
                const fechaStr = `${anio}-${String(mes + 1).padStart(2, '0')}-${String(diaReal).padStart(2, '0')}`;
                const eventosDelDia = evaluacionesFiltradas.filter(e => e.fecha === fechaStr);
                
                eventosDelDia.forEach(evento => {
                    const eventoElement = document.createElement('div');
                    eventoElement.className = `evento-calendario ${evento.color}`;
                    eventoElement.textContent = `${evento.asignatura}: ${evento.nombre}`;
                    eventoElement.title = `${evento.tipoTexto} - ${evento.porcentaje}% - Corte: ${evento.corte}`;
                    
                    // Al hacer clic en el evento, mostrar detalles
                    eventoElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        mostrarDetallesEvento(evento);
                    });
                    
                    eventosContainer.appendChild(eventoElement);
                });
                
                // Si hay más de 2 eventos, mostrar indicador
                if (eventosDelDia.length > 2) {
                    const masEventos = document.createElement('div');
                    masEventos.className = 'evento-calendario evento-multiple';
                    masEventos.textContent = `+${eventosDelDia.length - 2} más`;
                    masEventos.addEventListener('click', (e) => {
                        e.stopPropagation();
                        mostrarEventosDelDia(eventosDelDia, fechaStr);
                    });
                    // Mantener solo los primeros 2 eventos visibles
                    while (eventosContainer.children.length > 2) {
                        eventosContainer.removeChild(eventosContainer.lastChild);
                    }
                    eventosContainer.appendChild(masEventos);
                }
            }
            
            diaElement.appendChild(eventosContainer);
            calendarioDias.appendChild(diaElement);
        }
        
        // Filtrar evaluaciones según los filtros seleccionados
        function filtrarEvaluaciones() {
            let filtradas = [...todasLasEvaluaciones];
            
            // Filtrar por mes
            const filtroMesValor = filtroMes.value;
            if (filtroMesValor !== 'todos') {
                const mesFiltro = parseInt(filtroMesValor);
                filtradas = filtradas.filter(e => {
                    const fecha = parseLocalDate(e.fecha);
                    return fecha.getMonth() === mesFiltro;
                });
            }
            
            // Filtrar por asignatura
            const filtroAsignaturaValor = filtroAsignatura.value;
            if (filtroAsignaturaValor !== 'todos') {
                filtradas = filtradas.filter(e => e.asignatura === filtroAsignaturaValor);
            }
            
            // Filtrar por corte
            const filtroCorteValor = filtroCorte.value;
            if (filtroCorteValor !== 'todos') {
                filtradas = filtradas.filter(e => e.corte === filtroCorteValor);
            }
            
            return filtradas;
        }
        
        // Mostrar detalles de un evento
        function mostrarDetallesEvento(evento) {
            document.getElementById('modal-asignatura').textContent = evento.asignatura;
            document.getElementById('modal-evaluacion').textContent = evento.tipoTexto;
            document.getElementById('modal-nombre').textContent = evento.nombre;
            document.getElementById('modal-porcentaje').textContent = `${evento.porcentaje}%`;
            document.getElementById('modal-corte').textContent = evento.corte.replace('corte', 'Corte ');
            document.getElementById('modal-fecha').textContent = evento.fechaLarga; // Usar fecha larga formateada
            
            modalDetalles.style.display = 'flex';
        }
        
        // Mostrar todos los eventos de un día
        function mostrarEventosDelDia(eventos, fechaStr) {
            const fechaLarga = formatLongDate(fechaStr); // Usar función corregida
            
            const modalMultiples = document.createElement('div');
            modalMultiples.className = 'modal-detalles';
            modalMultiples.innerHTML = `
                <div class="modal-contenido" style="max-width: 600px;">
                    <button class="cerrar-modal cerrar-multiples">&times;</button>
                    <h3 class="modal-titulo">Evaluaciones del ${fechaLarga}</h3>
                    <div style="display: flex; flex-direction: column; gap: 15px; max-height: 400px; overflow-y: auto;">
                        ${eventos.map(evento => `
                            <div class="info-detalle" style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px;">
                                <div class="detalle-item">
                                    <span class="detalle-label">Asignatura:</span>
                                    <span class="detalle-valor">${evento.asignatura}</span>
                                </div>
                                <div class="detalle-item">
                                    <span class="detalle-label">Evaluación:</span>
                                    <span class="detalle-valor ${evento.tipo === 'Evaluación 1' ? 'tipo-evaluacion1' : 'tipo-evaluacion2'}">
                                        ${evento.tipoTexto}
                                    </span>
                                </div>
                                <div class="detalle-item">
                                    <span class="detalle-label">Nombre:</span>
                                    <span class="detalle-valor">${evento.nombre}</span>
                                </div>
                                <div class="detalle-item">
                                    <span class="detalle-label">Porcentaje:</span>
                                    <span class="detalle-valor porcentaje">${evento.porcentaje}%</span>
                                </div>
                                <div class="detalle-item">
                                    <span class="detalle-label">Fecha:</span>
                                    <span class="detalle-valor fecha">${evento.fechaLarga}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modalMultiples);
            modalMultiples.style.display = 'flex';
            
            modalMultiples.querySelector('.cerrar-multiples').addEventListener('click', () => {
                document.body.removeChild(modalMultiples);
            });
        }
        
        // Actualizar próximas evaluaciones
        function actualizarProximasEvaluaciones() {
            const hoy = getLocalDateString(new Date()); // Usar fecha local
            const evaluacionesFuturas = todasLasEvaluaciones
                .filter(e => e.fecha >= hoy)
                .sort((a, b) => a.fecha.localeCompare(b.fecha)) // Ordenar por fecha (string)
                .slice(0, 5); // Mostrar solo las 5 próximas
            
            listaProximas.innerHTML = '';
            
            if (evaluacionesFuturas.length === 0) {
                listaProximas.innerHTML = '<p style="text-align: center; color: var(--text-body);">No hay evaluaciones próximas</p>';
                return;
            }
            
            evaluacionesFuturas.forEach(evento => {
                // Parsear la fecha correctamente
                const fecha = parseLocalDate(evento.fecha);
                const dia = fecha.getDate();
                const mes = fecha.toLocaleDateString('es-ES', { month: 'short' });
                
                const item = document.createElement('div');
                item.className = 'item-proxima';
                item.innerHTML = `
                    <div class="fecha-proxima">
                        <div class="dia-proxima">${dia}</div>
                        <div class="mes-proxima">${mes}</div>
                    </div>
                    <div class="info-proxima">
                        <div class="nombre-proxima">${evento.nombre}</div>
                        <div class="detalles-proxima">
                            <span>${evento.asignatura}</span>
                            <span class="tipo-proxima ${evento.tipo === 'Evaluación 1' ? 'tipo-evaluacion1' : 'tipo-evaluacion2'}">
                                ${evento.tipoTexto}
                            </span>
                            <span>${evento.porcentaje}%</span>
                        </div>
                    </div>
                `;
                
                item.addEventListener('click', () => mostrarDetallesEvento(evento));
                listaProximas.appendChild(item);
            });
        }
        
        // =========================================
        // EVENT LISTENERS DEL CALENDARIO
        // =========================================
        
        filtroMes.addEventListener('change', () => {
            generarCalendario(mesSeleccionado, anioSeleccionado);
        });
        
        filtroAsignatura.addEventListener('change', () => {
            generarCalendario(mesSeleccionado, anioSeleccionado);
            actualizarProximasEvaluaciones();
        });
        
        filtroCorte.addEventListener('change', () => {
            generarCalendario(mesSeleccionado, anioSeleccionado);
            actualizarProximasEvaluaciones();
        });
        
        btnHoy.addEventListener('click', () => {
            fechaActual = new Date();
            mesSeleccionado = fechaActual.getMonth();
            anioSeleccionado = fechaActual.getFullYear();
            filtroMes.value = 'todos'; // Resetear filtro de mes
            generarCalendario(mesSeleccionado, anioSeleccionado);
        });
        
        btnPrevMes.addEventListener('click', () => {
            mesSeleccionado--;
            if (mesSeleccionado < 0) {
                mesSeleccionado = 11;
                anioSeleccionado--;
            }
            generarCalendario(mesSeleccionado, anioSeleccionado);
        });
        
        btnNextMes.addEventListener('click', () => {
            mesSeleccionado++;
            if (mesSeleccionado > 11) {
                mesSeleccionado = 0;
                anioSeleccionado++;
            }
            generarCalendario(mesSeleccionado, anioSeleccionado);
        });
        
        btnVistaMes.addEventListener('click', () => {
            btnVistaMes.classList.add('active');
            btnVistaSemana.classList.remove('active');
        });
        
        btnVistaSemana.addEventListener('click', () => {
            btnVistaSemana.classList.add('active');
            btnVistaMes.classList.remove('active');
        });
        
        // Cerrar modales
        modalDetalles.querySelector('.cerrar-modal').addEventListener('click', () => {
            modalDetalles.style.display = 'none';
        });
        
        modalDetalles.addEventListener('click', (e) => {
            if (e.target === modalDetalles) {
                modalDetalles.style.display = 'none';
            }
        });
        
        // =========================================
        // INICIALIZACIÓN
        // =========================================
        
        // Establecer fecha mínima como hoy (corregido)
        const today = getLocalDateString(new Date());
        fechaEvaluacion1Input.min = today;
        fechaEvaluacion2Input.min = today;
        
        // Inicializar resumen
        actualizarResumenCortes();
        
        // Inicializar calendario
        generarCalendario(mesSeleccionado, anioSeleccionado);
        actualizarProximasEvaluaciones();
        
        // Suavizar navegación interna
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });