var request = require('request');
var knex = require('./db.js');
function Stocks() {
  return knex('stocks');
}
function RealTimePrices() {
  return knex('realtimeprices');
}
function DataMiner() {
  var stocksFromDatabase = {};
  Stocks().select().then(function(stocks) {
    stocks.forEach(function(stock) {
      stocksFromDatabase[stock.stockTicker] = stock;
    });
    var interval = setInterval(doMine, 1000 * 60 * 1);
    doMine();
  });
  function doMine() {
    var symbolKeys = Object.keys(stocksFromDatabase);
    for (i = 0; i < symbolKeys.length; i++) {
      whatthefuck(symbolKeys[i], i);
    }
  }
  function whatthefuck(symbol, i){
    setTimeout(function () {
      var url = 'http://dev.markitondemand.com/Api/v2/Quote/json?symbol=' +
        symbol;
      request(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          store(JSON.parse(body));
        } else {
          console.error('Error: ' + error +
            ' StatusCode: ' + response.statusCode);
          console.log('url: ' + url);
          console.log(body);
        }
      });
    }, i * 10000);
  }
  function store(json) {
    if (json.Status == 'SUCCESS') {
      var currentStock = stocksFromDatabase[json.Symbol];
      var inserter = {
        stock_id: currentStock.id,
        price: json.LastPrice,
        captured_time: json.Timestamp
      };
      RealTimePrices().insert(inserter).returning('id')
      .then(function(id) {
        console.log('inserted');
        console.log(inserter);
        console.log('at ' + id);
      })
      .catch(function(err) {
        console.error('Error: ' + err);
      });
    }
  }
  this.stop = function() {
    clearInterval(interval);
  };
}
var miner = new DataMiner();
