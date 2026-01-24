import {Horario} from '../models/horario-model.js';

export const CrearHorarioController = async (datos) => {
    const horario = datos.map(h => [
        h.id_curso,
        h.dia_semana,
        h.hora_inicio,
        h.hora_final,
        h.aula
    ]);

    return await Horario.CrearHorario(horario);
}

export const ObtenerCursosHorarioController = async (id_usuario,id_lapso) => {
    return await Horario.ObtenerCursosHorario(id_usuario,id_lapso);
}

export const ObtenerHorarioController = async (id_usuario,id_lapso) => {
    return await Horario.ObtenerHorario(id_usuario,id_lapso);
}