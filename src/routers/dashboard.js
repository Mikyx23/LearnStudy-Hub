import express from 'express';
export const routerDashboard = express.Router();
import { 
    ObtenerDatosUsuarioController,
    ObtenerDatosAcademicosController 
} from '../controllers/dashboard-controller.js';
import { config } from '../../config.js';
const {lapsoActual} = config;

routerDashboard.get('/', async(req,res) => {
    try{
        const {user} = req.session;

        const result = await ObtenerDatosUsuarioController(user.id, lapsoActual);
        // const result2 = await ObtenerDatosAcademicosController(user.carrer, user.id, lapsoActual);

        res.render('dashboard', {
            user: result.user || {},
            classes: [],
            next_exam: {},
            exams: []
        });
    }
    catch(error){
        throw new Error('No se ha podido obtener el dashboard');
    }
});