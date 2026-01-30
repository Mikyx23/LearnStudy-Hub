// VARIABLES GLOBALES
import { config } from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { port } = config;

// ----------- MODULOS IMPORTADOS -----------
import express from 'express';
import cookieParser from 'cookie-parser';
import { getToken, authenticateUser } from './src/middleware/auth.js';
const app = express();

app.disable('x-powered-by');

// ----------- MIDDLEWARES -----------
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.urlencoded({ extended: true }));    // Lee datos de entrada en formularios
app.use(express.static(path.join(__dirname, '/public')));   // SERVIR ARCHIVOS ESTÁTICOS desde la carpeta public
app.use(express.json());
app.use(cookieParser());
app.use(getToken);

// ----------- ROUTING -----------
app.get('/', (req, res) => {
    const {user} = req.session;

    if(user){
        return res.redirect('/api/dashboard');
    }
    res.sendFile(path.join(__dirname, '/public/index/index.html'));
});

// ----------- ROUTERS -----------
import {routerLogin} from './src/routers/login.js';
app.use('/api/login', routerLogin);

app.use(authenticateUser);

import {routerDashboard} from './src/routers/dashboard.js';
app.use('/api/dashboard', routerDashboard);

import {routerMalla} from './src/routers/malla.js';
app.use('/api/malla', routerMalla);

import {routerProfile} from './src/routers/profile.js';
app.use('/api/perfil', routerProfile);

import {routerCourses} from './src/routers/courses.js';
app.use('/api/cursos', routerCourses);

import {routerAgenda} from './src/routers/agenda.js';
app.use('/api/agenda', routerAgenda);

import {routerQualifications} from './src/routers/qualifications.js';
app.use('/api/calificaciones', routerQualifications);

import {routerHorario} from './src/routers/horario.js';
app.use('/api/horario', routerHorario);

import {routerPomodoro} from './src/routers/pomodoro.js';
app.use('/api/pomodoro', routerPomodoro);

//CERRAR SESION
app.get('/logout', (req, res) =>{
    res.clearCookie('access_token').redirect('/');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en  http://localhost:${port}`);
});