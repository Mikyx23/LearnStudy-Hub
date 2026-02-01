/**
 * LearnStudy - Sistema de Administración CRUD
 * Gestión completa de entidades universitarias
 */

// ============================================
// CONFIGURACIÓN Y VARIABLES GLOBALES
// ============================================

const paginacion = {
    usuarios: { paginaActual: 1, porPagina: 10 },
    carreras: { paginaActual: 1, porPagina: 10 },
    asignaturas: { paginaActual: 1, porPagina: 10 },
    malla: { paginaActual: 1, porPagina: 10 },
    lapsos: { paginaActual: 1, porPagina: 10 },
    frases: { paginaActual: 1, porPagina: 10 },
    prelaciones_materias: { paginaActual: 1, porPagina: 10 },
    prelaciones_academicas: { paginaActual: 1, porPagina: 10 }
};

let carreraSeleccionadaMalla = null;
let editandoId = null;
let editandoTipo = null;
let tipoPrelacionActual = 'materias'; // 'materias' o 'academicas'
let carreraFiltroPrelaciones = null;
let carreraSeleccionadaFormulario = null; // Para rastrear la carrera seleccionada en formularios

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function getPaginado(lista, config) {
    const total = Math.ceil(lista.length / config.porPagina) || 1;
    if (config.paginaActual > total) config.paginaActual = total;
    const inicio = (config.paginaActual - 1) * config.porPagina;
    return { 
        items: lista.slice(inicio, inicio + config.porPagina), 
        totalPaginas: total 
    };
}

function cambiarPagina(tipo, nueva) {
    paginacion[tipo].paginaActual = nueva;
    renderizarSeccion(tipo);
}

function renderPagi(idContenedor, actual, total, tipo) {
    const cont = document.getElementById(idContenedor);
    if (!cont) return;
    
    cont.innerHTML = `
        <button class="btn-pagi" ${actual === 1 ? 'disabled' : ''} 
                onclick="cambiarPagina('${tipo}', ${actual - 1})">
            <i class="fas fa-chevron-left"></i> Anterior
        </button>
        <span class="pagi-info">Página ${actual} de ${total}</span>
        <button class="btn-pagi" ${actual === total ? 'disabled' : ''} 
                onclick="cambiarPagina('${tipo}', ${actual + 1})">
            Siguiente <i class="fas fa-chevron-right"></i>
        </button>
    `;
}

// Función para filtrar asignaturas por carrera
function filtrarAsignaturasPorCarrera(idCarrera) {
    if (!idCarrera) return [];
    
    return datos.malla.filter(m => m.id_carrera == idCarrera).map(m => {
        const carrera = datos.carreras.find(c => c.id_carrera == m.id_carrera);
        return {
            id: m.id_asignatura_carrera,
            nombre: m.nombre_asignatura || 'N/A',
            carrera: carrera ? carrera.nombre_carrera : 'N/A',
            codigo: m.codigo_asignatura,
            semestre: m.semestre,
            id_carrera: m.id_carrera
        };
    });
}

// ============================================
// RENDERIZADORES DE TABLAS
// ============================================

