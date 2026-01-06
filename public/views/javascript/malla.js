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

    const materiaData = pensum.find(m => m.codigo === codStr);

    if (materiaData) {
        // --- 1. Requisitos y Correquisitos ---
        materiaData.requisitos.forEach(r => {
            const el = document.querySelector(`.asignatura-card[data-codigo="${r}"]`);
            if (el) el.classList.add('is-requisito');
        });

        materiaData.correquisitos.forEach(c => {
            const el = document.querySelector(`.asignatura-card[data-codigo="${c}"]`);
            if (el) el.classList.add('is-correquisito');
        });

        // --- 2. Lógica de SMA (Solo el semestre indicado) ---
        if (materiaData.SMA > 0) {
            // Buscamos directamente el contenedor del semestre específico
            const semestreDiv = document.getElementById(`semestre${materiaData.SMA}`);
            if (semestreDiv) {
                semestreDiv.classList.add('semestre-requerido');
            }
        }

        // --- 3. Alertas ---
        const alerta = document.getElementById('info-alerta');
        let mensajes = [];
        if (materiaData.UCA > 0) mensajes.push(`Requiere ${materiaData.UCA} UC aprobadas.`);
        if (materiaData.SMA > 0) mensajes.push(`Requiere haber aprobado el Semestre ${toRomano(materiaData.SMA)} completo.`);

        if (mensajes.length > 0) {
            alerta.innerHTML = mensajes.join('<br>');
            alerta.classList.remove('d-none');
        }
    }
}

// IMPORTANTE: Asegúrate de que ReiniciarEstilos limpie la clase
function ReiniciarEstilos() {
    const grid = document.getElementById('gridContainer');
    grid.classList.remove('has-selection');
    
    document.querySelectorAll('.asignatura-card').forEach(c => {
        c.classList.remove('is-selected', 'is-requisito', 'is-correquisito');
    });

    // Limpiamos el resaltado del semestre
    document.querySelectorAll('.malla__semestre').forEach(s => {
        s.classList.remove('semestre-requerido');
    });

    const alerta = document.getElementById('info-alerta');
    if (alerta) alerta.classList.add('d-none');
}

window.ClickAsignatura = ClickAsignatura;
window.ReiniciarEstilos = ReiniciarEstilos;