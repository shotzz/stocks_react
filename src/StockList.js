import React, {Fragment} from 'react';

// Component list
const StockList = (props) => {
    return (
        <div className="row">
            <div>{props.stock.name}</div>
            <div>{props.stock.price}</div>
            {
                props.stock.priceChange===2 ? (
                    <div className="priceRise">{props.stock.displayTime}</div>
                ) : props.stock.priceChange===0 ? (
                    <div className="priceFall">{props.stock.displayTime}</div>
                ) : (
                    <div>Jus now</div>
                )
            }
            <div>{props.stock.max}</div>
            <div>{props.stock.min}</div>
        </div>
    );
};

export default StockList;