function cargarUsuarios() {
    const tbody = document.querySelector('#tableEstudiantes tbody');
    if (!tbody) return;
    
    const { items, totalPaginas } = getPaginado(datos.estudiantes, paginacion.usuarios);
    
    tbody.innerHTML = items.map(u => `
        <tr>
            <td>${u.cedula}</td>
            <td>${u.nombre}</td>
            <td>${u.apellido}</td>
            <td>${u.correo}</td>
            <td>
                <button class="btn-action delete" onclick="confirmarEliminacion('usuario', ${u.id_usuario})" 
                        title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    renderPagi('pagination-estudiantes', paginacion.usuarios.paginaActual, totalPaginas, 'usuarios');
}

function cargarCarreras() {
    const tbody = document.querySelector('#tableCarreras tbody');
    if (!tbody) return;
    
    const { items, totalPaginas } = getPaginado(datos.carreras, paginacion.carreras);
    
    tbody.innerHTML = items.map(c => `
        <tr>
            <td>${c.id_carrera}</td>
            <td>${c.nombre_carrera}</td>
            <td>
                <button class="btn-action delete" onclick="confirmarEliminacion('carrera', ${c.id_carrera})" 
                        title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    renderPagi('pagination-carreras', paginacion.carreras.paginaActual, totalPaginas, 'carreras');
}

function cargarAsignaturas() {
    const tbody = document.querySelector('#tableAsignaturas tbody');
    if (!tbody) return;
    
    const { items, totalPaginas } = getPaginado(datos.asignaturas, paginacion.asignaturas);
    
    tbody.innerHTML = items.map(a => `
        <tr>
            <td>${a.id_asignatura}</td>
            <td>${a.nombre_asignatura}</td>
            <td>
                <button class="btn-action delete" onclick="confirmarEliminacion('asignatura', ${a.id_asignatura})" 
                        title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    renderPagi('pagination-asignaturas', paginacion.asignaturas.paginaActual, totalPaginas, 'asignaturas');
}

function cargarMalla() {
    const tbody = document.querySelector('#tableMalla tbody');
    const select = document.getElementById('selectCarreraMalla');
    
    if (!tbody || !select) return;

    // DEBUG: Ver qué datos tenemos
    console.log('=== DEBUG MALLA ===');
    console.log('Total de registros en malla:', datos.malla.length);
    console.log('Primer registro de malla:', datos.malla[0]);
    console.log('Carreras disponibles:', datos.carreras);
    
    // Cargar select de carreras (solo una vez)
    if (select.options.length <= 1) {
        select.innerHTML = '<option value="">-- Seleccione una carrera --</option>' +
            datos.carreras.map(c => 
                `<option value="${c.id_carrera}">${c.nombre_carrera}</option>`
            ).join('');
        
        // Establecer carrera por defecto (Arquitectura ID: 41)
        if (datos.carreras.length > 0) {
            const arquitectura = datos.carreras.find(c => c.id_carrera == 41);
            carreraSeleccionadaMalla = arquitectura ? 41 : datos.carreras[0].id_carrera;
            select.value = carreraSeleccionadaMalla;
        }
    }

    console.log('Carrera seleccionada:', carreraSeleccionadaMalla);

    // Filtrar malla por carrera seleccionada
    if (!carreraSeleccionadaMalla) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Seleccione una carrera</td></tr>';
        return;
    }

    const filtrados = datos.malla.filter(m => {
        console.log('Comparando:', m.id_carrera, '==', carreraSeleccionadaMalla, '→', m.id_carrera == carreraSeleccionadaMalla);
        return m.id_carrera == carreraSeleccionadaMalla;
    });
    
    console.log('Registros filtrados:', filtrados.length);
    
    if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No hay asignaturas en esta malla curricular</td></tr>';
        renderPagi('pagination-malla', 1, 1, 'malla');
        return;
    }

    const { items, totalPaginas } = getPaginado(filtrados, paginacion.malla);

    tbody.innerHTML = items.map(m => {
        // DEBUG: Ver qué campos tiene cada registro
        if (filtrados.indexOf(m) === 0) {
            console.log('Campos del primer registro:', Object.keys(m));
            console.log('Registro completo:', m);
        }
        
        // Usar los campos correctos según los alias de la consulta SQL
        const codigo = m.codigo_asignatura || 'N/A';
        const nombre = m.nombre_asignatura || 'Sin nombre';
        
        return `
            <tr>
                <td>${codigo}</td>
                <td>${nombre}</td>
                <td>${m.semestre}</td>
                <td>${m.uc_asignatura}</td>
                <td>${m.total_horas}</td>
                <td>
                    <button class="btn-action delete" 
                            onclick="confirmarEliminacion('malla', ${m.id_asignatura_carrera})" 
                            title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    renderPagi('pagination-malla', paginacion.malla.paginaActual, totalPaginas, 'malla');
}

function cargarLapsos() {
    const tbody = document.querySelector('#tableLapsos tbody');
    if (!tbody) return;
    
    const { items, totalPaginas } = getPaginado(datos.lapsos, paginacion.lapsos);
    
    tbody.innerHTML = items.map(l => `
        <tr>
            <td>${l.periodo}</td>
            <td>${l.año}</td>
            <td>
                <button class="btn-action delete" onclick="confirmarEliminacion('lapso', ${l.id_lapso})" 
                        title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    renderPagi('pagination-lapsos', paginacion.lapsos.paginaActual, totalPaginas, 'lapsos');
}

function cargarFrases() {
    const tbody = document.querySelector('#tableFrases tbody');
    if (!tbody) return;
    
    const { items, totalPaginas } = getPaginado(datos.frases, paginacion.frases);
    
    tbody.innerHTML = items.map(f => `
        <tr>
            <td>${f.id_frase}</td>
            <td>"${f.frase}"</td>
            <td>
                <button class="btn-action delete" onclick="confirmarEliminacion('frase', ${f.id_frase})" 
                        title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    renderPagi('pagination-frases', paginacion.frases.paginaActual, totalPaginas, 'frases');
}

// ============================================
// FUNCIONES PARA PRELACIONES (CORREGIDAS)
// ============================================

function mostrarTipoPrelacion(tipo) {
    tipoPrelacionActual = tipo;
    
    // Actualizar botones
    const btnMaterias = document.getElementById('btnPrelacionMaterias');
    const btnAcademicas = document.getElementById('btnPrelacionAcademicas');
    
    if (btnMaterias && btnAcademicas) {
        btnMaterias.style.borderColor = tipo === 'materias' ? 'var(--primary)' : '#ccc';
        btnMaterias.style.color = tipo === 'materias' ? 'var(--primary)' : 'var(--text-body)';
        
        btnAcademicas.style.borderColor = tipo === 'academicas' ? 'var(--primary)' : '#ccc';
        btnAcademicas.style.color = tipo === 'academicas' ? 'var(--primary)' : 'var(--text-body)';
    }
    
    // Mostrar/ocultar tablas
    const tablaMaterias = document.getElementById('tablaPrelacionMaterias');
    const tablaAcademicas = document.getElementById('tablaPrelacionAcademicas');
    
    if (tablaMaterias && tablaAcademicas) {
        tablaMaterias.style.display = tipo === 'materias' ? 'block' : 'none';
        tablaAcademicas.style.display = tipo === 'academicas' ? 'block' : 'none';
    }
    
    if (tipo === 'materias') {
        cargarPrelacionesMaterias();
    } else {
        cargarPrelacionesAcademicas();
    }
}

function cargarPrelacionesMaterias() {
    const tbody = document.querySelector('#tablePrelacionesMaterias tbody');
    const select = document.getElementById('selectCarreraPrelacion');
    
    if (!tbody || !select) return;
    
    // Cargar select de carreras si es necesario
    if (select.options.length <= 1) {
        select.innerHTML = '<option value="">-- Todas las carreras --</option>' +
            datos.carreras.map(c => 
                `<option value="${c.id_carrera}">${c.nombre_carrera}</option>`
            ).join('');
    }
    
    // Filtrar si hay carrera seleccionada
    let filtrados = datos.prelaciones_materias || [];
    if (carreraFiltroPrelaciones) {
        filtrados = filtrados.filter(p => {
            // Los datos ya deben tener id_carrera desde el servidor
            return p.id_carrera == carreraFiltroPrelaciones;
        });
    }
    
    const { items, totalPaginas } = getPaginado(filtrados, paginacion.prelaciones_materias);
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay prelaciones de materias registradas</td></tr>';
        renderPagi('pagination-prelaciones-materias', paginacion.prelaciones_materias.paginaActual, totalPaginas, 'prelaciones_materias');
        return;
    }
    
    // IMPORTANTE: Usar directamente los nombres formateados que vienen del servidor
    tbody.innerHTML = items.map(p => {
        return `
            <tr>
                <td>${p.asignatura_principal || 'N/A'}</td>
                <td>
                    <span class="badge ${p.tipo_prelacion === 'REQUISITO' ? 'active' : 'inactive'}" 
                          style="background: ${p.tipo_prelacion === 'REQUISITO' ? '#fef3c7' : '#dbeafe'}; 
                                 color: ${p.tipo_prelacion === 'REQUISITO' ? '#92400e' : '#1e40af'}">
                        ${p.tipo_prelacion === 'REQUISITO' ? 'Requisito' : 'Correquisito'}
                    </span>
                </td>
                <td>${p.asignatura_prelacion || 'N/A'}</td>
                <td>${p.nombre_carrera || 'N/A'}</td>
                <td>
                    <button class="btn-action delete" 
                            onclick="confirmarEliminacion('prelacion_materia', ${p.id_prelacion_materia}, 'Prelación')" 
                            title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    renderPagi('pagination-prelaciones-materias', paginacion.prelaciones_materias.paginaActual, totalPaginas, 'prelaciones_materias');
}

function cargarPrelacionesAcademicas() {
    const tbody = document.querySelector('#tablePrelacionesAcademicas tbody');
    const select = document.getElementById('selectCarreraPrelacionAcad');
    
    if (!tbody || !select) return;
    
    // Cargar select de carreras si es necesario
    if (select.options.length <= 1) {
        select.innerHTML = '<option value="">-- Todas las carreras --</option>' +
            datos.carreras.map(c => 
                `<option value="${c.id_carrera}">${c.nombre_carrera}</option>`
            ).join('');
    }
    
    // Filtrar si hay carrera seleccionada
    let filtrados = datos.prelaciones_academicas || [];
    if (carreraFiltroPrelaciones) {
        filtrados = filtrados.filter(p => {
            // Los datos ya deben tener id_carrera desde el servidor
            return p.id_carrera == carreraFiltroPrelaciones;
        });
    }
    
    const { items, totalPaginas } = getPaginado(filtrados, paginacion.prelaciones_academicas);
    
    if (items.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay prelaciones académicas registradas</td></tr>';
        renderPagi('pagination-prelaciones-academicas', paginacion.prelaciones_academicas.paginaActual, totalPaginas, 'prelaciones_academicas');
        return;
    }
    
    // IMPORTANTE: Usar directamente los nombres formateados que vienen del servidor
    tbody.innerHTML = items.map(p => {
        return `
            <tr>
                <td>${p.nombre_asignatura || 'N/A'}</td>
                <td>
                    <span class="badge ${p.tipo_prelacion === 'UC_APROBADAS' ? 'active' : 'inactive'}" 
                          style="background: ${p.tipo_prelacion === 'UC_APROBADAS' ? '#d1fae5' : '#dbeafe'}; 
                                 color: ${p.tipo_prelacion === 'UC_APROBADAS' ? '#065f46' : '#1e40af'}">
                        ${p.tipo_prelacion === 'UC_APROBADAS' ? 'UC Aprobadas' : 'Semestre Aprobado'}
                    </span>
                </td>
                <td>${p.valor_requerido} ${p.tipo_prelacion === 'UC_APROBADAS' ? 'UC' : 'Semestre'}</td>
                <td>${p.nombre_carrera || 'N/A'}</td>
                <td>
                    <button class="btn-action delete" 
                            onclick="confirmarEliminacion('prelacion_academica', ${p.id_prelacion_academica}, 'Prelación')" 
                            title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    renderPagi('pagination-prelaciones-academicas', paginacion.prelaciones_academicas.paginaActual, totalPaginas, 'prelaciones_academicas');
}

function filtrarPrelacionesMaterias() {
    const select = document.getElementById('selectCarreraPrelacion');
    carreraFiltroPrelaciones = select.value ? parseInt(select.value) : null;
    paginacion.prelaciones_materias.paginaActual = 1;
    cargarPrelacionesMaterias();
}

function filtrarPrelacionesAcademicas() {
    const select = document.getElementById('selectCarreraPrelacionAcad');
    carreraFiltroPrelaciones = select.value ? parseInt(select.value) : null;
    paginacion.prelaciones_academicas.paginaActual = 1;
    cargarPrelacionesAcademicas();
}

// Función auxiliar para obtener información de asignatura por id de malla (CORREGIDA)
function obtenerAsignaturaPorIdMalla(idAsignaturaCarrera) {
    // Buscar en el arreglo de malla que ya tiene los nombres formateados
    const registroMalla = datos.malla.find(m => m.id_asignatura_carrera == idAsignaturaCarrera);
    if (!registroMalla) return null;
    
    const carrera = datos.carreras.find(c => c.id_carrera == registroMalla.id_carrera);
    
    // IMPORTANTE: Usar el nombre_asignatura de la malla que ya viene formateado
    return {
        nombre: registroMalla.nombre_asignatura || 'N/A', // Este ya viene formateado
        carrera: carrera ? carrera.nombre_carrera : 'N/A',
        codigo: registroMalla.codigo_asignatura || 'N/A',
        id_carrera: registroMalla.id_carrera
    };
}

// ============================================
// CONTROL DE RENDERIZADO
// ============================================

function renderizarSeccion(tipo) {
    switch(tipo) {
        case 'usuarios':
            cargarUsuarios();
            break;
        case 'carreras':
            cargarCarreras();
            break;
        case 'asignaturas':
            cargarAsignaturas();
            break;
        case 'malla':
            cargarMalla();
            break;
        case 'lapsos':
            cargarLapsos();
            break;
        case 'frases':
            cargarFrases();
            break;
        case 'prelaciones_materias':
            cargarPrelacionesMaterias();
            break;
        case 'prelaciones_academicas':
            cargarPrelacionesAcademicas();
            break;
    }
}

function actualizarEstadisticas() {
    document.getElementById('totalEstudiantes').textContent = datos.estudiantes.length;
    document.getElementById('totalCarreras').textContent = datos.carreras.length;
    document.getElementById('totalAsignaturas').textContent = datos.asignaturas.length;
    document.getElementById('totalLapsos').textContent = datos.lapsos.length;
}

// ============================================
// SISTEMA DE MODALES
// ============================================

function abrirModal(tipo, id = null) {
    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    editandoTipo = tipo;
    editandoId = id;
    
    // Configurar título y formulario según el tipo
    let tituloTexto = '';
    let formularioHTML = '';
    
    switch(tipo) {
        case 'usuario':
            tituloTexto = id ? 'Editar Usuario' : 'Nuevo Usuario';
            formularioHTML = obtenerFormularioUsuario(id);
            break;
        case 'carrera':
            tituloTexto = id ? 'Editar Carrera' : 'Nueva Carrera';
            formularioHTML = obtenerFormularioCarrera(id);
            break;
        case 'asignatura':
            tituloTexto = id ? 'Editar Asignatura' : 'Nueva Asignatura';
            formularioHTML = obtenerFormularioAsignatura(id);
            break;
        case 'malla':
            tituloTexto = id ? 'Editar Asignatura en Malla' : 'Asignar Asignatura a Malla';
            formularioHTML = obtenerFormularioMalla(id);
            break;
        case 'lapso':
            tituloTexto = id ? 'Editar Lapso Académico' : 'Nuevo Lapso Académico';
            formularioHTML = obtenerFormularioLapso(id);
            break;
        case 'frase':
            tituloTexto = id ? 'Editar Frase' : 'Nueva Frase';
            formularioHTML = obtenerFormularioFrase(id);
            break;
        case 'prelacion_materia':
            tituloTexto = id ? 'Editar Prelación de Materia' : 'Nueva Prelación de Materia';
            formularioHTML = obtenerFormularioPrelacionMateria(id);
            break;
        case 'prelacion_academica':
            tituloTexto = id ? 'Editar Prelación Académica' : 'Nueva Prelación Académica';
            formularioHTML = obtenerFormularioPrelacionAcademica(id);
            break;
    }
    
    title.textContent = tituloTexto;
    body.innerHTML = formularioHTML;
    modal.style.display = 'flex';
    
    // Agregar event listeners para los cambios en los selects (solo para formularios de prelaciones)
    if (tipo === 'prelacion_materia' || tipo === 'prelacion_academica') {
        // Esperar a que el DOM se actualice
        setTimeout(() => {
            const selectPrincipal = document.querySelector('select[name="id_asignatura_carrera"]');
            if (selectPrincipal) {
                selectPrincipal.addEventListener('change', function() {
                    const idAsignaturaCarrera = this.value;
                    if (idAsignaturaCarrera) {
                        const asignatura = obtenerAsignaturaPorIdMalla(idAsignaturaCarrera);
                        if (asignatura && asignatura.id_carrera) {
                            carreraSeleccionadaFormulario = asignatura.id_carrera;
                            // Filtrar el segundo select
                            filtrarSelectPrelaciones(asignatura.id_carrera);
                        }
                    } else {
                        // Si no hay selección, resetear
                        carreraSeleccionadaFormulario = null;
                        resetearSelectPrelaciones();
                    }
                });
                
                // Si estamos editando, configurar el filtro inmediatamente
                if (id && selectPrincipal.value) {
                    const asignatura = obtenerAsignaturaPorIdMalla(selectPrincipal.value);
                    if (asignatura && asignatura.id_carrera) {
                        carreraSeleccionadaFormulario = asignatura.id_carrera;
                        filtrarSelectPrelaciones(asignatura.id_carrera);
                    }
                }
            }
        }, 100);
    }
}

// Función para filtrar el select de prelaciones
function filtrarSelectPrelaciones(idCarrera) {
    const selectPrelacion = document.querySelector('select[name="id_asignatura_prelacion"]');
    if (!selectPrelacion) return;
    
    // Obtener todas las asignaturas de la misma carrera
    const asignaturasFiltradas = filtrarAsignaturasPorCarrera(idCarrera);
    
    // Guardar el valor actual seleccionado
    const valorActual = selectPrelacion.value;
    
    // Limpiar y repoblar el select
    selectPrelacion.innerHTML = '<option value="">-- Seleccione una asignatura --</option>';
    
    asignaturasFiltradas.forEach(a => {
        const option = document.createElement('option');
        option.value = a.id;
        option.textContent = `${a.codigo} - ${a.nombre} (${a.carrera})`;
        selectPrelacion.appendChild(option);
    });
    
    // Restaurar el valor seleccionado si aún está disponible
    if (valorActual) {
        const asignaturaSeleccionada = asignaturasFiltradas.find(a => a.id == valorActual);
        if (asignaturaSeleccionada) {
            selectPrelacion.value = valorActual;
        }
    }
    
    // Agregar mensaje informativo
    const carrera = datos.carreras.find(c => c.id_carrera == idCarrera);
    if (carrera) {
        selectPrelacion.setAttribute('title', `Mostrando solo asignaturas de la carrera: ${carrera.nombre_carrera}`);
    }
}

// Función para resetear el select de prelaciones
function resetearSelectPrelaciones() {
    const selectPrelacion = document.querySelector('select[name="id_asignatura_prelacion"]');
    if (!selectPrelacion) return;
    
    // Obtener todas las asignaturas de todas las carreras
    const todasAsignaturas = datos.malla.map(m => {
        const carrera = datos.carreras.find(c => c.id_carrera == m.id_carrera);
        return {
            id: m.id_asignatura_carrera,
            nombre: m.nombre_asignatura || 'N/A',
            carrera: carrera ? carrera.nombre_carrera : 'N/A',
            codigo: m.codigo_asignatura
        };
    });
    
    // Limpiar y repoblar el select
    selectPrelacion.innerHTML = '<option value="">-- Seleccione una asignatura --</option>';
    
    todasAsignaturas.forEach(a => {
        const option = document.createElement('option');
        option.value = a.id;
        option.textContent = `${a.codigo} - ${a.nombre} (${a.carrera})`;
        selectPrelacion.appendChild(option);
    });
    
    // Remover título informativo
    selectPrelacion.removeAttribute('title');
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
    editandoId = null;
    editandoTipo = null;
    carreraSeleccionadaFormulario = null;
}

function editar(tipo, id) {
    abrirModal(tipo, id);
}

// Función para confirmar eliminación
async function confirmarEliminacion(tipo, id, nombre) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar este registro${nombre ? ': ' + nombre : ''}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    });
    
    if (result.isConfirmed) {
        eliminarRegistro(tipo, id);
    }
}

// Función para eliminar registro con fetch
async function eliminarRegistro(tipo, id) {
    // Determinar la URL según el tipo
    let url;
    
    switch(tipo) {
        case 'usuario':
            url = `/api/crud/usuarios/${id}`;
            break;
        case 'carrera':
            url = `/api/crud/carreras/${id}`;
            break;
        case 'asignatura':
            url = `/api/crud/asignaturas/${id}`;
            break;
        case 'malla':
            url = `/api/crud/malla/${id}`;
            break;
        case 'lapso':
            url = `/api/crud/lapsos/${id}`;
            break;
        case 'frase':
            url = `/api/crud/frases/${id}`;
            break;
        case 'prelacion_materia':
            url = `/api/crud/prelaciones/materias/${id}`;
            break;
        case 'prelacion_academica':
            url = `/api/crud/prelaciones/academicas/${id}`;
            break;
        default:
            console.error('Tipo de entidad no reconocido:', tipo);
            return;
    }
    
    // Mostrar indicador de carga
    Swal.fire({
        title: 'Eliminando...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Enviar solicitud DELETE al servidor
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Error al eliminar');
            });
        }
        return response.json();
    })
    .then(datosRespuesta => {
        console.log('Respuesta del servidor:', datosRespuesta);
        
        // Mostrar mensaje de éxito
        Swal.fire({
            icon: "success",
            title: "¡Eliminado con éxito!",
            text: "El registro ha sido eliminado correctamente.",
            confirmButtonColor: "#28a745",
            confirmButtonText: "Ok",
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                // Recargar la página para actualizar los datos
                window.location.reload();
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo eliminar el registro',
            confirmButtonColor: '#2563eb'
        });
    });
}

