import {Curso} from "../models/courses-model.js";

export const InsertarCursoController = async (id_usuario,id_asignatura_carrera,id_lapso) => {
    return await Curso.InsertarCurso(id_usuario,id_asignatura_carrera,id_lapso);
}

export const ObtenerCursosController = async (id_carrera,id_usuario,id_lapso) => {
    return await Curso.ObtenerCursos(id_carrera,id_usuario,id_lapso);
}

export const ObtenerCursosDisponiblesController = async (id_usuario,id_lapso,id_carrera) => {
    return await Curso.ObtenerCursosDisponibles(id_usuario,id_lapso,id_carrera);
}