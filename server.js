const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = process.argv[2];
const url = new URL(`https://${process.argv[3]}`);

const proxy = createProxyMiddleware({
  target: url,
  changeOrigin: true,
  selfHandleResponse: true,
});

const server = http.createServer();

server.on('request', (req, res) => {
  console.log(`Request received for ${req.url}`);
  let data = '';
  // Apply proxy middleware to the request
  proxy(req, res, (proxyRes) => {
    proxyRes.on('data', (chunk) => {
      data += chunk;
    });

    proxyRes.on('end', () => {
      res.setHeader('X-Cache', 'MISS');
      res.writeHead('200', proxyRes.getHeaders()).end(data);
    });

    proxyRes.on('error', (err) => {
      console.error('Error in proxy server response: ', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    });
  })
});

server.listen(port, () => {
  console.log(`
    Proxy Server initialized at http://localhost:${port}
    Forwarding requests to ${url}`);
});
