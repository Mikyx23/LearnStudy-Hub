const linkRegistro = document.getElementById('link-registro');
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const linkRecuperar = document.getElementById('link-recuperar');
const formRecuperar = document.getElementById('form-recuperar');
const linkLoginRegistro = document.getElementById('link-login-registro');
const linkLoginRecuperar = document.getElementById('link-login-recuperar');

linkRegistro.addEventListener('click', () => {
    formLogin.classList.add('ocultar');
    formRegistro.classList.remove('ocultar');
});

linkRecuperar.addEventListener('click', () =>{
    formLogin.classList.add('ocultar');
    formRecuperar.classList.remove('ocultar');
});

linkLoginRecuperar.addEventListener('click', () => {
    formRecuperar.classList.add('ocultar');
    formLogin.classList.remove('ocultar');
});

linkLoginRegistro.addEventListener('click', () => {
    formRegistro.classList.add('ocultar');
    formLogin.classList.remove('ocultar');
});