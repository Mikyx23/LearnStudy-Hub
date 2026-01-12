import express from 'express';
export const routerQualifications = express.Router();
import { 
    ObtenerCursosCalificacionesController, 
    ObtenerEvaluacionesCalificacionesController, 
    InsertarCalificacionController
} from '../controllers/qualifications-controller.js';
import { config } from '../../config.js';
const { lapsoActual } = config;

routerQualifications.get('/', async (req,res) => {
    try{
        const {user} = req.session;

        const result2 = await ObtenerCursosCalificacionesController(user.id,lapsoActual);
        const result3 = await ObtenerEvaluacionesCalificacionesController(user.id,lapsoActual);

        if(result2.success || result3.success){
            res.render('qualifications', {
                cursos: result2.courses || [],
                evaluaciones: result3.exams || [],
                mensaje: false
            });
        }
        else if(!result2.success && result2.message === 'No se ha podido obtener los cursos de las calificaciones'){
            res.render('qualifications', {
                cursos: result2.courses || [],
                evaluaciones: result3.exams || [],
                mensaje: true
            });
        }
        else{
            res.status(404).send(result2.message || result3.message);
        }
    }
    catch(error){
        console.log(error);
        throw new Error('Error al obtener las calificaciones');
    }
});

routerQualifications.post('/registrar', async (req,res) => {
    try{
        const { id_curso, id_evaluacion, calificacion } = req.body;

        const result = await InsertarCalificacionController(id_curso, id_evaluacion, calificacion);

        if(result.success){
            res.status(200).json({redirectUrl: '/api/calificaciones'});
        }
        else{
            res.status(404).send(result.message);
        }
    }
    catch(error){
        throw new Error('Error al registrar la calificación');
    }
});