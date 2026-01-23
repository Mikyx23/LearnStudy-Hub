import {pool} from './conexion.js';
import { GET_POMODORO_DATA } from './queries.js';

export class Pomodoro {
    static ObtenerDatosPomodoro = async (id_usuario, id_lapso) => {
        try{
            const [rows] = await pool.query(GET_POMODORO_DATA, [id_usuario, id_lapso]);
            
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
}