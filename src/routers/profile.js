import express from 'express';
import { ObtenerPerfilUsuarioController, GuardarFotoPerfilController } from '../controllers/profile-controller.js';
import { config } from '../../config.js';
const { lapsoActual } = config;
import { CalculateAverage } from '../../public/utils/utils.js';
export const routerProfile = express.Router();
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../public/uploads/profiles');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const userId = req.session?.user?.id || 'unknown';
        cb(null, `${userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage }); // Añade esta línea justo después del storage

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
        throw new Error('Error al obtener el perfil');
    }
});

routerProfile.post('/foto-perfil', upload.single('fotoPerfil'), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).send('No se subió ninguna imagen.');
        }

        const { user } = req.session;

        if (!req.file) {
            return res.status(400).send('No se seleccionó ninguna imagen');
        }

        const rutaFoto = `/uploads/profiles/${req.file.filename}`;

        const result = await GuardarFotoPerfilController(user.id, rutaFoto);

        if(result.success){
            res.redirect('/api/perfil');
        }else {
            return res.status(404).send(result.message);
        }
    } catch (error) {
        console.error("Error en endpoint foto-perfil:", error);
        res.status(500).send('Error al actualizar el perfil');
    }
});