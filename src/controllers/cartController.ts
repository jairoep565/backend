import { CartItem, Cart, Game } from "../data";

export let userCarts: { [userId: string]: Cart } = {};

export function getUserCart(userId: string): Cart {
  return userCarts[userId] || { userId, items: [], total: 0 };
}

export function addProductToCart(userId: string, game: Game, quantity: number) {
  const cart = getUserCart(userId);
  const existingGame = cart.items.find(item => item.game.id === game.id);

  if (existingGame) {
    // Si el juego ya está en el carrito, incrementamos la cantidad
    existingGame.quantity += quantity;
  } else {
    // Si el juego no está en el carrito, lo añadimos
    cart.items.push({
      game,       // Almacenamos el objeto completo del juego
      quantity    // Cantidad de este juego
    });
  }

  // Actualizamos el total del carrito
  cart.total = cart.items.reduce((total, item) => total + (item.quantity * item.game.price), 0);

  userCarts[userId] = cart;
}

export function removeProductFromCart(userId: string, gameId: number) {
  const cart = getUserCart(userId);
  cart.items = cart.items.filter(item => item.game.id !== gameId);

  // Actualizamos el total del carrito
  cart.total = cart.items.reduce((total, item) => total + (item.quantity * item.game.price), 0);

  userCarts[userId] = cart;
}

export function processPayment(cart: Cart): boolean {
  // Lógica para procesar el pago, como integrar con una pasarela de pago real
  console.log("Procesando pago para el carrito:", cart);
  return true; // Simulación de pago exitoso
}