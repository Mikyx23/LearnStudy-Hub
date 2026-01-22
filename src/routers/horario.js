import express from 'express';
export const routerHorario = express.Router();
import { ObtenerCursosHorarioController, ObtenerHorarioController, CrearHorarioController } from '../controllers/horario-controller.js';
import { config } from '../../config.js';
const {lapsoActual} = config;

routerHorario.get('/', async (req,res) => {
    try{
        const {user} = req.session;

        const result = await ObtenerCursosHorarioController(user.id, lapsoActual);
        const result2 = await ObtenerHorarioController(user.id, lapsoActual);

        if(result.success){
            res.render('horario', {
                materias: result.courses || [],
                horarios: result2.schedule || [],
                mensaje: false
            })
        }
        else{
            res.render('horario', {
                materias: [],
                horarios: [],
                mensaje: true
            })
        }
    }
    catch(error){
        throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener el horario');
    }
});

routerHorario.post('/guardar', async (req,res) => {
    try{
        const datos = req.body;
        console.log(datos)
        const result = await CrearHorarioController(datos);

        if(result.success){
            res.status(200).json({redirectUrl: '/api/horario'})
        }
        else{
            res.status(500).json({message: result.message});
        }
    }
    catch(error){
        // throw new Error('No se ha podido guardar el horario');
    }
})