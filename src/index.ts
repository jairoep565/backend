import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { listaUsers, User } from './data'; 


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


// Obtener perfil de usuario
app.get('/api/profile', (req: Request, res: Response) => {
  const { userId } = req.query; // Usamos el userId que se pasa como query en la URL

  // Si no hay un userId, devolvemos un error
  if (!userId) {
    return res.status(400).json({ message: 'El ID de usuario es necesario' });
  }

  // Buscar al usuario por su ID
  const user = listaUsers.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Si el usuario existe, devolver los datos
  return res.status(200).json({
    id: user.id,
    email: user.email,
    username: user.username,
    country: user.country,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

// Endpoint Login
app.post('/api/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Buscar al usuario por el email
  const user = listaUsers.find(user => user.email === email);

  if (!user) {
    return res.status(401).json({ message: "Usuario no encontrado" });
  }

  // Verificar que la contraseña sea correcta
  if (user.password !== password) {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }

  // Si el login es exitoso, respondemos con los datos del usuario
  return res.status(200).json({
    message: "Login exitoso",
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      country: user.country,
    },
  });
});


//Olvidar contraseña

app.post('/api/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;  // Desestructuramos el email del cuerpo de la solicitud

  // Buscar el usuario por su email
  const user = listaUsers.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });  // Si no existe el usuario
  }

  // Simulamos el envío del correo para recuperación de contraseña
  // Aquí puedes imaginar que se envía un correo de recuperación al usuario
  return res.status(200).json({
    message: "Correo de recuperación enviado con éxito. Revisa tu bandeja de entrada."
  });
});

//Registro de usuario

app.post('/api/register', (req: Request, res: Response) => {
  const { fullName, email, password, username, country } = req.body;

  // Validar si el correo electrónico ya está registrado
  const userExists = listaUsers.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: "El correo electrónico ya está registrado" });
  }

  // Validar si el username ya está registrado
  const usernameExists = listaUsers.find(user => user.username === username);
  if (usernameExists) {
    return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
  }
  // Crear un nuevo usuario
  const newUser: User = {
    id: Date.now().toString(),  // Usamos `Date.now()` para simular un ID único
    email,
    password,  // La contraseña aún está en texto claro (por ahora)
    username,
    country,
    createdAt: new Date(),
  };

  listaUsers.push(newUser); // Guardar al usuario en la lista simulada

  // Responder con los datos del nuevo usuario
  return res.status(201).json({
    message: 'Usuario creado exitosamente',
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      country: newUser.country,
    },
  });
});

//Cambiar contraseña

app.put('/api/change-password', (req: Request, res: Response) => {
  const { userId, currentPassword, newPassword } = req.body;

  // Buscar al usuario por su ID
  const user = listaUsers.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Verificar que la contraseña actual sea correcta
  if (user.password !== currentPassword) {
    return res.status(401).json({ message: "Contraseña actual incorrecta" });
  }

  // Cambiar la contraseña
  user.password = newPassword;
  user.updatedAt = new Date();  // Actualizamos la fecha de la última actualización

  return res.status(200).json({
    message: "Contraseña cambiada con éxito",
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      country: user.country,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,  
    },
  });
});



app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
