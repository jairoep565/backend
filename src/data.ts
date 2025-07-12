
export interface User {
  id: string;
  email: string;
  password: string; // En un entorno real, esto debería ser un hash
  createdAt: Date;
}

// Lista de usuarios simulados
export const listaUsers: User[] = [
  {
    id: '1',
    email: 'usuario@ejemplo.com',
    password: '1234',  // En un entorno real, esta contraseña debe estar encriptada
    createdAt: new Date()
  },
];