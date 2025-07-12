import { listaUsers, User } from '../data';  // Lista de usuarios simulados

export const registerUser = async (email: string, password: string) => {
  // Verificar si el email ya está registrado
  const existingUser = listaUsers.find(u => u.email === email);
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  // Crear un nuevo usuario (en este caso, en la lista simulada)
  const newUser: User = {
    id: (listaUsers.length + 1).toString(),  // Generamos un ID único simple
    email,
    password,  // En un entorno real, encripta la contraseña
    createdAt: new Date(),
  };

  listaUsers.push(newUser);  // Agregar usuario a la lista simulada

  return newUser;
};