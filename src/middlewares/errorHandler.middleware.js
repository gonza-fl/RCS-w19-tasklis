const errorHandler = (err, _req, res, _next) => {
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
}

export default errorHandler;
