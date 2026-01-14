import {pool} from './conexion.js';
import { GET_USER_DATA, GET_ACADEMIC_DATA } from './queries.js';

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
}