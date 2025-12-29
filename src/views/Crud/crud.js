
        // Datos de ejemplo (simulando base de datos)
        let datos = {
            estudiantes: [],
            carreras: [],
            asignaturas: [],
            malla: [],
            cursos: [],
            horarios: [],
            evaluaciones: []
        };

        // Variable para controlar qué formulario está abierto
        let formularioActual = '';
        let edicionId = null;

        // Inicializar datos de ejemplo
        function inicializarDatos() {
            // Cargar carreras desde la base de datos proporcionada
            datos.carreras = [
                {id_carrera: 41, nombre_carrera: 'Arquitectura', total_UC: 173, estado_carrera: true},
                {id_carrera: 42, nombre_carrera: 'Ingenieria Civil', total_UC: 191, estado_carrera: true},
                {id_carrera: 43, nombre_carrera: 'Ingenieria Electrica', total_UC: 183, estado_carrera: true},
                {id_carrera: 44, nombre_carrera: 'Ingenieria Electronica', total_UC: 184, estado_carrera: true},
                {id_carrera: 45, nombre_carrera: 'Ingenieria Industrial', total_UC: 184, estado_carrera: true},
                {id_carrera: 46, nombre_carrera: 'Ingenieria de Mantenimiento Mecanico', total_UC: 184, estado_carrera: true},
                {id_carrera: 47, nombre_carrera: 'Ingenieria de Sistemas', total_UC: 189, estado_carrera: true},
                {id_carrera: 48, nombre_carrera: 'Ingenieria de Diseño Industrial', total_UC: 181, estado_carrera: true}
            ];

            // Cargar asignaturas (primeras 10 como ejemplo)
            datos.asignaturas = [
                {id_asignatura: 1000, nombre_asignatura: 'ACTIVIDAD DE FORMACION CULTURAL I', estado_asignatura: true},
                {id_asignatura: 1001, nombre_asignatura: 'ACTIVIDAD DE FORMACION CULTURAL II', estado_asignatura: true},
                {id_asignatura: 1002, nombre_asignatura: 'ACTIVIDAD DE ORIENTACION', estado_asignatura: true},
                {id_asignatura: 1003, nombre_asignatura: 'ALGEBRA LINEAL', estado_asignatura: true},
                {id_asignatura: 1004, nombre_asignatura: 'ANALISIS NUMERICO', estado_asignatura: true},
                {id_asignatura: 1005, nombre_asignatura: 'CIRCUITOS ELECTRICOS I', estado_asignatura: true},
                {id_asignatura: 1006, nombre_asignatura: 'CIRCUITOS ELECTRICOS II', estado_asignatura: true},
                {id_asignatura: 1007, nombre_asignatura: 'COMUNICACIONES', estado_asignatura: true},
                {id_asignatura: 1008, nombre_asignatura: 'CONTROL DE CALIDAD', estado_asignatura: true},
                {id_asignatura: 1009, nombre_asignatura: 'CONSTRUCCION I', estado_asignatura: true}
            ];

            // Ejemplo de estudiante
            datos.estudiantes.push({
                cedula: 31158650,
                nombres: 'Miguel',
                apellidos: 'Vasquez',
                correo: 'mavt1423@gmail.com',
                id_carrera: 47,
                unidades_credito_aprobadas: 60,
                promedio_actual: 14.78,
                promedio_historico: 14.50,
                estado_usuario: true
            });

            // Ejemplo de malla curricular
            datos.malla.push({
                id_carrera: 47,
                id_asignatura: 1039,
                semestre: 1,
                uc_asignatura: 2,
                total_horas: 3,
                estado_asignatura_carrera: true
            });

            actualizarEstadisticas();
        }

        // Funciones de navegación
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                cambiarTab(tabId);
            });
        });

        function cambiarTab(tabId) {
            // Actualizar botones activos
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

            // Actualizar contenido visible
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');

            // Cargar datos específicos de la pestaña
            switch(tabId) {
                case 'estudiantes':
                    cargarEstudiantes();
                    break;
                case 'carreras':
                    cargarCarreras();
                    break;
                case 'asignaturas':
                    cargarAsignaturas();
                    break;
                case 'malla':
                    cargarSelectCarreras();
                    break;
                case 'cursos':
                    cargarCursos();
                    break;
                case 'horarios':
                    cargarHorarios();
                    break;
                case 'evaluaciones':
                    cargarEvaluaciones();
                    break;
            }
        }

        // Funciones para modales
        function openModal(tipo, id = null) {
            formularioActual = tipo;
            edicionId = id;
            const modal = document.getElementById('modal');
            const modalTitle = document.getElementById('modalTitle');
            const modalBody = document.getElementById('modalBody');

            switch(tipo) {
                case 'estudiante':
                    modalTitle.textContent = id ? 'Editar Estudiante' : 'Nuevo Estudiante';
                    modalBody.innerHTML = generarFormEstudiante(id);
                    break;
                case 'carrera':
                    modalTitle.textContent = id ? 'Editar Carrera' : 'Nueva Carrera';
                    modalBody.innerHTML = generarFormCarrera(id);
                    break;
                case 'asignatura':
                    modalTitle.textContent = id ? 'Editar Asignatura' : 'Nueva Asignatura';
                    modalBody.innerHTML = generarFormAsignatura(id);
                    break;
                case 'malla-curricular':
                    modalTitle.textContent = 'Asignar Asignatura a Carrera';
                    modalBody.innerHTML = generarFormMalla();
                    break;
                case 'curso':
                    modalTitle.textContent = id ? 'Editar Curso' : 'Nuevo Curso';
                    modalBody.innerHTML = generarFormCurso(id);
                    break;
            }

            modal.style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('modal').style.display = 'none';
            document.getElementById('modalForm').reset();
            formularioActual = '';
            edicionId = null;
        }

        // Generadores de formularios
        function generarFormEstudiante(id) {
            const estudiante = id ? datos.estudiantes.find(e => e.cedula == id) : null;
            
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>Cédula *</label>
                        <input type="number" name="cedula" value="${estudiante ? estudiante.cedula : ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Carrera *</label>
                        <select name="id_carrera" required>
                            <option value="">-- Seleccione --</option>
                            ${datos.carreras.map(c => 
                                `<option value="${c.id_carrera}" ${estudiante && estudiante.id_carrera == c.id_carrera ? 'selected' : ''}>
                                    ${c.nombre_carrera}
                                </option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Nombres *</label>
                        <input type="text" name="nombres" value="${estudiante ? estudiante.nombres : ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Apellidos *</label>
                        <input type="text" name="apellidos" value="${estudiante ? estudiante.apellidos : ''}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Correo Electrónico *</label>
                    <input type="email" name="correo" value="${estudiante ? estudiante.correo : ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Contraseña ${id ? '(dejar en blanco para no cambiar)' : '*'}</label>
                        <input type="password" name="contraseña" ${id ? '' : 'required'}>
                    </div>
                    <div class="form-group">
                        <label>UC Aprobadas</label>
                        <input type="number" name="unidades_credito_aprobadas" value="${estudiante ? estudiante.unidades_credito_aprobadas : 0}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Estado</label>
                    <select name="estado_usuario">
                        <option value="true" ${estudiante && estudiante.estado_usuario ? 'selected' : ''}>Activo</option>
                        <option value="false" ${estudiante && !estudiante.estado_usuario ? 'selected' : ''}>Inactivo</option>
                    </select>
                </div>
            `;
        }

        function generarFormCarrera(id) {
            const carrera = id ? datos.carreras.find(c => c.id_carrera == id) : null;
            
            return `
                <div class="form-row">
                    <div class="form-group">
                        <label>ID Carrera *</label>
                        <input type="number" name="id_carrera" value="${carrera ? carrera.id_carrera : ''}" required ${id ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label>Total UC *</label>
                        <input type="number" name="total_UC" value="${carrera ? carrera.total_UC : ''}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Nombre de la Carrera *</label>
                    <input type="text" name="nombre_carrera" value="${carrera ? carrera.nombre_carrera : ''}" required>
                </div>
                <div class="form-group">
                    <label>Estado</label>
                    <select name="estado_carrera">
                        <option value="true" ${carrera && carrera.estado_carrera ? 'selected' : ''}>Activa</option>
                        <option value="false" ${carrera && !carrera.estado_carrera ? 'selected' : ''}>Inactiva</option>
                    </select>
                </div>
            `;
        }

        // Funciones CRUD
        function guardarFormulario(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            switch(formularioActual) {
                case 'estudiante':
                    guardarEstudiante(data);
                    break;
                case 'carrera':
                    guardarCarrera(data);
                    break;
                case 'asignatura':
                    guardarAsignatura(data);
                    break;
                case 'malla-curricular':
                    guardarMalla(data);
                    break;
            }

            closeModal();
        }

        function guardarEstudiante(data) {
            const index = datos.estudiantes.findIndex(e => e.cedula == edicionId);
            
            const estudiante = {
                cedula: parseInt(data.cedula),
                id_carrera: parseInt(data.id_carrera),
                nombres: data.nombres,
                apellidos: data.apellidos,
                correo: data.correo,
                contraseña: data.contraseña || '123456', // Valor por defecto si no se cambia
                unidades_credito_aprobadas: parseInt(data.unidades_credito_aprobadas) || 0,
                promedio_actual: 0,
                promedio_historico: 0,
                estado_usuario: data.estado_usuario === 'true'
            };

            if (index === -1) {
                datos.estudiantes.push(estudiante);
            } else {
                // Mantener la contraseña si no se cambió
                if (!data.contraseña) {
                    estudiante.contraseña = datos.estudiantes[index].contraseña;
                }
                datos.estudiantes[index] = estudiante;
            }

            cargarEstudiantes();
            actualizarEstadisticas();
        }

        function guardarCarrera(data) {
            const index = datos.carreras.findIndex(c => c.id_carrera == edicionId);
            
            const carrera = {
                id_carrera: parseInt(data.id_carrera),
                nombre_carrera: data.nombre_carrera,
                total_UC: parseInt(data.total_UC),
                estado_carrera: data.estado_carrera === 'true'
            };

            if (index === -1) {
                datos.carreras.push(carrera);
            } else {
                datos.carreras[index] = carrera;
            }

            cargarCarreras();
            actualizarEstadisticas();
        }

        // Funciones para cargar datos en tablas
        function cargarEstudiantes() {
            const tbody = document.querySelector('#tableEstudiantes tbody');
            tbody.innerHTML = '';

            datos.estudiantes.forEach(estudiante => {
                const carrera = datos.carreras.find(c => c.id_carrera == estudiante.id_carrera);
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td>${estudiante.cedula}</td>
                    <td>${estudiante.nombres}</td>
                    <td>${estudiante.apellidos}</td>
                    <td>${estudiante.correo}</td>
                    <td>${carrera ? carrera.nombre_carrera : 'No asignada'}</td>
                    <td>${estudiante.unidades_credito_aprobadas}</td>
                    <td>
                        <span class="status-badge ${estudiante.estado_usuario ? 'status-active' : 'status-inactive'}">
                            ${estudiante.estado_usuario ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td class="actions">
                        <button class="btn btn-warning btn-sm" onclick="openModal('estudiante', ${estudiante.cedula})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarEstudiante(${estudiante.cedula})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                
                tbody.appendChild(tr);
            });
        }

        function cargarCarreras() {
            const tbody = document.querySelector('#tableCarreras tbody');
            tbody.innerHTML = '';

            datos.carreras.forEach(carrera => {
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td>${carrera.id_carrera}</td>
                    <td>${carrera.nombre_carrera}</td>
                    <td>${carrera.total_UC}</td>
                    <td>
                        <span class="status-badge ${carrera.estado_carrera ? 'status-active' : 'status-inactive'}">
                            ${carrera.estado_carrera ? 'Activa' : 'Inactiva'}
                        </span>
                    </td>
                    <td class="actions">
                        <button class="btn btn-warning btn-sm" onclick="openModal('carrera', ${carrera.id_carrera})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarCarrera(${carrera.id_carrera})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                
                tbody.appendChild(tr);
            });
        }

        function cargarAsignaturas() {
            const tbody = document.querySelector('#tableAsignaturas tbody');
            tbody.innerHTML = '';

            datos.asignaturas.forEach(asignatura => {
                const tr = document.createElement('tr');
                
                tr.innerHTML = `
                    <td>${asignatura.id_asignatura}</td>
                    <td>${asignatura.nombre_asignatura}</td>
                    <td>
                        <span class="status-badge ${asignatura.estado_asignatura ? 'status-active' : 'status-inactive'}">
                            ${asignatura.estado_asignatura ? 'Activa' : 'Inactiva'}
                        </span>
                    </td>
                    <td class="actions">
                        <button class="btn btn-warning btn-sm" onclick="openModal('asignatura', ${asignatura.id_asignatura})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarAsignatura(${asignatura.id_asignatura})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                
                tbody.appendChild(tr);
            });
        }

        // Funciones para actualizar estadísticas
        function actualizarEstadisticas() {
            document.getElementById('totalEstudiantes').textContent = datos.estudiantes.length;
            document.getElementById('totalCarreras').textContent = datos.carreras.length;
            document.getElementById('totalAsignaturas').textContent = datos.asignaturas.length;
            // Aquí podrías calcular el total de cursos activos si los tienes en datos
        }

        // Funciones de eliminación
        function eliminarEstudiante(cedula) {
            if (confirm('¿Está seguro de eliminar este estudiante?')) {
                datos.estudiantes = datos.estudiantes.filter(e => e.cedula !== cedula);
                cargarEstudiantes();
                actualizarEstadisticas();
            }
        }

        function eliminarCarrera(id) {
            if (confirm('¿Está seguro de eliminar esta carrera?')) {
                datos.carreras = datos.carreras.filter(c => c.id_carrera !== id);
                cargarCarreras();
                actualizarEstadisticas();
            }
        }

        // Inicializar cuando se carga la página
        document.addEventListener('DOMContentLoaded', () => {
            inicializarDatos();
            cargarEstudiantes();
            cargarCarreras();
            cargarAsignaturas();
            
            // Configurar logout
            document.getElementById('logoutBtn').addEventListener('click', () => {
                if (confirm('¿Desea cerrar sesión?')) {
                    // Aquí iría la lógica de logout
                    alert('Sesión cerrada');
                }
            });
        });

        // Nota: Para completar el sistema, necesitarías implementar:
        // 1. Backend con Node.js/Express (ya te lo proporcioné anteriormente)
        // 2. Conexión a la base de datos MySQL
        // 3. Funciones CRUD completas para todas las tablas
        // 4. Autenticación y autorización
        // 5. Validaciones más robustas
        // 6. Manejo de errores
        // 7. Paginación para tablas grandes
        // 8. Búsquedas más avanzadas
        // 9. Exportación de datos (Excel, PDF)
        // 10. Reportes y estadísticas avanzadas