import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import Constants, { Directions, Positions } from '../config'
import type { ICell } from '../types/room'
import usePlayers from './players'
import useRoom from './room'

interface Ball {
  playerId: string
  count: number
  capacity: number
}

interface BallWithColor extends Ball {
  color: string
}

interface TravellingBall {
  fromRow: number
  fromCol: number
  toRow: number
  toCol: number
}

const useReactor = defineStore('reactor', () => {
  const $room = useRoom()
  const $players = usePlayers()

  const rows = ref(Constants.NO_OF_ROWS)
  const cols = ref(Constants.NO_OF_COLS)
  const boxWidth = ref(0)
  const _ballsMatrix = ref<Ball[][]>([[]])
  const travellingBalls = ref<TravellingBall[]>([])

  const ballsMatrix = computed(() => {
    return _ballsMatrix.value.reduce((acc, row) => {
      acc.push(row.map(cell => {
        const playerColor = $players.playersMap[cell.playerId]?.color;
        return {
          playerId: cell.playerId,
          count: cell.count,
          capacity: cell.capacity,
          color: playerColor,
        };
      }))
      return acc;
    }, [] as BallWithColor[][]);
  });

  const travellingBallColor = computed(() => {
    return $players.playersMap[$players.playerIdTurn]?.color
  });

  function addBall(row: number, col: number) {
    _ballsMatrix.value[row][col].count += 1
    _ballsMatrix.value[row][col].playerId = $players.playerIdTurn;
  }

  function addTravellingBall(fromRow: number, fromCol: number, toRow: number, toCol: number) {
    _ballsMatrix.value[fromRow][fromCol].playerId = $players.playerIdTurn;
    travellingBalls.value.push({ fromRow, fromCol, toRow, toCol })
  }

  function explode(row: number, col: number) {
    const Movements = {
      [Directions.UP]: [-1, 0],
      [Directions.DOWN]: [1, 0],
      [Directions.LEFT]: [0, -1],
      [Directions.RIGHT]: [0, 1],
    }

    const isValidBox = (x: number, y: number) =>
      x >= 0 && y >= 0 && x < rows.value && y < cols.value

    Object.entries(Movements).forEach(([direction, [moveX, moveY]]) => {
      const targetRow = row + moveX
      const targetCol = col + moveY

      if (isValidBox(targetRow, targetCol))
        addTravellingBall(row, col, targetRow, targetCol)
    })
  }

  function explodeIfFull(row: number, col: number) {
    if (
      _ballsMatrix.value[row][col].count >= _ballsMatrix.value[row][col].capacity
    ) {
      _ballsMatrix.value[row][col].count = 0
      _ballsMatrix.value[row][col].playerId = '';
      explode(row, col)
    }
  }

  function react() {
    const travellingBallsCopy = [...travellingBalls.value]
    travellingBallsCopy.forEach(
      ({ fromRow, fromCol, toRow, toCol }, index) => {
        startReaction(toRow, toCol)
        travellingBalls.value.shift()
        _ballsMatrix.value[fromRow][fromCol].playerId = '';
      },
    )
  }

  function startReaction(row: number, col: number) {
    addBall(row, col)
    explodeIfFull(row, col)
  }

  function setBoard(boardState: ICell[][]) {
    rows.value = boardState.length
    cols.value = boardState[0].length

    const matrix: Ball[][] = []
    for (let row = 0; row < rows.value; row++) {
      const rowMatrix: Ball[] = []

      for (let col = 0; col < cols.value; col++) {
        const cell = boardState[row][col]

        rowMatrix[col] = {
          playerId: cell.playerId,
          count: cell.count,
          capacity: cell.capacity,
        }
      }
      matrix[row] = rowMatrix
    }

    _ballsMatrix.value = matrix
  }

  // For testing
  function fillRandomValue() {
    const matrix: Ball[][] = []
    const a = false

    for (let row = 0; row < rows.value; row++) {
      const matrixRow: Ball[] = []

      for (let col = 0; col < cols.value; col++) {
        const color = Object.values(Constants.Colors)[
          ~~(Math.random() * Object.values(Constants.Colors)
            .length)]
        const ball: Ball = {
          playerId: '',
          count: 0,
          capacity: Constants.CAPACITY[Positions.MIDDLE],
        }
        if (isCornerBox(row, col)) {
          ball.count = 1
          // ball.count = 0;
          ball.capacity = Constants.CAPACITY[Positions.CORNER]
        }
        else if (isSideBox(row, col)) {
          ball.count = ~~(Math.random() * 3)
          // ball.count = 0;
          ball.capacity = Constants.CAPACITY[Positions.SIDE]
        }
        else {
          ball.count = ~~(Math.random() * 4)
          // ball.count = 0;
          ball.capacity = Constants.CAPACITY[Positions.MIDDLE]
        }

        matrixRow.push(ball)
      }
      matrix.push(matrixRow)
    }

    _ballsMatrix.value = matrix
  }

  function isCornerBox(row: number, col: number) {
    return (
      (row === 0 && col === 0) // top-left
      || (row === 0 && col === cols.value - 1) // top-right
      || (row === rows.value - 1 && col === 0) // bottom-left
      || (row === rows.value - 1 && col === cols.value - 1)
    ) // bottom-right
  }

  function isSideBox(row: number, col: number) {
    return (
      !isCornerBox(row, col)
      && (row === 0
      || col === 0
      || row === rows.value - 1
      || col === cols.value - 1)
    )
  }

  function isMiddleBox(row: number, col: number) {
    return !isSideBox(row, col)
  }

  function getPosition(row: number, col: number) {
    if (isCornerBox(row, col))
      return Positions.CORNER
    else if (isSideBox(row, col))
      return Positions.SIDE

    return Positions.MIDDLE
  }

  return {
    rows,
    cols,
    boxWidth,
    travellingBalls,

    ballsMatrix,
    travellingBallColor,

    setBoard,
    react,
    startReaction,
    fillRandomValue,
  }
})

export default useReactor
