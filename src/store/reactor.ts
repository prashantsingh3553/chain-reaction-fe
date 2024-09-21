import { defineStore } from 'pinia';
import Constants, { Directions, Positions } from '../config';

interface Ball {
  color: string;
  count: number;
  capacity: number;
  position: Positions
}

interface TravellingBall {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

const useReactor = defineStore('reactor', {
  state: () => ({
    rows: Constants.NO_OF_ROWS,
    cols: Constants.NO_OF_COLS,

    boxWidth: 0,

    ballsMatrix: [[]] as Ball[][],

    travellingBalls: [] as TravellingBall[],
  }),

  actions: {
    addBall(row: number, col: number) {
      this.ballsMatrix[row][col].count += 1;
    },

    addTravellingBall(fromRow: number, fromCol: number, toRow: number, toCol: number) {
      this.travellingBalls.push({ fromRow, fromCol, toRow, toCol });
    },

    explode(row: number, col: number) {
      const Movements = {
        [Directions.UP]: [-1, 0],
        [Directions.DOWN]: [1, 0],
        [Directions.LEFT]: [0, -1],
        [Directions.RIGHT]: [0, 1],
      };

      const isValidBox = (x: number, y: number) =>
        x >= 0 && y >= 0 && x < this.rows && y < this.cols;

      Object.entries(Movements).forEach(([direction, [moveX, moveY]]) => {
        const targetRow = row + moveX;
        const targetCol = col + moveY;

        if (isValidBox(targetRow, targetCol)) {
          this.addTravellingBall(row, col, targetRow, targetCol);
        }
      });
    },

    explodeIfFull(row: number, col: number) {
      if (
        this.ballsMatrix[row][col].count >= this.ballsMatrix[row][col].capacity
      ) {
        this.ballsMatrix[row][col].count = 0;
        this.explode(row, col);
      }
    },

    react() {
      const travellingBalls = [...this.travellingBalls];
      travellingBalls.forEach(
        ({ fromRow, fromCol, toRow, toCol }, index) => {
          this.startReaction(toRow, toCol);
          this.travellingBalls.shift();
        }
      );
    },

    startReaction(row: number, col: number) {
      this.addBall(row, col);
      this.explodeIfFull(row, col);
    },

    fillRandomValue() {
      const matrix: Ball[][] = [];
      let a = false;

      for (let row = 0; row < this.rows; row++) {
        const matrixRow: Ball[] = [];

        for (let col = 0; col < this.cols; col++) {
          const color = Object.values(Constants.Colors)[
            ~~(Math.random() * Object.values(Constants.Colors)
          .length)];
          let ball: Ball = {
            color,
            count: 0,
            capacity: Constants.CAPACITY[Positions.MIDDLE],
            position: Positions.MIDDLE,
          };
          if (this.isCornerBox(row, col)) {
            ball.count = 1;
            // ball.count = 0;
            ball.capacity = Constants.CAPACITY[Positions.CORNER];
            ball.position = this.getPosition(row, col);
          } else if (this.isSideBox(row, col)) {
            ball.count = ~~(Math.random() * 3);
            // ball.count = 0;
            ball.capacity = Constants.CAPACITY[Positions.SIDE];
            ball.position = this.getPosition(row, col);
          } else {
            ball.count = ~~(Math.random() * 4);
            // ball.count = 0;
            ball.capacity = Constants.CAPACITY[Positions.MIDDLE];
            ball.position = this.getPosition(row, col);
          }

          matrixRow.push(ball);
        }
        matrix.push(matrixRow);
      }

      this.ballsMatrix = matrix;
    },

    isCornerBox(row: number, col: number) {
      return (
        (row === 0 && col === 0) || // top-left
        (row === 0 && col === this.cols - 1) || // top-right
        (row === this.rows - 1 && col === 0) || // bottom-left
        (row === this.rows - 1 && col === this.cols - 1)
      ); // bottom-right
    },

    isSideBox(row, col) {
      return (
        !this.isCornerBox(row, col) &&
        (row === 0 ||
          col === 0 ||
          row === this.rows - 1 ||
          col === this.cols - 1)
      );
    },

    isMiddleBox(row, col) {
      return !this.isSideBox(row, col);
    },

    getPosition(row: number, col: number) {
      if (this.isCornerBox(row, col)) {
        return Positions.CORNER;
      } else if (this.isSideBox(row, col)) {
        return Positions.SIDE;
      }
      return Positions.MIDDLE;
    },
  },
});

export default useReactor;
