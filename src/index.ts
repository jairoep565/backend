import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { listaUsers, User, listaGames, Game } from './data'; 


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

// Obtener un usuario por ID
app.get('/api/user/:id', (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = listaUsers.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  return res.status(200).json(user);
});


//Obtener todos los usuarios
app.get('/api/users', (req: Request, res: Response) => {
  // Devolver la lista de usuarios
  return res.status(200).json(listaUsers);
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

//Verificar si el email ya está registrado
app.get('/api/verify-email', (req: Request, res: Response) => {
  const { email } = req.query;

  const userExists = listaUsers.find(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ message: "El correo ya está registrado" });
  }

  return res.status(200).json({ message: "Correo disponible" });
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

// Cerrar sesión
app.post('/api/logout', (req: Request, res: Response) => {
  // Si estuvieras usando JWT o sesiones, aquí destruirías el token o la sesión.
  // En este caso, solo simulamos el cierre de sesión.
  return res.status(200).json({ message: 'Sesión cerrada' });
});

// Editar perfil de usuario
app.put('/api/update-profile', (req: Request, res: Response) => {
  const { userId, fullName, email, username, country } = req.body;

  // Buscar al usuario por su ID
  const user = listaUsers.find(user => user.id === userId);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Actualizar los datos del usuario
  user.email = email || user.email;
  user.username = username || user.username;
  user.country = country || user.country;
  user.updatedAt = new Date();

  return res.status(200).json({
    message: "Perfil actualizado con éxito",
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

//Obtener todos los juegos
app.get('/api/games', (req: Request, res: Response) => {
    // Devolver la lista de juegos
    return res.status(200).json(listaGames);
    }
);


//Obtener un juego por ID

app.get('/api/game/:id', (req: Request, res: Response) => {
  const gameId = req.params.id;
  const game = listaGames.find(game => game.id === gameId);

  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }

  return res.status(200).json(game);
});


// Agregar un nuevo juego
app.post('/api/admin/games', (req: Request, res: Response) => {
  const { title, description, price, category, platform, releaseDate, onSale, images } = req.body;

  // Validar si el juego ya existe por título
  const existingGame = listaGames.find(game => game.title === title);
  if (existingGame) {
    return res.status(400).json({ message: "El juego ya existe en el catálogo" });
  }

  // Crear el nuevo juego
  const newGame: Game = {
    id: Date.now().toString(), // Usamos Date.now() para generar un ID único
    title,
    description,
    price,
    category,
    platform,
    releaseDate,
    onSale,
    images,
  };

  listaGames.push(newGame); // Guardamos el juego en el catálogo

  return res.status(201).json({
    message: 'Juego agregado con éxito',
    game: newGame,
  });
});

//Editar un juego

app.put('/api/admin/games/:id', (req: Request, res: Response) => {
  const gameId = req.params.id;
  const { title, description, price, category, platform, releaseDate, onSale, images } = req.body;

  // Buscar el juego a editar
  const game = listaGames.find(game => game.id === gameId);

  if (!game) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }

  // Actualizar las propiedades del juego
  game.title = title || game.title;
  game.description = description || game.description;
  game.price = price || game.price;
  game.category = category || game.category;
  game.platform = platform || game.platform;
  game.releaseDate = releaseDate || game.releaseDate;
  game.onSale = onSale !== undefined ? onSale : game.onSale;
  game.images = images || game.images;

  return res.status(200).json({
    message: "Juego actualizado con éxito",
    game,
  });
});

// Eliminar un juego
app.delete('/api/admin/games/:id', (req: Request, res: Response) => {
  const gameId = req.params.id;
  const gameIndex = listaGames.findIndex(game => game.id === gameId);

  if (gameIndex === -1) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }

  listaGames.splice(gameIndex, 1); // Eliminar el juego de la lista

  return res.status(200).json({ message: "Juego eliminado con éxito" });
});

// Filtrar juegos por categoría, fecha de lanzamiento y precios
app.get('/api/admin/games/filter', (req: Request, res: Response) => {
  const { category, releaseDate, priceRange } = req.query;
  let filteredGames = listaGames;

  // Filtrar por categoría
  if (category && typeof category === 'string') {
    filteredGames = filteredGames.filter(game => game.category === category);
  }

  // Filtrar por fecha de lanzamiento
  if (releaseDate && typeof releaseDate === 'string') {
    filteredGames = filteredGames.filter(game => game.releaseDate === releaseDate);
  }

  // Filtrar por precio
  if (priceRange && typeof priceRange === 'string') {
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);

    // Verificamos si minPrice y maxPrice son números válidos antes de filtrar
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      filteredGames = filteredGames.filter(game => game.price >= minPrice && game.price <= maxPrice);
    }
  }

  return res.status(200).json(filteredGames);
});







app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

