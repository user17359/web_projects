import { temp } from "three/examples/jsm/nodes/Nodes.js"

export enum side {
    white = 0,
    green = 1,
    red = 2,
    blue = 3,
    yellow = 4,
    orange = 5  
}

export class Cube {

    dim = 3

    top: side[][]
    bottom: side[][]
    right: side[][]
    left: side[][]
    front: side[][]
    back: side[][]

    constructor () {
        this.top = []
        this.bottom = []
        this.right = []
        this.left = []
        this.front = []
        this.back = []

        for(let i = 0; i < this.dim; i++){
            this.top[i] = []
            this.bottom[i] = []
            this.right[i] = []
            this.left[i] = []
            this.front[i] = []
            this.back[i] = []
            for(let j = 0; j < this.dim; j++){
                this.top[i][j] = side.white
                this.bottom[i][j] = side.orange
                this.right[i][j] = side.red
                this.left[i][j] = side.green
                this.front[i][j] = side.blue
                this.back[i][j] = side.yellow
            }
        }
    }

    private getRow(face: side[][], row: number): side[] {
        return face[row].slice();
    }
    
    private setRow(face: side[][], row: number, values: side[]) {
        face[row] = values.slice();
    }

    private getColumn(face: side[][], col: number): side[] {
        return face.map(row => row[col]);
    }
    
    private setColumn(face: side[][], col: number, values: side[]) {
        face.forEach((row, i) => (row[col] = values[i]));
    }

    private rotateFace(face: side[][], clockwise: boolean): side[][] {
        const dim = face.length;
        const newFace = Array.from({ length: dim }, () => Array(dim).fill(null));
    
        for (let i = 0; i < dim; i++) {
            for (let j = 0; j < dim; j++) {
                if (clockwise) {
                    newFace[j][dim - i - 1] = face[i][j];
                } else {
                    newFace[dim - j - 1][i] = face[i][j];
                }
            }
        }
    
        return newFace;
    }

    rotateRow(no: number, clockwise: boolean){
        const temp = this.getRow(this.front, no);

        if (clockwise) {
            this.setRow(this.front, no, this.getRow(this.left, no).reverse());
            this.setRow(this.left, no, this.getRow(this.back, no));
            this.setRow(this.back, no, this.getRow(this.right, no).reverse());
            this.setRow(this.right, no, temp);
        } else {
            this.setRow(this.front, no, this.getRow(this.right, no));
            this.setRow(this.right, no, this.getRow(this.back, no).reverse());
            this.setRow(this.back, no, this.getRow(this.left, no));
            this.setRow(this.left, no, temp.reverse());
        }

        if (no === 0) {
            this.bottom = this.rotateFace(this.bottom, clockwise);
        } else if (no === this.dim - 1) {
            this.top = this.rotateFace(this.top, clockwise);
        }
    }

    rotateColumnX(no: number, clockwise: boolean){
        const temp = this.getColumn(this.top, no);
        if (clockwise) {
            this.setColumn(this.top, no, this.getColumn(this.front, no));
            this.setColumn(this.front, no, this.getColumn(this.bottom, no).reverse());
            this.setColumn(this.bottom, no, this.getColumn(this.back, no));
            this.setColumn(this.back, no, temp.reverse());
        } else {
            this.setColumn(this.top, no, this.getColumn(this.back, no).reverse());
            this.setColumn(this.back, no, this.getColumn(this.bottom, no));
            this.setColumn(this.bottom, no, this.getColumn(this.front, no).reverse());
            this.setColumn(this.front, no, temp);
        }
    
        if (no === 0) {
            this.left = this.rotateFace(this.left, !clockwise);
        } else if (no === this.dim - 1) {
            this.right = this.rotateFace(this.right, !clockwise);
        }
    }

    rotateColumnZ(no: number, clockwise: boolean){
        const temp = this.getRow(this.top, no);

        if (clockwise) {
            this.setRow(this.top, no, this.getColumn(this.left, no));
            this.setColumn(this.left, no, this.getRow(this.bottom, no).reverse());
            this.setRow(this.bottom, no, this.getColumn(this.right, no));
            this.setColumn(this.right, no, temp.reverse());
        } else {
            this.setRow(this.top, no, this.getColumn(this.right, no).reverse());
            this.setColumn(this.right, no, this.getRow(this.bottom, no));
            this.setRow(this.bottom, no, this.getColumn(this.left, no).reverse());
            this.setColumn(this.left, no, temp);
        }

        if (no === 0) {
            this.front = this.rotateFace(this.front, !clockwise);
        } else if (no === this.dim - 1) {
            this.back = this.rotateFace(this.back, !clockwise);
        }
    }
}