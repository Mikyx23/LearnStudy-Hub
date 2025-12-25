import express from'express';
import { SECRET_JWT_KEY } from '../../config.js';
export const routerLogin = express.Router();
import path from 'path';
// VARIABLES GLOBALES
import { fileURLToPath } from 'url';
import { CrearUsuarioController, VerificarCorreoController, VerificarCedulaController, VerificarUsuario, ObtenerIdUsuarioController, ActualizarContraseñaController } from '../controllers/users-controller.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import jwt from 'jsonwebtoken';

routerLogin.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/login/login.html'));
});

routerLogin.get('/preguntas-seguridad', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/security-questions/security-questions.html'));
});

routerLogin.get('/recuperar-contrasena', (req,res) => {
    res.sendFile(path.join(__dirname, '../../public/recover-password/recover-password.html'));
});

// Ruta para manejar el POST del formulario
routerLogin.post('/', async (req, res) => {
    const { cedula, password } = req.body;
    
    if(cedula === undefined || cedula === '') return res.status(400).json({message: 'La cedula es invalida'});
    if(password === undefined || password === '') return res.status(400).json({message: 'La contraseña es invalida'});
    
    const result = await VerificarUsuario(cedula,password);
    //  Creando token para info del usuario
    const token = jwt.sign({id: result.id}, SECRET_JWT_KEY, {
        expiresIn: '1h'
    });

    if(result.success){
        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60
        });

        res.status(200).json({
            redirectUrl: '/api/inicio',
        });
    }
    else{
        res.status(400).json({message: 'Cedula o contrasena invalida'});
    }
});

import { CrearInscripcionCarreraController } from '../controllers/inscripcion-controller.js';
routerLogin.post('/registro', async (req,res) => {
    // if(req.body.name === undefined || req.body.name === '') return res.send('El nombre es obligatorio');
    // if(req.body.lastname === undefined || req.body.lastname === '') return res.send('El apellido es obligatorio');
    // if(req.body.cedula === undefined || req.body.cedula === '') return res.send('La cedula es obligatoria');
    // if(req.body.email === undefined || req.body.email === '') return res.send('El correo es obligatorio');
    // if(req.body.password === undefined || req.body.password === '') return res.send('La contraseña es obligatoria');
    // if(req.body.numCarrer === undefined || req.body.numCarrer === '') return res.send('El numero de carreras es obligatorio');

    const cedulaExiste = await VerificarCedulaController(req.body.cedula);
    const correoExiste = await VerificarCorreoController(req.body.email);

    if(cedulaExiste){
        return res.status(400).json({
            success: false,
            message: 'La cedula ya esta registrada'
        });
    }

    if(correoExiste){
        // return res.send('El correo ya esta registrado');
        return res.status(400).json({
            success: false,
            message: 'El correo ya esta registrado'
        });
    }

    if(req.body.numCarrer === '1'){
        const {name, lastname, cedula, email, password, numCarrer, carrer1} = req.body;
        const registro = await CrearUsuarioController(name,lastname,cedula,email,password,numCarrer,carrer1);
        const inscripcion = await CrearInscripcionCarreraController(registro.id, carrer1);

        if(inscripcion.respuesta && registro.respuesta){
            // res.redirect('/');
            res.status(200).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                redirectUrl: '/api/login/preguntas-seguridad',
                cedula: cedula
            });
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
            // res.send('Usuario registrado exitosamente');
            res.status(200).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                redirectUrl: '/api/login/preguntas-seguridad',
                cedula: cedula
            });
        }
        else{
            res.send('Error al registrar');
        }
    }
    else{
        res.send('Error en el numero de carreras');
        return;
    }
});

import { CrearRecuperarContraseñaController, ObtenerPreguntaSeguridadController, ValidarRespuestaSeguridadController } from '../controllers/recover-controller.js';
routerLogin.post('/preguntas-seguridad', async (req,res) => {
    const {cedula} = req.body;
    const {pregunta1,respuesta1,pregunta2,respuesta2,pregunta3,respuesta3} = req.body;
    const id_user = await ObtenerIdUsuarioController(cedula);

    if(!id_user.success){
        return res.status(400).json({
            success: false,
            message: 'Esta cedula no existe'
        })
    }

    const result = await CrearRecuperarContraseñaController(id_user.id,pregunta1,respuesta1,pregunta2,respuesta2,pregunta3,respuesta3)
    
    if(result.success){
        res.status(200).json({
            success: true,
            message: 'Registro exitoso',
            redirectUrl: '/api/login'
        })
    }
    else{
        res.status(400).json({
            success: false,
            message: result.message
        });
    }
});

routerLogin.post('/recover-cedula', async (req,res) => {
    const {cedula} = req.body;
    const id_user = await ObtenerIdUsuarioController(cedula);

    if(!id_user.success){
        return res.status(400).json({
            success: false,
            message: 'Esta cedula no existe'
        })
    }

    const result = await ObtenerPreguntaSeguridadController(id_user.id);

    if(result.success){
        res.status(200).json({
            success: true,
            pregunta: result.questions,
            id: result.id_recover
        })
    }
    else{
        res.status(400).json({
            success: false
        })
    }
});

routerLogin.post('/recover-respuesta', async (req,res) => {
    const { datos: { respuesta }, id } = req.body;

    const result = await ValidarRespuestaSeguridadController(respuesta,id);

    if(result.success){
        res.status(200).json({
            success: true,
            id: result.id
        });
    }
    else{
        res.status(400).json({
            success: false,
            message: 'Respuesta incorrecta. Intenta de nuevo'
        })
    }
});

routerLogin.patch('/recover-contrasena', async (req,res) =>{
    const { datos: { contraseña }, id } = req.body;
    const result = await ActualizarContraseñaController(id,contraseña);

    if(result.success){
        res.status(200).json({
            success: true,
            message: result.message,
            redirectUrl: '/api/login'
        })
    }
    else{
        res.status(400).json({
            success: false,
            message: result.message,
        })
    }
});