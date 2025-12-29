// VARIABLES GLOBALES
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------- MODULOS IMPORTADOS -----------
import express from 'express';
import pkg from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from './config.js';
const { json } = pkg;
const app = express();
const PUERTO = process.env.PORT || 3000;

app.disable('x-powered-by');

// ----------- MIDDLEWARES -----------
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));    // Lee datos de entrada en formularios
app.use(express.static(path.join(__dirname, '/public')));   // SERVIR ARCHIVOS ESTÁTICOS desde la carpeta public
app.use(express.json());
app.use(cookieParser());
app.use((req,res,next) => {
    const token = req.cookies.access_token;
    req.session = {user: null}

    try{
        const data = jwt.verify(token, SECRET_JWT_KEY);
        req.session.user = data;
    }catch{}

    next()
});

// ----------- ROUTERS -----------
import {routerLogin} from './src/routers/login.js';
app.use('/api/login', routerLogin);

// ----------- ROUTING -----------
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index/index.html'));
});

import { ObtenerUsuarioController } from './src/controllers/users-controller.js';
app.get('/api/inicio', async (req,res) => {
    const {user} = req.session;
    if(!user) return res.status(403).send('Acceso no autorizado');
    // PAGINA DE INICIO CON LOGUEAR 

    const usuario = await ObtenerUsuarioController(user.id);

    if(!usuario){
        res.send('Usuario no encontrado');
    }
    else{
        res.send(`Bienvenido a LearnStudy Hub ${usuario.nombre} ${usuario.apellido}`);
    }
});

import { ObtenerCarreras } from './src/models/carrers-model.js';
app.get('/api/carreras', async (req, res) => {
    try{
        const carreras = await ObtenerCarreras();
        console.log(carreras)
        return res.json(carreras);
    }catch(error){
        console.error(error);
        res.send('Error al obtener las carreras').status(500);
        throw error;
    }
});

app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en  http://localhost:${PUERTO}`);
});