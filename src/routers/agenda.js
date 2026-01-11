import express from 'express';
export const routerAgenda = express.Router();
import { ObtenerCursosAgendaController, CrearEvaluacionController, ObtenerEvaluacionesController } from '../controllers/agenda-controller.js';
import { config } from '../../config.js'
const { lapsoActual } = config;

routerAgenda.get('/', async(req, res) => {
    try{
        const {user} = req.session;
        
        const result = await ObtenerCursosAgendaController(user.id,lapsoActual);
        const result2 = await ObtenerEvaluacionesController(user.id,lapsoActual);

        if(result.sucess){
            res.status(200).render('agenda', {
                asignaturas: result.courses || [],
                evaluaciones: result2.exams || [],
                todasLasEvaluaciones: result2.exams || []
            });
        }
        else{
            res.status(404).send(result.message);
        }
    }
    catch(error){
        throw new Error('Error al obtener la agenda');
    }
});

routerAgenda.post('/registrar', async (req, res) => {
    try{
        const { asignatura_id, descripcion, corte, porcentaje, fecha} = req.body;
        console.log(asignatura_id, descripcion, corte, porcentaje, fecha);

        const result = await CrearEvaluacionController(asignatura_id, descripcion, corte, porcentaje, fecha);

        if(result.sucess){
            res.status(200).json({redirectUrl: '/api/agenda'});
        }
        else{
            res.status(404).send(result.message); 
        }
    }
    catch(error){
        throw new Error('Error al registrar la evaluación');
    }
});