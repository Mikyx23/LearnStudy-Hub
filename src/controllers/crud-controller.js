import { Crud } from "../models/crud/crud-model.js";

export const InsertarCarreraController = async (nombre_carrera) => {
    return await Crud.InsertarCarrera(nombre_carrera)
}

export const InsertarAsignaturaController = async (nombre_asignatura) => {
    return await Crud.InsertarAsignatura(nombre_asignatura)
}

export const InsertarLapsosController = async (periodo, año) => {
    return await Crud.InsertarLapsos(periodo, año)
}

export const InsertarFrasesController = async (frase) => {
    return await Crud.InsertarFrases(frase)
}

export const InsertarMallaController = async (id_carrera,codigo, nombre, semestre, UC, TH) => {
    return await Crud.InsertarMalla(id_carrera, codigo, nombre, semestre, UC, TH)
}

export const InsertarPrelacionMateriaController = async (id_asignatura_carrera, id_asignatura_prelacion, tipo_prelacion) => {
    return await Crud.InsertarPrelacionMateria(id_asignatura_carrera, id_asignatura_prelacion, tipo_prelacion);
}

export const InsertarPrelacionAcademicaController = async (id_asignatura_carrera, tipo_prelacion, valor_requerido) => {
    return await Crud.InsertarPrelacionAcademica(id_asignatura_carrera, tipo_prelacion, valor_requerido);
}

export const EliminarUsuarioController = async (id_usuario) => {
    return await Crud.EliminarUsuario(id_usuario)
}

export const EliminarCarreraController = async (id_carrera) => {
    return await Crud.EliminarCarrera(id_carrera)
}

export const EliminarAsignaturaController = async (id_asignatura) => {
    return await Crud.EliminarAsignatura(id_asignatura)
}

export const EliminarLapsosController = async (id_lapso) => {
    return await Crud.EliminarLapsos(id_lapso)
}

export const EliminarFrasesController = async (id_frase) => {
    return await Crud.EliminarFrases(id_frase)
}

export const EliminarMallaController = async (id_malla) => {
    return await Crud.EliminarMalla(id_malla)
}

export const EliminarPrelacionMateriaController = async (id_prelacion_materia) => {
    return await Crud.EliminarPrelacionMateria(id_prelacion_materia)
}

export const EliminarPrelacionAcademicaController = async (id_prelacion_academica) => {
    return await Crud.EliminarPrelacionAcademica(id_prelacion_academica)
}

export const ObtenerEstudiantesController = async () => {
    const estudiantes = await Crud.ObtenerEstudiantes()

    const estudiantesProcesados = estudiantes.data.map(estudiante => ({
        ...estudiante,
        // Convertimos "41,42" -> [41, 42]
        carreras: estudiante.carreras ? estudiante.carreras.split(',').map(Number) : []
    }));

    return estudiantesProcesados;
}

export const ObtenerCarrerasController = async () => {
    return await Crud.ObtenerCarreras()
}

export const ObtenerAsignaturasController = async () => {
    return await Crud.ObtenerAsignaturas()
}

export const ObtenerLapsosController = async () => {
    return await Crud.ObtenerLapsos()
}

export const ObtenerFrasesController = async () => {
    return await Crud.ObtenerFrases()
}

export const ObtenerMallasController = async () => {
    return await Crud.ObtenerMallas()
}

export const ObtenerPrelacionesMateriasController = async () => {
    return await Crud.ObtenerPrelacionesMaterias()
}

export const ObtenerPrelacionesAcademicasController = async () => {
    return await Crud.ObtenerPrelacionesAcademicas()
}