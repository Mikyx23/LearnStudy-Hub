import express from 'express';
export const routerQualifications = express.Router();
import { 
    ObtenerCursosCalificacionesController, 
    ObtenerEvaluacionesCalificacionesController, 
    InsertarCalificacionController,
    ObtenerMallaCalificacionesController,
    ObtenerHistorialAcademicoController,
    InsertarHistorialAcademicoController,
    ObtenerLapsosAcademicosController
} from '../controllers/qualifications-controller.js';
import { config } from '../../config.js';
const { lapsoActual } = config;

routerQualifications.get('/', async (req,res) => {
    try{
        const {user} = req.session;

        const result2 = await ObtenerCursosCalificacionesController(user.carrer,user.id,lapsoActual);
        const result3 = await ObtenerEvaluacionesCalificacionesController(user.carrer,user.id,lapsoActual);
        const result4 = await ObtenerMallaCalificacionesController(user.carrer);
        const result5 = await ObtenerHistorialAcademicoController(user.id);
        const result6 = await ObtenerLapsosAcademicosController();
        
        if(result2.success || result3.success){
            res.render('qualifications', {
                cursos: result2.courses || [],
                evaluaciones: result3.exams || [],
                userData: res.userData,
                pensum: result4.malla || [],
                historial: result5.history || [],
                lapsos: result6.lapsos || []
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

routerQualifications.post('/historial-guardar', async (req,res) => {
    try{
        const { id_usuario, periodo, codigo, materia, nota, estado } = req.body;
        console.log(req.body);

        const result = await InsertarHistorialAcademicoController(id_usuario, periodo, codigo, materia, nota, estado);

        if(result.success){
            res.status(200).json({redirectUrl: '/api/calificaciones'});
        }
        else{
            res.status(404).send(result.message);
        }
    }
    catch(error){
        // throw new Error('Error al registrar el historial académico');
        console.log(error);
    }
});