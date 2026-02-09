import { Calificaciones } from "../models/qualifications/qualifications-model.js";

export const InsertarCalificacionController = async (id_curso, id_evaluacion, calificacion) => {
    return await Calificaciones.InsertarCalificacion(id_curso, id_evaluacion, calificacion);
}

export const InsertarHistorialAcademicoController = async (id_usuario, periodo, codigo, materia, nota, estado) => {
    return await Calificaciones.InsertarHistorialAcademico(id_usuario, periodo, codigo, materia, nota, estado);
}

export const ObtenerCursosCalificacionesController = async (id_carrera,id_usuario,id_lapso) => {
    return await Calificaciones.ObtenerCursosCalificaciones(id_carrera,id_usuario,id_lapso);
}

export const ObtenerEvaluacionesCalificacionesController = async (id_carrera,id_usuario,id_lapso) => {
    return await Calificaciones.ObtenerEvaluacionesCalificaciones(id_carrera,id_usuario,id_lapso);
}

export const ObtenerMallaCalificacionesController = async (id_carrera) => {
    return await Calificaciones.ObtenerMallaCalificaciones(id_carrera);
}

export const ObtenerHistorialAcademicoController = async (id_usuario) => {
    return await Calificaciones.ObtenerHistorialAcademico(id_usuario);
}

export const ObtenerLapsosAcademicosController = async () => {
    return await Calificaciones.ObtenerLapsosAcademicos();
}