// ============================================
// GENERADORES DE FORMULARIOS
// ============================================

function obtenerFormularioUsuario(id) {
    let usuario = null;
    if (id) {
        usuario = datos.estudiantes.find(u => u.id_usuario == id);
    }
    
    return `
        <div class="form-group">
            <label>Cédula *</label>
            <input type="text" name="cedula" class="form-control" 
                   value="${usuario ? usuario.cedula : ''}" required>
        </div>
        <div class="form-group">
            <label>Nombre *</label>
            <input type="text" name="nombre" class="form-control" 
                   value="${usuario ? usuario.nombre : ''}" required>
        </div>
        <div class="form-group">
            <label>Apellido *</label>
            <input type="text" name="apellido" class="form-control" 
                   value="${usuario ? usuario.apellido : ''}" required>
        </div>
        <div class="form-group">
            <label>Correo Electrónico *</label>
            <input type="email" name="correo" class="form-control" 
                   value="${usuario ? usuario.correo : ''}" required>
        </div>
        ${!id ? `
        <div class="form-group">
            <label>Contraseña *</label>
            <input type="password" name="contraseña" class="form-control" required>
        </div>
        ` : ''}
    `;
}

function obtenerFormularioCarrera(id) {
    let carrera = null;
    if (id) {
        carrera = datos.carreras.find(c => c.id_carrera == id);
    }
    
    return `
        <div class="form-group">
            <label>Nombre de la Carrera *</label>
            <input type="text" name="nombre_carrera" class="form-control" 
                   value="${carrera ? carrera.nombre_carrera : ''}" required>
        </div>
    `;
}

