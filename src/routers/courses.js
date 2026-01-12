import express from 'express';
export const routerCourses = express.Router();
import { ObtenerCursosController, ObtenerCursosDisponiblesController, InsertarCursoController } from '../controllers/courses-controller.js';
import { config } from '../../config.js';
const { lapsoActual } = config;
import { CalculateCredits } from '../../public/utils/utils.js';

routerCourses.get('/', async (req,res) => {
    const {user} = req.session;

    const result = await ObtenerCursosController(user.id,lapsoActual);
    const result2 = await ObtenerCursosDisponiblesController(user.id,lapsoActual,user.carrer);
    const creditosInscritos = await CalculateCredits(result.courses);

    if(result.success || result2.success){
        res.render('courses', { 
            misAsignaturas: result.courses || [],
            disponibles: result2.availables || [],
            creditosInscritos: creditosInscritos || 0
        });
    }
});

routerCourses.post('/inscribir', async (req,res) => {
    const {user} = req.session;
    const { asignaturaId } = req.body;

    if(isNaN(asignaturaId)){
        return res.status(400).json({
            sucess: false,
            message: 'La asignatura no existe'
        });
    }

    const result = await InsertarCursoController(user.id,asignaturaId,lapsoActual);

    if(result.success){
        res.status(200).json({
            success: true,
            redirectUrl: '/api/cursos'
        });
    }
    else{
        res.status(400).json({
            success: false,
            message: 'Error al inscribir la asignatura'
        });
    }
});