<template>
  <div id="app">
    <h1>Foxex</h1>
    <select v-model="currentPair">
      <option v-for="pair in pairs" :key="pair">{{pair}}</option>
    </select>
    <span>Pair: {{ currentPair }}</span>
    <h2>ask</h2>
    <ul id="ask">
      <li v-for="(total, price) in orderBook.ask" :key="price">
        {{ price }} : {{ total }}
      </li>
    </ul>
    <h2>bid</h2>
    <ul id="bid">
      <li v-for="(total, price) in orderBook.ask" :key="price">
        {{ price }} : {{ total }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import io from 'socket.io-client';

  export default Vue.extend({
    name: 'App',
    data() {
      return {
        pairs: ["BTC_ETH", "BTC_DOGE"],
        currentPair: null,
        orderBook: {},
        socket: io("localhost:3000")
      };
    },
    watch: {
      currentPair: function (pair) {
        this.currentPair = pair;
        console.log(`subscribing to ${pair}`);
        this.socket.emit("subscribe", this.currentPair);
      }
    },
    mounted() {
      this.socket.on("debug", (data: string) => {
        console.log(`debug: ${data}`);
      });
      this.socket.on("orderBookLoaded", (orderBook: OrderBook) => {
        console.log(`orderBookLoaded\n${JSON.stringify(orderBook)}`);
        this.orderBook = orderBook;
      });
    }
  });

  export interface OrderBook {
    bid: { [price: number]: number };
    ask: { [price: number]: number };
  }

</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
