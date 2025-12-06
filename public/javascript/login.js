const linkRegistro = document.getElementById('link-registro');
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');

linkRegistro.addEventListener('click', () => {
    formLogin.classList.add('ocultar');
    formRegistro.classList.remove('ocultar');
});