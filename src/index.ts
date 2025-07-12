import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { listaUsers, User } from './data'; 
import { loginUser } from './controllers/authController';
import { registerUser } from './controllers/registerUser';

dotenv.config();

const app = express();

// Configuración de middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("assets"));

const PORT = process.env.PORT || 3000;

// Ruta raíz
app.get("/", (req: Request, resp: Response) => {
  resp.send("Endpoint raíz");
});

// Ruta para obtener el perfil del usuario
app.get('/api/profile', (req: Request, res: Response) => {
  const user = listaUsers[0]; // Aquí deberías verificar al usuario autenticado
  if (!user) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  res.status(200).json({
    id: user.id,
    email: user.email,
  });
});


// Ruta de login
app.post('/api/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const authResponse = loginUser(email, password);  // Llamamos a la función loginUser
    res.status(200).json(authResponse); // Enviar respuesta con los datos del usuario
  } catch (error: unknown) {
    // Verificamos si el error es una instancia de Error
    if (error instanceof Error) {
      res.status(401).json({ message: error.message }); // Ahora `message` es accesible
    } else {
      res.status(500).json({ message: 'Error desconocido' }); // En caso de que el error no sea una instancia de `Error`
    }
  }
});

app.post('/api/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const newUser = await registerUser(email, password); // Llamar a la función de registro
    res.status(201).json({
      message: 'Usuario creado',
      user: {
        id: newUser.id,
        email: newUser.email,
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message }); // Error si no se pudo crear el usuario
    } else {
      res.status(500).json({ message: 'Error desconocido' });
    }
  }
});

// Ruta para cerrar sesión
app.post('/api/logout', (req: Request, res: Response) => {
  // Aquí normalmente se eliminaría la sesión del usuario o se invalidaría el token
  res.status(200).json({ message: 'Sesión cerrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
