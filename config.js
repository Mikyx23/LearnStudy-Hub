import 'dotenv/config';

// Centralizamos la configuración y validamos tipos de datos
export const config = {
    port: Number(process.env.PORT) || 3000,
    jwtSecret: process.env.SECRET_JWT_KEY, // Se lee del .env
    saltRounds: Number(process.env.SALT_ROUNDS) || 10,
    lapsoActual: Number(process.env.LAPSO_ACTUAL) || 1,
};

if (!config.jwtSecret) {
    throw new Error("FATAL ERROR: SECRET_JWT_KEY no está definida en el archivo .env");
}