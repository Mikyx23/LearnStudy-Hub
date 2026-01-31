import {pool} from './conexion.js';
import { GET_COURSES_QUALIFICATIONS, GET_EXAMS_QUALIFICATIONS, INSERT_QUALIFICATIONS } from './queries.js';


export class Calificaciones {
    static InsertarCalificacion = async (id_curso, id_evaluacion, calificacion) => {
        try{
            const [result] = await pool.execute(INSERT_QUALIFICATIONS,[calificacion,id_evaluacion,id_curso]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido insertar la calificación'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido insertar la calificación');
        }
    }

    static ObtenerCursosCalificaciones = async (id_usuario,id_lapso) => {
        try{
            const [rows] = await pool.execute(GET_COURSES_QUALIFICATIONS,[id_usuario,id_lapso]);

            if(rows.length > 0){
                return {
                    success: true,
                    courses: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido obtener los cursos de las calificaciones'
                }
            }
        }
        catch(error){
            console.error(error)
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener los cursos de las calificaciones');
        }
    }

    static ObtenerEvaluacionesCalificaciones = async (id_usuario,id_lapso) => {
        try{
            const [rows] = await pool.execute(GET_EXAMS_QUALIFICATIONS,[id_usuario,id_lapso]);

            if(rows.length > 0){
                return {
                    success: true,
                    exams: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido obtener las evaluaciones de las calificaciones'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener las evaluaciones de las calificaciones');
        }
    }
}