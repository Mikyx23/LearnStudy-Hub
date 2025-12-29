import { InscripcionCarrera } from "../models/inscription-model.js";

export const CrearInscripcionCarreraController = async (idUsuario, idCarrera) => {
    const nuevaInscripcion = new InscripcionCarrera(null, idUsuario, idCarrera, null, null);
    return await nuevaInscripcion.CrearInscripcionCarrera();
}