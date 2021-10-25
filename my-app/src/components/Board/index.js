import React from 'react';
import Square from '../Square'

class Board extends React.Component {
    renderSquare(i) {
        const winLine = this.props.winLine;
        //console.log(`board ${this.props.winLine}`)
        if (winLine && winLine.includes(i)) {
            return (
                <Square
                    key={i} //to remove the warning
                    value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}
                    isWinLine='true'
                />
            );
        }
        else {
            return (
                <Square
                    key={i} //to remove the warning
                    value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}
                />
            );
        }
    }
  
    render() {
        let boardLength = Math.sqrt(this.props.squares.length);
        //console.log(boardLength);
        let myBoard = [];
        for (let i = 0; i < boardLength; i++) {
            let row = [];
            for (let j = 0; j < boardLength; j++) {
                row.push(this.renderSquare(i * boardLength + j));
            }
            myBoard.push(<div key={i} className='board-row'>{row}</div>); // temp key to remove the warning
        }
        return (<div>{myBoard}</div>);
    }
}

export default Board;