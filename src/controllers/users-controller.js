import { Usuarios } from '../models/users-model.js';

export const CrearUsuarioController = async (name,lastname,cedula,email,password) =>{
    const usuario = new Usuarios(null,name,lastname,cedula,email,password);
    return await usuario.CrearUsuario();
}

export const VerificarUsuario = async (cedula,password) => {
    return await Usuarios.VerificarUsuario(cedula,password);
}

export const VerificarCorreoController = async (email) => {
    return await Usuarios.VerificarCorreo(email);
}

export const VerificarCedulaController = async (cedula) => {
    return await Usuarios.VerificarCedula(cedula);
}

export const ObtenerUsuarioController = async (id) => {
    return await Usuarios.ObtenerUsuario(id);
}

export const ObtenerIdUsuarioController = async (cedula) => {
    return await Usuarios.ObtenerIdUsuario(cedula);
}

export const ActualizarContraseñaController = async (id_usuario,nuevaContrasena) => {
    return await Usuarios.ActualizarContraseña(id_usuario,nuevaContrasena)
}