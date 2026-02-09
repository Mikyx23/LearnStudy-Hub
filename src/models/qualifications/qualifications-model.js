import {pool} from '../conexion.js';
import { 
    GET_COURSES_QUALIFICATIONS, 
    GET_EXAMS_QUALIFICATIONS, 
    INSERT_QUALIFICATIONS, 
    GET_MALLA_QUALIFICATIONS, 
    GET_ACADEMIC_HISTORY, 
    INSERT_ACADEMIC_HISTORY, 
    GET_ACADEMIC_LAPSOS 
} from './qualifications-queries.js';


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

    static InsertarHistorialAcademico = async (id_usuario, id_asignatura_carrera, nota_definitiva, estado_aprobacion) => {
        try{
            const [result] = await pool.execute(INSERT_ACADEMIC_HISTORY,[id_usuario,id_asignatura_carrera,nota_definitiva,estado_aprobacion]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido insertar el historial académico'
                }
            }
        }
        catch(error){
            // throw new Error('Ha ocurrido un error inesperado: No se ha podido insertar el historial académico');
            console.log(error);
        }
    }

    static ObtenerCursosCalificaciones = async (id_carrera,id_usuario,id_lapso) => {
        try{
            const [rows] = await pool.execute(GET_COURSES_QUALIFICATIONS,[id_carrera,id_usuario,id_lapso]);

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

    static ObtenerEvaluacionesCalificaciones = async (id_carrera,id_usuario,id_lapso) => {
        try{
            const [rows] = await pool.execute(GET_EXAMS_QUALIFICATIONS,[id_carrera,id_usuario,id_lapso]);

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

    static ObtenerMallaCalificaciones = async (id_carrera) => {
        try{
            const [rows] = await pool.execute(GET_MALLA_QUALIFICATIONS,[id_carrera]);

            if(rows.length > 0){
                return {
                    success: true,
                    malla: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido obtener la malla de calificaciones'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener la malla de calificaciones');
        }
    }

    static ObtenerHistorialAcademico = async (id_usuario) => {
        try{
            const [rows] = await pool.execute(GET_ACADEMIC_HISTORY,[id_usuario]);

            if(rows.length > 0){
                return {
                    success: true,
                    history: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido obtener el historial académico'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener el historial académico');
        }
    }

    static ObtenerLapsosAcademicos = async () => {
        try{
            const [rows] = await pool.execute(GET_ACADEMIC_LAPSOS);
            if(rows.length > 0){
                return {
                    success: true,
                    lapsos: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido obtener los lapsos académicos'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un erorr inesperado: No se ha podido obtener los lapsos académicos')
        }
    }
}