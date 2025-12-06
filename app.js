// VARIABLES GLOBALES
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------- MODULOS IMPORTADOS -----------
import express from 'express';
import pkg from 'body-parser';
const { json } = pkg;
const app = express();
const PUERTO = process.env.PORT || 3000;

app.disable('x-powered-by');

// ----------- MIDDLEWARES -----------
app.use(express.urlencoded({ extended: true }));    // Lee datos de entrada en formularios
app.use(express.static(path.join(__dirname, '/public')));   // SERVIR ARCHIVOS ESTÁTICOS desde la carpeta public
app.use(express.json());

// ----------- ROUTERS -----------
import {routerLogin} from './src/routers/login.js';
app.use('/api/login', routerLogin);

// ----------- ROUTING -----------
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/index.html'));
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