import express from 'express';
import { ObtenerPerfilUsuarioController } from '../controllers/profile-controller.js';
import { config } from '../../config.js';
const { lapsoActual } = config;
import { CalculateAverage } from '../../public/utils/utils.js';
export const routerProfile = express.Router();

routerProfile.get('/', async (req,res) => {
    try{
        const {user} = req.session;
        let average = 0;

        const result = await ObtenerPerfilUsuarioController(user.id,user.carrer,lapsoActual);

        const subjectsArray = JSON.parse(result.user[0].subjects);

        if(result && result.success && result.user) {
            average = await CalculateAverage(subjectsArray);
        }

        if(result.success){
            res.render('profile', {user: result.user[0], subject: subjectsArray, average: average});
        }else {
            return res.status(404).send(result.message);
        }
    }
    catch(error){
        console.log(error);
        // throw new Error('Error al obtener el perfil');
    }
});