const formRecuperar = document.getElementById('formulario-recuperar');

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

        if(!respuesta.ok){
            alert(datosRespuesta.message);
        }
        else{
            if(datosRespuesta.redirectUrl){
                setTimeout(() => {
                    window.location.href = datosRespuesta.redirectUrl;
                },1500)
            }
        }
    }
    catch{
        throw new Error('Ha ocurrido un error inesperado');
    }
});