# Caching Proxy

A caching proxy is an intermediary server that forwards client requests to the actual server and caches the responses. When a client makes a request, the caching proxy checks if it has a cached copy of the response. If it does, it returns the cached response to the client, reducing the need to contact the actual server. If the response is not cached, the proxy forwards the request to the actual server, retrieves the response, caches it, and then returns it to the client. This process helps improve performance, reduce latency, and decrease the load on the actual server.

## Functionalities

- **Start the Caching Proxy Server**: You can start the caching proxy server by running the following command:
    ```sh
    ./caching-proxy --origin <URL> --port <PORT>
    ```Response

- **Return Response with Headers and Cache the Response**: The caching proxy server returns the response along with the headers from the actual server. It also caches the response for future requests.

- **Indicate Cache Status**: The server includes a header in the response to indicate whether the response was served from the cache or fetched from the actual server. For example:
    - `X-Cache: HIT` - The response was served from the cache.
    - `X-Cache: MISS` - The response was fetched from the actual server and then cached.

- **Clear the Cache**: You can clear the cache by running the following command:
    ```sh
    ./caching-proxy --clear-cache
    ```
