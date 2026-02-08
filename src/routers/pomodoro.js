import express from 'express';
export const routerPomodoro = express.Router();
import { 
    ObtenerDatosPomodoroController, 
    CrearSesionPomodoroController, 
    ObtenerDatosSesionesController,
    LimpiarPomodoroController,
    LimpiarSesionPomodoroController 
} from '../controllers/pomodoro-controller.js';
import { config } from '../../config.js';
const { lapsoActual } = config;
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

routerPomodoro.get('/', async (req, res) => {
    try {
        const { user } = req.session;
        const result = await ObtenerDatosPomodoroController(user.carrer,user.id, lapsoActual);
        const result2 = await ObtenerDatosSesionesController(user.carrer,user.id, lapsoActual);

        // Ruta absoluta al script
        const scriptPath = path.join(__dirname, '../data-structures/pila.py');
        const pythonProcess = spawn('python', [scriptPath]);

        let dataFromPython = "";
        let stderrData = "";

        pythonProcess.stdin.write(JSON.stringify(result2.data || []));
        pythonProcess.stdin.end();

        pythonProcess.stdout.on('data', (data) => {
            dataFromPython += data.toString();
        });

        // Capturar errores de Python para debugging
        pythonProcess.stderr.on('data', (data) => {
            stderrData += data.toString();
        });

        pythonProcess.on('close', (code) => {
            let sesionesProcesadas = [];
            
            if (code !== 0) {
                console.error(`Python script falló con código ${code}: ${stderrData}`);
            } else {
                try {
                    // Validar que dataFromPython no esté vacío antes de parsear
                    if (dataFromPython.trim()) {
                        sesionesProcesadas = JSON.parse(dataFromPython);
                    }
                } catch (e) {
                    console.error("Error parseando JSON de Python. Recibido:", dataFromPython, e);
                }
            }

            res.render('pomodoro', {
                data: result.data || [],
                sesiones: sesionesProcesadas || [],
                userData: res.userData
            });
        });
    } catch (error) {
        console.error("Error en routerPomodoro:", error);
        res.status(500).send("Error interno");
    }
});

routerPomodoro.post('/guardar', async (req,res) => {
    try{
        const { id_evaluacion, descripcion_sesion, hora_inicio, hora_final, ciclos } = req.body;

        const result = await CrearSesionPomodoroController(id_evaluacion, descripcion_sesion, hora_inicio, hora_final, ciclos);

        if(result.success){
            res.status(200).json({redirectUrl: '/api/pomodoro'});
        }
        else{
            res.status(500).send(result.message);
        }
    }
    catch(error){
        throw new Error('Error al guardar el pomodoro');
    }
});

routerPomodoro.delete('/limpiar', async (req, res) => {
    try{
        const { user } = req.session;
        const result = await LimpiarPomodoroController(user.id, lapsoActual);

        if(result.success){
            res.status(200).json({redirectUrl: '/api/pomodoro'});
        }
        else{
            res.status(500).send(result.message)
        }  
    }
    catch(error){
        throw new Error('Error al limpiar el pomodoro');
    }
});

routerPomodoro.delete('/eliminar/:id', async (req, res) => {
    try{
        const { id } = req.params;
        console.log(id)
        const result = await LimpiarSesionPomodoroController(id);

        if(result.success){
            res.status(200).json({redirectUrl: '/api/pomodoro'});
        }
        else{
            res.status(500).send(result.message);
        }
    }
    catch(error){
        throw new Error('Error al eliminar la sesión del pomodoro');
    }
});