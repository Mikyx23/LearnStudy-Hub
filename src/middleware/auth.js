import { SECRET_JWT_KEY } from '../../config.js';
import jwt from 'jsonwebtoken';

export const getToken = (req, res, next) =>{
    const token = req.cookies.access_token;
    req.session = {user: null}

    try{
        const data = jwt.verify(token, SECRET_JWT_KEY);
        req.session.user = data;
    }catch{}

    next()
};

export const authenticateUser = (req, res, next) => {
    const {user} = req.session;

    if (!user) {
        return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado' });
    }
    next()
}