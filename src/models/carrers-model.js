import {pool} from './conexion.js';

export const ObtenerCarreras = async () => {
    try {
        const query = 'SELECT * FROM tbl_carreras';
        const [rows] =  await pool.query(query);
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}