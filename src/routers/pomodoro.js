import express from 'express';
export const routerPomodoro = express.Router();
import { ObtenerDatosPomodoroController, CrearSesionPomodoroController } from '../controllers/pomodoro-controller.js';
import { config } from '../../config.js';
const { lapsoActual } = config;

routerPomodoro.get('/', async (req,res) => {
    try{
        const {user} = req.session;

        const result = await ObtenerDatosPomodoroController(user.id, lapsoActual);

        res.render('pomodoro', {
            data: result.data || []
        })
    }
    catch(error){
        // throw new Error('Error al obtener el pomodoro');
        console.error(error);
    }
});

routerPomodoro.post('/guardar', async (req,res) => {
    try{
        const { id_evaluacion, descripcion_sesion, hora_inicio, hora_final, ciclos } = req.body;
        const { user } = req.session;

        const result = await CrearSesionPomodoroController(id_evaluacion, descripcion_sesion, hora_inicio, hora_final, ciclos);

        if(result.success){
            res.status(200).json({redirectUrl: '/api/pomodoro'});
        }
        else{
            res.status(500).send(result.message);
        }
    }
    catch(error){
        throw new Error('Error al guardar el pomodoro');
    }
});