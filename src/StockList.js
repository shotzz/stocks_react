import React from 'react';

// Component list
const StockList = (props) => {
    return (
        <div className="row">
            <div>{props.stock.name}</div>
            <div>{props.stock.price}</div>
            <div>{props.stock.displayTime}</div>
            <div>{props.stock.max}</div>
            <div>{props.stock.min}</div>
        </div>
    );
};

export default StockList;