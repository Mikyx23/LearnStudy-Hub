import {pool} from './conexion.js';
import { GET_USER_PROFILE, UPDATE_PROFILE_PHOTO } from './queries.js';

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

    static GuardarFotoPerfil = async (id_usuario,foto) => {
        try{
            const [rows] = await pool.execute(UPDATE_PROFILE_PHOTO,[foto,id_usuario]);

            if(rows.affectedRows > 0){
                return {
                    success: true,
                    message: 'Foto de perfil guardada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido guardar la foto de perfil'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido guardar la foto de perfil');
        }
    }
}