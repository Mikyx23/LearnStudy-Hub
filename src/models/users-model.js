import {pool} from './conexion.js';
import bcrypt, { compareSync } from 'bcryptjs';

export class Usuarios{
    constructor(id_usuario,nombre,apellido,cedula,correo,contraseña){
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.apellido = apellido;
        this.cedula = cedula;
        this.correo = correo;
        this.contraseña = contraseña;
    }

    CrearUsuario = async () => {
        try{
            const query = 'INSERT INTO tbl_usuarios (cedula,nombre,apellido,correo,contraseña) VALUES (?,?,?,?,?)'; //Query para insertar en la tabla usuarios

            const cedulaParseada = parseInt(this.cedula,10);

            const saltRounds = 10;
            const contrasenaHash = await bcrypt.hash(this.contraseña,saltRounds);  //Encriptar contrasena

            const [resultado] = await pool.execute(query,[cedulaParseada,this.nombre,this.apellido,this.correo,contrasenaHash]); //Ejecutar consulta

            if(resultado.affectedRows > 0){ //Verifica si se afecto una columna en la BD (si se ingreso el usuario o no)
                return {
                    respuesta: true,
                    id: resultado.insertId,
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

    static ObtenerUsuario = async (id) => {
        try{
            const query = 'SELECT nombre, apellido FROM tbl_usuarios WHERE id_usuario = ?';
            const [rows] = await pool.execute(query,[id]);

            if(rows.length > 0){
                return {
                    success: true,
                    nombre: rows[0].nombre,
                    apellido: rows[0].apellido
                }
            }
            else{
                return{
                    success: false
                }
            }
        }
        catch{
            throw new Error('Ha ocurrido un error inesperado');
        }
    }

    static VerificarUsuario = async (cedula,password) => {
        try{
            const query = 'SELECT id_usuario, nombre, apellido, contraseña FROM tbl_usuarios WHERE cedula = ?';
            const cedulaParseada = parseInt(cedula,10);
            const [rows] = await pool.execute(query,[cedulaParseada]);

            if(rows.length > 0 && bcrypt.compareSync(password,rows[0].contraseña)){
                return {
                    success: true,
                    id: rows[0].id_usuario,
                    name: rows[0].nombre,
                    lastname: rows[0].apellido
                };
            }
            else{
                return {
                    success: false
                };
            }
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado');
        }
    }

    static VerificarCorreo = async (correo) => {
        try{
            const query = 'SELECT COUNT(*) FROM tbl_usuarios WHERE correo = ?'; //Query para verificar si el correo ya existe
            const [rows] = await pool.execute(query,[correo]); //Ejecutar consulta
            const count = rows[0]['COUNT(*)']; //Obtener el conteo de correos encontrados
            return count > 0; //Retorna true si el correo ya existe, false si no
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado'); 
        } 
    }

    static VerificarCedula = async (cedula) => {
        try{
            const query = 'SELECT COUNT(*) FROM tbl_usuarios WHERE cedula = ?';
            const [rows] = await pool.execute(query,[cedula]);
            const count = rows[0]['COUNT(*)'];
            return count > 0;
        }
        catch(error){
            throw new Error('Ha ocurrido un error inesperado'); 
        }
    }
}