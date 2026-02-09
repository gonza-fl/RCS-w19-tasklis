# Guía: Manejo Centralizado de Errores en Express

El manejo centralizado de errores es una de las mejores prácticas en el desarrollo con Node.js y Express. Permite separar la lógica de negocio de la lógica de notificación de errores, haciendo que el código sea más limpio, legible y fácil de mantener.

## 1. ¿Por qué centralizar errores?

*   **DRY (Don't Repeat Yourself):** Evitas escribir el mismo bloque `try/catch` y `res.status(500).json(...)` en cada controlador.
*   **Consistencia:** Todas las respuestas de error de tu API tendrán el mismo formato.
*   **Mantenibilidad:** Si decides cambiar el formato del error (ej. agregar un timestamp), solo lo haces en un lugar.
*   **Debug Inteligente:** Puedes agregar logs específicos (como Winston o Morgan) solo en el middleware de errores.

---

## 2. Paso 1: Crear una Clase de Error Personalizada (Opcional pero recomendado)

Para tener más control, podemos crear una clase que herede de `Error` y nos permita pasar el código de estado HTTP.

**Archivo sugerido:** `src/utils/customError.js` (o dentro de la guía para el alumno)

```javascript
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Diferencia errores de código vs errores de usuario

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
```

---

## 3. Paso 2: Crear el Middleware de Errores

Este middleware debe ser el **último** que se registre en tu aplicación Express, ya que recibe los errores que le pasan otros middlewares o rutas usando `next(error)`.

**Archivo sugerido:** `src/middlewares/errorHandler.middleware.js`

```javascript
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // En entorno de desarrollo queremos ver todo el stack
    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    } else {
        // En producción no queremos exponer detalles técnicos (security)
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message || 'Algo salió mal en el servidor'
        });
    }
};

export default errorHandler;
```

---

## 4. Paso 3: Registrar el Middleware en `main.js`

Es crucial que este middleware esté después de todas tus rutas.

```javascript
import express from 'express';
import taskRoutes from './src/routes/tasks.routes.js';
import errorHandler from './src/middlewares/errorHandler.middleware.js';

const app = express();
app.use(express.json());

// Tus rutas
app.use('/api/tasks', taskRoutes);

// Manejo de rutas no encontradas (404)
app.all('*', (req, res, next) => {
    const err = new Error(`No se pudo encontrar ${req.originalUrl} en este servidor`);
    err.statusCode = 404;
    next(err); // Al pasar un argumento a next(), Express sabe que es un error
});

// REGISTRO DEL MIDDLEWARE DE ERRORES (Al final)
app.use(errorHandler);

app.listen(3000, () => console.log('Server running!'));
```

---

## 5. Paso 4: Refactorizar los controladores

Ahora, en lugar de manejar el error con un `res.status().json()`, simplemente lo pasamos a `next()`.

**Antes:**
```javascript
const listAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message }); // Lógica repetida
    }
}
```

**Después:**
```javascript
const listAllTasks = async (req, res, next) => { // Agregamos next
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        next(error); // El error viaja directamente al Error Handler
    }
}
```

---

## Tip Pro: Limpiando aún más el código

Para no escribir `try/catch` en cada función, puedes crear una función envolvente (Wrapper):

```javascript
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Uso en controlador:
export const listAllTasks = catchAsync(async (req, res, next) => {
    const tasks = await Task.find(); // Si falla, catchAsync envía el error a next()
    res.status(200).json(tasks);
});
```

¡Con esto, tus controladores quedan reducidos a la mínima expresión y tu código se ve ultra profesional!
