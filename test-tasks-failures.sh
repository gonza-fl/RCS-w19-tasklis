#!/bin/bash

# Este script contiene comandos curl para probar los casos de fallo en los endpoints /tasks/:id
# Asegúrate de que el servidor esté corriendo en http://localhost:3000

BASE_URL="http://localhost:3000/tasks"
# ID de formato válido pero que probablemente no exista en tu DB
NON_EXISTENT_ID="65b3d6874f67c13ac9000000"
# ID de formato inválido
INVALID_ID="123-id-invalido"

echo "--- Probando DELETE /tasks/:id ---"

echo "1. DELETE con ID inválido (debe fallar por validateTaskId)"
curl -X DELETE "$BASE_URL/$INVALID_ID" -H "Content-Type: application/json"
echo -e "\n"

echo "2. DELETE con ID inexistente (debe devolver 404)"
curl -X DELETE "$BASE_URL/$NON_EXISTENT_ID" -H "Content-Type: application/json"
echo -e "\n"

echo "--- Probando PATCH /tasks/:id ---"

echo "3. PATCH con ID inválido (debe fallar por validateTaskId)"
curl -X PATCH "$BASE_URL/$INVALID_ID" \
     -H "Content-Type: application/json" \
     -d '{"title": "Nuevo Título"}'
echo -e "\n"

echo "4. PATCH con ID inexistente (debe devolver 404)"
curl -X PATCH "$BASE_URL/$NON_EXISTENT_ID" \
     -H "Content-Type: application/json" \
     -d '{"title": "Nuevo Título"}'
echo -e "\n"

echo "5. PATCH con título demasiado corto (min 4)"
curl -X PATCH "$BASE_URL/$NON_EXISTENT_ID" \
     -H "Content-Type: application/json" \
     -d '{"title": "abc"}'
echo -e "\n"

echo "6. PATCH con prioridad inválida"
curl -X PATCH "$BASE_URL/$NON_EXISTENT_ID" \
     -H "Content-Type: application/json" \
     -d '{"priority": "URGENTE"}'
echo -e "\n"

echo "7. PATCH con estado (state) inválido"
curl -X PATCH "$BASE_URL/$NON_EXISTENT_ID" \
     -H "Content-Type: application/json" \
     -d '{"state": "desconocido"}'
echo -e "\n"

echo "8. PATCH con finishedAt inválido (no es fecha)"
curl -X PATCH "$BASE_URL/$NON_EXISTENT_ID" \
     -H "Content-Type: application/json" \
     -d '{"finishedAt": "esto-no-es-una-fecha"}'
echo -e "\n"

echo "9. PATCH intentando enviar deletedAt (prohibido en PATCH)"
curl -X PATCH "$BASE_URL/$NON_EXISTENT_ID" \
     -H "Content-Type: application/json" \
     -d '{"deletedAt": "2024-01-01"}'
echo -e "\n"

echo "10. PATCH con campos no permitidos"
curl -X PATCH "$BASE_URL/$NON_EXISTENT_ID" \
     -H "Content-Type: application/json" \
     -d '{"campoInventado": "valor", "otro": 123}'
echo -e "\n"
