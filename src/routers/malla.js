import express from 'express';
export const routerMalla = express.Router();
import { ObtenerMallaCurricularController, ProcesarMallaCurricularController} from '../controllers/malla-controller.js';

routerMalla.get('/', async (req,res) => {
    const {user} = req.session;

    const pensum = await ObtenerMallaCurricularController(user.carrer);

    const pensumProcesado = await ProcesarMallaCurricularController(pensum.pensum);

    res.render('malla', { pensum: pensumProcesado});
});