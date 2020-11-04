<template>
  <div id="app">
    <h1>Foxex</h1>
    <select v-model="currentPair">
      <option v-for="pair in pairs" :key="pair">{{pair}}</option>
    </select>
    <h2>ask</h2>
    <ul class="table" id="ask">
      <li class="head">
        <span>Price</span> <span class="bittrex">Bittrex</span> <span class="poloniex">Poloniex</span>
        <span>Combined</span>
      </li>
      <li v-for="entry in orderBook.ask" :key="entry.price">
        <span>{{ entry.price }}</span> <span class="bittrex">{{ entry.bittrex }}</span> <span class="poloniex">{{ entry.poloniex }}</span>
        <span>{{ entry.combined }}</span>
      </li>
    </ul>
    <h2>bid</h2>
    <ul class="table" id="bid">
      <li v-for="entry in orderBook.bid" :key="entry.price">
        <span>{{ entry.price }}</span> <span class="bittrex">{{ entry.bittrex }}</span> <span class="poloniex">{{ entry.poloniex }}</span>
        <span>{{ entry.combined }}</span>
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
        socket: process.env.NODE_ENV === 'development' ? io("localhost:3000") : io()
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

  @media only screen and (max-width: 550px) {
    span.bittrex, span.poloniex {
      display: none;
    }
  }

  ul.table {
    padding: 0;
    display: table;
    margin: 0 auto;

    li.head {
      display: table-header-group;
      font-weight: 800;
    }

    li {
      display: table-row;
      list-style: none;
      &:nth-of-type(2n) {
        background: #ddd;
      }
    }

    span {
      width: 7rem;
      display: inline-block;
    }
  }
</style>
