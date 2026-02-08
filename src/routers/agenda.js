import express from 'express';  // Importación de Express para la gestión de rutas y peticiones HTTP
export const routerAgenda = express.Router(); // Definición del router de Express para gestionar los endpoints de la agenda
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
        const {user} = req.session; // Extrae la información del usuario autenticado desde la sesión
        
        // Consultas al controlador: se busca la carga académica y el cronograma de exámenes
        const result = await ObtenerCursosAgendaController(user.carrer,user.id,lapsoActual);
        const result2 = await ObtenerEvaluacionesController(user.carrer,user.id,lapsoActual);

        // Envía los datos a la plantilla agenda.ejs
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

// Ruta para actualizar estado de evaluación con más opciones
routerAgenda.put('/estado/:id', async (req, res) => {
    try{
        // Obtiene el ID desde los parámetros de la ruta y el nuevo estado desde el body
        const { id } = req.params;
        const { estado, estado_actual } = req.body;

        console.log(`Actualizando estado de evaluación ${id} de ${estado_actual} a: ${estado}`);

        // Obtener la evaluación actual de la base de datos para verificar su estado real
        // (Necesitarás una función para obtener una evaluación por ID)
        
        // Validar transiciones no permitidas
        if (estado_actual === 'CALIFICADA') {
            return res.status(400).json({
                success: false,
                message: 'No se puede cambiar el estado de una evaluación calificada.'
            });
        }
        
        if (estado_actual === 'ENTREGADA' && estado === 'PENDIENTE') {
            return res.status(400).json({
                success: false,
                message: 'Una evaluación entregada no puede volver a estado pendiente.'
            });
        }

        const estadosPermitidos = ['PENDIENTE', 'ENTREGADA', 'CALIFICADA'];
        if (!estadosPermitidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: `Estado no válido. Debe ser uno de: ${estadosPermitidos.join(', ')}`
            });
        }

        // Lógica para actualizar el registro específico
        const result = await ActualizarEstadoEvaluacionController(id, estado);

        if(result.sucess){
            res.status(200).json({
                success: true,
                message: `Estado actualizado a ${estado}`,
                estado: estado
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
// Ruta para obtener los estados disponibles
routerAgenda.get('/estados', async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            estados: [
                { id: 'PENDIENTE', nombre: 'Pendiente', color: 'blue', icono: 'clock' },
                { id: 'ENTREGADA', nombre: 'Entregada', color: 'emerald', icono: 'check-circle' },
                { id: 'CALIFICADA', nombre: 'Calificada', color: 'purple', icono: 'star' }
            ]
        });
    } catch (error) {
        console.error('Error en GET /estados:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error interno del servidor'
        });
    }
});

// ... resto del código ...
// Ruta para eliminar evaluación
routerAgenda.delete('/delete/:id', async (req, res) => {
    try{
        // Extrae el ID del recurso a eliminar
        const { id } = req.params;

        // Ejecuta la eliminación en la base de datos a través del controlador
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