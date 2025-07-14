export interface User {
  id: number;
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
    id: 1,
    email: 'usuario@ejemplo.com',
    password: '1234',  // En un entorno real, esta contraseña debe estar encriptada
    username: 'usuario1',
    country: 'Perú',
    createdAt: new Date(),
  },
];

export interface Game {
  id: number; // ID único del juego (debe ser un número)
  title: string;
  description: string;
  price: number;
  category: string;
  platform: string;
  releaseDate: string;
  onSale: boolean;
  images: string[];
  rating?: number;
  reviews?: string[];
}

export const listaGames: Game[] = [
  {
    id: 1,
    title: 'The Last of Us Part II',
    description: 'Un emocionante juego de aventura y acción.',
    price: 59.99,
    category: 'Acción',
    platform: 'PS4',
    releaseDate: '2020-06-19',
    onSale: true,
    images: ['https://image.api.playstation.com/vulcan/ap/rnd/202312/0117/315718bce7eed62e3cf3fb02d61b81ff1782d6b6cf850fa4.png', 'https://img.game8.co/3817458/dbebe39e9920367d6d8e20d6b699823e.png/show', 'https://www.youtube.com/watch?v=JdE9U9WW_HM'],
    rating: 4.5,
    reviews: ['Gran juego', 'Emocionante historia'],
  },
  // Otros juegos...
];

export interface News {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  image: string;
}

export const listaNews: News[] = [
  {
    id: 1,
    title: 'Lanzamiento de nuevo juego',
    content: 'Hoy se ha lanzado un nuevo juego que promete revolucionar la industria.',
    createdAt: new Date(),
    updatedAt: new Date(),
    image: 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2024/01/last-us-parte-ii-remastered-3261743.jpg?tf=3840x'
  },
  {
    id: 2,
    title: 'Nintendo Switch recibe un nuevo título',
    content: 'Nintendo ha anunciado el lanzamiento de un esperado juego para la Switch, disponible desde hoy.',
    createdAt: new Date(),
    updatedAt: new Date(),
    image: 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000010192/f26fc9e1b11ce01369966ed9225e320a293c4eaad1329774f125e05629ffd437'
  },
  // Otras noticias...
];


export interface CartItem {
  productId: string;
  quantity: number;
}

export interface UserCart {
  userId: string;
  items: CartItem[];
}

export let cartList: UserCart[] = []; // Lista simulada de carritos de usuario



