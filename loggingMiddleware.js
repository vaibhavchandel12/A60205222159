// loggingMiddleware.js
const loggingMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
};

module.exports = loggingMiddleware;
