import React from 'react';
import { Sparklines, SparklinesLine, SparklinesReferenceLine } from 'react-sparklines';

// Component list
const StockList = (props) => {
    return (
        <div className="row">
            <div>{props.stock.name}</div>
            {
                props.stock.priceChange===2 ? (
                    <div className="priceRise price">{props.stock.price}</div>
                ) : props.stock.priceChange===0 ? (
                    <div className="priceFall price">{props.stock.price}</div>
                ) : (
                    <div className="price">{props.stock.price}</div>
                )
            }
            {
                props.stock.displayTime!==0 ? (
                    <div className="time">{props.stock.displayTime}</div>
                ) : (
                    <div className="time">Jus now</div>
                )
            }
            <div>{props.stock.max}</div>
            <div>{props.stock.min}</div>
            <div className="trend">
                <Sparklines data={props.stock.priceArray} limit={40} width={100} height={25} >
                    <SparklinesLine />
                    <SparklinesReferenceLine type="mean" />
                </Sparklines>
            </div>
        </div>
    );
};

export default StockList;