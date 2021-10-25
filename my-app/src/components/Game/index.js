import React, { useState } from 'react';
import Board from '../Board'

function calculateWinner(squares, cur_pos) {
    let boardLength = Math.sqrt(squares.length);
    //x = index % cols, y = index / cols
    let y = cur_pos % boardLength 
    let x = Math.floor(cur_pos / boardLength)
    let cur_val = squares[cur_pos];
    let winLine = Array(boardLength).fill(null);
    /*console.log(`cur val: ${cur_val}`);
    console.log(`x: ${x}`);
    console.log(`y: ${y}`);*/

    //access 1d as 2d: array[desired_row*numcols+desiredcol]
    
    //console.log(`squares in calc: ${squares}`);
    //check col 
    for (let i = 0; i < boardLength; i++) {
        //console.log(`i: ${i} squares[i]: ${squares[cur_row * boardLength + i]} cur_val: ${cur_val}` );
        winLine[i] = x * boardLength + i;
        if (squares[x * boardLength + i] != cur_val) {
            //console.log(`COL Break at index: ${i} squares[${x * boardLength + i}]: ${squares[x * boardLength + i]} cur_val: ${cur_val}` );
            break;
        }
        if (boardLength < 6)
            if (i == boardLength - 1) {
                //console.log(`Winner: ${squares[cur_pos]}`);
                return {
                    squares: squares[cur_pos],
                    winLine: winLine,
                };
            }
        else if (i == 5)
            return  {
                squares: squares[cur_pos],
                winLine: winLine,
            };
    }

    //check row
    for (let i = 0; i < boardLength; i++) {
        winLine[i] = i * boardLength + y;
        if (squares[i * boardLength + y] !== cur_val) {
            //console.log(`ROW Break at index: ${i} squares[${i * boardLength + y}]: ${squares[i * boardLength + y]} cur_val: ${cur_val}` );
            break;
        }
        if (boardLength < 6)
            if (i == boardLength - 1) {
                //console.log(`Winner: ${squares[cur_pos]}`);
                return  {
                    squares: squares[cur_pos],
                    winLine: winLine,
                };
            }
        else if (i == 5)
            return  {
                squares: squares[cur_pos],
                winLine: winLine,
            };
    }

    //check primary diag
    if (x == y) {
        for (let i = 0; i < boardLength; i++) {
            winLine[i] = i * boardLength + i;
            if (squares[i * boardLength + i] !== cur_val) {
                //console.log(`PriDiag Break at index: ${i} squares[${i * boardLength + i}]: ${squares[i * boardLength + i]} cur_val: ${cur_val}` );
                break;
            }
            if (boardLength < 6)
                if (i == boardLength - 1) {
                    //console.log(`Winner: ${squares[cur_pos]}`);
                    return  {
                        squares: squares[cur_pos],
                        winLine: winLine,
                    };
                }
            else if (i == 5)
                return  {
                    squares: squares[cur_pos],
                    winLine: winLine,
                };
        }
    }

    //check secondary diag
    if (x + y == boardLength - 1) {
        for (let i = 0; i < boardLength; i++) {
            winLine[i] = i * boardLength + (boardLength - 1 - i);
            if (squares[i * boardLength + (boardLength - 1 - i)] !== cur_val) {
                //console.log(`SecDiag Break at index: ${i} squares[${i * boardLength + i}]: ${squares[i * boardLength + i]} cur_val: ${cur_val}` );
                break;
            }
            if (boardLength < 6)
                if (i == boardLength - 1) {
                    //console.log(`Winner: ${squares[cur_pos]}`);
                    return  {
                        squares: squares[cur_pos],
                        winLine: winLine,
                    };
                }
            else if (i == 5)
                return  {
                    squares: squares[cur_pos],
                    winLine: winLine,
                };
        }
    }

    return null;
}

