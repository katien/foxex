<template>
  <div id="app">
    <h1>FOXEX</h1>
    <select v-model="currentPair">
      <option v-for="pair in pairs" :key="pair">{{pair}}</option>
    </select>
    <br>
    <span>Pair: {{ currentPair }}</span>
    <h2>ask</h2>
    <ul id="ask">

      <span>Price</span> <span>Bittrex</span> <span>Poloniex</span> <span>Combined</span>
      <li v-for="(entry, price) in orderBook.ask" :key="price">
        <span>{{ price }}</span> <span>{{ entry.bittrex }}</span> <span>{{ entry.poloniex }}</span> <span>{{ entry.combined }}</span>
      </li>
    </ul>
    <h2>bid</h2>
    <ul id="bid">
      <li v-for="(entry, price) in orderBook.bid" :key="price">
        <span>{{ price }}</span> <span>{{ entry.bittrex }}</span> <span>{{ entry.poloniex }}</span> <span>{{ entry.combined }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import io from 'socket.io-client';
  import {OrderBook} from "@/types/OrderBook";

  export default Vue.extend({
    name: 'App',
    data() {
      return {
        pairs: ["BTC_ETH", "BTC_DOGE"],
        currentPair: "",
        orderBook: {},
        socket: io()
      };
    },
    watch: {
      currentPair: function (pair) {
        this.currentPair = pair;
        this.socket.emit("subscribe", this.currentPair);
      }
    },
    mounted() {
      this.currentPair = "BTC_ETH";
      this.socket.on("orderBookLoaded", (orderBook: OrderBook) => {
        Vue.set(this.$data, "orderBook", orderBook);
      });
    }
  });

</script>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    font-size: 12px;
  }

  li {
    list-style: none;
  }

  ul span {
    width: 10rem;
    display: inline-block;
  }
</style>
