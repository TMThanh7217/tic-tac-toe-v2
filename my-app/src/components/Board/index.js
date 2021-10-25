import React from 'react';
import Square from '../Square'

const Board = ({squares, winLine, onClick}) => {
    const renderSquare = (i) => {
        //console.log(`board ${this.props.winLine}`)
        if (winLine && winLine.includes(i)) {
            return (
                <Square
                    key={i} //to remove the warning
                    value={squares[i]}
                    onClick={() => onClick(i)}
                    isWinLine='true'
                />
            );
        }
        else {
            return (
                <Square
                    key={i} //to remove the warning
                    value={squares[i]}
                    onClick={() => onClick(i)}
                />
            );
        }
    }
  
    let boardLength = Math.sqrt(squares.length);
    //console.log(boardLength);
    let myBoard = [];
    for (let i = 0; i < boardLength; i++) {
        let row = [];
        for (let j = 0; j < boardLength; j++) {
            row.push(renderSquare(i * boardLength + j));
        }
        myBoard.push(<div key={i} className='board-row'>{row}</div>); // temp key to remove the warning
    }
    return (<div>{myBoard}</div>);
}

export default Board;