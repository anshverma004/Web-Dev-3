const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const { url, method } = req;
  console.log(`Received ${method} request for route: ${url}`);

  if (url === "/" || url === "") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to Node Server");
  } else if (url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("About Page");
  } else if (url === "/contact") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Contact Page");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Error: Page Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
