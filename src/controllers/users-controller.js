import { Usuarios } from '../models/users-model.js';
export const CrearUsuarioController = async (name,lastname,cedula,email,password) =>{
    const usuario = new Usuarios(null,name,lastname,cedula,email,password);
    return await usuario.CrearUsuario();
}

export const VerificarCorreoController = async (email) => {
    return await Usuarios.VerificarCorreo(email);
}