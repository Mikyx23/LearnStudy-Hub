import {pool} from './conexion.js';
import { toRomano } from '../../public/utils/utils.js';

export class Malla {
    static ObtenerMallaCurricular = async (carrer) => {
        try{
            const query = `
            SELECT 
                ac.codigo_asignatura AS codigo, 
                a.nombre_asignatura AS nombre, 
                ac.semestre AS semestre, 
                ac.uc_asignatura AS UC, 
                ac.total_horas AS TH,
                -- Agrupamos todos los códigos en un solo string separado por comas
                GROUP_CONCAT(DISTINCT CASE WHEN pm.tipo_prelacion = 'REQUISITO' THEN ac_pre.codigo_asignatura END) AS requisitos,
                GROUP_CONCAT(DISTINCT CASE WHEN pm.tipo_prelacion = 'CORREQUISITO' THEN ac_pre.codigo_asignatura END) AS correquisitos,
                MAX(CASE WHEN pa.tipo_prelacion = 'UC_APROBADAS' THEN pa.valor_requerido END) AS UCA,
                MAX(CASE WHEN pa.tipo_prelacion = 'SEMESTRE_APROBADO' THEN pa.valor_requerido END) AS SMA
            FROM tbl_asignaturas_carreras ac
            INNER JOIN tbl_asignaturas a ON ac.id_asignatura = a.id_asignatura
            LEFT JOIN tbl_prelaciones_materias pm ON ac.id_asignatura_carrera = pm.id_asignatura_carrera
            LEFT JOIN tbl_asignaturas_carreras ac_pre ON pm.id_asignatura_prelacion = ac_pre.id_asignatura_carrera
            LEFT JOIN tbl_prelaciones_academicas pa ON ac.id_asignatura_carrera = pa.id_asignatura_carrera
            WHERE ac.id_carrera = ?
            GROUP BY ac.codigo_asignatura, a.nombre_asignatura, ac.semestre, ac.uc_asignatura, ac.total_horas
            ORDER BY ac.semestre
            `

            const [rows] = await pool.execute(query,[carrer]);

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

    static ProcesarMallaCurricular = async (rows) => {
        let conteoNombres = {};
        let indicesActuales = {};
    
        // Nombre exacto a excluir
        const EXCEPCION = "PROYECTO DE SERVICIO COMUNITARIO";

        // Contar ocurrencias ignorando la excepción
        rows.forEach(m => {
            const nombreUpper = m.nombre.trim().toUpperCase();
            if (nombreUpper !== EXCEPCION) {
                conteoNombres[nombreUpper] = (conteoNombres[nombreUpper] || 0) + 1;
            }
        });

        // Asignar nombres con romanos
        return rows.map(m => {
            const nombreOriginal = m.nombre.trim();
            const nombreUpper = nombreOriginal.toUpperCase();

            // Si no es la excepción y aparece más de una vez
            if (nombreUpper !== EXCEPCION && conteoNombres[nombreUpper] > 1) {
                indicesActuales[nombreUpper] = (indicesActuales[nombreUpper] || 0) + 1;
                return {
                    ...m,
                    nombre: `${nombreOriginal} ${toRomano(indicesActuales[nombreUpper])}`
                };
            }

            // Si es Servicio Comunitario o materia única, se queda tal cual
            return { ...m, nombre: nombreOriginal };
        });
    }
}