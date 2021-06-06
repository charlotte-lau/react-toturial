import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className={`square ${props.current ? "current" : ''}` }
      onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
          <Square key={i}
          value={this.props.squares[i]} 
          current={(this.props.currentPosition === i)}
          onClick={() => this.props.onClick(i)}/>
        );
  }

  render() {
    const boardSize = 3;
    var squares = [];
    for (var i=0; i<boardSize; i++){
        var row = [];
        for (var y=0; y<boardSize; y++){
          row.push(this.renderSquare(boardSize*i+y));
        }
        squares.push(<div key={i} className="board-row">{row}</div>);
        
    }
    return (
      <div>
        {squares}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        movedPosition: null
      }],
      stepNumber: 0,
      isAccending: true,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1]
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext?'X':'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        movedPosition: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  toggleMovedList() {
    this.setState({
      isAccending: !this.state.isAccending
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const col = Math.floor(step.movedPosition/3), row = step.movedPosition - 3*col;
      const desc = move ? 
        'Go to move #' + move + ' , col: ' + col + ', row: ' + row: 
        'Go to game start';
        return (
          <li key={move}>
              <button 
                  className={(this.state.stepNumber === move)?'current':null}
                  onClick={()=> this.jumpTo(move)}>{desc}</button>
          </li>
        )
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            currentPosition={current.movedPosition}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.toggleMovedList()}>Reverse list</button>
          <ol>{this.state.isAccending?moves:moves.reverse()}</ol>
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}