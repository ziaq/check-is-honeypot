<!-- ABOUT THE PROJECT -->
## About The Project

It is a small utility that takes as input a key from the Redis database in which the address of the contract to be checked, the result of the program will be full information about the token, including whether it is a honeypot or not. The output of the program you can see below:
```js
2023-04-20T05:47:43.236Z info [getPair]: Address: 0xD3DDCAbb014Dd54135D3De49800aAbeFc324CAD1, Response: [
  {
    "ChainID": 1,
    "Pair": {
      "Name": "Uniswap V2: WETH-WOJAKIE",
      "Tokens": [
        "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "0xd3ddcabb014dd54135d3de49800aabefc324cad1"
      ],
      "Address": "0x46a94d1598223a4c7a644b1c3960762c767e7f86"
    },
    "Reserves": [
      1209568463950591000,
      83020780485785620
    ],
    "Liquidity": 4707.471122110747,
    "Router": "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
  }
]
2023-04-20T05:47:45.130Z info [getSpecs]: Address: 0xD3DDCAbb014Dd54135D3De49800aAbeFc324CAD1, responseSpecs: {
  "Token": {
    "Name": "Wojakie Coin",
    "Symbol": "WOJAKIE",
    "Decimals": 9,
    "Address": "0xd3ddcabb014dd54135d3de49800aabefc324cad1"
  },
  "WithToken": {
    "Name": "Ether",
    "Symbol": "ETH",
    "Decimals": 18,
    "Address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  },
  "IsHoneypot": false,
  "Error": null,
  "MaxBuy": null,
  "MaxSell": null,
  "BuyTax": 4.999999999996159,
  "SellTax": 6.071050766764773,
  "TransferTax": 0,
  "Flags": null,
  "BuyGas": 183180,
  "SellGas": 268583,
  "Chain": {
    "ID": 1,
    "Name": "Ethereum",
    "ShortName": "ETH",
    "Currency": "ETH"
  },
  "Router": "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
  "Pair": {
    "ChainID": 1,
    "Pair": {
      "Name": "Uniswap V2: WETH-WOJAKIE",
      "Tokens": [
        "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        "0xd3ddcabb014dd54135d3de49800aabefc324cad1"
      ],
      "Address": "0x46a94d1598223a4c7a644b1c3960762c767e7f86"
    },
    "Reserves": [
      1209568463950591000,
      83020780485785620
    ],
    "Liquidity": 4707.471122110747,
    "Router": "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"
  },
  "PairAddress": "0x46a94d1598223a4c7a644b1c3960762c767e7f86"
}
```

### Built With

- node.js
- ts-node
- typescript
- ioredis
- axios
- winston

<!-- GETTING STARTED -->
## Getting Started

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ziaq/get-token-specifications-etherium.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your settings in `config/config.js`
   ```js
   export default {
    redisUrl: {
      hostname: 'localhost',
      port: 6379,
    },
   };
   ```

<!-- USAGE EXAMPLES -->
## Usage

1. Run in the terminal while in the project directory 
   ```sh
   ts-node index.js
   ```
2. Add to Redis db0 new writing with key contains address like "0xD3DDCAbb014Dd54135D3De49800aAbeFc324CAD1"
3. Then you will get output in console, app.log and db1 in Redis

## Contact

- Twitter https://twitter.com/RomaZiaq
- Telegram @roma_ziaq
- Project Link: https://github.com/ziaq/get-token-specifications-etherium