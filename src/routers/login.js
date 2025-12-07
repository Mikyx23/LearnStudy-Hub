import express from'express';
export const routerLogin = express.Router();
import path from 'path';
// VARIABLES GLOBALES
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

routerLogin.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/login.html'));
});

// Ruta para manejar el POST del formulario
routerLogin.post('/', (req, res) => {
    const { username, password } = req.body;
    
    // Aquí valida las credenciales (ej. contra una base de datos)
    if (username === 'admin' && password === '1234') {
        res.send('Inicio de sesión exitoso');
    } else {
        res.send('Credenciales incorrectas');
    }
});

import { InsertarUsuarioController } from '../controllers/users-controller.js';
routerLogin.post('/registro', async (req,res) => {
    const {cedula, carrer, name2, password2, email, lastname } = req.body;

    const registro = await InsertarUsuarioController(cedula,carrer,name2,lastname,email,password2);

    if(registro.respuesta === true){
        res.send(registro.mensaje);
    }
    else{
        res.send(registro.mensaje)
    }
});