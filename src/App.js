import React, {Component, Fragment} from 'react';
import ReactDOM from 'react-dom';
import logo from './mnet.svg';
import './App.css';

import StockList from './StockList';

var webSocket = null,
    PRICE_RISE = 2,
    PRICE_SAME = 1,
    PRICE_FALL = 0,
    stockObj = {};

class StocksApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stocks: {}
        };
        this.fetchStocks = this.fetchStocks.bind(this);
        this.renderStocks = this.renderStocks.bind(this);
        this.updateStockObj = this.updateStockObj.bind(this);
        this.init = this.init();
    }

    fetchStocks() {
        var webSocketURL = "ws://stocks.mnet.website";
        console.log("openWSConnection::Connecting to: " + webSocketURL);
        try {
            webSocket = new WebSocket(webSocketURL);
            webSocket.onopen = function(openEvent) {
                document.getElementById("wrapper").classList.add("spinner");
                console.log("WebSocket OPEN: " + JSON.stringify(openEvent, null, 4));
            };
            webSocket.onclose = function (closeEvent) {
                console.log("WebSocket CLOSE: " + JSON.stringify(closeEvent, null, 4));
                document.getElementById("wrapper").classList.add("closed");
            };
            webSocket.onerror = function (errorEvent) {
                console.log("WebSocket ERROR: " + JSON.stringify(errorEvent, null, 4));
                document.getElementById("wrapper").classList.add("error");
            };
            webSocket.onmessage = function (messageEvent) {
                var wsMsg = messageEvent.data;
                console.log("WebSocket MESSAGE: " + wsMsg);
                this.renderStocks(wsMsg);
            }.bind(this);
        } catch (exception) {
            console.error(exception);
            document.getElementById("wrapper").classList.add("failed");
        }
    }

    init() {
        this.fetchStocks();
    }

    renderStocks(wsMsg) {
        const newArray = JSON.parse(wsMsg);

        newArray.forEach(function (stockData) {
            var name = stockData[0];
            this.updateStockObj(stockData, stockObj[name] || {});
        }.bind(this));
    }

    updateStockObj(stockData, stock) {

        let name = stockData[0],
            price = parseFloat(stockData[1].toFixed(4)),
            maxPrice = stock.max || price,
            minPrice = stock.min || price,
            prevPrice = stock.price,
            presentTime = Date.now(),
            time = stock.time || presentTime,
            displayTime = 0,
            priceChange = PRICE_SAME,
            priceArray = stock.priceArray || [];

        if(stock.name) {
            if(maxPrice<price) {
                maxPrice = price;
            } else if(minPrice>price) {
                minPrice = price;
            }

            if(prevPrice > price){
                priceChange = PRICE_FALL;
            }
            else if(prevPrice < price){
                priceChange = PRICE_RISE;
            }

            if(time <= presentTime) {
                displayTime = Math.abs(presentTime - time)/1000;
            }

            displayTime = Math.round(displayTime)==0? "Jus Now" : Math.round(displayTime) + " secs ago";

            priceArray.push(price);
        }

        stockObj[name] = {
            name: name,
            price: price,
            max: maxPrice,
            min: minPrice,
            priceChange: priceChange,
            time: presentTime,
            displayTime: displayTime,
            priceArray: priceArray
        };

        this.setState({
            stocks: stockObj
        });
    }

    render() {

        let results = Object.keys(this.state.stocks).map( (stock, index) => {
            return <StockList key={index} stock={stockObj[stock]} />
        });

        return (
            <Fragment>
                <div id="wrapper">
                    <div id="info">Unable to fetch any more data.</div>
                    <div className="logo"><img src={logo} alt="" /></div>
                    {
                        this.state.stocks? (
                            <div id="results">
                                <div className="row header">
                                    <div className="stockName">Ticker</div>
                                    <div className="price">Price</div>
                                    <div id="header-time">Last Updated</div>
                                    <div className="high">High</div>
                                    <div className="low">Low</div>
                                </div>
                                <div>{results}</div>
                            </div>
                        ): (
                            <div className="loading">
                                <img src="assets/spinner.gif" width="100"/>
                            </div>
                        )
                    }
                </div>
                <div className="footer">
                    Media.net
                </div>
            </Fragment>
        );
    }
}

ReactDOM.render(<StocksApp/>, document.getElementById('root'));

export default StocksApp;
