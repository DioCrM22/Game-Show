// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro:', err.stack);

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Erro interno do servidor'
  });
};

export default errorHandler;
