import http from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import Cache from './.cache/cache.js';

const port = process.argv[2];
const url = new URL(`https://${process.argv[3]}`);
const cache = new Cache(url);

if (process.argv[2] === 'clear-cache') {
  console.log('Clearing cache...');
  cache.clear();
  process.exit(0);
}

const proxy = createProxyMiddleware({
  target: url,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      /* handle proxyReq */
      // Retrieve data from cache
      const path = proxyReq.path;
      const cachedData = cache.get(path);

      if (cachedData !== undefined) {
        // set header to indicate cache hit
        res.setHeader('X-Cache', 'HIT');
        console.log('Data retrieved from cache');
        // respond with cached data
        res.end(cachedData);
      } else {
        // set header to indicate cache miss
        res.setHeader('X-Cache', 'MISS');}
    },
    proxyRes: (proxyRes, req, res) => {
      /* handle proxyRes */
      // extract path from request and data from response
      const path = req.url;
      let data = '';
      proxyRes.on('data', (chunk) => {
        data += chunk;
      });
      
      proxyRes.on('end', () => {
        // save data in cache if not already cached
        if (cache.get(path) === undefined) {
          cache.save(path, data);
          console.log('Data saved in cache');
        }
      })
    },
    error: (err, req, res) => {
      /* handle error */
      console.error(`[${err.code}]: Error occured while processing request for ${req.url}`);
      switch (err.code) {
        case 'ETIMEDOUT':
          res.writeHead(504, { 'Content-Type': 'text/plain' });
          res.end('Gateway Timeout: The request took too long to complete.');
          break;
        case 'ECONNREFUSED':
          res.writeHead(502, { 'Content-Type': 'text/plain' });
          res.end('Bad Gateway: Connection refused by the target server.');
          break;
        case 'ENOTFOUND':
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found: The requested resource could not be found.');
          break;
        default:
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error: An unexpected error occurred.');
          break;
      }
    },
  },
});

const server = http.createServer(proxy);

server.on('request', (req, res, next) => {
  console.log(`Request received for ${req.url}`);
});

server.listen(port, () => {
  console.log(`
    Proxy Server initialized at http://localhost:${port}
    Forwarding requests to ${url}`);
});
