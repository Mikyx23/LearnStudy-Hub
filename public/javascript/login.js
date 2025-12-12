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

// Volver al login desde recuperar contraseña
linkVolverLogin.addEventListener('click', () => {
    formRecuperar.classList.add('ocultar');
    formLogin.classList.remove('ocultar');
});

// Ir a recuperar contraseña desde login
linkRecuperar.addEventListener('click', () => {
    formLogin.classList.add('ocultar');
    formRecuperar.classList.remove('ocultar');
});

// Cambiar a formularios de login desde registro
btnLoginFormRegistro.addEventListener('click', () => {
    formRegistro.classList.add('ocultar');
    formLogin.classList.remove('ocultar');
});

// Cambiar a formularios de registro desde login
btnRegistroFormLogin.addEventListener('click', () => {
    formLogin.classList.add('ocultar');
    formRegistro.classList.remove('ocultar');
}); 