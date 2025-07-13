import { CartItem, cartList, UserCart } from "../data";

export const getUserCart = (userId: string): CartItem[] => {
  const userCart = cartList.find(cart => cart.userId === userId);
  return userCart ? userCart.items : [];
};

export const addProductToCart = (userId: string, productId: string, quantity: number) => {
  const userCart = cartList.find(cart => cart.userId === userId);

  if (userCart) {
    const existingProduct = userCart.items.find(item => item.productId === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity; // Incrementar cantidad si el producto ya está en el carrito
    } else {
      userCart.items.push({ productId, quantity }); // Agregar nuevo producto si no está en el carrito
    }
  } else {
    // Si no hay carrito para el usuario, crear uno nuevo
    cartList.push({
      userId,
      items: [{ productId, quantity }],
    });
  }
};

export const removeProductFromCart = (userId: string, productId: string) => {
  const userCart = cartList.find(cart => cart.userId === userId);

  if (userCart) {
    userCart.items = userCart.items.filter(item => item.productId !== productId); // Filtra el producto a eliminar
  }
};

export const processPayment = (cart: CartItem[]): boolean => {
  if (cart.length === 0) {
    return false;
  }

  // Lógica de pago simulada
  return true;
};