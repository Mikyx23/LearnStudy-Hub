import express from 'express';
export const routerCourses = express.Router();  // Inicialización del enrutador modular para la gestión de cursos/materias
// Importación de controladores para obtener y manipular la carga académica
import { ObtenerCursosController, ObtenerCursosDisponiblesController, InsertarCursoController } from '../controllers/courses-controller.js';
// Configuración global y utilidades
import { config } from '../../config.js';
const { lapsoActual } = config;
import { CalculateCredits } from '../../public/utils/utils.js';

routerCourses.get('/', async (req,res) => {
    // Se obtiene el usuario de la sesión para conocer su historial y carrera
    const {user} = req.session;

    // Ejecución de consultas concurrentes para optimizar la carga de la página
    const result = await ObtenerCursosController(user.carrer,user.id,lapsoActual);
    const result2 = await ObtenerCursosDisponiblesController(user.id,lapsoActual,user.carrer);
    // Cálculo dinámico del total de créditos que el alumno lleva inscritos actualmente
    const creditosInscritos = await CalculateCredits(result.courses);

    // Si alguna de las consultas es exitosa, se renderiza la vista courses.ejs
    if(result.success || result2.success){
        res.render('courses', { 
            misAsignaturas: result.courses || [],
            disponibles: result2.availables || [],
            creditosInscritos: creditosInscritos || 0,
            userData: res.userData
        });
    }
});

routerCourses.post('/inscribir', async (req,res) => {
    const {user} = req.session;
    const { asignaturaId } = req.body;

    // Validación de entrada: Verifica que el ID enviado sea un número válido
    if(isNaN(asignaturaId)){
        return res.status(400).json({
            sucess: false,
            message: 'La asignatura no existe'
        });
    }

    // Intenta realizar la inserción en la base de datos
    const result = await InsertarCursoController(user.id,asignaturaId,lapsoActual);

    if(result.success){
        // Respuesta exitosa: indica al frontend que debe redirigir para actualizar la lista
        res.status(200).json({
            success: true,
            redirectUrl: '/api/cursos'
        });
    }
    else{
        // Error de negocio (ej: materia sin cupo, prelación no cumplida, etc.)
        res.status(400).json({
            success: false,
            message: 'Error al inscribir la asignatura'
        });
    }
});