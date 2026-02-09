class ApiError extends Error {
  constructor(message = '', statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational; // Diferencia errores de código vs errores de usuario

    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Solicitud inválida') {
    super(message, 400);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Acceso denegado') {
    super(message, 403);
  }
}

export { ApiError, NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError };
