// Elementos del DOM

// Botones para cambiar entre formularios
const btnLoginFormRegistro = document.getElementById('btn-login_form-registro');
const btnRegistroFormLogin = document.getElementById('btn-registro_form-login');
// Formularios
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const formRecuperar = document.getElementById('form-recuperar');
// Links para recuperar contraseña y volver al login
const linkRecuperar = document.getElementById('link-recover_form-login');
const linkVolverLogin = document.getElementById('link-recover_form-recuperar');
// selects con las carreras
const selectCarrera1 = document.getElementById('carrer-1-container');
const selectCarrera2 = document.getElementById('carrer-2-container');
// numero de opciones en los selects
const numeroCarreras = document.getElementById('input-num-carreras');
//  Email verificacion
const containerCorreo = document.getElementById('container-email');
const formularioRegistro = document.getElementById('formulario-registro');
const mensajeEmail = document.getElementById('email-message');
//  Div Inputs
const containerInputNombre = document.getElementById('input-container-name');
const containerInputApellido = document.getElementById('input-container-lastname');
const containerInputCedula = document.getElementById('input-container-cedula');
const containerInputContrasena = document.getElementById('input-container-password');
const containerInputConfirmar = document.getElementById('input-container-confirm');
const containerInputContrasenaLogin = document.getElementById('login-container-password');
//  Inputs
const inputNombre = document.getElementById('input-name');
const inputApellido = document.getElementById('input-lastname');
const inputCedula = document.getElementById('register-cedula');
const inputCorreo = document.getElementById('input-email');
const inputContrasena = document.getElementById('register-password');
const inputConfirmar = document.getElementById('input-confirm-password');
const inputCarrera1 = document.getElementById('input-select-carrer-1');
const inputCarrera2 = document.getElementById('input-select-carrer-2');

const mensajePassword = document.getElementById('password-message');
const mensajeCedula = document.getElementById('cedula-message');
const mensajeLogin = document.getElementById('login-message');

const formularioLogin = document.getElementById('formulario-login');
const ojoIcono = document.getElementById('icon-eyes');
const ojoIconoCerrado = document.getElementById('icon-eyes-slash');
const inputLoginPassword = document.getElementById('input-password');

const formularioRecuperarCedula = document.getElementById('form-recuperar-cedula');
const formularioRecuperarRespuesta = document.getElementById('form-recuperar-respuesta');
//  EVENTOS

// Cambiar a formularios de login desde registro
btnLoginFormRegistro.addEventListener('click', () => {
    OcultarElemento(formRegistro);
    MostrarElemento(formLogin);
});

// Cambiar a formularios de registro desde login
btnRegistroFormLogin.addEventListener('click', () => {
    OcultarElemento(formLogin);
    MostrarElemento(formRegistro);
});

ojoIcono.addEventListener('click', () => {
    inputLoginPassword.setAttribute('type', 'text');
    OcultarElemento(ojoIcono);
    MostrarElemento(ojoIconoCerrado);
    inputLoginPassword.focus();
});

ojoIconoCerrado.addEventListener('click', () => {
    inputLoginPassword.setAttribute('type', 'password');
    OcultarElemento(ojoIconoCerrado);
    MostrarElemento(ojoIcono);
    inputLoginPassword.focus();
});

//Mostrar selects
numeroCarreras.addEventListener('change', (event) => {
    const valorSeleccionado = event.target.value;

    if (valorSeleccionado === '1') {
        MostrarElemento(selectCarrera1);
        OcultarElemento(selectCarrera2);
        inputCarrera2.required = false;
    }
    else if (valorSeleccionado === '2') {
        MostrarElemento(selectCarrera1);
        MostrarElemento(selectCarrera2);
        inputCarrera2.required = true;
    }
    else {
        OcultarElemento(selectCarrera1);
        OcultarElemento(selectCarrera2);
        inputCarrera2.required = false;
    }
});

inputNombre.addEventListener('blur', () => {
    ValidarInput(containerInputNombre,inputNombre.value,ValidarNombreApellido);
});

inputApellido.addEventListener('blur', () => {
    ValidarInput(containerInputApellido,inputApellido.value,ValidarNombreApellido);
});

inputCedula.addEventListener('blur', () => {
    if(ValidarCedula(inputCedula.value)){
        CampoValido(containerInputCedula);
        LimpiarError(containerInputCedula,mensajeCedula);
    }
    else if(inputCedula.value.trim().length === 0){
        containerInputCedula.classList.remove('valido');
        containerInputCedula.classList.remove('invalido');
        LimpiarError(containerInputCedula,mensajeCedula);
    }
    else{
        CampoInvalido(containerInputCedula);
    }
});

inputCorreo.addEventListener('blur', () => {
    if(ValidarCorreo(inputCorreo.value)){
        CampoValido(containerCorreo);
        LimpiarError(containerCorreo,mensajeEmail);
    }
    else if(inputCorreo.value.trim().length === 0){
        containerCorreo.classList.remove('valido');
        containerCorreo.classList.remove('invalido');
        LimpiarError(containerCorreo,mensajeEmail);
    }
    else{
        CampoInvalido(containerCorreo);
    }
});

