export enum side {
    white = 0,
    green = 1,
    red = 2,
    blue = 3,
    yellow = 4,
    orange = 5  
}

export class Cube {
    top: side[][];
    bottom: side[][];
    right: side[][];
    left: side[][];
    front: side[][];
    back: side[][];
}