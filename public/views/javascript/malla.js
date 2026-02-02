import {toRomano} from '/utils/utils.js';

function ClickAsignatura(codigoSeleccionado) {
    const codStr = String(codigoSeleccionado);
    const grid = document.getElementById('gridContainer');
    const cardSeleccionada = document.querySelector(`.asignatura-card[data-codigo="${codStr}"]`);

    if (!cardSeleccionada) return;
    if (cardSeleccionada.classList.contains('is-selected')) {
        ReiniciarEstilos();
        return;
    }

    ReiniciarEstilos();
    grid.classList.add('has-selection');
    cardSeleccionada.classList.add('is-selected');

    // Buscamos la materia en el array 'pensum'
    const materiaData = pensum.find(m => m.codigo === codStr);

    if (materiaData) {
        // --- 1. Requisitos y Correquisitos (Resaltado Visual) ---
        materiaData.requisitos.forEach(r => {
            const el = document.querySelector(`.asignatura-card[data-codigo="${r}"]`);
            if (el) el.classList.add('is-requisito');
        });

        materiaData.correquisitos.forEach(c => {
            const el = document.querySelector(`.asignatura-card[data-codigo="${c}"]`);
            if (el) el.classList.add('is-correquisito');
        });

        // --- 2. SMA (Semestre Aprobado) y Cálculo de UC Acumuladas ---
        let mensajes = [];

        if (materiaData.SMA && materiaData.SMA > 0) {
            // Resaltar el contenedor del semestre requerido
            const semestreDiv = document.getElementById(`semestre${materiaData.SMA}`);
            if (semestreDiv) {
                semestreDiv.classList.add('semestre-requerido');
            }

            // Lógica de suma: Filtramos materias de semestres anteriores o igual al SMA
            const ucAcumuladas = pensum
                .filter(m => m.semestre !== null && m.semestre <= materiaData.SMA)
                .reduce((sum, m) => sum + Number(m.UC || 0), 0);

            mensajes.push(`Requiere haber aprobado el Semestre ${toRomano(materiaData.SMA)} completo (${ucAcumuladas} UC acumuladas).`);
        }

        // --- 3. Otras Alertas ---
        if (materiaData.UCA > 0) {
            mensajes.push(`Requiere ${materiaData.UCA} UC aprobadas en total.`);
        }

        // --- 4. Mostrar Mensajes en Pantalla ---
        const alerta = document.getElementById('info-alerta');
        if (alerta) {
            if (mensajes.length > 0) {
                alerta.innerHTML = mensajes.join('<br>');
                alerta.classList.remove('d-none');
            } else {
                alerta.classList.add('d-none');
            }
        }
    }
}

function ReiniciarEstilos() {
    const grid = document.getElementById('gridContainer');
    if (grid) grid.classList.remove('has-selection');
    
    document.querySelectorAll('.asignatura-card').forEach(c => {
        c.classList.remove('is-selected', 'is-requisito', 'is-correquisito');
    });

    document.querySelectorAll('.malla__semestre').forEach(s => {
        s.classList.remove('semestre-requerido');
    });

    const alerta = document.getElementById('info-alerta');
    if (alerta) alerta.classList.add('d-none');
}

window.ClickAsignatura = ClickAsignatura;
window.ReiniciarEstilos = ReiniciarEstilos;