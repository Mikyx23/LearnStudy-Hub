import { Pomodoro } from '../models/pomodoro/pomodoro-model.js';

export const CrearSesionPomodoroController = async (id_evaluacion, descripcion_sesion, hora_inicio, hora_final, ciclos) => {
    return Pomodoro.CrearSesionPomodoro(id_evaluacion, descripcion_sesion, hora_inicio, hora_final, ciclos);
}

export const LimpiarPomodoroController = async (id_usuario, id_lapso) => {
    return Pomodoro.LimpiarPomodoro(id_usuario, id_lapso);
}

export const LimpiarSesionPomodoroController = async (id_sesion) => {
    return Pomodoro.LimpiarSesionPomodoro(id_sesion);
}

export const ObtenerDatosPomodoroController = async (id_carrera, id_usuario, lapsoActual) => {
    return Pomodoro.ObtenerDatosPomodoro(id_carrera,id_usuario, lapsoActual)
}

export const ObtenerDatosSesionesController = async (id_carrera,id_usuario, lapsoActual) => {
    return Pomodoro.ObtenerDatosSesiones(id_carrera,id_usuario, lapsoActual)
}