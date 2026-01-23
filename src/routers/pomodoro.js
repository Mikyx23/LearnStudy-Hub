import express from 'express';
export const routerPomodoro = express.Router();
import { ObtenerDatosPomodoroController} from '../controllers/pomodoro-controller.js';
import { config } from '../../config.js';
const { lapsoActual } = config;

routerPomodoro.get('/', async (req,res) => {
    try{
        const {user} = req.session;

        const result = await ObtenerDatosPomodoroController(user.id, lapsoActual);

        if(result.success){
            res.render('pomodoro', {
                data: result.data
            })
        }
        else{
            res.status(500).send(result.message);
        }
    }
    catch(error){
        // throw new Error('Error al obtener el pomodoro');
        console.error(error);
    }
});