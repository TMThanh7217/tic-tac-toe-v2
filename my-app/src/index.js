import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './components/Board'

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                cur_pos: -1,
                winner: null,
            }],
            size: 3,
            xIsNext: true,
            stepNumber: 0,
            isAscend: true,
            okClick: false,
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleOkClick = this.handleOkClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const cur_pos = i;
        /*if (calculateWinner(squares) || squares[i]) {
            return;
        }*/

        if (current.winner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                cur_pos: cur_pos,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    handleSortClick() {
        this.setState({
            isAscend: !this.state.isAscend,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleOkClick(e) {
        let boardSize = this.state.size;
        let squares = new Array(boardSize * boardSize).fill(null);
        //console.log(boardSize);
        if (boardSize < 3 || boardSize > 5 )
            alert('Board size must be >= 3 and <= 5');
        else {
            this.setState({
                okClick: true,
                size: boardSize,
                history: [{
                    squares: squares,
                }],
            });
            }
        e.preventDefault();
    }

    handleChange(e) {
        this.setState({size: e.target.value});
    }

    render() {
        if (this.state.okClick) {
            const history = this.state.history;
            const current = history[this.state.stepNumber];
            console.log('in render ' + current.squares.length);
            //const winner = calculateWinner(current.squares);
            /*console.log(`Game render squares ${current.squares}`);
            console.log(`Game render cur_pos ${current.cur_pos}`);*/
            const winner = calculateWinner(current.squares, current.cur_pos) ? calculateWinner(current.squares, current.cur_pos).squares : null ;
            const winLine = calculateWinner(current.squares, current.cur_pos) ? calculateWinner(current.squares, current.cur_pos).winLine : null ;
            //console.log(`Game ${winLine}`);
            //console.log(`Game render winner ${winner}`);
            //const cur_pos = this.state.cur_pos;
            
            const moves = history.map((step, move) => {
                let cur_pos = step.cur_pos ;
                let boardLength = Math.sqrt(step.squares.length);
                //x = index % cols, y = index / cols
                let col = cur_pos % boardLength 
                let row = Math.floor(cur_pos / boardLength)
                const isSelected = move === this.state.stepNumber;
                //col, row + 1 because x, y start from 0
                const desc = move ? 'Go to move #' + move + ` (${col + 1}, ${row + 1})` : 'Go to game start';

                if (isSelected)
                    return (
                        <li key={move}>
                            <button style={{fontWeight: 'bold'}} onClick={() => this.jumpTo(move)} >{desc}</button>
                        </li>
                    )
                else return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)} >{desc}</button>
                    </li>
                );
            });

            let status;
            let sortStatus = this.state.isAscend ? 'Ascending' : 'Descending';

            if (winner) {
                status = 'Winner: ' + winner;
                current.winner = winner;
            }
            else if (!winner && !current.squares.includes(null)) {
                status = "It's a draw";
            }
            else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }

            let reverseMoves = moves.slice(); //copy original moves because reverse() mutate the original array
            reverseMoves = reverseMoves.reverse();
            let displayMoves = this.state.isAscend ? moves : reverseMoves;
                return (
                    <div className="game">
                        <div className="game-board">
                            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winLine={winLine}/>
                        </div>
                        <div className="game-info">
                            <div>{status}</div>
                            <ol>{displayMoves}</ol>
                        </div>
                        <div>
                            <button onClick={() => this.handleSortClick()}>Sort moves: {sortStatus}</button>
                        </div>
                    </div>
                )
        }

        return (
            <div className="game">
                <div>
                    <fieldset>
                        <legend> Enter board size (nxn):</legend>
                        <input type='number' value={this.state.size} onChange={this.handleChange} ></input>
                        <button onClick={this.handleOkClick}>Ok</button>
                    </fieldset>
                </div>
            </div>
        );
    }
}
  
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
