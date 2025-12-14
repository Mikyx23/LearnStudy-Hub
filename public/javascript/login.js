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

//  Eventos

//Mostrar selects
numeroCarreras.addEventListener('change', (event) => {
    const valorSeleccionado = event.target.value;

    if (valorSeleccionado === '1') {
        MostrarElemento(selectCarrera1);
        OcultarElemento(selectCarrera2);
    }
    else if (valorSeleccionado === '2') {
        MostrarElemento(selectCarrera1);
        MostrarElemento(selectCarrera2);
    }
    else {
        OcultarElemento(selectCarrera1);
        OcultarElemento(selectCarrera2);
    }
});

// Volver al login desde recuperar contraseña
linkVolverLogin.addEventListener('click', () => {
    OcultarElemento(formRecuperar);
    MostrarElemento(formLogin);
});

// Ir a recuperar contraseña desde login
linkRecuperar.addEventListener('click', () => {
    OcultarElemento(formLogin);
    MostrarElemento(formRecuperar);
});

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

// Funciones 

//Ocultar elemento
const OcultarElemento = (elemento) => {
    elemento.classList.add('ocultar');
}

//Mostrar elemento
const MostrarElemento = (elemento) => {
    elemento.classList.remove('ocultar');
}