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
    // Si la petición es para login, la dejamos pasar sin preguntar
    if (req.path.startsWith('/api/login') || req.path === '/') {
        return next();
    }

    const user = req.session?.user;

    if (!user) {
        // Importante: Si es una petición API (AJAX/Fetch), responde con JSON, no con HTML
        // if (req.path.startsWith('/api/')) {
        //     return res.status(401).json({ message: 'No autorizado: Inicie sesión' });
        // }
        return res.status(401).send('<h1>Acceso denegado: Token no proporcionado</h1>');
    }
    next();
}