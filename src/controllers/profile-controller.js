import { Perfil } from "../models/profile-model.js";

export const ObtenerPerfilUsuarioController = async (id_usuario,id_carrera,id_lapso) => {
    return await Perfil.ObtenerPerfilUsuario(id_usuario,id_carrera,id_lapso);
}

export const GuardarFotoPerfilController = async (id_usuario,foto) => {
    return await Perfil.GuardarFotoPerfil(id_usuario,foto);
}