import React from 'react';

const Square = ({isWinLine, onClick, value}) => {
    //console.log(`square ${props.isWinLine}`)
    if (isWinLine) {
        return (
            <button className="square" style={{backgroundColor: 'green'}} onClick={onClick}>
                {value}
            </button>
        );
    }
    else{
        return (
            <button className="square" onClick={onClick}>
                {value}
            </button>
        );
    }
}

export default Square;