function obtenerFormularioAsignatura(id) {
    let asignatura = null;
    if (id) {
        asignatura = datos.asignaturas.find(a => a.id_asignatura == id);
    }
    
    return `
        <div class="form-group">
            <label>Nombre de la Asignatura *</label>
            <input type="text" name="nombre_asignatura" class="form-control" 
                   value="${asignatura ? asignatura.nombre_asignatura : ''}" required>
        </div>
    `;
}

function obtenerFormularioMalla(id) {
    let malla = null;
    if (id) {
        malla = datos.malla.find(m => m.id_asignatura_carrera == id);
    }
    
    return `
        <div class="form-group">
            <label>Carrera *</label>
            <select name="id_carrera" class="form-control" required ${id ? 'disabled' : ''}>
                <option value="">-- Seleccione --</option>
                ${datos.carreras.map(c => 
                    `<option value="${c.id_carrera}" ${malla && malla.id_carrera == c.id_carrera ? 'selected' : ''}>
                        ${c.nombre_carrera}
                    </option>`
                ).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Asignatura *</label>
            <select name="id_asignatura" class="form-control" required ${id ? 'disabled' : ''}>
                <option value="">-- Seleccione --</option>
                ${datos.asignaturas.map(a => 
                    `<option value="${a.id_asignatura}" ${malla && malla.id_asignatura == a.id_asignatura ? 'selected' : ''}>
                        ${a.nombre_asignatura}
                    </option>`
                ).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Código de Asignatura *</label>
            <input type="number" name="codigo_asignatura" class="form-control" 
                   value="${malla ? malla.codigo_asignatura : ''}" required>
        </div>
        <div class="form-group">
            <label>Semestre *</label>
            <input type="number" name="semestre" class="form-control" min="1" max="12"
                   value="${malla ? malla.semestre : ''}" required>
        </div>
        <div class="form-group">
            <label>Unidades de Crédito (UC) *</label>
            <input type="number" name="uc_asignatura" class="form-control" min="1"
                   value="${malla ? malla.uc_asignatura : ''}" required>
        </div>
        <div class="form-group">
            <label>Total de Horas *</label>
            <input type="number" name="total_horas" class="form-control" min="1"
                   value="${malla ? malla.total_horas : ''}" required>
        </div>
    `;
}

