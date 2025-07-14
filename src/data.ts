export interface User {
  id: string;
  email: string;
  password: string; // En un entorno real, esto debería ser un hash (ej. bcrypt)
  username: string;  // Agregar el campo de nombre de usuario
  country: string;   // Agregar el campo de país
  createdAt: Date;
  updatedAt?: Date;  // Opcional: Se actualizaría si el perfil del usuario se edita
}

// Lista de usuarios simulada
export const listaUsers: User[] = [
  {
    id: '1',
    email: 'usuario@ejemplo.com',
    password: '1234',  // En un entorno real, esta contraseña debe estar encriptada
    username: 'usuario1',
    country: 'Perú',
    createdAt: new Date(),
  },
];

export interface Game {
  id: string; // ID único del juego
  title: string; // Título del juego
  description: string; // Descripción del juego
  price: number; // Precio del juego
  category: string; // Categoría del juego (por ejemplo, 'acción', 'aventura', etc.)
  platform: string; // Plataforma (por ejemplo, 'PS4', 'PS5', 'Switch', 'Windows', 'MacOS')
  releaseDate: string; // Fecha de lanzamiento del juego (puedes usar formato ISO 'YYYY-MM-DD')
  onSale: boolean; // Indica si el juego está en oferta
  images: string[]; // Lista de URLs de imágenes del juego (portada, capturas, etc.)
  rating?: number; // Calificación del juego (opcional)
  reviews?: string[]; // Reseñas de los usuarios (opcional)
}

export const listaGames: Game[] = [
  {
    id: '1',
    title: 'The Last of Us Part II',
    description: 'Un emocionante juego de aventura y acción.',
    price: 59.99,
    category: 'Acción',
    platform: 'PS4',
    releaseDate: '2020-06-19',
    onSale: true,
    images: ['https://example.com/cover1.jpg', 'https://example.com/screenshot1.jpg'],
    rating: 4.5,
    reviews: ['Gran juego', 'Emocionante historia'],
  },
  // Otros juegos...
];

export interface News {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}




export interface CartItem {
  productId: string;
  quantity: number;
}

export interface UserCart {
  userId: string;
  items: CartItem[];
}

export let cartList: UserCart[] = []; // Lista simulada de carritos de usuario



