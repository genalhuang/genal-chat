export function logger(req, res, next) {
  const { method, path } = req;
  console.log(`${method} ${path}`);
  next();
};
