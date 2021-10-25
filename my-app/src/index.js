import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    //console.log(`square ${props.isWinLine}`)
    if (props.isWinLine) {
        return (
            <button className="square" style={{backgroundColor: 'green'}} onClick={props.onClick}>
                {props.value}
            </button>
        );
    }
    else{
        return (
            <button className="square" onClick={props.onClick}>
                {props.value}
            </button>
        );
    }
}
  
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
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                cur_pos: -1,
                winner: null,
            }],
            xIsNext: true,
            stepNumber: 0,
            isAscend: true,
        }
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

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
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
            let col = cur_pos % boardLength //x = index % cols
            let row = Math.floor(cur_pos / boardLength) //y = index / cols
            const isSelected = move === this.state.stepNumber;
            const desc = move ? 'Go to move #' + move + ` (${col}, ${row})` : 'Go to game start';

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
    let y = cur_pos % boardLength //x = index % cols
    let x = Math.floor(cur_pos / boardLength) //y = index / cols
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