const Game = () => {
    // State Hook
    const [history, setHistory] = useState([{
        squares: Array(9).fill(null),
        cur_pos: -1,
        winner: null,
    }]);

    const [size, setSize] = useState(3);
    const [xIsNext, setXIsNext] = useState(true);
    const [stepNumber, setStepNumber] = useState(0);
    const [isAscend, setIsAscend] = useState(true);
    const [okClick, setOkClick] = useState(false);


    const handleClick = (i) =>{
        const curHistory = history.slice(0, stepNumber + 1);
        const current = curHistory[curHistory.length - 1];
        const squares = current.squares.slice();
        const cur_pos = i;
        /*if (calculateWinner(squares) || squares[i]) {
            return;
        }*/

        if (current.winner || squares[i]) {
            return;
        }

        squares[i] = xIsNext ? 'X' : 'O';

        setHistory(curHistory.concat([{
            squares: squares,
            cur_pos: cur_pos,
        }]));
        setXIsNext(!xIsNext);
        setStepNumber(curHistory.length)
    }

    const handleSortClick = () => {
        setIsAscend(!isAscend)
    }

    const jumpTo = (step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }

    const handleOkClick = (e) => {
        let boardSize = size;
        let squares = new Array(boardSize * boardSize).fill(null);
        //console.log(boardSize);
        if (boardSize < 3 || boardSize > 5 )
            alert('Board size must be >= 3 and <= 5');
        else {
            setOkClick(true);
            setSize(boardSize);
            setHistory([{squares: squares}]);
        }
        e.preventDefault();
    }

    const handleChange = (e) => {
        setSize(e.target.value);
    }

    if (okClick) {
        const myHistory = history;
        const current = myHistory[stepNumber];
        console.log('in render ' + current.squares.length);
        //const winner = calculateWinner(current.squares);
        /*console.log(`Game render squares ${current.squares}`);
        console.log(`Game render cur_pos ${current.cur_pos}`);*/
        const winner = calculateWinner(current.squares, current.cur_pos) ? calculateWinner(current.squares, current.cur_pos).squares : null ;
        const winLine = calculateWinner(current.squares, current.cur_pos) ? calculateWinner(current.squares, current.cur_pos).winLine : null ;
        //console.log(`Game ${winLine}`);
        //console.log(`Game render winner ${winner}`);
        //const cur_pos = this.state.cur_pos;
        
        const moves = myHistory.map((step, move) => {
            let cur_pos = step.cur_pos ;
            let boardLength = Math.sqrt(step.squares.length);
            //x = index % cols, y = index / cols
            let col = cur_pos % boardLength 
            let row = Math.floor(cur_pos / boardLength)
            const isSelected = move === stepNumber;
            //col, row + 1 because x, y start from 0
            const desc = move ? 'Go to move #' + move + ` (${col + 1}, ${row + 1})` : 'Go to game start';

            if (isSelected)
                return (
                    <li key={move}>
                        <button style={{fontWeight: 'bold'}} onClick={() => jumpTo(move)} >{desc}</button>
                    </li>
                )
            else return (
                <li key={move}>
                    <button onClick={() => jumpTo(move)} >{desc}</button>
                </li>
            );
        });

        let status;
        let sortStatus = isAscend ? 'Ascending' : 'Descending';

        if (winner) {
            status = 'Winner: ' + winner;
            current.winner = winner;
        }
        else if (!winner && !current.squares.includes(null)) {
            status = "It's a draw";
        }
        else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }

        let reverseMoves = moves.slice(); //copy original moves because reverse() mutate the original array
        reverseMoves = reverseMoves.reverse();
        let displayMoves = isAscend ? moves : reverseMoves;
            return (
                <div className="game">
                    <div className="game-board">
                        <Board squares={current.squares} onClick={(i) => handleClick(i)} winLine={winLine}/>
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <ol>{displayMoves}</ol>
                    </div>
                    <div>
                        <button onClick={() => handleSortClick()}>Sort moves: {sortStatus}</button>
                    </div>
                </div>
            )
    }

    return (
        <div className="game">
            <div>
                <fieldset>
                    <legend> Enter board size (nxn):</legend>
                    <input type='number' value={size} onChange={handleChange} ></input>
                    <button onClick={handleOkClick}>Ok</button>
                </fieldset>
            </div>
        </div>
    );
}

export default Game;