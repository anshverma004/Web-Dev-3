function logger(req, res, next) {
  let time = new Date().toLocaleTimeString();
  console.log("[" + time + "] " + req.method + " " + req.url);
  next();
}

module.exports = logger;
