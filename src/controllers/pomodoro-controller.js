import { Pomodoro } from '../models/pomodoro-model.js';

export const CrearSesionPomodoroController = async (id_evaluacion, descripcion_sesion, hora_inicio, hora_final, ciclos) => {
    return Pomodoro.CrearSesionPomodoro(id_evaluacion, descripcion_sesion, hora_inicio, hora_final, ciclos);
}

export const ObtenerDatosPomodoroController = async (id_usuario, lapsoActual) => {
    return Pomodoro.ObtenerDatosPomodoro(id_usuario, lapsoActual)
}