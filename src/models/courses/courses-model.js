import {pool} from '../conexion.js';
import { GET_COURSES, GET_COURSES_AVAILABLE, ADD_COURSE } from './courses-queries.js';

export class Curso {
    static InsertarCurso = async (id_usuario,id_asignatura_carrera,id_lapso) => {
        try{
            const [response] = await pool.execute(ADD_COURSE,[id_usuario,id_asignatura_carrera,id_lapso]);

            if(response.affectedRows > 0){
                return {
                    success: true,
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido insertar el curso'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido insertar el curso');
        }
    }


    static ObtenerCursos = async (id_carrera,id_usuario,id_lapso) => {
        try{
            const [rows] = await pool.execute(GET_COURSES,[id_carrera,id_usuario,id_lapso]);

            if(rows.length > 0){
                return {
                    success: true,
                    courses: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido obtener los cursos'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener los cursos');
        }
    }

    static ObtenerCursosDisponibles = async (id_usuario,id_lapso,id_carrera) => {
        try{
            const [rows] = await pool.execute(GET_COURSES_AVAILABLE,[id_usuario,id_carrera,id_usuario,id_lapso,id_carrera,id_carrera]);

            if(rows.length > 0){
                return {
                    success: true,
                    availables: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se han podido obtener los cursos disponibles'
                }
            }
        }
        catch(error){
            console.error(error);
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener los cursos disponibles');
        }
    }
}