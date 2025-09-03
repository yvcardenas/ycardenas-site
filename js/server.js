// server.js file given from warapitiya on GitHub

const jsonServer = require('json-server');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json'); 
const HOST = process.env.HOST || '0.0.0.0';      // expose publicly first; later 127.0.0.1
const PORT = parseInt(process.env.PORT || '3000', 10); 

const server = jsonServer.create();
const router = jsonServer.router(DB_PATH);
const middlewares = jsonServer.defaults(); // logger, static, CORS, no-cache

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

server.listen(PORT, HOST, () => {
  console.log(`JSON Server running at http://${HOST}:${PORT} using ${DB_PATH}`);
});
