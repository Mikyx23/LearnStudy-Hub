document.addEventListener('DOMContentLoaded', () => {
        const pensum = [
    {
        nombre: 'LENGUAJE Y COMUNICACION',
        codigo: '4701121',
        UC: 2,
        semestre: 1
    },
    {
        nombre: 'METODOLOGIA DE LA INVESTIGACION',
        codigo: '4703121',
        UC: 2,
        semestre: 1
    },
    {
        nombre: 'MATEMATICAS I',
        codigo: '4701141',
        UC: 4,
        semestre: 1
    },
    {
        nombre: 'ACTIVIDAD DE ORIENTACION',
        codigo: '4702121',
        UC: 2,
        semestre: 1
    },
    {
        nombre: 'EDUCACION, SALUD FISICA Y DEPORTE I',
        codigo: '4702111',
        UC: 1,
        semestre: 1
    },
    {
        nombre: 'ACTIVIDAD DE FORMACION CULTURAL I',
        codigo: '4701111',
        UC: 1,
        semestre: 1
    },
    {
        nombre: 'INTRODUCCION A LA INGENIERIA DE SISTEMAS',
        codigo: '4704121',
        UC: 2,
        semestre: 1
    },
    {
        nombre: 'ALGEBRA I',
        codigo: '4701131',
        UC: 3,
        semestre: 1
    },
    {
        nombre: 'INTRODUCCION A LA COMPUTACION',
        codigo: '4701131',
        UC: 2,
        semestre: 1
    },
    {
        nombre: 'INTRODUCCION A LA ADMINISTRACION',
        codigo: '4703222',
        UC: 2,
        semestre: 2
    },
    {
        nombre: 'ECONOMIA GENERAL',
        codigo: '4702222',
        UC: 2,
        semestre: 2
    },
    {
        nombre: 'MATEMATICAS II',
        codigo: '4701242',
        UC: 4,
        semestre: 2
    },
    {
        nombre: 'EDUCACION, SALUD FISICA Y DEPORTE II',
        codigo: '4702112',
        UC: 1,
        semestre: 2
    },
    {
        nombre: 'ACTIVIDAD DE FORMACION CULTURAL II',
        codigo: '4701112',
        UC: 1,
        semestre: 2
    },
    {
        nombre: 'INGLES I',
        codigo: '4701122',
        UC: 2,
        semestre: 2
    },
    {
        nombre: 'ALGEBRA LINEAL',
        codigo: '4701232',
        UC: 3,
        semestre: 2
    },
    {
        nombre: 'LENGUAJE DE PROGRAMACION I',
        codigo: '4701222',
        UC: 2,
        semestre: 2
    },
    {
        nombre: 'FISICA I',
        codigo: '4702232',
        UC: 3,
        semestre: 2
    },
    {
        nombre: 'MATEMATICAS III',
        codigo: '4701243',
        UC: 4,
        semestre: 3
    },
    {
        nombre: 'CONTABILIDAD I',
        codigo: '4701233',
        UC: 3,
        semestre: 3
    },
    {
        nombre: 'LENGUAJE DE PROGRAMACION II',
        codigo: '4701323',
        UC: 2,
        semestre: 3
    },
    {
        nombre: 'INGLES II',
        codigo: '4701223',
        UC: 2,
        semestre: 3
    },
    {
        nombre: 'TEORIA DE SISTEMAS',
        codigo: '4701333',
        UC: 3,
        semestre: 3
    },
    {
        nombre: 'FISICA II',
        codigo: '4702243',
        UC: 4,
        semestre: 3
    },
    {
        nombre: 'LENGUAJE DE PROGRAMACION III',
        codigo: '4701324',
        UC: 2,
        semestre: 4
    },
    {
        nombre: 'MATEMATICAS IV',
        codigo: '4701244',
        UC: 4,
        semestre: 4
    },
    {
        nombre: 'CONTABILIDAD II',
        codigo: '4701234',
        UC: 3,
        semestre: 4
    },
    {
        nombre: 'ESTADISTICA I',
        codigo: '4702334',
        UC: 3,
        semestre: 4
    },
    {
        nombre: 'ESTRUCTURAS DISCRETAS Y GRAFOS',
        codigo: '4703334',
        UC: 3,
        semestre: 4
    },
    {
        nombre: 'LABORATORIO DE FISICA',
        codigo: '4701224',
        UC: 2,
        semestre: 4
    },
    {
        nombre: 'ELECTIVA I',
        codigo: '4701334',
        UC: 3,
        semestre: 4
    },
    {
        nombre: 'PROGRAMACION NUMERICA',
        codigo: '4706335',
        UC: 3,
        semestre: 5
    },
    {
        nombre: 'ESTADISTICA II',
        codigo: '4702335',
        UC: 3,
        semestre: 5
    },
    {
        nombre: 'TEORIA DE LA ORGANIZACION',
        codigo: '4701325',
        UC: 2,
        semestre: 5
    },
    {
        nombre: 'ANALISIS Y DISEÑO DE SISTEMAS',
        codigo: '4703335',
        UC: 3,
        semestre: 5
    },
    {
        nombre: 'BASE DE DATOS',
        codigo: '4704335',
        UC: 3,
        semestre: 5
    },
    {
        nombre: 'ELECTIVA II',
        codigo: '4701335',
        UC: 3,
        semestre: 5
    },
    {
        nombre: 'ESTRUCTURA DE DATOS',
        codigo: '4705335',
        UC: 3,
        semestre: 5
    },
    {
        nombre: 'PROGRAMACION NO NUMERICA I',
        codigo: '4703336',
        UC: 3,
        semestre: 6
    },
    {
        nombre: 'TEORIA DE LA INFORMACION',
        codigo: '4701326',
        UC: 2,
        semestre: 6
    },
    {
        nombre: 'INGENIERIA ECONOMICA',
        codigo: '4702326',
        UC: 2,
        semestre: 6
    },
    {
        nombre: 'METODOLOGIA DE LA INVESTIGACION',
        codigo: '4701236',
        UC: 3,
        semestre: 6
    },
    {
        nombre: 'SISTEMAS ELECTRICOS',
        codigo: '4702236',
        UC: 3,
        semestre: 6
    },
    {
        nombre: 'SISTEMAS OPERATIVOS I',
        codigo: '4702336',
        UC: 3,
        semestre: 6
    },
    {
        nombre: 'ORGANIZACION DEL COMPUTADOR',
        codigo: '4701226',
        UC: 2,
        semestre: 6
    },
    {
        nombre: 'TALLER DE INDUCCION AL SERVICIO COMUNITARIO',
        codigo: '4700006',
        UC: 0,
        semestre: 6
    },
    {
        nombre: 'ELECTIVA III',
        codigo: '4701336',
        UC: 3,
        semestre: 6
    },
    {
        nombre: 'ELECTRONICA DIGITAL',
        codigo: '4703347',
        UC: 4,
        semestre: 7
    },
    {
        nombre: 'PROGRAMACION NO NUMERICA II',
        codigo: '4703337',
        UC: 3,
        semestre: 7
    },
    {
        nombre: 'PLANIFICACION DE SISTEMAS',
        codigo: '4702337',
        UC: 3,
        semestre: 7
    },
    {
        nombre: 'SISTEMAS I',
        codigo: '4701327',
        UC: 2,
        semestre: 7
    },
    {
        nombre: 'INVESTIGACION DE OPERACIONES I',
        codigo: '4704337',
        UC: 3,
        semestre: 7
    },
    {
        nombre: 'ELECTIVA IV',
        codigo: '4701337',
        UC: 3,
        semestre: 7
    },
    {
        nombre: 'PROYECTO DE SERVICIO COMUNITARIO',
        codigo: '4700007',
        UC: 0,
        semestre: 7
    },
    {
        nombre: 'SISTEMAS OPERATIVOS II',
        codigo: '4705337',
        UC: 3,
        semestre: 7
    },
    {
        nombre: 'SISTEMAS II',
        codigo: '4702338',
        UC: 3,
        semestre: 8
    },
    {
        nombre: 'SISTEMAS DE INFORMACION',
        codigo: '4703338',
        UC: 3,
        semestre: 8
    },
    {
        nombre: 'INVESTIGACION DE OPERACIONES II',
        codigo: '4704338',
        UC: 3,
        semestre: 8
    },
    {
        nombre: 'PROYECTO DE SERVICIO COMUNITARIO',
        codigo: '4700008',
        UC: 0,
        semestre: 8
    },
    {
        nombre: 'SIST. Y PROCEDIMIENTOS ADMINISTRA.',
        codigo: '4702328',
        UC: 2,
        semestre: 8
    },
    {
        nombre: 'ELECTIVA V',
        codigo: '4701338',
        UC: 3,
        semestre: 8
    },
    {
        nombre: 'SIMULACION DIGITAL',
        codigo: '4701328',
        UC: 2,
        semestre: 8
    },
    {
        nombre: 'OPTIMIZACION DE SISTEMAS Y FUNCIONES',
        codigo: '4703339',
        UC: 3,
        semestre: 9
    },
    {
        nombre: 'AUDITORIA Y EVALUACION DE SISTEMAS',
        codigo: '4704339',
        UC: 3,
        semestre: 9
    },
    {
        nombre: 'ADIMIST. DE SIST. DE INFORMACION',
        codigo: '4702329',
        UC: 2,
        semestre: 9
    },
    {
        nombre: 'DISEÑO Y EVALUACION DE PROYECTOS',
        codigo: '4702339',
        UC: 3,
        semestre: 9
    },
    {
        nombre: 'PROYECTO DE INVESTIGACION',
        codigo: '4701449',
        UC: 4,
        semestre: 9
    },
    {
        nombre: 'ELECTIVA VI',
        codigo: '4701339',
        UC: 3,
        semestre: 9
    },
    {
        nombre: 'ETICA Y DEONTOLOGIA PROFESIONAL',
        codigo: '4701329',
        UC: 2,
        semestre: 9
    },
    {
        nombre: 'TRABAJO DE GRADO',
        codigo: '4714610',
        UC: 6,
        semestre: 10
    },
    {
        nombre: 'PASANTIA',
        codigo: '4714810',
        UC: 8,
        semestre: 10
    },
];

    function toRomano(num) {
        const romans = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
        return romans[num - 1];
    }

    function renderizarMalla(datos) {
        let globalIndex = 0; // Para controlar el retraso de la animación

        datos.forEach(asignatura => {
            const contenedorSemestre = document.getElementById(`semestre${asignatura.semestre}`);

            if (contenedorSemestre.children.length === 0) {
            const header = document.createElement('div');
                header.className = 'semestre__header';
                header.innerHTML = `<h2>Semestre ${toRomano(asignatura.semestre)}</h2>`;
                contenedorSemestre.appendChild(header);
            }

            const card = document.createElement('div');
            card.className = 'asignatura-card';
            card.style.animationDelay = `${globalIndex * 0.02}s`; 

            card.innerHTML = `
                <div class="card-header">
                    <span class="codigo-badge">${asignatura.codigo}</span>
                    <span class="uc-badge">${asignatura.UC} UC</span>
                </div>
                <div class="nombre-asignatura">${asignatura.nombre}</div>
            `;

            contenedorSemestre.appendChild(card);
            globalIndex++;
        });
    }
    renderizarMalla(pensum);
});