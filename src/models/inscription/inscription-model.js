import {pool} from '../conexion.js';

export class InscripcionCarrera{
    constructor(idInscripcionCarrera, idUsuario, idCarrera, fechaInscripcion, estado){
        this.idInscripcionCarrera = idInscripcionCarrera;
        this.idUsuario = idUsuario;
        this.idCarrera = idCarrera;
        this.fechaInscripcion = fechaInscripcion;
        this.estado = estado;
    }

    CrearInscripcionCarrera = async () => {
        try{
            const query = 'INSERT INTO tbl_inscripciones_carreras (id_usuario,id_carrera,fecha_inscripcion) VALUES (?,?,?)'; //Query para insertar en la tabla inscripciones_carreras
            const fechaActual = new Date();
            const fechaFormateada = fechaActual.toISOString().split('T')[0]; // Formatear la fecha a 'YYYY-MM-DD'

            const [resultado] = await pool.execute(query,[this.idUsuario,this.idCarrera,fechaFormateada]); //Ejecutar consulta

            if(resultado.affectedRows > 0){ //Verifica si se afecto una columna en la BD (si se ingreso la inscripcion o no)
                return {
                    respuesta: true,
                    mensaje: 'Inscripcion a la carrera registrada exitosamente'
                };
            }
            else{
                return{
                    respuesta: false,
                    mensaje: 'No se ha podido registrar la inscripcion a la carrera'
                };
            }
        }
        catch(error){
            console.error(error);
            throw error;
        }
    }
}