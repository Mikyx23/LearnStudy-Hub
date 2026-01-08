import express from 'express';
import { ObtenerPerfilUsuarioController } from '../controllers/profile-controller.js';
import { LAPSO_ACTUAL } from '../../config.js';
import { CalculateAverage } from '../../public/utils/utils.js';
export const routerProfile = express.Router();

routerProfile.get('/', async (req,res) => {
    const {user} = req.session;

    const result = await ObtenerPerfilUsuarioController(user.id,user.carrer,LAPSO_ACTUAL);
    const average = await CalculateAverage(result.user);

    if(result.success){
        res.render('profile', {user: result.user[0], subject: result.user, average: average});
    }
});