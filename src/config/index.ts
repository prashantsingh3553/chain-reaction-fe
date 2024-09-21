export enum Positions {
  CORNER = 'corner',
  SIDE = 'side',
  MIDDLE = 'middle',
};

export enum Directions {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export default {
  NO_OF_COLS: 6,
  NO_OF_ROWS: 7,

  TransitionDuration: 500,

  Colors: {
    BLUE: '#0896e1',
    RED: '#ff1f20',
    GREEN: '#79f659',
    YELLOW: '#feb927',
  },

  CAPACITY: {
    [Positions.CORNER]: 2,
    [Positions.SIDE]: 3,
    [Positions.MIDDLE]: 4,
  },
};