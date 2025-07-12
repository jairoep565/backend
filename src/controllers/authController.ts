import { listaUsers, User } from '../data';  // Lista de usuarios simulados

// Función para manejar el inicio de sesión (sin token)
export const loginUser = (email: string, password: string) => {
  // Buscar el usuario por el correo electrónico
  const user = listaUsers.find(u => u.email === email);

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Compara las contraseñas (en un entorno real, las contraseñas deberían estar encriptadas)
  if (user.password !== password) {
    throw new Error('Contraseña incorrecta');
  }

  // Si las credenciales son correctas, devuelve el mensaje y los datos del usuario
  return {
    message: 'Login exitoso',
    user: {
      id: user.id,
      email: user.email
    }
  };
};