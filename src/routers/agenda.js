import express from 'express';  // Importación de Express para la gestión de rutas y peticiones HTTP
export const routerAgenda = express.Router(); // Definición del router de Express para gestionar los endpoints de la agenda
import { 
    ObtenerCursosAgendaController, 
    CrearEvaluacionController, 
    ObtenerEvaluacionesController,
    ActualizarEstadoEvaluacionController,
    EliminarEvaluacionController
} from '../controllers/agenda-controller.js'; // Importacion de funciones controladores
import { config } from '../../config.js' // Importa la configuración global de la aplicación
const { lapsoActual } = config; // Extrae el periodo académico vigente para filtrar las consultas automáticamente

/*
Renderiza la vista principal de la agenda.
Obtiene, de forma asíncrona, tanto los cursos inscritos como las evaluaciones 
programadas para el usuario en sesión y el lapso académico vigente.
*/
routerAgenda.get('/', async(req, res) => {
    try{
        const {user} = req.session; // Extrae la información del usuario autenticado desde la sesión
        
        // Consultas al controlador: se busca la carga académica y el cronograma de exámenes
        const result = await ObtenerCursosAgendaController(user.carrer,user.id,lapsoActual);
        const result2 = await ObtenerEvaluacionesController(user.carrer,user.id,lapsoActual);
        
        // Envía los datos a la plantilla agenda.ejs
        res.status(200).render('agenda', {
            asignaturas: result.courses || [],
            // evaluaciones: result2.exams || [],
            todasLasEvaluaciones: result2.exams || [],
            userData: res.userData
        });
        
    }
    catch(error){
        // Lanza una excepción si falla la carga de datos inicial
        throw new Error('Error al obtener la agenda');
    }
});

/*
Endpoint para registrar una nueva evaluación académica.
Recibe los datos del formulario, los procesa a través del controlador y
responde con una URL de redirección si la operación fue exitosa.
*/
routerAgenda.post('/registrar', async (req, res) => {
    try{
        // Desestructuración de los campos enviados desde el formulario/cliente
        const { asignatura_id, descripcion, corte, porcentaje, fecha} = req.body;

        // Llamada al controlador para guardar la nueva evaluación en la base de datos
        const result = await CrearEvaluacionController(asignatura_id, descripcion, corte, porcentaje, fecha);

        if(result.success){
            // Si se creó con éxito, envía la URL para que el frontend recargue la agenda
            res.status(200).json({redirectUrl: '/api/agenda'});
        }
        else{
            // Si hubo un error de validación o lógica, responde con el mensaje de error
            res.status(404).send(result.message); 
        }
    }
    catch(error){
        // Captura errores inesperados del servidor
        throw new Error('Error al registrar la evaluación');
    }
});

/*
Actualiza el estado de una evaluación (ej: de 'Pendiente' a 'Entregado').
Utiliza el ID de la evaluación pasado por la URL y el nuevo estado enviado en el cuerpo.
*/
routerAgenda.put('/estado/:id', async (req, res) => {
    try{
        // Obtiene el ID desde los parámetros de la ruta y el nuevo estado desde el body
        const { id } = req.params;
        const { estado } = req.body;

        // Lógica para actualizar el registro específico
        const result = await ActualizarEstadoEvaluacionController(id, estado);

        if(result.success){
            // Retorna éxito y la ruta para refrescar la interfaz
            res.status(200).json({redirectUrl: '/api/agenda'});
        }
    }
    catch(error){
        // Manejo de errores en la actualización
        throw new Error('Error al actualizar el estado de la evaluación');
    }
});

/*
Elimina permanentemente una evaluación específica.
Requiere el ID del registro como parámetro en la ruta.
*/
routerAgenda.delete('/delete/:id', async (req, res) => {
    try{
        // Extrae el ID del recurso a eliminar
        const { id } = req.params;

        // Ejecuta la eliminación en la base de datos a través del controlador
        const result = await EliminarEvaluacionController(id);

        if(result.success){
            // Indica éxito y provee la URL de redirección
            res.status(200).json({redirectUrl: '/api/agenda'});
        }
    }
    catch(error){
        // Manejo de errores en la eliminación
        throw new Error('Error al eliminar la evaluación');
    }
})