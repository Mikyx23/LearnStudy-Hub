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

// Ruta principal (renderiza HTML)
routerAgenda.get('/', async(req, res) => {
    try{
        const {user} = req.session;
        
        const result = await ObtenerCursosAgendaController(user.id,lapsoActual);
        const result2 = await ObtenerEvaluacionesController(user.id,lapsoActual);

        res.status(200).render('agenda', {
            asignaturas: result.courses || [],
            todasLasEvaluaciones: result2.exams || [],
            userData: res.userData
        });
        
    }
    catch(error){
        console.error('Error al obtener la agenda:', error);
        res.status(500).render('error', { 
            message: 'Error al cargar la agenda',
            userData: res.userData
        });
    }
});

// Ruta API para obtener evaluaciones (JSON)
routerAgenda.get('/api/evaluaciones', async(req, res) => {
    try{
        const {user} = req.session;
        
        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado. Inicia sesión nuevamente.'
            });
        }

        const result = await ObtenerEvaluacionesController(user.id, lapsoActual);

        res.status(200).json({
            success: true,
            evaluaciones: result.exams || []
        });
    }
    catch(error){
        console.error('Error en API /api/evaluaciones:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor al obtener evaluaciones'
        });
    }
});

// Ruta para registrar evaluación
routerAgenda.post('/registrar', async (req, res) => {
    try{
        const { asignatura_id, descripcion, corte, porcentaje, fecha } = req.body;
        
        console.log('Datos recibidos:', { asignatura_id, descripcion, corte, porcentaje, fecha });

        // Validaciones básicas
        if (!asignatura_id || !descripcion || !corte || !porcentaje || !fecha) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        const result = await CrearEvaluacionController(
            asignatura_id, 
            descripcion, 
            corte, 
            porcentaje, 
            fecha
        );

        if(result.sucess){
            res.status(200).json({
                success: true,
                message: 'Evaluación registrada exitosamente'
            });
        }
        else{
            res.status(400).json({
                success: false,
                message: result.message || 'Error al registrar la evaluación'
            }); 
        }
    }
    catch(error){
        console.error('Error en POST /registrar:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor al registrar evaluación'
        });
    }
});

// Ruta para actualizar estado
routerAgenda.put('/estado/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const { estado } = req.body;

        const result = await ActualizarEstadoEvaluacionController(id, estado);

        if(result.sucess){
            res.status(200).json({
                success: true,
                message: 'Estado actualizado correctamente'
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || 'Error al actualizar estado'
            });
        }
    }
    catch(error){
        console.error('Error en PUT /estado/:id:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor al actualizar estado'
        });
    }
});

// Ruta para eliminar evaluación
routerAgenda.delete('/delete/:id', async (req, res) => {
    try{
        const { id } = req.params;

        const result = await EliminarEvaluacionController(id);

        if(result.sucess){
            res.status(200).json({
                success: true,
                message: 'Evaluación eliminada correctamente'
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.message || 'Error al eliminar evaluación'
            });
        }
    }
    catch(error){
        console.error('Error en DELETE /delete/:id:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor al eliminar evaluación'
        });
    }
});

export default routerAgenda;