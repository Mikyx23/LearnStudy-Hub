import {pool} from './conexion.js';
import bcrypt from 'bcryptjs';
import { config } from '../../config.js';
const { saltRounds } = config;



export class RecuperarContraseña {
    static CrearRecuperarContraseña = async (id_usuario,pregunta1,respuesta1,pregunta2,respuesta2,pregunta3,respuesta3) => {
        const query = 'INSERT INTO tbl_recuperacion (id_usuario,pregunta,respuesta) VALUES ?';
        const hash1 = await bcrypt.hash(respuesta1,saltRounds);
        const hash2 = await bcrypt.hash(respuesta2,saltRounds);
        const hash3 = await bcrypt.hash(respuesta3,saltRounds);
        const registros = [
            [id_usuario,pregunta1,hash1],
            [id_usuario,pregunta2,hash2],
            [id_usuario,pregunta3,hash3]
        ];

        const [resultado] = await pool.query(query,[registros]);

        if(resultado.affectedRows > 0){
            return {
                success: true,
                message: 'Preguntas de seguridad registradas exitosamente'
            }
        }
        else{
            return {
                success: false,
                message: 'Error al registrar las preguntas de seguridad'
            }
        }
    }

    static ObtenerPreguntaSeguridad = async (id_usuario) => {
        try{
            const query = 'SELECT id_recuperacion, pregunta FROM tbl_recuperacion WHERE id_usuario = ?';
            const [rows] = await pool.execute(query,[id_usuario]);

            const random = Math.floor(Math.random() * (2 - 0 + 1)) + 0;

            if(rows.length > 0){
                return {
                    success: true,
                    questions: rows[random].pregunta,
                    id_recover: rows[random].id_recuperacion
                }
            }
            else{
                return {
                    success: false
                }
            }
        }
        catch{
            throw new Error('No se ha podido encontrar sus preguntas de seguridad');
        }
    }

    static ValidarRespuestaSeguridad = async (respuesta,id_recover) => {
        try{
            const query = 'SELECT respuesta, id_usuario FROM tbl_recuperacion WHERE id_recuperacion = ?';
            const [rows] = await pool.execute(query,[id_recover]);

            if(rows.length > 0){
                const valido = await bcrypt.compare(respuesta,rows[0].respuesta);

                if(valido){
                    return {
                        success: true,
                        id: rows[0].id_usuario
                    }
                }
                else{
                    return {
                        success: false
                    }
                }
            }
        }
        catch(error){
            throw new Error('No se ha podido verificar su respuesta');
        }
    } 
}