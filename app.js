// ----------- CONFIGURACIÓN DE ENTORNO Y RUTAS -----------
import { config } from './config.js'; // Importa variables de entorno y configuración global
import path from 'path'; // Módulo nativo para manejar rutas de archivos
import { fileURLToPath } from 'url'; // Utilidad para convertir URLs de módulos en rutas de sistema

// Configuración de __dirname para entornos ESM (ECMAScript Modules)
const __filename = fileURLToPath(import.meta.url); // Obtiene la ruta absoluta del archivo actual
const __dirname = path.dirname(__filename); // Obtiene el directorio base del proyecto
const { port } = config; // Desestructura el puerto definido en la configuración

// ----------- MODULOS IMPORTADOS -----------
import express from 'express'; // Framework principal para el servidor web
import cookieParser from 'cookie-parser'; // Middleware para gestionar y leer cookies del navegador
import { getToken, authenticateUser } from './src/middleware/auth.js'; // Middlewares personalizados de seguridad
const app = express(); // Inicialización de la aplicación Express

// Seguridad: Oculta la cabecera 'x-powered-by' para no revelar que se usa Express
app.disable('x-powered-by');

// ----------- CONFIGURACIÓN DE MIDDLEWARES Y VISTAS -----------
app.set('view engine', 'ejs'); // Define EJS como el motor de plantillas dinámicas
app.set('views', './src/views'); // Establece la ubicación de las vistas/plantillas
app.use(express.urlencoded({ extended: true })); // Procesa datos de formularios (application/x-www-form-urlencoded)
app.use(express.static(path.join(__dirname, '/public'))); // Sirve archivos estáticos (CSS, JS, imágenes) desde /public
app.use(express.json()); // Permite recibir y entender cuerpos de peticiones en formato JSON
app.use(cookieParser()); // Habilita el análisis de cookies en las solicitudes entrantes
app.use(getToken); // Middleware global para extraer o verificar el token en cada petición

// ----------- ENRUTAMIENTO BASE -----------
app.get('/', (req, res) => {
    const {user} = req.session; // Intenta recuperar los datos del usuario de la sesión

    // Si el usuario ya está autenticado, lo redirige al panel principal
    if(user){
        return res.redirect('/api/dashboard');
    }
    // Si no hay sesión, sirve el archivo HTML estático de la página de inicio
    res.sendFile(path.join(__dirname, '/public/index/index.html'));
});

// ----------- ROUTERS PÚBLICOS -----------
import {routerLogin} from './src/routers/login.js';
app.use('/api/login', routerLogin); // Rutas relacionadas con el inicio de sesión

// ----------- BARRERA DE SEGURIDAD -----------
// A partir de aquí, todas las rutas requieren autenticación obligatoria
app.use(authenticateUser); 

// ----------- ROUTERS PRIVADOS (PROTEGIDOS) -----------
import {routerDashboard} from './src/routers/dashboard.js';
app.use('/api/dashboard', routerDashboard); // Panel principal del usuario

import {routerMalla} from './src/routers/malla.js';
app.use('/api/malla', routerMalla); // Gestión de malla curricular

import {routerProfile} from './src/routers/profile.js';
app.use('/api/perfil', routerProfile); // Gestión de perfil de usuario

import {routerCourses} from './src/routers/courses.js';
app.use('/api/cursos', routerCourses); // Gestión de cursos y materias

import {routerAgenda} from './src/routers/agenda.js';
app.use('/api/agenda', routerAgenda); // Gestión de agenda y eventos

import {routerQualifications} from './src/routers/qualifications.js';
app.use('/api/calificaciones', routerQualifications); // Gestión de notas y promedios

import {routerHorario} from './src/routers/horario.js';
app.use('/api/horario', routerHorario); // Gestión del horario semanal

import {routerPomodoro} from './src/routers/pomodoro.js';
app.use('/api/pomodoro', routerPomodoro); // Herramienta de productividad Pomodoro

import {routerCrud} from './src/routers/crud.js';
app.use('/api/crud', routerCrud); // Operaciones generales de Base de Datos

// ----------- CIERRE DE SESIÓN -----------
app.get('/logout', (req, res) =>{
    // Limpia la cookie del token y redirige al inicio
    res.clearCookie('access_token').redirect('/');
});

// ----------- INICIO DEL SERVIDOR -----------
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});