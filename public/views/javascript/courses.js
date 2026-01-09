const formInscripcion = document.getElementById('inscribeForm');

lucide.createIcons();

function toggleModal() {
    document.getElementById('courseModal').classList.toggle('hidden');
}

function selectCourse(element, id) {
    document.querySelectorAll('.course-item').forEach(el => el.classList.remove('border-blue-500', 'bg-blue-50'));
    document.querySelectorAll('.selection-check').forEach(el => el.classList.add('hidden'));
    
    element.classList.add('border-blue-500', 'bg-blue-50');
    element.querySelector('.selection-check').classList.remove('hidden');
    
    document.getElementById('selectedCourseId').value = id;
    const btn = document.getElementById('btnInscribir');
    btn.disabled = false;
    btn.classList.remove('opacity-50', 'cursor-not-allowed');
}

// Buscador en tiempo real dentro del modal
function filterCourses() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let items = document.querySelectorAll('.course-item');
    
    items.forEach(item => {
        let text = item.querySelector('.course-name').innerText.toLowerCase();
        item.style.display = text.includes(input) ? 'flex' : 'none';
    });
}

formInscripcion.addEventListener('submit', async (event) => {
    event.preventDefault();

    const datos = new FormData(event.target);
    const datosJSON = Object.fromEntries(datos.entries());

    try{
        const respuesta = await fetch(`/api/cursos/inscribir`, {
            method: 'POST',
            body: JSON.stringify(datosJSON),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const datosRespuesta = await respuesta.json();

        if(!respuesta.ok){
            alert('Error al inscribir la asignatura');
        }
        else{
            if(datosRespuesta.redirectUrl){
                setTimeout(() => {
                    window.location.href = datosRespuesta.redirectUrl;
                },1500)
            }
        }
    }
    catch(error){
        throw new Error('Ha ocurrido un error inesperado');
    }
});