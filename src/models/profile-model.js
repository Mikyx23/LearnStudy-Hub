import {pool} from './conexion.js';
import { GET_USER_PROFILE } from './queries.js';

export class Perfil {
    static ObtenerPerfilUsuario = async (id_usuario,id_carrera,id_lapso) => {
        try{
            const [rows] = await pool.execute(GET_USER_PROFILE,[id_lapso,id_usuario,id_lapso,id_usuario,id_carrera]);

            if(rows.length > 0){
                return {
                    success: true,
                    user: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido obtener el perfil del usuario'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener el perfil del usuario');
        }
    }
}