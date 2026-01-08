import {Malla} from '../models/malla-model.js';

export const ObtenerMallaCurricularController = async (carrer) => {
    return await Malla.ObtenerMallaCurricular(carrer);
}