export enum side {
    white = 0,
    green = 1,
    red = 2,
    blue = 3,
    yellow = 4,
    orange = 5  
}

export class Cube {

    dim = 3;

    top: side[][];
    bottom: side[][];
    right: side[][];
    left: side[][];
    front: side[][];
    back: side[][];

    constructor () {
        this.top = [];
        this.bottom = [];
        this.right = [];
        this.left = [];
        this.front = [];
        this.back = [];

        for(let i = 0; i < this.dim; i++){
            this.top[i] = [];
            this.bottom[i] = [];
            this.right[i] = [];
            this.left[i] = [];
            this.front[i] = [];
            this.back[i] = [];
            for(let j = 0; j < this.dim; j++){
                this.top[i][j] = side.white;
                this.bottom[i][j] = side.orange;
                this.right[i][j] = side.red;
                this.left[i][j] = side.green;
                this.front[i][j] = side.blue;
                this.back[i][j] = side.yellow;
            }
        }
    }
}