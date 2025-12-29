import { RecuperarContraseña } from "../models/recover-model.js";

export const CrearRecuperarContraseñaController = async (id_usuario,pregunta1,respuesta1,pregunta2,respuesta2,pregunta3,respuesta3) => {
    return await RecuperarContraseña.CrearRecuperarContraseña(id_usuario,pregunta1,respuesta1,pregunta2,respuesta2,pregunta3,respuesta3);
}

export const ObtenerPreguntaSeguridadController = async (id_usuario) => {
    return await RecuperarContraseña.ObtenerPreguntaSeguridad(id_usuario);
}

export const ValidarRespuestaSeguridadController = async (respuesta,id_recover) => {
    return await RecuperarContraseña.ValidarRespuestaSeguridad(respuesta,id_recover);
}