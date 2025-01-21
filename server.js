const http = require('http');

const PORT = process.argv[2];
const URL = process.argv[4];

const server = http.createServer().listen(PORT);

