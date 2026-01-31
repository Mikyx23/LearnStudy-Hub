import express from 'express';
export const routerAgenda = express.Router();
import { 
            ObtenerCursosAgendaController, 
            CrearEvaluacionController, 
            ObtenerEvaluacionesController,
            ActualizarEstadoEvaluacionController,
            EliminarEvaluacionController
        } from '../controllers/agenda-controller.js';
import { config } from '../../config.js'
const { lapsoActual } = config;

routerAgenda.get('/', async(req, res) => {
    try{
        const {user} = req.session;
        
        const result = await ObtenerCursosAgendaController(user.id,lapsoActual);
        const result2 = await ObtenerEvaluacionesController(user.id,lapsoActual);

        res.status(200).render('agenda', {
            asignaturas: result.courses || [],
            // evaluaciones: result2.exams || [],
            todasLasEvaluaciones: result2.exams || []
        });
        
    }
    catch(error){
        throw new Error('Error al obtener la agenda');
    }
});

routerAgenda.post('/registrar', async (req, res) => {
    try{
        const { asignatura_id, descripcion, corte, porcentaje, fecha} = req.body;

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

routerAgenda.put('/estado/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const { estado } = req.body;
        console.log(id)

        const result = await ActualizarEstadoEvaluacionController(id, estado);

        if(result.sucess){
            res.status(200).json({redirectUrl: '/api/agenda'});
        }
    }
    catch(error){
        throw new Error('Error al actualizar el estado de la evaluación');
    }
});

routerAgenda.delete('/delete/:id', async (req, res) => {
    try{
        const { id } = req.params;

        const result = await EliminarEvaluacionController(id);

        if(result.sucess){
            res.status(200).json({redirectUrl: '/api/agenda'});
        }
    }
    catch(error){
        throw new Error('Error al eliminar la evaluación');
    }
})