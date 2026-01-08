import { config } from '../../config.js';
const { jwtSecret } = config;
import jwt from 'jsonwebtoken';

export const getToken = (req, res, next) =>{
    const token = req.cookies.access_token;
    req.session = {user: null}

    try{
        const data = jwt.verify(token, jwtSecret);
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