import {pool} from './conexion.js';
import { GET_MALLA_CURRICULAR } from './queries.js';


export class Malla {
    static ObtenerMallaCurricular = async (carrer) => {
        try{
            const [rows] = await pool.execute(GET_MALLA_CURRICULAR,[carrer]);

            if(rows.length > 0){
                return {
                    success: true,
                    pensum: rows
                }
            }
            else{
                return{
                    sucess: false,
                    message: 'Error al obtener la malla curricular'
                }
            }
        }
        catch(error){
            console.error(error)
            throw new Error('Ha ocurrido un error inesperado: No se ha podido obtener la malla curricular')
        }
    }
}