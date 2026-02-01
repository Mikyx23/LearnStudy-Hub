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
} from './queries.js'

export class Crud {
    static InsertarCarrera = async (nombre_carrera, estado_carrera) => {
        try{
            const [result] = await pool.execute(INSERT_CARRER_CRUD, [nombre_carrera, estado_carrera]);

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

    static InsertarAsignatura = async (nombre_asignatura, estado_asignatura) => {
        try{
            const [result] = await pool.execute(INSERT_SUBJECT_CRUD, [nombre_asignatura, estado_asignatura]);

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

    static InsertarMalla = async (id_carrera, codigo, nombre, semestre, UC, TH, estado) => {
        try{
            const [result] = await pool.execute(INSERT_MALLA_CRUD, [id_carrera, codigo, nombre, semestre, UC, TH, estado]);

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