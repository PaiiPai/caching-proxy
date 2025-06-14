import http from 'http';
import { createProxyMiddleware } from require('http-proxy-middleware');
import Cache from './.cache/cache';

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
  selfHandleResponse: true,
  plugins: [
    (proxyServer, options) => {
      let path;

      proxyServer.on('error', (err, req, res) => {
        console.error('Error occured in proxy server: ', err);
        res.end('Proxy server error...');
      });

      proxyServer.on('proxyReq', (proxyReq, proxyRes, res) => {
        // Retrieve data from cache
        path = proxyReq.path;
        const cachedData = cache.get(path);

        if (cachedData !== undefined) {
          // Pass the cached data and set header
          // in proxy server response
          res.setHeader('X-Cache', 'HIT');
          console.log('Data retrieved from cache');
          res.end(cachedData);
        }
      });

      proxyServer.on('proxyRes', (proxyRes, req, res) => {
        let data = '';
        proxyRes.on('data', (chunk) => {
          data += chunk;
        });

        proxyRes.on('end', () => {
          if (cache.get(path) === undefined) {
            cache.save(path, data);
            res.setHeader('X-Cache', 'MISS');
            console.log('Data saved in cache');
            res.end(data);
          }
        });
      });
    }
  ],
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
