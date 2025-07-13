# Sistema de Autenticación - Backend

## Características
- ✅ Login con email y contraseña
- ✅ Validación de credenciales
- ✅ Manejo de sesiones
- ✅ Verificación de autenticación
- ✅ Middleware de seguridad

## Uso
```typescript
import { authenticateUser, checkAuthentication } from './services/auth';

// Iniciar sesión
const result = await authenticateUser('usuario@ejemplo.com', '1234');

// Verificar autenticación
if (checkAuthentication()) {
  console.log('Usuario autenticado');
}