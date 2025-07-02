
import http from 'http';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';

// Get paths in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create server
const server = http.createServer((req, res) => {
  let parsed = url.parse(req.url);  // get url from request
  let pathname = parsed.pathname;   // clean up to get the path

  // route to index.html if ''
  if (pathname === "/") {
    pathname = "/index.html";
  }

  // full path to requested file
  const filePath = path.join(__dirname, pathname);

  // content-type detection
  const ext = path.extname(filePath);
  const types = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
  };
  const contentType = types[ext] || "text/plain";

  // read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

// Start server
server.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
