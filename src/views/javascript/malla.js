document.addEventListener('DOMContentLoaded', () => {
        const pensum = [
    {
        nombre: 'LENGUAJE Y COMUNICACION',
        codigo: '4701121',
        UC: 2,
        semestre: 1,
        prelaciones: []
    },
    {
        nombre: 'METODOLOGIA DE LA INVESTIGACION',
        codigo: '4703121',
        UC: 2,
        semestre: 1,
        prelaciones: []
    },
    {
        nombre: 'MATEMATICAS I',
        codigo: '4701141',
        UC: 4,
        semestre: 1,
        prelaciones: []
    },
    {
        nombre: 'ACTIVIDAD DE ORIENTACION',
        codigo: '4702121',
        UC: 2,
        semestre: 1,
        prelaciones: []
    },
    {
        nombre: 'EDUCACION, SALUD FISICA Y DEPORTE I',
        codigo: '4702111',
        UC: 1,
        semestre: 1,
        prelaciones: []
    },
    {
        nombre: 'ACTIVIDAD DE FORMACION CULTURAL I',
        codigo: '4701111',
        UC: 1,
        semestre: 1,
        prelaciones: []
    },
    {
        nombre: 'INTRODUCCION A LA INGENIERIA DE SISTEMAS',
        codigo: '4704121',
        UC: 2,
        semestre: 1,
        prelaciones: []
    },
    {
        nombre: 'ALGEBRA I',
        codigo: '4701131',
        UC: 3,
        semestre: 1,
        prelaciones: []
    },
    {
        nombre: 'INTRODUCCION A LA COMPUTACION',
        codigo: '4705121',
        UC: 2,
        semestre: 1,
        prelaciones: []
    },
    {
        nombre: 'INTRODUCCION A LA ADMINISTRACION',
        codigo: '4703222',
        UC: 2,
        semestre: 2,
        prelaciones: []
    },
    {
        nombre: 'ECONOMIA GENERAL',
        codigo: '4702222',
        UC: 2,
        semestre: 2,
        prelaciones: []
    },
    {
        nombre: 'MATEMATICAS II',
        codigo: '4701242',
        UC: 4,
        semestre: 2,
        prelaciones: ['4701141']
    },
    {
        nombre: 'EDUCACION, SALUD FISICA Y DEPORTE II',
        codigo: '4702112',
        UC: 1,
        semestre: 2,
        prelaciones: []
    },
    {
        nombre: 'ACTIVIDAD DE FORMACION CULTURAL II',
        codigo: '4701112',
        UC: 1,
        semestre: 2,
        prelaciones: []
    },
    {
        nombre: 'INGLES I',
        codigo: '4701122',
        UC: 2,
        semestre: 2,
        prelaciones: []
    },
    {
        nombre: 'ALGEBRA LINEAL',
        codigo: '4701232',
        UC: 3,
        semestre: 2,
        prelaciones: ['4701141','4701131']
    },
    {
        nombre: 'LENGUAJE DE PROGRAMACION I',
        codigo: '4701222',
        UC: 2,
        semestre: 2,
        prelaciones: ['4701131','4705121']
    },
    {
        nombre: 'FISICA I',
        codigo: '4702232',
        UC: 3,
        semestre: 2,
        prelaciones: ['4701141']
    },
    {
        nombre: 'MATEMATICAS III',
        codigo: '4701243',
        UC: 4,
        semestre: 3,
        prelaciones: ['4701242']
    },
    {
        nombre: 'CONTABILIDAD I',
        codigo: '4701233',
        UC: 3,
        semestre: 3,
        prelaciones: []
    },
    {
        nombre: 'LENGUAJE DE PROGRAMACION II',
        codigo: '4701323',
        UC: 2,
        semestre: 3,
        prelaciones: ['4701222']
    },
    {
        nombre: 'INGLES II',
        codigo: '4701223',
        UC: 2,
        semestre: 3,
        prelaciones: ['4701122']
    },
    {
        nombre: 'TEORIA DE SISTEMAS',
        codigo: '4701333',
        UC: 3,
        semestre: 3,
        prelaciones: ['4704121']
    },
    {
        nombre: 'FISICA II',
        codigo: '4702243',
        UC: 4,
        semestre: 3,
        prelaciones: ['4702232','4701242']
    },
    {
        nombre: 'LENGUAJE DE PROGRAMACION III',
        codigo: '4701324',
        UC: 2,
        semestre: 4,
        prelaciones: ['4701323']
    },
    {
        nombre: 'MATEMATICAS IV',
        codigo: '4701244',
        UC: 4,
        semestre: 4,
        prelaciones: ['4701243']
    },
    {
        nombre: 'CONTABILIDAD II',
        codigo: '4701234',
        UC: 3,
        semestre: 4,
        prelaciones: ['4701233']
    },
    {
        nombre: 'ESTADISTICA I',
        codigo: '4702334',
        UC: 3,
        semestre: 4,
        prelaciones: ['4701242']
    },
    {
        nombre: 'ESTRUCTURAS DISCRETAS Y GRAFOS',
        codigo: '4703334',
        UC: 3,
        semestre: 4,
        prelaciones: ['4701242','4701323']
    },
    {
        nombre: 'LABORATORIO DE FISICA',
        codigo: '4701224',
        UC: 2,
        semestre: 4,
        prelaciones: ['4702243']
    },
    {
        nombre: 'ELECTIVA I',
        codigo: '4701334',
        UC: 3,
        semestre: 4,
        prelaciones: []
    },
    {
        nombre: 'PROGRAMACION NUMERICA',
        codigo: '4706335',
        UC: 3,
        semestre: 5,
        semestre: ['4701324','4701244']
    },
    {
        nombre: 'ESTADISTICA II',
        codigo: '4702335',
        UC: 3,
        semestre: 5,
        prelaciones: ['4702334']
    },
    {
        nombre: 'TEORIA DE LA ORGANIZACION',
        codigo: '4701325',
        UC: 2,
        semestre: 5,
        prelaciones: ['4703222','4701333']
    },
    {
        nombre: 'ANALISIS Y DISEÑO DE SISTEMAS',
        codigo: '4703335',
        UC: 3,
        semestre: 5,
        prelaciones: ['4701333']
    },
    {
        nombre: 'BASE DE DATOS',
        codigo: '4704335',
        UC: 3,
        semestre: 5,
        prelaciones: ['4701324','4703334']
    },
    {
        nombre: 'ELECTIVA II',
        codigo: '4701335',
        UC: 3,
        semestre: 5,
        prelaciones: []
    },
    {
        nombre: 'ESTRUCTURA DE DATOS',
        codigo: '4705335',
        UC: 3,
        semestre: 5,
        prelaciones: ['4701324']
    },
    {
        nombre: 'PROGRAMACION NO NUMERICA I',
        codigo: '4703336',
        UC: 3,
        semestre: 6,
        prelaciones: ['4706335']
    },
    {
        nombre: 'TEORIA DE LA INFORMACION',
        codigo: '4701326',
        UC: 2,
        semestre: 6,
        prelaciones: ['4703335','4704335']
    },
    {
        nombre: 'INGENIERIA ECONOMICA',
        codigo: '4702326',
        UC: 2,
        semestre: 6,
        prelaciones: ['4701244','4702222']
    },
    {
        nombre: 'METODOLOGIA DE LA INVESTIGACION',
        codigo: '4701236',
        UC: 3,
        semestre: 6,
        prelaciones: ['4703121']
    },
    {
        nombre: 'SISTEMAS ELECTRICOS',
        codigo: '4702236',
        UC: 3,
        semestre: 6,
        prelaciones: ['4701224']
    },
    {
        nombre: 'SISTEMAS OPERATIVOS I',
        codigo: '4702336',
        UC: 3,
        semestre: 6,
        prelaciones: ['4703335']
    },
    {
        nombre: 'ORGANIZACION DEL COMPUTADOR',
        codigo: '4701226',
        UC: 2,
        semestre: 6,
        prelaciones: ['4701324']
    },
    {
        nombre: 'TALLER DE INDUCCION AL SERVICIO COMUNITARIO',
        codigo: '4700006',
        UC: 0,
        semestre: 6,
        prelaciones: []
    },
    {
        nombre: 'ELECTIVA III',
        codigo: '4701336',
        UC: 3,
        semestre: 6,
        prelaciones: []
    },
    {
        nombre: 'ELECTRONICA DIGITAL',
        codigo: '4703347',
        UC: 4,
        semestre: 7,
        prelaciones: ['4701226','4702236']
    },
    {
        nombre: 'PROGRAMACION NO NUMERICA II',
        codigo: '4703337',
        UC: 3,
        semestre: 7,
        prelaciones: ['4703336']
    },
    {
        nombre: 'PLANIFICACION DE SISTEMAS',
        codigo: '4702337',
        UC: 3,
        semestre: 7,
        prelaciones: ['4703335','4704335']
    },
    {
        nombre: 'SISTEMAS I',
        codigo: '4701327',
        UC: 2,
        semestre: 7,
        prelaciones: ['4703335','4703336']
    },
    {
        nombre: 'INVESTIGACION DE OPERACIONES I',
        codigo: '4704337',
        UC: 3,
        semestre: 7,
        prelaciones: ['4701244','4702335']
    },
    {
        nombre: 'ELECTIVA IV',
        codigo: '4701337',
        UC: 3,
        semestre: 7,
        prelaciones: []
    },
    {
        nombre: 'PROYECTO DE SERVICIO COMUNITARIO',
        codigo: '4700007',
        UC: 0,
        semestre: 7,
        prelaciones: []
    },
    {
        nombre: 'SISTEMAS OPERATIVOS II',
        codigo: '4705337',
        UC: 3,
        semestre: 7,
        prelaciones: ['4702336']
    },
    {
        nombre: 'SISTEMAS II',
        codigo: '4702338',
        UC: 3,
        semestre: 8,
        prelaciones: ['4701327']
    },
    {
        nombre: 'SISTEMAS DE INFORMACION',
        codigo: '4703338',
        UC: 3,
        semestre: 8,
        prelaciones: ['4701326']
    },
    {
        nombre: 'INVESTIGACION DE OPERACIONES II',
        codigo: '4704338',
        UC: 3,
        semestre: 8,
        prelaciones: ['4704337']
    },
    {
        nombre: 'PROYECTO DE SERVICIO COMUNITARIO',
        codigo: '4700008',
        UC: 0,
        semestre: 8,
        prelaciones: []
    },
    {
        nombre: 'SIST. Y PROCEDIMIENTOS ADMINISTRA.',
        codigo: '4702328',
        UC: 2,
        semestre: 8,
        prelaciones: ['4701325']
    },
    {
        nombre: 'ELECTIVA V',
        codigo: '4701338',
        UC: 3,
        semestre: 8,
        prelaciones: []
    },
    {
        nombre: 'SIMULACION DIGITAL',
        codigo: '4701328',
        UC: 2,
        semestre: 8,
        prelaciones: ['4703347']
    },
    {
        nombre: 'OPTIMIZACION DE SISTEMAS Y FUNCIONES',
        codigo: '4703339',
        UC: 3,
        semestre: 9,
        prelaciones: ['4704338']
    },
    {
        nombre: 'AUDITORIA Y EVALUACION DE SISTEMAS',
        codigo: '4704339',
        UC: 3,
        semestre: 9,
        prelaciones: ['4702338']
    },
    {
        nombre: 'ADIMIST. DE SIST. DE INFORMACION',
        codigo: '4702329',
        UC: 2,
        semestre: 9,
        prelaciones: ['4703338']
    },
    {
        nombre: 'DISEÑO Y EVALUACION DE PROYECTOS',
        codigo: '4702339',
        UC: 3,
        semestre: 9,
        prelaciones: ['4704338']
    },
    {
        nombre: 'PROYECTO DE INVESTIGACION',
        codigo: '4701449',
        UC: 4,
        semestre: 9,
        prelaciones: []
    },
    {
        nombre: 'ELECTIVA VI',
        codigo: '4701339',
        UC: 3,
        semestre: 9,
        prelaciones: []
    },
    {
        nombre: 'ETICA Y DEONTOLOGIA PROFESIONAL',
        codigo: '4701329',
        UC: 2,
        semestre: 9,
        prelaciones: []
    },
    {
        nombre: 'TRABAJO DE GRADO',
        codigo: '4714610',
        UC: 6,
        semestre: 10,
        prelaciones: ['4701449']
    },
    {
        nombre: 'PASANTIA',
        codigo: '4714810',
        UC: 8,
        semestre: 10,
        prelaciones: []
    },
];
    
    function toRomano(num){ 
        const romanos = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]; 
        return romanos[num - 1]; 
    }
    
    function ReiniciarEstilos() {
        const grid = document.getElementById('gridContainer');
        const cards = document.querySelectorAll('.asignatura-card');
        
        grid.classList.remove('has-selection');
        cards.forEach(c => {
            c.classList.remove('is-selected', 'is-dependent');
        });
    }

    function ClickAsignatura(codigoSeleccionado, todosLosDatos) {
        const grid = document.getElementById('gridContainer');
        const todasLasCards = document.querySelectorAll('.asignatura-card');
        
        // Si hago click en la misma que ya está seleccionada, reiniciamos todo 
        const cardSeleccionada = document.querySelector(`.asignatura-card[data-codigo="${codigoSeleccionado}"]`);
        if (cardSeleccionada.classList.contains('is-selected')) {
            ReiniciarEstilos();
            return;
        }

        // Limpiar estilos previos
        ReiniciarEstilos();

        // Activar el modo "selección" en la grilla
        grid.classList.add('has-selection');

        // Resaltar la materia clickeada
        cardSeleccionada.classList.add('is-selected');

        // Buscar y resaltar las materias que REQUIEREN esta materia (Dependientes)
        // Buscamos en el array aquellas materias cuya lista prelaciones incluya el código seleccionado
        const materiasDependientes = todosLosDatos.filter(m => 
            m.prelaciones && m.prelaciones.includes(codigoSeleccionado)
        );

        materiasDependientes.forEach(materia => {
            const cardDependiente = document.querySelector(`.asignatura-card[data-codigo="${materia.codigo}"]`);
            if (cardDependiente) {
                cardDependiente.classList.add('is-dependent');
            }
        });
    }

    function MostrarMalla(datos) {
        const gridContainer = document.getElementById('gridContainer');
        
        datos.forEach(asignatura => {
            const contenedorSemestre = document.getElementById(`semestre${asignatura.semestre}`);
            
            if (contenedorSemestre) {
                // Crear Header si no existe
                if (contenedorSemestre.querySelectorAll('.semestre__header').length === 0) {
                    const header = document.createElement('div');
                    header.className = 'semestre__header';
                    header.innerHTML = `<h2>Semestre ${toRomano(asignatura.semestre)}</h2>`;
                    contenedorSemestre.prepend(header);
                }

                const card = document.createElement('div');
                card.className = 'asignatura-card';
                // Guardamos el código en el elemento HTML para buscarlo luego
                card.dataset.codigo = asignatura.codigo; 
                
                card.innerHTML = `
                    <div class="card-header">
                        <span class="codigo-badge">${asignatura.codigo}</span>
                        <span class="uc-badge">${asignatura.UC} UC</span>
                    </div>
                    <div class="nombre-asignatura">${asignatura.nombre}</div>
                `;

                // Evento Click 
                card.addEventListener('click', () => {
                    ClickAsignatura(asignatura.codigo, datos);
                });

                contenedorSemestre.appendChild(card);
            }
        });
    }

    MostrarMalla(pensum);
});