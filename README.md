# LearnStudy-Hub

> Plataforma educativa creada con Node.js y Express para gestionar cursos, horarios y perfil de usuario.

## Características
- Gestión de cursos y mallas curriculares
- Agenda y horario
- Registro y recuperación de contraseña
- Perfil de usuario y calificaciones
- Pomodoro integrado

## Tecnologías
- Node.js
- Express
- EJS (vistas)
- MySQL (mysql2)
- Luxon, JSON Web Tokens, bcryptjs

## Requisitos
- Node.js v16+ y npm
- MySQL (o servicio compatible) para la base de datos

## Instalación
1. Clona el repositorio:

   git clone <repositorio>
   cd LearnStudy-Hub

2. Instala dependencias:

   npm install

3. Crea un archivo `.env` basado en tus variables (host, usuario, contraseña, DB, JWT_SECRET, etc.).

## Ejecución
- Modo desarrollo (con reinicio automático):

  npm run dev

- Modo producción:

  npm start

La aplicación arranca desde `app.js`.

## Estructura del proyecto (resumen)
- `app.js` - punto de entrada
- `config.js` - configuración general
- `src/controllers/` - controladores
- `src/models/` - modelos y consultas a la base de datos
- `src/routers/` - rutas/routers
- `views/` - plantillas EJS
- `public/` - assets públicos (JS, CSS, imágenes)

## Uso
- Rutas principales: login, recuperación de contraseña, dashboard, curso, malla y perfil.
- Frontend con plantillas EJS y scripts en `public/` y `views/javascript/`.

## Contribuir
1. Crea un fork
2. Abre una rama con tu feature: `git checkout -b feature/nombre`
3. Haz commits claros y pide pull request

## Licencia
Proyecto con licencia ISC (ver `package.json`).

## Contacto
Si tienes dudas o quieres colaborar, abre un issue o contacta al autor del repositorio.
# LearnStudy-Hub
Proyecto de Electiva II (PROGRAMACION WEB)

## Ejemplos: funciones principales
Abajo hay bloques de código con las funciones más importantes de cada apartado. Copia los fragmentos según necesites.

**Servidor (inicio y enrutado):**
```javascript
// fragmento de app.js
app.use(getToken);

// rutas públicas
app.use('/api/login', routerLogin);

// proteger rutas siguientes con JWT en cookie
app.use(authenticateUser);

app.use('/api/dashboard', routerDashboard);
app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
```

**Middleware de autenticación (`src/middleware/auth.js`):**
```javascript
export const getToken = (req, res, next) => {
  const token = req.cookies.access_token;
  req.session = { user: null };
  try { req.session.user = jwt.verify(token, jwtSecret); } catch {}
  next();
};

export const authenticateUser = (req, res, next) => {
  if (!req.session.user) return res.status(401).send('Acceso denegado');
  next();
};
```

**Conexión a la base de datos (`src/models/conexion.js`):**
```javascript
import mysql2 from 'mysql2/promise';
export const pool = mysql2.createPool({
  host: 'localhost', user: 'root', password: '1122', port: 3307,
  database: 'db_learnstudy', waitForConnections: true, connectionLimit: 10
});
```

**Modelo de usuarios (fragmentos de `src/models/users-model.js`):**
```javascript
CrearUsuario = async () => {
  const contrasenaHash = await bcrypt.hash(this.contraseña, saltRounds);
  const [resultado] = await pool.execute(query, [cedulaParseada, this.nombre, this.apellido, this.correo, contrasenaHash]);
  return resultado.affectedRows > 0 ? { respuesta: true, id: resultado.insertId } : { respuesta: false };
}

static VerificarUsuario = async (cedula, password) => {
  const [rows] = await pool.execute(query, [cedulaParseada]);
  if (rows.length > 0 && compareSync(password, rows[0].contraseña)) return { success: true, id: rows[0].id_usuario, name: rows[0].nombre };
  return { success: false };
}
```

**Ruta de login (autenticación y cookie) – `src/routers/login.js`:**
```javascript
routerLogin.post('/', async (req, res) => {
  const { cedula, password, timezone } = req.body;
  const result = await VerificarUsuario(cedula, password);
  if (result.success) {
    const token = jwt.sign({ id: result.id, name: result.name }, jwtSecret, { expiresIn: '1h' });
    res.cookie('access_token', token, { httpOnly: true, sameSite: 'strict', maxAge: 3600000 });
    return res.status(200).json({ redirectUrl: '/api/dashboard' });
  }
  res.status(400).json({ message: 'Cédula o contraseña inválida' });
});
```

**Controlador de usuarios (ejemplo) – `src/controllers/users-controller.js`:**
```javascript
export const CrearUsuarioController = async (name, lastname, cedula, email, password) => {
  const usuario = new Usuarios(null, name, lastname, cedula, email, password);
  return await usuario.CrearUsuario();
}
```

## Capturas de pantalla
#### Ejemplo:
```
![Login](/public/images/screenshots/login.png)
 Para añadir capturas, coloca las imágenes en `public/images/screenshots/`.

### Capturas incluidas

![Login](public/images/screenshots/login.svg)

![Dashboard](public/images/screenshots/dashboard.svg)

![Malla]()

![agenda]()

![Horario]()

![Asignaturas]()

![calificaciones]()

![Perfil](public/images/screenshots/perfil.svg)

![crud]()

![logo](public\images\Logo_sin_fondo.png)
