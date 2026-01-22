import { Dashboard } from "../models/dashboard-model.js";
import { DateTime } from 'luxon';

export const ObtenerDatosUsuarioController = async (id_usuario, id_lapso) => {
    return await Dashboard.ObtenerDatosUsuario(id_usuario, id_lapso);
}

export const ObtenerDatosAcademicosController = async (id_carrera, id_usuario, id_lapso) => {
    return await Dashboard.ObtenerDatosAcademicos(id_carrera, id_usuario, id_lapso);
}

export const ObtenerClasesDiaActualController = async (id_usuario, id_lapso, time_zone) => {
    const diaActual = DateTime.now().setZone(time_zone).weekday;

    return await Dashboard.ObtenerClasesDiaActual(id_usuario, id_lapso, diaActual);
}