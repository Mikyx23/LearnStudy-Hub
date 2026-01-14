import { Dashboard } from "../models/dashboard-model.js";

export const ObtenerDatosUsuarioController = async (id_usuario, id_lapso) => {
    return await Dashboard.ObtenerDatosUsuario(id_usuario, id_lapso);
}

export const ObtenerDatosAcademicosController = async (id_carrera, id_usuario, id_lapso) => {
    return await Dashboard.ObtenerDatosAcademicos(id_carrera, id_usuario, id_lapso);
}