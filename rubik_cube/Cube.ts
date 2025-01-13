import { temp } from "three/examples/jsm/nodes/Nodes.js";

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

    rotateRow(no: number, clockwise: boolean){
        var temp: side[] = [];
        if(clockwise){
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.front[i][no];
                this.front[i][no] = this.left[i][no];
                this.left[i][no] = this.back[i][no];
                this.back[i][no] = this.right[i][no];
                this.right[i][no] = temp[i];
            }
        }
        else{
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.front[i][no];
                this.front[i][no] = this.right[i][no];
                this.right[i][no] = this.back[i][no];
                this.back[i][no] = this.left[i][no];
                this.left[i][no] = temp[i];
            }
        }
    }

    rotateColumnX(no: number, clockwise: boolean){
        var temp: side[] = [];
        if(clockwise){
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.top[no][i];
                this.top[no][i] = this.front[no][i];
                this.front[no][i] = this.bottom[no][i];
                this.bottom[no][i] = this.back[no][i];
                this.back[no][i] = temp[i];
            }
        }
        else{
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.top[no][i];
                this.top[no][i] = this.back[no][i];
                this.back[no][i] = this.bottom[no][i];
                this.bottom[no][i] = this.front[no][i];
                this.front[no][i] = temp[i];
            }
        }
    }

    rotateColumnZ(no: number, clockwise: boolean){
        var temp: side[] = [];
        if(clockwise){
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.top[i][no];
                this.top[i][no] = this.right[no][i];
                this.right[no][i] = this.bottom[i][no];
                this.bottom[i][no] = this.left[no][i];
                this.left[no][i] = temp[i];
            }
        }
        else{
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.top[i][no];
                this.top[i][no] = this.left[no][i];
                this.left[no][i] = this.bottom[i][no];
                this.bottom[i][no] = this.right[i][no];
                this.right[no][i] = temp[i];
            }
        }
    }
}