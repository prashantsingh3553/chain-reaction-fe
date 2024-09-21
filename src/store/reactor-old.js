import { defineStore } from 'pinia';
import Constants from '../config';

const useReactor = defineStore('reactor-old', {
  state: () => ({
    rows: Constants.NO_OF_ROWS,
    cols: Constants.NO_OF_COLS,

    ballsMatrix: Array(Constants.NO_OF_ROWS).
      fill()
      .map(() => Array(Constants.NO_OF_COLS).fill(0)),
    
    reactionQueue: [],
  }),

  actions: {
    addBall(row, col) {
      this.ballsMatrix[row][col] += 1;
    },

    explodeBox(row, col) {
      const boxPosition = this.getBoxPosition(row, col);
      this.ballsMatrix[row][col] -= Constants.MAX_LIFE[boxPosition];
    },

    boxExceedingLimit(row, col) {
      const ballsPresent = this.ballsMatrix[row][col];
      const boxPosition = this.getBoxPosition(row, col);

      return ballsPresent > Constants.MAX_LIFE[boxPosition];
    },
    
    boxReachedLimit(row, col) {
      const ballsPresent = this.ballsMatrix[row][col];
      const boxPosition = this.getBoxPosition(row, col);

      return ballsPresent === Constants.MAX_LIFE[boxPosition];
    },

    populateBalls(row, col) {
      const Movements = {
        UP: [0, 1],
        DOWN: [0, -1],
        LEFT: [-1, 0],
        RIGHT: [1, 0],
      };

      const isValidBox = (row, col) => row >= 0 &&
                                        col >= 0 &&
                                        row < this.rows &&
                                        col < this.cols;

      Object.values(Movements).forEach(([ moveX, moveY ]) => {
        const targetRow = row + moveX;
        const targetCol = col + moveY;

        if (isValidBox(targetRow, targetCol)) {
          this.addBall(targetRow, targetCol);

          if (this.boxReachedLimit(targetRow, targetCol)) {
            this.reactionQueue.push({ row: targetRow, col: targetCol });
          }
        }
      });
    },

    addBallToNeighbors(row, col) {
      const balls = this.ballsMatrix[row][col];
      const position = this.getBoxPosition(row, col);

      if (balls < Constants.MAX_LIFE[position]) {
        return;
      }

      this.explodeBox(row, col);
      this.populateBalls(row, col);
    },

    reactBox(row, col, isUserInput = false) {
      if (isUserInput) {
        this.addBall(row, col);
      }

      if (this.boxReachedLimit(row, col) || this.boxExceedingLimit(row, col)) {
        this.addBallToNeighbors(row, col);
      }
    },

    react(row, col) {
      const timeLimit = 500;
      const startTime = Date.now();
      let isUserInput = true;

      this.reactionQueue.push({ row, col });

      while (this.reactionQueue.length) {
        // Fail Safe for infinite loop
        if (Date.now() - startTime > timeLimit) {
          console.log('Infinite loop');
          break;
        }

        // TODO: Check if all boxes are same color -> break;

        const { row: x, col: y } = this.reactionQueue.shift();
        console.log(`${x}, ${y}: `, this.ballsMatrix[x][y]);

        // Start reaction in box
        this.reactBox(x, y, isUserInput);
        isUserInput = false;
      }
    },
    
    startReaction(row, col) {
      this.react(row, col);
    },

    fillRandomValue() {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          if (this.isCornerBox(row, col)) {
            this.ballsMatrix[row][col] = 1;
          } else if (this.isSideBox(row, col)) {
            this.ballsMatrix[row][col] = ~~(Math.random() * 3);
          } else {
            this.ballsMatrix[row][col] = ~~(Math.random() * 4);
          }
        }
      }
    },

    isCornerBox(row, col) {
      return (row === 0 && col === 0) || // top-left
        (row === 0 && col === this.cols - 1) || // top-right
        (row === this.rows - 1 && col === 0) || // bottom-left
        (row === this.rows - 1 && col === this.cols - 1); // bottom-right
    },

    isSideBox(row, col) {
      return !this.isCornerBox(row, col) &&
        (row === 0 || col === 0 || row === this.rows - 1 || col === this.cols - 1);
    },

    isMiddleBox(row, col) {
      return !this.isSideBox(row, col);
    },

    getBoxPosition(row, col) {
      if (this.isCornerBox(row, col)) {
        return Constants.POSITIONS.CORNER;
      } else if (this.isSideBox(row, col)) {
        return Constants.POSITIONS.SIDE;
      }
      return Constants.POSITIONS.MIDDLE;
    },
  },
});

export default useReactor;