inputContrasena.addEventListener('blur', () => {
    if(ValidarContrasena(inputContrasena.value)){
        CampoValido(containerInputContrasena);
        LimpiarError(containerInputContrasena,mensajePassword);
    }
    else if(inputContrasena.value.trim().length === 0){
        containerInputContrasena.classList.remove('valido');
        containerInputContrasena.classList.remove('invalido');
        LimpiarError(containerInputContrasena,mensajePassword);
    }
    else{
        CampoInvalido(containerInputContrasena);
        MostrarError(containerInputContrasena,mensajePassword);
    }
});

inputConfirmar.addEventListener('blur', () => {
    if(ValidarConfirmar(inputContrasena.value,inputConfirmar.value)){
        CampoValido(containerInputConfirmar);
    }
    else if(inputConfirmar.value.trim().length === 0){
        containerInputConfirmar.classList.remove("valido");
        containerInputConfirmar.classList.remove("invalido");
    }
    else{
        CampoInvalido(containerInputConfirmar);
    }
});

numeroCarreras.addEventListener('keydown', (event) =>{
    const keysPermitidas = [
            'Tab', 'Backspace', 'Delete', 
            'ArrowLeft', 'ArrowRight', 
            'ArrowUp', 'ArrowDown'
        ];

    if(keysPermitidas.includes(event.key)) {
        return; 
    }
    if(event.key.match(/[0-9.]/)) {
        event.preventDefault();
    }
});

formularioLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    OcultarElemento(mensajeLogin);

    const datos = new FormData(event.target);
    const datosJSON = Object.fromEntries(datos.entries());

    try{
        const respuesta = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(datosJSON),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const datosRespuesta = await respuesta.json();
        
        if(!respuesta.ok && datosRespuesta.message === 'Cedula o contrasena invalida'){
            MostrarElemento(mensajeLogin);
        }
        else if(!respuesta.ok){
            alert('Error al iniciar sesion');
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

formularioRegistro.addEventListener('submit', async (event) => {
    if(await !ValidarCampos()){
        return
    }

    event.preventDefault();
    LimpiarError(containerCorreo,mensajeEmail);
    LimpiarError(containerInputCedula,mensajeCedula);

    const datos = new FormData(event.target);
    const datosJSON = Object.fromEntries(datos.entries());
    
    try{
        const respuesta = await fetch('/api/login/registro', {
            method: 'POST',
            body: JSON.stringify(datosJSON),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const datosRespuesta = await respuesta.json();

        if(!respuesta.ok && datosRespuesta.message === 'El correo ya esta registrado'){
            MostrarError(containerCorreo,mensajeEmail);
        }
        else if(!respuesta.ok && datosRespuesta.message === 'La cedula ya esta registrada'){
            MostrarError(containerInputCedula,mensajeCedula);
        }
        else{
            sessionStorage.setItem('cedula',datosRespuesta.cedula);
            if(datosRespuesta.redirectUrl){
                setTimeout(() => {
                    window.location.href = datosRespuesta.redirectUrl;
                },1500)
            }
        }
    }
    catch(error){
        console.error('Error en el registro:', error);
        console.error('Mensaje: ', error.message);
        alert('Error al registrar. Intente de nuevo');
    }
});

// Funciones 

//Ocultar elemento
const OcultarElemento = (elemento) => {
    elemento.classList.add('ocultar');
}

//Mostrar elemento
const MostrarElemento = (elemento) => {
    elemento.classList.remove('ocultar');
}

const MostrarError = (contenedor,mensaje) => {
    MostrarElemento(mensaje);
    contenedor.classList.add('invalido');
}

const LimpiarError = (contenedor,mensaje) => {
    OcultarElemento(mensaje);
    contenedor.classList.remove('invalido');
}

const CampoValido = (elemento) => {
    elemento.classList.remove('invalido');
    elemento.classList.add('valido');
}

const CampoInvalido = (elemento) => {
    elemento.classList.remove('valido');
    elemento.classList.add('invalido');
}

const ValidarInput = (elemento,valor,validar) => {
    if(validar(valor) && valor.length > 0){
        CampoValido(elemento);
    }
    else if(valor.trim().length === 0){
        elemento.classList.remove('valido');
        elemento.classList.remove('invalido');
    }
    else{
        CampoInvalido(elemento);
    }
}

const ValidarNombreApellido = (nombre) => {
    return /^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+$/.test(nombre) && nombre.length > 1;
}

const ValidarCedula = (cedula) => {
    return /^\d+$/.test(cedula) && cedula.length > 7;
}

const ValidarCorreo = (correo) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo);
}

const ValidarContrasena = (contrasena) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[\s\S]{8,}$/.test(contrasena);
}

const ValidarConfirmar = (contrasena,confirmar) => {
    return contrasena === confirmar && contrasena.length > 0;
}

const ValidarCampos = async () => {
    let validos = true;
    if(!ValidarNombreApellido(inputNombre.value)){
        return validos = false;
    }

    if(!ValidarNombreApellido(inputApellido.value)){
        return validos = false;
    }

    if(!ValidarCedula(inputCedula.value)){
        return validos = false;
    }

    if(!ValidarContrasena(inputContrasena.value)){
        return validos = false;
    }

    if(!ValidarConfirmar(inputConfirmar.value)){
        return validos = false;
    }
    return validos;
}