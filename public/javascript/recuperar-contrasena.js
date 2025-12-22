const formCedula = document.getElementById('form-recuperar-cedula');
const formRespuesta = document.getElementById('form-recuperar-respuesta');
const formContraseña = document.getElementById('form-recuperar-contraseña');

const inputCedula = document.getElementById('recover-cedula');
const inputRespuesta = document.getElementById('recover-respuesta');
const inputContraseña = document.getElementById('recover-contraseña');

const parrafoPregunta = document.getElementById('pregunta-seguridad');

const mensajeRespuesta = document.getElementById('response-message');

const formCedulaContainer = document.getElementById('form-cedula-container');
const formRespuestaContainer = document.getElementById('form-respuesta-container');
const formContraseñaContainer = document.getElementById('form-contraseña-container');

formCedula.addEventListener('submit', async (event) =>{
    event.preventDefault();

    const datos = new FormData(event.target);
    const datosJSON = Object.fromEntries(datos.entries());

    try{
        const respuesta = await fetch('/api/login/recover-cedula', {
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
            sessionStorage.setItem('recuperacion', datosRespuesta.id);
            parrafoPregunta.textContent = `Pregunta: ${datosRespuesta.pregunta}`;
            OcultarElemento(formCedulaContainer);
            MostrarElemento(formRespuestaContainer);
            if(datosRespuesta.redirectUrl){
                setTimeout(() => {
                    window.location.href = datosRespuesta.redirectUrl;
                },1500)
            }
        }
    }
    catch(error){
        // throw new Error('Ha ocurrido un error inesperado');
        console.error('Detalles del error:', error);
    }
});

formRespuesta.addEventListener('submit', async (event) => {
    event.preventDefault();

    const datos = new FormData(event.target);
    const datosJSON = Object.fromEntries(datos.entries());

    const idGuardado = sessionStorage.getItem('recuperacion');

    const datosPeticion = {
        datos: datosJSON,
        id: idGuardado
    }

    try{
        const respuesta = await fetch('/api/login/recover-respuesta', {
            method: 'POST',
            body: JSON.stringify(datosPeticion),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const datosRespuesta = await respuesta.json();

        if(!respuesta.ok){
            MostrarElemento(mensajeRespuesta);
        }
        else{
            sessionStorage.setItem('usuario',datosRespuesta.id);
            OcultarElemento(formRespuestaContainer);
            MostrarElemento(formContraseñaContainer);
            if(datosRespuesta.redirectUrl){
                setTimeout(() => {
                    window.location.href = datosRespuesta.redirectUrl;
                },1500)
            }
        }
    }
    catch(error){
        // throw new Error('Ha ocurrido un error inesperado');
        console.error(error)
    }
});

formContraseña.addEventListener('submit', async (event) => {
    event.preventDefault();

    const datos = new FormData(event.target);
    const datosJSON = Object.fromEntries(datos.entries());

    const idGuardado = sessionStorage.getItem('usuario');

    const datosPeticion = {
        datos: datosJSON,
        id: idGuardado
    }

    try{
        const respuesta = await fetch('/api/login/recover-contrasena', {
            method: 'PATCH',
            body: JSON.stringify(datosPeticion),
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
    catch(error){
        throw new Error('Ha ocurrido un error inesperado');
    }
});

const OcultarElemento = (elemento) => {
    elemento.classList.add('ocultar');
}

//Mostrar elemento
const MostrarElemento = (elemento) => {
    elemento.classList.remove('ocultar');
}

const ValidarCedula = (cedula) => {
    return /^\d+$/.test(cedula) && cedula.length > 7;
}