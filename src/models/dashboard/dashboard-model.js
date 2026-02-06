import {pool} from '../conexion.js';
import { GET_USER_DATA, GET_ACADEMIC_DATA, GET_TODAY_CLASSES, GET_PHRASE } from '../queries.js';

export class Dashboard {
    static ObtenerDatosUsuario = async (id_usuario, id_lapso) => {
        try{
            const [rows] = await pool.execute(GET_USER_DATA,[id_lapso,id_usuario]);

            if(rows.length > 0){
                return {
                    success: true,
                    user: rows[0]
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se han podido obtener los datos del usuario'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener el dashboard');
        }
    }

    static ObtenerDatosAcademicos = async (id_carrera, id_usuario, id_lapso) => {
        try{
            const [rows] = await pool.execute(GET_ACADEMIC_DATA,[id_carrera,id_usuario,id_lapso]);
            
            if(rows.length > 0){
                return {
                    success: true,
                    data: rows
                }
            }
            else{
                return {
                    sucess: false,
                    message: 'No se han podido obtener los datos académicos'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se han podido obtener los datos académicos');
        }
    }

    static ObtenerClasesDiaActual = async (id_carrera, id_usuario, id_lapso, dia_semana) => {
        try{
            const [rows] = await pool.execute(GET_TODAY_CLASSES,[id_carrera,id_carrera,id_usuario,id_lapso,dia_semana]);

            if(rows.length > 0){
                return {
                    success: true,
                    today: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se han podido obtener las clases del día'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener las clases del día');
        }
    }

    static ObtenerFrase = async () => {
        try{
            const [rows] = await pool.execute(GET_PHRASE);

            if(rows.length > 0){
                return {
                    success: true,
                    frase: rows[0].frase
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido obtener la frase'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener la frase');
        }
    }
}