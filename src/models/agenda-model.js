import {pool} from './conexion.js';
import { GET_COURSES_AGENDA, INSERT_EXAM, GET_EXAMS, SET_STATE_EXAM, DELETE_EXAM } from './queries.js';


export class Agenda {
    static CrearEvaluacion = async (id_curso, descripcion, corte, porcentaje, fecha_entrega) => {
        try{
            const [result] = await pool.query(INSERT_EXAM, [id_curso, descripcion, corte, porcentaje, fecha_entrega]);

            if(result.affectedRows > 0){
                return {
                    sucess:true,
                }
            }
            else{
                return {
                    sucess:false,
                    message: 'No se ha podido crear la evaluación'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido crear la evaluación');
        }
    }

    static EliminarEvaluacion = async (id_evaluacion) => {
        try{
            const [result] = await pool.query(DELETE_EXAM, [id_evaluacion]);

            if(result.affectedRows > 0){
                return {
                    sucess:true,
                }
            }
            else{
                return {
                    sucess:false,
                    message: 'No se ha podido eliminar la evaluación'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido eliminar la evaluación');
        }
    }
        

    static ActualizarEstadoEvaluacion = async (id_evaluacion, estado) => {
        try{
            const [result] = await pool.query(SET_STATE_EXAM, [estado, id_evaluacion]);

            if(result.affectedRows > 0){
                return {
                    sucess:true,
                }
            }
            else{
                return {
                    sucess:false,
                    message: 'No se ha podido actualizar el estado de la evaluación'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido actualizar el estado de la evaluación')
        }
    }
    
    static ObtenerCursosAgenda = async (id_usuario, id_lapso) => {
        try{
            const [rows] = await pool.query(GET_COURSES_AGENDA, [id_usuario, id_lapso]);
            
            if(rows.length > 0){
                return {
                    sucess:true,
                    courses: rows
                }
            }
            else{
                return {
                    sucess:false,
                    message: 'No se encontraron cursos'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener los cursos de la agenda');
        }
    }

    static ObtenerEvaluaciones = async (id_usuario, id_lapso) => {
        try{
            const [rows] = await pool.query(GET_EXAMS, [id_usuario, id_lapso]);
            
            if(rows.length > 0){
                return {
                    sucess:true,
                    exams: rows
                }
            }
            else{
                return {
                    sucess:false,
                    message: 'No se encontraron evaluaciones'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: ');
        }
    }    
}