import { InsertarUsuario } from '../models/users-model.js';
export const InsertarUsuarioController = async (cedula,carrer,name2,lastname,email,password2) =>{
    return await InsertarUsuario(cedula,carrer,name2,lastname,email,password2);
}