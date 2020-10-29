export interface BittrexResponse {
  pair: string;
  data: {
    buy: BittrexResponseEntry[];
    sell: BittrexResponseEntry[];
  }
}


export interface BittrexResponseEntry {
  rate: number;
  quantity: number;
}