function obtenerFormularioLapso(id) {
    let lapso = null;
    if (id) {
        lapso = datos.lapsos.find(l => l.id_lapso == id);
    }
    
    return `
        <div class="form-group">
            <label>Periodo *</label>
            <select name="periodo" class="form-control" required>
                <option value="">-- Seleccione --</option>
                <option value="1" ${lapso && lapso.periodo == 1 ? 'selected' : ''}>1</option>
                <option value="2" ${lapso && lapso.periodo == 2 ? 'selected' : ''}>2</option>
                <option value="3" ${lapso && lapso.periodo == 3 ? 'selected' : ''}>3</option>
            </select>
        </div>
        <div class="form-group">
            <label>Año *</label>
            <input type="number" name="año" class="form-control" min="2020" max="2030"
                   value="${lapso ? lapso.año : new Date().getFullYear()}" required>
        </div>
    `;
}

function obtenerFormularioFrase(id) {
    let frase = null;
    if (id) {
        frase = datos.frases.find(f => f.id_frase == id);
    }
    
    return `
        <div class="form-group">
            <label>Frase *</label>
            <textarea name="frase" class="form-control" rows="4" required>${frase ? frase.frase : ''}</textarea>
        </div>
    `;
}

function obtenerFormularioPrelacionMateria(id) {
    let prelacion = null;
    if (id) {
        prelacion = (datos.prelaciones_materias || []).find(p => p.id_prelacion_materia == id);
    }
    
    // Obtener todas las asignaturas disponibles en malla curricular (ya formateadas)
    const todasAsignaturas = datos.malla.map(m => {
        const carrera = datos.carreras.find(c => c.id_carrera == m.id_carrera);
        return {
            id: m.id_asignatura_carrera,
            nombre: m.nombre_asignatura || 'N/A', // Ya viene formateado
            carrera: carrera ? carrera.nombre_carrera : 'N/A',
            codigo: m.codigo_asignatura,
            id_carrera: m.id_carrera
        };
    });
    
    return `
        <div class="form-group">
            <label>Asignatura Principal *</label>
            <select name="id_asignatura_carrera" class="form-control" required ${id ? 'disabled' : ''}>
                <option value="">-- Seleccione una asignatura --</option>
                ${todasAsignaturas.map(a => 
                    `<option value="${a.id}" ${prelacion && prelacion.id_asignatura_carrera == a.id ? 'selected' : ''}>
                        ${a.codigo} - ${a.nombre} (${a.carrera})
                    </option>`
                ).join('')}
            </select>
            <small class="text-muted">Al seleccionar una asignatura, solo podrás elegir prelaciones de la misma carrera</small>
        </div>
        <div class="form-group">
            <label>Tipo de Prelación *</label>
            <select name="tipo_prelacion" class="form-control" required>
                <option value="">-- Seleccione tipo --</option>
                <option value="REQUISITO" ${prelacion && prelacion.tipo_prelacion === 'REQUISITO' ? 'selected' : ''}>Requisito</option>
                <option value="CORREQUISITO" ${prelacion && prelacion.tipo_prelacion === 'CORREQUISITO' ? 'selected' : ''}>Correquisito</option>
            </select>
        </div>
        <div class="form-group">
            <label>Asignatura Prelación *</label>
            <select name="id_asignatura_prelacion" class="form-control" required>
                <option value="">-- Seleccione una asignatura --</option>
                ${todasAsignaturas.map(a => 
                    `<option value="${a.id}" ${prelacion && prelacion.id_asignatura_prelacion == a.id ? 'selected' : ''}>
                        ${a.codigo} - ${a.nombre} (${a.carrera})
                    </option>`
                ).join('')}
            </select>
            <small class="text-muted">Este listado se filtrará automáticamente cuando selecciones una asignatura principal</small>
        </div>
        <div style="background: #e0f2fe; padding: 10px; border-radius: 6px; border-left: 4px solid #0284c7; margin-top: 15px; font-size: 0.85rem;">
            <small>
                <i class="fas fa-info-circle"></i> 
                <strong>Requisito:</strong> Debe aprobarse antes de cursar la asignatura principal.<br>
                <strong>Correquisito:</strong> Debe cursarse al mismo tiempo que la asignatura principal.<br>
                <strong>Nota:</strong> Solo puedes seleccionar prelaciones de la misma carrera que la asignatura principal.
            </small>
        </div>
    `;
}

