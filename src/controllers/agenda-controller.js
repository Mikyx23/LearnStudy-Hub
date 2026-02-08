import {Agenda} from '../models/agenda-model.js'

export const CrearEvaluacionController = async (id_curso, descripcion, corte, porcentaje, fecha_entrega) => {
    return Agenda.CrearEvaluacion(id_curso, descripcion, corte, porcentaje, fecha_entrega);
}

export const EliminarEvaluacionController = async (id_evaluacion) => {
    return Agenda.EliminarEvaluacion(id_evaluacion);
}

export const ActualizarEstadoEvaluacionController = async (id_evaluacion, estado) => {
    return Agenda.ActualizarEstadoEvaluacion(id_evaluacion, estado);
}

export const ObtenerCursosAgendaController = async (id_carrera,id_usuario, id_lapso) => {
    return Agenda.ObtenerCursosAgenda(id_carrera,id_usuario, id_lapso);
}

export const ObtenerEvaluacionesController = async (id_carrera,id_usuario, id_lapso) => {
    return Agenda.ObtenerEvaluaciones(id_carrera,id_usuario, id_lapso);
}