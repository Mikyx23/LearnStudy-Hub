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
    if (req.path.startsWith('/api/login') || req.path === '/') {
        return next();
    }

    const user = req.session?.user;

    if (!user) {
        return res.status(401).send('<h1>Acceso denegado: Token no proporcionado</h1>');
    }
    next();
}

export const userData = (req, res, next) => {
    const {user} = req.session

    const username = user.name + " " + user.lastname
    const nameInitials = user.name[0] + user.lastname[0]

    res.userData = {
        name: username,
        initials: nameInitials
    };
    next();
}