import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import { listaUsers, User, listaGames, Game, News} from './data';
import { getUserCart, addProductToCart, removeProductFromCart, processPayment } from './controllers/cartController';
import { PrismaClient } from "./generated/prisma"; 
const prisma = new PrismaClient();


dotenv.config();

const app = express();

// Configuración de middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("assets"));

const PORT = process.env.PORT;

// Ruta raíz
app.get("/", (req: Request, resp: Response) => {
  resp.send("Endpoint raíz");
});


//-------------------------------------------- USUARIOS --------------------------------------------//

// Obtener perfil de usuario
app.get('/api/profile', (req: Request, resp: Response) => {
  const { userId } = req.query; // Usamos el userId que se pasa como query en la URL

  // Si no hay un userId, devolvemos un error
  if (!userId) {
    return resp.status(400).json({ message: 'El ID de usuario es necesario' });
  }

  // Convertir userId a un número (es posible que esté en formato string)
  const userIdNumber = parseInt(userId as string, 10);

  // Verificar que userId es un número válido
  if (isNaN(userIdNumber)) {
    return resp.status(400).json({ message: 'El ID de usuario debe ser un número válido' });
  }

  // Buscar al usuario por su ID (ahora `userIdNumber` es un número)
  const user = listaUsers.find(user => user.id === userIdNumber);

  if (!user) {
    return resp.status(404).json({ message: "Usuario no encontrado" });
  }

  // Si el usuario existe, devolver los datos
  return resp.status(200).json({
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
  const userId = parseInt(req.params.id, 10);

  // Verificar que el userId sea un número válido
  if (isNaN(userId)) {
    return res.status(400).json({ message: "El ID debe ser un número válido" });
  }

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
app.post('/api/login', (req, res) => {
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
  const { email, password } = req.body;

  // Buscar el usuario por su email
  const user = listaUsers.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Cambiar la contraseña
  user.password = password;  // Aquí debes actualizar la contraseña del usuario
  user.updatedAt = new Date();

  return res.status(200).json({
    message: "Correo de recuperación enviado con éxito. Revisa tu bandeja de entrada.",
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

  // Obtener el último ID en la lista y sumarle 1 para el nuevo ID
  const lastUser = listaUsers[listaUsers.length - 1]; // Último usuario
  const newId = lastUser ? lastUser.id + 1 : 1;  // Si hay usuarios, incrementa el ID, sino empieza desde 1

  // Crear un nuevo usuario
  const newUser: User = {
    id: newId,  // Usamos `Date.now()` para simular un ID único
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

// Verificar código de confirmación
app.post('/api/verify-code', (req: Request, res: Response) => {
  const { code } = req.body;

  // Supón que el código válido está guardado en una variable en el servidor
  const validCode = '123456'; // Este código debería estar guardado en alguna parte de la sesión o base de datos

  // Verificamos si el código recibido es igual al código válido
  const isValidCode = code === validCode;

  if (isValidCode) {
    return res.status(200).json({ message: 'Código verificado con éxito' });
  } else {
    return res.status(400).json({ message: 'Código inválido' });
  }
});

//-------------------------------------------- JUEGOS --------------------------------------------//
/*
//Obtener todos los juegos
app.get('/api/games', (req: Request, res: Response) => {
    // Devolver la lista de juegos
    return res.status(200).json(listaGames);
    }
);


//Obtener un juego por ID

app.get('/api/game/:id', (req: Request, res: Response) => {
  // Convertir el ID recibido de la URL en un número
  const gameId = parseInt(req.params.id, 10);

  // Buscar el juego por ID
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

  // Generar un ID para el nuevo juego basado en el último id existente
  const newId = listaGames.length > 0 ? Math.max(...listaGames.map(game => game.id)) + 1 : 1;

  // Crear el nuevo juego
  const newGame: Game = {
    id: newId, // Asignar el id generado
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
  // Convertir el ID recibido en un número
  const gameId = parseInt(req.params.id, 10);
  
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
  // Convertir el ID recibido en un número
  const gameId = parseInt(req.params.id, 10);

  // Buscar el índice del juego por el id
  const gameIndex = listaGames.findIndex(game => game.id === gameId);

  if (gameIndex === -1) {
    return res.status(404).json({ message: "Juego no encontrado" });
  }

  // Eliminar el juego de la lista
  listaGames.splice(gameIndex, 1);

  return res.status(200).json({ message: "Juego eliminado con éxito" });
});

// Endpoint para filtrar juegos
app.get('/api/admin/games/filter', (req: Request, res: Response) => {
  const { categoria, precioMin, precioMax } = req.query;
  let filteredGames = listaGames;

  // Filtrar por categoría
  if (categoria && typeof categoria === 'string') {
    filteredGames = filteredGames.filter(game => game.category === categoria);
  }

  // Filtrar por precio
  if (precioMin && precioMax) {
    const minPrice = parseFloat(precioMin as string);
    const maxPrice = parseFloat(precioMax as string);
    filteredGames = filteredGames.filter(game => game.price >= minPrice && game.price <= maxPrice);
  }

  return res.status(200).json(filteredGames);
});
*/
//-------------------------------------------- NOTICIAS --------------------------------------------//


// Obtener todas las noticias
app.get('/api/admin/news', async (req: Request, res: Response) => {
  try {
    const allNews = await prisma.noticia.findMany();  // Obtiene todas las noticias

    return res.status(200).json(allNews);  // Devuelve las noticias encontradas (vacío si no hay noticias)
  } catch (error) {
    console.error("Error al obtener las noticias:", error);
    return res.status(500).json({ message: "Error al obtener las noticias" });
  }
});


app.get('/api/admin/news/:id', async (req: Request, res: Response) => {
  const newsId = parseInt(req.params.id);  // Convertir el `id` a número

  if (isNaN(newsId)) {
    return res.status(400).json({ message: "ID inválido. Debe ser un número" });
  }

  try {
    const news = await prisma.noticia.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      return res.status(404).json({ message: "Noticia no encontrada con el ID proporcionado" });
    }

    return res.status(200).json(news);  // Devolver la noticia encontrada
  } catch (error) {
    console.error("Error al obtener la noticia:", error);
    return res.status(500).json({ message: "Error al obtener la noticia" });
  }
});


// Agregar una nueva noticia
app.post('/api/admin/news', async (req: Request, res: Response) => {
  const { title, content } = req.body;

  // Limpiar el título para eliminar espacios adicionales
  const cleanedTitle = title.trim();

  try {
    // Verificar si ya existe una noticia con el mismo título
    const existing = await prisma.noticia.findFirst({
      where: { title: cleanedTitle },
    });

    if (existing) {
    return res.status(409).json({ message: "Ya existe una noticia con ese título" });
}

    const newNews = await prisma.noticia.create({
      data: {
        title: cleanedTitle,  // Usar el título limpio
        content,
        fecha: new Date().toISOString(),  // Ajustar fecha si es necesario
        estado: 'activo',  // Asumiendo que el estado es "activo" al crear una noticia
      },
    });

    return res.status(201).json({
      message: 'Noticia agregada con éxito',
      news: newNews,  // Devolver la noticia recién creada
    });
  } catch (error) {
    console.error("Error al agregar noticia:", error);
    return res.status(500).json({ message: "Error al agregar noticia" });
  }
});


app.delete('/api/admin/news/:id', async (req: Request, res: Response) => {
  const newsId = parseInt(req.params.id);  // Convertir el id de la URL a número

  if (isNaN(newsId)) {
    return res.status(400).json({ message: "ID inválido. Debe ser un número" });
  }

  try {
    const news = await prisma.noticia.findUnique({
      where: { id: newsId },
    });

    if (!news) {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }

    // Eliminar la noticia
    await prisma.noticia.delete({
      where: { id: newsId },
    });

    return res.status(200).json({ message: "Noticia eliminada con éxito" });
  } catch (error) {
    console.error("Error al eliminar la noticia:", error);
    return res.status(500).json({ message: "Error al eliminar la noticia" });
  }
});



//--------------------------------------------- CARRITO DE COMPRAS --------------------------------------------//

// Obtener carrito de compras de un usuario
app.get('/api/cart/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const cart = getUserCart(userId); // Función para obtener el carrito del usuario
  return res.status(200).json(cart);
});

// Agregar un producto al carrito de compras
app.post('/api/cart/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  // Agregar el producto al carrito
  addProductToCart(userId, productId, quantity); // Función para agregar al carrito

  return res.status(200).json({ message: "Producto agregado al carrito" });
});

// Eliminar un producto del carrito de compras
app.delete('/api/cart/remove/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  // Eliminar el producto del carrito (implementar lógica aquí)
  return res.status(200).json({ message: "Producto eliminado del carrito" });
});

app.post('/api/cart/checkout', (req: Request, res: Response) => {
  const { items } = req.body;
  // Procesar el pago aquí (por ejemplo, integrar con una pasarela de pago)
  return res.status(200).json({ message: "Pedido confirmado con éxito" });
});

// Realizar pago de los productos en el carrito
app.post('/api/cart/:userId/checkout', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const cart = getUserCart(userId); // Obtener el carrito

  // Lógica para procesar el pago (aquí solo lo simulamos)
  const paymentSuccessful = processPayment(cart); // Función ficticia para procesar el pago

  if (paymentSuccessful) {
    return res.status(200).json({ message: "Pago realizado con éxito" });
  } else {
    return res.status(400).json({ message: "Error en el pago" });
  }
});

//--------------------------------------------- ESTADISTICAS --------------------------------------------//

app.get('/api/stats/monthly-earnings', (req, res) => {
  // Ejemplo de ganancias mensuales, puedes obtenerlos de tu base de datos
  const monthlyEarnings = [10000, 7500, 7800, 9800, 9900, 7800, 7500, 8900, 7700, 9100, 8600, 8000];

  res.status(200).json(monthlyEarnings);
});


/*
/ Verificar si el usuario está autenticado
export function verifyAuthentication(): boolean {
  const isAuth = checkAuthentication();
  
  if (isAuth) {
    const user = getCurrentUser();
    console.log(' Usuario autenticado:', user?.username);
    return true;
  } else {
    console.log(' Usuario no autenticado');
    return false;
  }
}

// Verificar y obtener información del usuario actual
export function verifyUserInfo(): void {
  if (checkAuthentication()) {
    const user = getCurrentUser();
    console.log('=== INFORMACIÓN DEL USUARIO ACTUAL ===');
    console.log('ID:', user?.id);
    console.log('Username:', user?.username);
    console.log('Email:', user?.email);
    console.log('País:', user?.country);
    console.log('Creado:', user?.createdAt);
    console.log('Actualizado:', user?.updatedAt);
  } else {
    console.log('❌ No hay usuario autenticado');
  }
}


*/ 




app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

