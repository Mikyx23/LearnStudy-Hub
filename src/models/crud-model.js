import {pool} from './conexion.js'
import {
    GET_USERS_CRUD,
    GET_CARRERS_CRUD,
    GET_SUBJECTS_CRUD,
    GET_SEMESTERS_CRUD,
    GET_PHRASES_CRUD,
    GET_MALLA_CRUD,
    GET_PRELACIONES_ACADEMICAS_CRUD,
    GET_PRELACIONES_MATERIAS_CRUD,
    INSERT_SUBJECT_CRUD,
    INSERT_CARRER_CRUD,
    INSERT_LAPSO_CRUD,
    INSERT_PHRASE_CRUD,
    INSERT_MALLA_CRUD,
    INSERT_PRELACION_MATERIA_CRUD,
    INSERT_PRELACION_ACADEMICA_CRUD,
    DELETE_USER_CRUD,
    DELETE_CARRER_CRUD,
    DELETE_SUBJECT_CRUD,
    DELETE_LAPSO_CRUD,
    DELETE_PHRASE_CRUD,
    DELETE_MALLA_CRUD,
    DELETE_PRELACION_MATERIA_CRUD,
    DELETE_PRELACION_ACADEMICA_CRUD
} from './queries.js'

export class Crud {
    static InsertarCarrera = async (nombre_carrera) => {
        try{
            const [result] = await pool.execute(INSERT_CARRER_CRUD, [nombre_carrera]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Carrera insertada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo insertar la carrera'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static InsertarAsignatura = async (nombre_asignatura) => {
        try{
            const [result] = await pool.execute(INSERT_SUBJECT_CRUD, [nombre_asignatura]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Asignatura insertada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo insertar la asignatura'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static InsertarLapsos = async (periodo, año) => {
        try{
            const [result] = await pool.execute(INSERT_LAPSO_CRUD, [periodo, año]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Lapsos insertados correctamente'
                }            
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo insertar los lapsos'
                }
            
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static InsertarFrases = async (frase) => {
        try{
            const [result] = await pool.execute(INSERT_PHRASE_CRUD, [frase]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Frase insertada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo insertar la frase'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static InsertarMalla = async (id_carrera, codigo, nombre, semestre, UC, TH) => {
        try{
            const [result] = await pool.execute(INSERT_MALLA_CRUD, [id_carrera, codigo, nombre, semestre, UC, TH]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Malla insertada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo insertar la malla'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static InsertarPrelacionMateria = async (id_asignatura_carrera, id_asignatura_prelacion, tipo_prelacion) => {
        try{
            const [result] = await pool.execute(INSERT_PRELACION_MATERIA_CRUD,[id_asignatura_carrera, id_asignatura_prelacion, tipo_prelacion]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Prelacion materia insertada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo insertar la prelacion materia'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static InsertarPrelacionAcademica = async (id_asignatura_carrera, tipo_prelacion, valor_requerido) => {
        try{
            const [result] = await pool.execute(INSERT_PRELACION_ACADEMICA_CRUD,[id_asignatura_carrera, tipo_prelacion, valor_requerido]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Prelacion academica insertada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo insertar la prelacion academica'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static EliminarUsuario = async (id_usuario) => {
        try{
            const [result] = await pool.execute(DELETE_USER_CRUD, [id_usuario]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Usuario eliminado correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo eliminar el usuario'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido algo inesperado: No se ha podido eliminar el usuario')
        }
    }

    static EliminarCarrera = async (id_carrera) => {
        try{
            const [result] = await pool.execute(DELETE_CARRER_CRUD, [id_carrera]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Carrera eliminada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo eliminar la carrera'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido algo inesperado: No se ha podido eliminar la carrera')
        }
    }

    static EliminarAsignatura = async (id_asignatura) => {
        try{
            const [result] = await pool.execute(DELETE_SUBJECT_CRUD, [id_asignatura]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Asignatura eliminada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo eliminar la asignatura'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido algo inesperado: No se ha podido eliminar la asignatura')
        }
    }

    static EliminarLapsos = async (id_lapso) => {
        try{
            const [result] = await pool.execute(DELETE_LAPSO_CRUD, [id_lapso]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Lapsos eliminados correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo eliminar los lapsos'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido algo inesperado: No se ha podido eliminar los lapsos')
        }
    }

    static EliminarFrases = async (id_frase) => {
        try{
            const [result] = await pool.execute(DELETE_PHRASE_CRUD, [id_frase]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Frase eliminada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo eliminar la frase'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido algo inesperado: No se ha podido eliminar la frase')
        }
    }

    static EliminarMalla = async (id_malla) => {
        try{
            const [result] = await pool.execute(DELETE_MALLA_CRUD, [id_malla]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Malla eliminada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo eliminar la malla'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido algo inesperado: No se ha podido eliminar la malla')
        }
    }

    static EliminarPrelacionMateria = async (id_prelacion_materia) => {
        try{
            const [result] = await pool.execute(DELETE_PRELACION_MATERIA_CRUD, [id_prelacion_materia]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Prelacion materia eliminada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo eliminar la prelacion materia'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido algo inesperado: No se ha podido eliminar la prelacion materia')
        }
    }

    static EliminarPrelacionAcademica = async (id_prelacion_academica) => {
        try{
            const [result] = await pool.execute(DELETE_PRELACION_ACADEMICA_CRUD, [id_prelacion_academica]);

            if(result.affectedRows > 0){
                return {
                    success: true,
                    message: 'Prelacion academica eliminada correctamente'
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se pudo eliminar la prelacion academica'
                }
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado: No se ha podido eliminar la prelacion academica')
        }
    }

    static ObtenerEstudiantes = async () => {
        try{
            const [rows] = await pool.execute(GET_USERS_CRUD);
            
            if(rows.length > 0){
                return {
                    success: true,
                    data: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se encontraron estudiantes'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static ObtenerCarreras = async () => {
        try{
            const [rows] = await pool.execute(GET_CARRERS_CRUD);

            if(rows.length > 0){
                return {
                    success: true,
                    data: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se encontraron carreras'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static ObtenerAsignaturas = async () => {
        try{
            const [rows] = await pool.execute(GET_SUBJECTS_CRUD); 

            if(rows.length > 0){
                return {
                    success: true,
                    data: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se encontraron asignaturas'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static ObtenerMallas = async () => {
        try{
            const [rows] = await pool.execute(GET_MALLA_CRUD);
            
            if(rows.length > 0){
                return {
                    success: true,
                    data: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se encontraron asignaturas'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static ObtenerLapsos = async () => {
        try{
            const [rows] = await pool.execute(GET_SEMESTERS_CRUD);

            if(rows.length > 0){
                return {
                    success: true,
                    data: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se encontraron semestres'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static ObtenerFrases = async () => {
        try{
            const [rows] = await pool.execute(GET_PHRASES_CRUD);

            if(rows.length > 0){
                return {
                    success: true,
                    data: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se encontraron frases'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static ObtenerPrelacionesMaterias = async () => {
        try{
            const [rows] = await pool.execute(GET_PRELACIONES_MATERIAS_CRUD);

            if(rows.length > 0){
                return {
                    success: true,
                    data: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se encontraron prelaciones'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }

    static ObtenerPrelacionesAcademicas = async () => {
        try{
            const [rows] = await pool.execute(GET_PRELACIONES_ACADEMICAS_CRUD);

            if(rows.length > 0){
                return {
                    success: true,
                    data: rows
                }
            }
            else{
                return {
                    success: false,
                    message: 'No se encontraron prelaciones'
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }
}