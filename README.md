# Foxex
Foxex is a combined order book displaying data from both Bittrex and Poloniex. Foxex server subscribes to the Bittrex and Poloniex websocket APIs for live updates.

Foxex uses websockets to facilitate live updates in all browser clients subscribed to an order book, data is pushed to browser clients rather than being polled for.

Ci is managed with CircleCi and will automatically deploy changes to Heroku when a push is made to master

## Potential improvements

### Scaling
- Maintaining websocket connections to each browser viewing an order book can be resource intensive, so the ability to horizontally scale Foxex's ConnectionManager component would become important as load increased. 

If Foxex needed to scale, I would divide it into microservices: 
- a ConnectionManager service to manage browser socket connections
- a Bittrex service to maintain a subscription to the Bittrex websocket API
- a Poloniex service to maintain a subscription to the Poloniex websocket API

I'd introduce an external caching service like Redis so that multiple instances of the ConnectionManager service could read from the same data store. The ConnectionManager Service could be scaled horizontally while the Bittrex and Poloniex services would forward order book updates to Redis. Redis also supports PubSub which would allow clients to subscribe to changes.

### Reactivity
I've home rolled a solution using callbacks, but what I really want is to have some observable objects at the data layer containing the order books. I could have implemented this with something like RxJS given more time, but in the interest of getting something done, I just invoke a callback each time an order book is modified.

### Monitoring
Currently I have reconnect logic in place if Bittrex or Poloniex return an error or are silent for too long, but I'd also like to implement monitoring so that a developer could be directly notified if there were an ongoing outage. A slack webhook would suffice.

### Libraries
The Bittrex client library I use is a work in progress, I would prefer to be using microsoft's official signalR client but time did not permit.