function obtenerFormularioPrelacionAcademica(id) {
    let prelacion = null;
    if (id) {
        prelacion = (datos.prelaciones_academicas || []).find(p => p.id_prelacion_academica == id);
    }
    
    // Obtener todas las asignaturas disponibles en malla curricular (ya formateadas)
    const todasAsignaturas = datos.malla.map(m => {
        const carrera = datos.carreras.find(c => c.id_carrera == m.id_carrera);
        return {
            id: m.id_asignatura_carrera,
            nombre: m.nombre_asignatura || 'N/A', // Ya viene formateado
            carrera: carrera ? carrera.nombre_carrera : 'N/A',
            codigo: m.codigo_asignatura,
            id_carrera: m.id_carrera
        };
    });
    
    return `
        <div class="form-group">
            <label>Asignatura *</label>
            <select name="id_asignatura_carrera" class="form-control" required ${id ? 'disabled' : ''}>
                <option value="">-- Seleccione una asignatura --</option>
                ${todasAsignaturas.map(a => 
                    `<option value="${a.id}" ${prelacion && prelacion.id_asignatura_carrera == a.id ? 'selected' : ''}>
                        ${a.codigo} - ${a.nombre} (${a.carrera})
                    </option>`
                ).join('')}
            </select>
        </div>
        <div class="form-group">
            <label>Tipo de Prelación Académica *</label>
            <select name="tipo_prelacion" class="form-control" required>
                <option value="">-- Seleccione tipo --</option>
                <option value="UC_APROBADAS" ${prelacion && prelacion.tipo_prelacion === 'UC_APROBADAS' ? 'selected' : ''}>UC Aprobadas</option>
                <option value="SEMESTRE_APROBADO" ${prelacion && prelacion.tipo_prelacion === 'SEMESTRE_APROBADO' ? 'selected' : ''}>Semestre Aprobado</option>
            </select>
        </div>
        <div class="form-group">
            <label>Valor Requerido *</label>
            <input type="number" name="valor_requerido" class="form-control" min="1" max="200"
                value="${prelacion ? prelacion.valor_requerido : '1'}" required>
            <small style="color: var(--text-body); font-size: 0.85rem;">
                Para "UC Aprobadas": número mínimo de unidades de crédito aprobadas requeridas<br>
                Para "Semestre Aprobado": semestre mínimo aprobado requerido
            </small>
        </div>
    `;
}

