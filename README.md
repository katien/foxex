# Foxex
Foxex is a combined order book displaying data from both Bittrex and Poloniex. Foxex subscribes to the Bittrex and Poloniex WebSocket APIs for live updates and uses `socket.io` to push updates to all browser clients subscribed to an order book.

Ci is managed by CircleCi and will automatically deploy changes to Heroku when new code is pushed to `master`.

### Getting Started
- To get started in development mode, run:
`npm run dev:server` 
`npm run dev:client`
- To run the app locally in production mode, run:
`npm run build; npm run start`

### Scripts
- `start` - runs server in production mode, will serve compiled client content from `dist` as static files
- `build` - compiles code in `client` and `server` to be run in production mode
- `test` - runs unit tests
- `dev:server` - runs a development server at `localhost:3000` with `nodemon`, will restart when changes are made in `server`
- `dev:client` - runs client in development mode with hot module reloading, will create a socket connection to `localhost:3000` by default

### Heroku Deployment
Heroku will automatically run `npm run build` and `npm run start` when a new deployment is made.

## Potential improvements

### Scaling
- Maintaining WebSocket connections to each browser viewing an order book can be resource-intensive, so the ability to horizontally scale Foxex's ConnectionManager component would become important if load increased. 

If Foxex needed to scale,  it could be divided into microservices: 
- a ConnectionManager service to manage browser WebSocket connections
- a Bittrex service to maintain a subscription to the Bittrex WebSocket API
- a Poloniex service to maintain a subscription to the Poloniex WebSocket API

An external caching service like Redis could be introduced so that multiple instances of the ConnectionManager service could read from the same data store. The ConnectionManager Service could be scaled horizontally while the Bittrex and Poloniex services would forward order book updates to Redis. Redis also supports PubSub which would allow clients to subscribe to changes.

### Reactivity
In a more complex application, it would be worth implementing an observable wrapper around the CombinedOrderBooks stored at the data layer or using a library like RxJs for server-side reactivity. Foxex uses callbacks registered with the Bittrex and Poloniex remote clients because it is a simple demo.

### Monitoring
There is reconnect logic in place if Bittrex or Poloniex return an error or are silent for too long, but monitoring would be useful so that a developer could be directly notified if there were an ongoing outage. A slack webhook would suffice.

### Libraries
The Bittrex client library used by Foxex is a work in progress. Given more time, Microsoft's official node signalR client would be a safer way to communicate with Bittrex's API.

### Environment Variables
Certain configurations are hardcoded, like the number of combined order book entries to calculate and the ports used in development mode. These could be loaded as environment variables.
