import express from 'express';
export const routerDashboard = express.Router();
import { 
    ObtenerDatosUsuarioController,
    ObtenerDatosAcademicosController,
    ObtenerClasesDiaActualController 
} from '../controllers/dashboard-controller.js';
import { config } from '../../config.js';
const {lapsoActual} = config;
import { DateTime } from 'luxon';

routerDashboard.get('/', async(req,res) => {
    try{
        const {user} = req.session;

        const result = await ObtenerDatosUsuarioController(user.id, lapsoActual);
        const result2 = await ObtenerDatosAcademicosController(user.carrer, user.id, lapsoActual);
        const result3 = await ObtenerClasesDiaActualController(user.id, lapsoActual, user.timezone);

        res.render('dashboard', {
            user: result?.user || {},
            classes: result3?.today || [],
            next_exam: result2?.data?.[0] || {},
            exams: result2?.data || [],
            DateTime: DateTime
        });
    }
    catch(error){
        // throw new Error('No se ha podido obtener el dashboard');
        console.error(error)
    }
});