// ============================================
// MANEJO DE FORMULARIOS
// ============================================

function guardarFormulario(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validar que no se pueda asignar una prelación de materia a sí misma
    if (editandoTipo === 'prelacion_materia') {
        if (data.id_asignatura_carrera === data.id_asignatura_prelacion) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'No puedes asignar una prelación a la misma asignatura',
                confirmButtonColor: '#2563eb'
            });
            return;
        }
    }
    
    // Convertir números de strings a integers donde sea necesario
    if (data.id_carrera) data.id_carrera = parseInt(data.id_carrera);
    if (data.id_asignatura) data.id_asignatura = parseInt(data.id_asignatura);
    if (data.codigo_asignatura) data.codigo_asignatura = parseInt(data.codigo_asignatura);
    if (data.semestre) data.semestre = parseInt(data.semestre);
    if (data.uc_asignatura) data.uc_asignatura = parseInt(data.uc_asignatura);
    if (data.total_horas) data.total_horas = parseInt(data.total_horas);
    if (data.periodo) data.periodo = parseInt(data.periodo);
    if (data.año) data.año = parseInt(data.año);
    if (data.valor_requerido) data.valor_requerido = parseInt(data.valor_requerido);
    
    console.log('Guardando:', editandoTipo, data, 'ID:', editandoId);
    
    // Determinar la URL y método según si es creación o edición
    let url, method;
    
    switch(editandoTipo) {
        case 'usuario':
            url = editandoId ? `/api/crud/usuarios/${editandoId}` : '/api/crud/usuarios';
            method = editandoId ? 'PUT' : 'POST';
            break;
        case 'carrera':
            url = editandoId ? `/api/crud/carreras/${editandoId}` : '/api/crud/carreras';
            method = editandoId ? 'PUT' : 'POST';
            break;
        case 'asignatura':
            url = editandoId ? `/api/crud/asignaturas/${editandoId}` : '/api/crud/asignaturas';
            method = editandoId ? 'PUT' : 'POST';
            break;
        case 'malla':
            url = editandoId ? `/api/crud/malla/${editandoId}` : '/api/crud/malla';
            method = editandoId ? 'PUT' : 'POST';
            break;
        case 'lapso':
            url = editandoId ? `/api/crud/lapsos/${editandoId}` : '/api/crud/lapsos';
            method = editandoId ? 'PUT' : 'POST';
            break;
        case 'frase':
            url = editandoId ? `/api/crud/frases/${editandoId}` : '/api/crud/frases';
            method = editandoId ? 'PUT' : 'POST';
            break;
        case 'prelacion_materia':
            url = editandoId ? `/api/crud/prelaciones/materias/${editandoId}` : '/api/crud/prelaciones/materias';
            method = editandoId ? 'PUT' : 'POST';
            break;
        case 'prelacion_academica':
            url = editandoId ? `/api/crud/prelaciones/academicas/${editandoId}` : '/api/crud/prelaciones/academicas';
            method = editandoId ? 'PUT' : 'POST';
            break;
        default:
            console.error('Tipo de entidad no reconocido:', editandoTipo);
            return;
    }
    
    // Mostrar indicador de carga con SweetAlert2
    Swal.fire({
        title: 'Guardando...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Enviar datos al servidor
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.message || 'Error al guardar');
            });
        }
        return response.json();
    })
    .then(datosRespuesta => {
        console.log('Respuesta del servidor:', datosRespuesta);
        
        // Cerrar modal antes de mostrar la alerta de éxito
        cerrarModal();
        
        // Mostrar mensaje de éxito y redirigir
        Swal.fire({
            icon: "success",
            title: "¡Guardado con éxito!",
            text: "Presiona el botón para continuar.",
            confirmButtonColor: "#28a745",
            confirmButtonText: "Ok",
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirigir a la URL proporcionada por el servidor o recargar la página
                window.location.href = datosRespuesta.redirectUrl || window.location.href;
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'No se pudo guardar el registro',
            confirmButtonColor: '#2563eb'
        });
    });
}

