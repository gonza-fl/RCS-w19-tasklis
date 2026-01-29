# Guía: Formateo de Fechas y Manejo de Campos en Mongoose

Esta guía explica el error común al formatear fechas, por qué ocurrió y cómo manejar qué datos enviamos en nuestra API.

## 1. El Error de Formateo de Fechas

### ¿Qué pasó y por qué era `null`?

El error `TypeError: Cannot read properties of null (reading 'toLocaleDateString')` ocurrió porque intentamos llamar a un método de fecha sobre un valor que no existía.

En tu caso, el campo era `deletedAt`. Este valor llega como `null` por dos razones comunes:

1. **Es un campo opcional**: La mayoría de tus tareas están activas, por lo que no tienen una fecha de eliminación asignada. En la base de datos, ese espacio está vacío o marcado como `null`.
2. **Ciclo de vida de Mongoose**: Cuando Mongoose recupera un documento, intenta aplicar todos los "getters" definidos. Si el campo no tiene datos, le pasa `null` a tu función, y al intentar hacer `null.toLocaleDateString()`, el código falla.

### La Solución: Optional Chaining

Para evitar que la app explote cuando un campo es opcional (como `deletedAt`), usamos el operador `?.`:

```javascript
// Mal: Explota si date es null
get: (date) => date.toLocaleDateString("es-AR")

// Bien: Devuelve undefined/null si no hay fecha, sin romperse
get: (date) => date?.toLocaleDateString("es-AR")
```

### ¿Dónde definir los getters?

**Importante:** Mongoose ignora los `get` si se ponen dentro de la configuración de `timestamps`. Deben definirse directamente en el cuerpo del esquema:

```javascript
const taskSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    get: (date) => date?.toLocaleDateString("es-AR")
  }
}, { timestamps: true });
```

---

## 2. Mejores Prácticas: ¿Qué campos mostrar?

Cuando creas una API, no siempre quieres enviar todo lo que hay en la base de datos. Aquí tienes las 3 formas de controlar esto:

### A. La técnica del "Transform" (Recomendado)

Es la forma más limpia. Configuras el Schema para que, cada vez que se convierta a JSON (para enviarlo por la API), limpie los campos que no quieres.

```javascript
{
  toJSON: {
    getters: true,  // Para que aplique tus formatos de fecha
    virtuals: true, // Para que muestre el campo 'id'
    transform: (doc, ret) => {
      delete ret._id; // Quitamos el _id con guion bajo
      delete ret.__v; // Quitamos la versión de Mongoose
      return ret;
    }
  }
}
```

### B. Selección en la consulta (`.select`)

Si solo en una ruta específica quieres ocultar algo, usas el signo `-`:

```javascript
// Trae todo excepto el campo "password" y "secret"
const results = await Task.find().select('-password -secret');
```

### C. Ocultar de forma global

Si un campo **nunca** debe viajar al cliente (ej. una contraseña), lo marcas en el esquema:

```javascript
password: {
  type: String,
  select: false // Mongoose nunca lo traerá a menos que lo pidas explícitamente
}
```

---

## 3. Conceptos Clave para Principiantes

| Término | ¿Qué es? |
| :--- | :--- |
| **`__v`** | Version Key. Un número interno que usa Mongoose para evitar que dos personas sobrescriban cambios al mismo tiempo. |
| **Getter (`get`)** | Una "máscara". El valor real en la DB no cambia, pero cuando lo pides, Mongoose te lo da transformado. |
| **Virtual** | Un campo que no existe en la DB (como `id`) pero que Mongoose genera al vuelo basándose en otros campos. |
| **`getters: true`** | La instrucción necesaria para que Mongoose aplique tus máscaras al convertir los datos a JSON. |

> [!TIP]
> Siempre usa el `transform` en `toJSON` para mantener tus respuestas de API limpias y profesionales. ¡Un JSON sin `__v` y con un `id` claro se ve mucho mejor!
