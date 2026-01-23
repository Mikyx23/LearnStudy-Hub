import { Pomodoro } from '../models/pomodoro-model.js';

export const ObtenerDatosPomodoroController = async (id_usuario, lapsoActual) => {
    return Pomodoro.ObtenerDatosPomodoro(id_usuario, lapsoActual)
}