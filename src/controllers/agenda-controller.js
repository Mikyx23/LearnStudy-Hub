import {Agenda} from '../models/agenda-model.js'

export const CrearEvaluacionController = async (id_curso, descripcion, corte, porcentaje, fecha_entrega) => {
    return Agenda.CrearEvaluacion(id_curso, descripcion, corte, porcentaje, fecha_entrega);
}

export const ObtenerCursosAgendaController = async (id_usuario, id_lapso) => {
    return Agenda.ObtenerCursosAgenda(id_usuario, id_lapso);
}

export const ObtenerEvaluacionesController = async (id_usuario, id_lapso) => {
    return Agenda.ObtenerEvaluaciones(id_usuario, id_lapso);
}