import { Calificaciones } from "../models/qualifications-model.js";

export const InsertarCalificacionController = async (id_curso, id_evaluacion, calificacion) => {
    return await Calificaciones.InsertarCalificacion(id_curso, id_evaluacion, calificacion);
}

export const ObtenerCursosCalificacionesController = async (id_usuario,id_lapso) => {
    return await Calificaciones.ObtenerCursosCalificaciones(id_usuario,id_lapso);
}

export const ObtenerEvaluacionesCalificacionesController = async (id_usuario,id_lapso) => {
    return await Calificaciones.ObtenerEvaluacionesCalificaciones(id_usuario,id_lapso);
}