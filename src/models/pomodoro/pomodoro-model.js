import {pool} from '../conexion.js';
import { 
    GET_POMODORO_DATA, 
    INSERT_POMODORO_SESSION, 
    GET_SESSIONS_DATA,
    DELETE_POMODORO_SESSION,
    DELETE_POMODORO_HISTORY
} from './pomodoro-queries.js';

export class Pomodoro {
    static CrearSesionPomodoro = async (id_evaluacion, descripcion_sesion, hora_inicio, hora_final, ciclos) => {
        try{
            const [result] = await pool.execute(INSERT_POMODORO_SESSION,[id_evaluacion, descripcion_sesion, hora_inicio, hora_final, ciclos]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido crear la sesión del pomodoro'
                }
            }
        }
        catch(error){
            throw new Error('Error al crear la sesión del pomodoro');
        }
    }

    static LimpiarPomodoro = async (id_usuario, id_lapso) => {
        try{
            const [result] = await pool.execute(DELETE_POMODORO_HISTORY, [id_usuario, id_lapso]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido limpiar el pomodoro'
                }
            }
        }
        catch(error){
            throw new Error('Error al limpiar el pomodoro');
        }   
    }

    static LimpiarSesionPomodoro = async (id_sesion) => {
        try{
            const [result] = await pool.execute(DELETE_POMODORO_SESSION, [id_sesion]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se ha podido limpiar la sesión del pomodoro'
                }
            }
        }
        catch(error){
            throw new Error('Error al limpiar la sesión del pomodoro');
        }
    }

    static ObtenerDatosPomodoro = async (id_carrera,id_usuario, id_lapso) => {
        try{
            const [rows] = await pool.query(GET_POMODORO_DATA, [id_carrera,id_usuario, id_lapso]);
            
            if(rows.length > 0){
                return {
                    success: true,
                    data: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se encontraron datos del pomodoro'
                }
            }
        }
        catch(error){
            throw new Error('Error al obtener los datos del pomodoro');
        }
    }

    static ObtenerDatosSesiones = async (id_carrera,id_usuario, id_lapso) => {
        try{
            const [rows] = await pool.query(GET_SESSIONS_DATA, [id_carrera,id_usuario, id_lapso]);

            if(rows.length > 0){
                return {
                    success: true,
                    data: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se encontraron datos de las sesiones'
                }
            }
        }
        catch(error){
            throw new Error('Error al obtener los datos de las sesiones');
        }
    }
}