import {pool} from './conexion.js';
import { GET_COURSES_SCHEDULE, GET_SCHEDULE, INSERT_SCHEDULE, DELETE_SCHEDULE } from './queries.js';

export class Horario {
    static CrearHorario = async (horario) => {
        try{
            const [resultado] = await pool.query(INSERT_SCHEDULE,[horario]);

            if(resultado.affectedRows > 0){
                return {
                    success: true,
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido crear el horario'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido crear el horario');
        }
    }

    static EliminarHorario = async (id_usuario,id_lapso) => {
        try{
            const [resultado] = await pool.execute(DELETE_SCHEDULE,[id_usuario,id_lapso]);

            if(resultado.affectedRows > 0){
                return {
                    success: true,
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido eliminar el horario'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido eliminar el horario')
        }
    }

    static ObtenerCursosHorario = async (id_usuario,id_lapso) => {
        try{
            const [rows] = await pool.execute(GET_COURSES_SCHEDULE,[id_usuario,id_lapso]);

            if(rows.length > 0){
                return {
                    success: true,
                    courses: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido obtener los cursos del horario'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener los cursos del horario');
        }
    }

    static ObtenerHorario = async (id_usuario,id_lapso) => {
        try{
            const [rows] = await pool.execute(GET_SCHEDULE,[id_usuario,id_lapso]);

            if(rows.length > 0){
                return {
                    success: true,
                    schedule: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido obtener el horario'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener el horario');
        }
    }
}