const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

const Cache = require('./.cache/cache');
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
  plugins: [
    (proxyServer, options) => {
      proxyServer.on('proxyReq', (tReq, tRes, proxyRes) => {
        if(tReq.path === 'clear-cache') {
          cache.clear();
          tRes.writeHead(200, 'OK');
          tRes.end('Cache cleared');
        }

        // Retrieve data from cache
        const cachedData = cache.get(tReq.path);

        if (cachedData !== undefined) {
          // Pass the cached data and set header
          // in proxy server response
          proxyRes.setHeader('X-Cache', 'HIT');
          proxyRes.end(cachedData);
        }

        let data = '';
        tRes.on('data', (chunk) => {
          data += chunk;
        });

        tRes.on('end', () => {
          if (cachedData === undefined) {
            cache.save(tReq.path, data);
            proxyRes.setHeader('X-Cache', 'MISS');
            proxyRes.end(data);
          }
        });
      })
    }
  ]
});

const server = http.createServer(proxy);

server.on('request', (req, res, next) => {
  console.log(`Request received for ${req.url}`);
});

server.on('error', (err) => {
  console.error('Error occured: ', err);
});

server.listen(port, () => {
  console.log(`
    Proxy Server initialized at http://localhost:${port}
    Forwarding requests to ${url}`);
});
