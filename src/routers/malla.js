import express from 'express';
export const routerMalla = express.Router();
import { ObtenerMallaCurricularController } from '../controllers/malla-controller.js';

routerMalla.get('/', async (req,res) => {
    const {user} = req.session;

    const pensum = await ObtenerMallaCurricularController(user.carrer);

    res.render('malla', { pensum: pensum.pensum, userData: res.userData });
});