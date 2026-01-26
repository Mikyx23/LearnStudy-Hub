const formRecuperar = document.getElementById('formulario-recuperar');
const mensajeCedula = document.getElementById('cedula-message');
const inputCedula = document.getElementById('input-cedula');

inputCedula.value = sessionStorage.getItem('cedula');

formRecuperar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = new FormData(e.target);
    const datosJSON = Object.fromEntries(datos.entries());

    try{
        const respuesta = await fetch('/api/login/preguntas-seguridad', {
            method: 'POST',
            body: JSON.stringify(datosJSON),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const datosRespuesta = await respuesta.json();

        if(!datosRespuesta.success && datosRespuesta.message === 'Esta cedula no existe'){
            MostrarElemento(mensajeCedula);
        }
        else if(!respuesta.ok){
            alert(datosRespuesta.message);
        }
        else{
            sessionStorage.removeItem('cedula');
            if(datosRespuesta.redirectUrl){
                setTimeout(() => {
                    window.location.href = datosRespuesta.redirectUrl;
                },1500)
            }
        }
    }
    catch{
        Swal.fire({
            icon: "error",
            title: "¡Error de conexión!",
            text: "No se pudo establecer comunicación con el servidor. Por favor, verifica tu internet.",
            confirmButtonText: "Reintentar",
            confirmButtonColor: "#d33",
        });
    }
});

const OcultarElemento = (elemento) => {
    elemento.classList.add('ocultar');
}

//Mostrar elemento
const MostrarElemento = (elemento) => {
    elemento.classList.remove('ocultar');
}