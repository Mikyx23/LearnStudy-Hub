import {pool} from './conexion.js';
import bcrypt from 'bcryptjs';

export const InsertarUsuario = async (cedula,carrer,name2,lastname,email,password2) => {
    try{
        const query = 'INSERT INTO tbl_usuarios (cedula,id_carrera,nombres,apellidos,correo,contraseña) VALUES (?,?,?,?,?,?)'; //Query para insertar en la tabla usuarios

        const cedulaParseada = parseInt(cedula,10);

        const saltRounds = 10;
        const contrasenaHash = await bcrypt.hash(password2,saltRounds);  //Encriptar contrasena

        const [resultado] = await pool.execute(query,[cedulaParseada,carrer,name2,lastname,email,contrasenaHash]); //Ejecutar consulta

        if(resultado.affectedRows > 0){ //Verifica si se afecto una columna en la BD (si se ingreso el usuario o no)
            return {
                respuesta: true,
                mensaje: 'Usuario registrado exitosamente'
            };
        }
        else{
            return{
                respuesta: false,
                mensaje: 'No se ha podido registrar el usuario'
            };
        }
    }
    catch(error){
        console.error(error);
        throw error;
    }
}