// Función auxiliar para actualizar registro local
function actualizarRegistroLocal(tipo, id, nuevosDatos) {
    let array;
    let idField;
    
    switch(tipo) {
        case 'usuario':
            array = datos.estudiantes;
            idField = 'id_usuario';
            break;
        case 'carrera':
            array = datos.carreras;
            idField = 'id_carrera';
            break;
        case 'asignatura':
            array = datos.asignaturas;
            idField = 'id_asignatura';
            break;
        case 'malla':
            array = datos.malla;
            idField = 'id_asignatura_carrera';
            break;
        case 'lapso':
            array = datos.lapsos;
            idField = 'id_lapso';
            break;
        case 'frase':
            array = datos.frases;
            idField = 'id_frase';
            break;
        case 'prelacion_materia':
            array = datos.prelaciones_materias || [];
            idField = 'id_prelacion_materia';
            break;
        case 'prelacion_academica':
            array = datos.prelaciones_academicas || [];
            idField = 'id_prelacion_academica';
            break;
    }
    
    const index = array.findIndex(item => item[idField] == id);
    if (index !== -1) {
        array[index] = { ...array[index], ...nuevosDatos };
    }
}

// Función auxiliar para agregar registro local
function agregarRegistroLocal(tipo, nuevoRegistro) {
    switch(tipo) {
        case 'usuario':
            datos.estudiantes.push(nuevoRegistro);
            break;
        case 'carrera':
            datos.carreras.push(nuevoRegistro);
            break;
        case 'asignatura':
            datos.asignaturas.push(nuevoRegistro);
            break;
        case 'malla':
            datos.malla.push(nuevoRegistro);
            break;
        case 'lapso':
            datos.lapsos.push(nuevoRegistro);
            break;
        case 'frase':
            datos.frases.push(nuevoRegistro);
            break;
        case 'prelacion_materia':
            if (!datos.prelaciones_materias) datos.prelaciones_materias = [];
            datos.prelaciones_materias.push(nuevoRegistro);
            break;
        case 'prelacion_academica':
            if (!datos.prelaciones_academicas) datos.prelaciones_academicas = [];
            datos.prelaciones_academicas.push(nuevoRegistro);
            break;
    }
}

// Función auxiliar para obtener nombre de sección
function obtenerNombreSeccion(tipo) {
    const mapa = {
        'usuario': 'usuarios',
        'carrera': 'carreras',
        'asignatura': 'asignaturas',
        'malla': 'malla',
        'lapso': 'lapsos',
        'frase': 'frases',
        'prelacion_materia': 'prelaciones_materias',
        'prelacion_academica': 'prelaciones_academicas'
    };
    return mapa[tipo] || tipo;
}

// Sistema de notificaciones con SweetAlert2
function mostrarNotificacion(titulo, mensaje, tipo = 'info') {
    const iconos = {
        'success': 'success',
        'error': 'error',
        'warning': 'warning',
        'info': 'info'
    };
    
    Swal.fire({
        icon: iconos[tipo] || 'info',
        title: titulo,
        text: mensaje,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
    });
}

// ============================================
// BÚSQUEDA
// ============================================

function buscar(tipo) {
    console.log('Buscando en:', tipo);
    // Implementar búsqueda según sea necesario
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Sistema de tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover active de todos
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => 
                el.classList.remove('active')
            );
            
            // Activar el seleccionado
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // Listener para cambio de carrera en malla curricular
    const selectMalla = document.getElementById('selectCarreraMalla');
    if (selectMalla) {
        selectMalla.addEventListener('change', (e) => {
            carreraSeleccionadaMalla = e.target.value;
            paginacion.malla.paginaActual = 1;
            cargarMalla();
        });
    }

    // Listener para el formulario del modal
    const modalForm = document.getElementById('modalForm');
    if (modalForm) {
        modalForm.addEventListener('submit', guardarFormulario);
    }

    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }

    // Inicializar sistema de tabs para prelaciones
    mostrarTipoPrelacion('materias');

    // Renderizar todas las secciones inicialmente
    ['usuarios', 'carreras', 'asignaturas', 'malla', 'lapsos', 'frases'].forEach(renderizarSeccion);
    
    // Actualizar estadísticas
    actualizarEstadisticas();
    
    console.log('Sistema CRUD inicializado correctamente');
});