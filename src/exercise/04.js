// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board(props) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => props.onClick(i)}>
        {props.squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const initialSquares = Array(9).fill(null)
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0)
  const [history, setHistory] = useLocalStorageState('history', [
    initialSquares,
  ])
  const currentSquares = history[currentStep]

  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function restart() {
    setCurrentStep(0)
    setHistory([initialSquares])
  }

  const selectMove = move => {
    setCurrentStep(move)
  }

  const selectSquare = square => {
    if (winner || currentSquares[square]) {
      return
    }

    const newHistory = history.slice(0, currentStep + 1)
    const squares = [...currentSquares]

    squares[square] = nextValue
    setHistory([...newHistory, squares])
    setCurrentStep(newHistory.length)
  }

  const moves = renderMoves(history, currentStep, selectMove)

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
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
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function renderMoves(history, currentStep, selectMove) {
  return history.map((square, index) => {
    const move = index === 0 ? 'game start' : `move #${index}`
    const isCurrent = index === currentStep
    return (
      <li key={index}>
        <button
          disabled={isCurrent}
          onClick={() => selectMove(index)}
        >{`Go to ${move} ${isCurrent ? ' (current)' : ''}`}</button>
      </li>
    )
  })
}

function App() {
  return <Game />
}

export default App
