import express from 'express';
export const routerDashboard = express.Router(); // Enrutador para el panel principal (Dashboard)
import { 
    ObtenerDatosUsuarioController,
    ObtenerDatosAcademicosController,
    ObtenerClasesDiaActualController,
    ObtenerFraseController
} from '../controllers/dashboard-controller.js';
import { config } from '../../config.js';
const {lapsoActual} = config;
import { DateTime } from 'luxon';

routerDashboard.get('/', async(req,res) => {
    try{
        const {user} = req.session;

        const result = await ObtenerDatosUsuarioController(user.id, lapsoActual);
        const result2 = await ObtenerDatosAcademicosController(user.carrer, user.id, lapsoActual);
        const result3 = await ObtenerClasesDiaActualController(user.carrer, user.id, lapsoActual, user.timezone);
        const result4 = await ObtenerFraseController();

        res.render('dashboard', {
            user: result?.user || {},
            classes: result3?.today || [],
            next_exam: result2?.data?.[0] || {},
            exams: result2?.data || [],
            DateTime: DateTime,
            frase: result4?.frase || '',
            userData: res.userData
        });
    }
    catch(error){
        // throw new Error('No se ha podido obtener el dashboard');
        console.error(error)
    }
});