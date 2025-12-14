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

import { CrearUsuarioController } from '../controllers/users-controller.js';
import { CrearInscripcionCarreraController } from '../controllers/inscripcion-controller.js';
routerLogin.post('/registro', async (req,res) => {
    if(req.body.name === undefined || req.body.name === '') return res.send('El nombre es obligatorio');
    if(req.body.lastname === undefined || req.body.lastname === '') return res.send('El apellido es obligatorio');
    if(req.body.cedula === undefined || req.body.cedula === '') return res.send('La cedula es obligatoria');
    if(req.body.email === undefined || req.body.email === '') return res.send('El correo es obligatorio');
    if(req.body.password === undefined || req.body.password === '') return res.send('La contraseña es obligatoria');
    if(req.body.numCarrer === undefined || req.body.numCarrer === '') return res.send('El numero de carreras es obligatorio');

    if(req.body.numCarrer === '1'){
        const {name, lastname, cedula, email, password, numCarrer, carrer1} = req.body;
        const registro = await CrearUsuarioController(name,lastname,cedula,email,password,numCarrer,carrer1);
        const inscripcion = await CrearInscripcionCarreraController(registro.id, carrer1);

        if(inscripcion.respuesta && registro.respuesta){
            res.send('Usuario registrado exitosamente');
        }
        else{
            res.send('Error al registrar al usuario o la inscripcion a la carrera');
        }
    }
    else if(req.body.numCarrer === '2'){
        const {name, lastname, cedula, email, password, numCarrer, carrer1, carrer2} = req.body;
        const registro = await CrearUsuarioController(name,lastname,cedula,email,password,numCarrer,carrer1,carrer2);
        const inscripcion1 = await CrearInscripcionCarreraController(registro.id, carrer1);
        const inscripcion2 = await CrearInscripcionCarreraController(registro.id, carrer2);

        if(inscripcion1.respuesta && inscripcion2.respuesta && registro.respuesta){
            res.send('Usuario registrado exitosamente');
        }
        else{
            res.send('Error al registrar al usuario o las inscripciones a las carreras');
        }
    }
    else{
        res.send('Error en el numero de carreras');
        return;
    }
});