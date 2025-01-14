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

    rotateRow(no: number, clockwise: boolean){
        var temp: side[] = []
       
        const res = Array.from({ length: this.dim }, () => Array(this.dim).fill(null))

        if(clockwise){
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.front[i][no]
                this.front[i][no] = this.left[i][no]
                this.left[i][no] = this.back[i][no]
                this.back[i][no] = this.right[i][no]
                this.right[i][no] = temp[i]
                if(no == 0){
                    for(let j = 0; j < this.dim; j++){
                        res[this.dim - j - 1][i] = this.bottom[i][j]
                    }
                }
                else if(no == this.dim - 1){
                    for(let j = 0; j < this.dim; j++){
                        res[this.dim - j - 1][i] = this.top[i][j]
                    }
                }
            }
        }
        else{
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.front[i][no]
                this.front[i][no] = this.right[i][no]
                this.right[i][no] = this.back[i][no]
                this.back[i][no] = this.left[i][no]
                this.left[i][no] = temp[i]
                if(no == 0){
                    for(let j = 0; j < this.dim; j++){
                        res[j][this.dim - i - 1] = this.bottom[i][j]
                    }
                }
                else if(no == this.dim - 1){
                    for(let j = 0; j < this.dim; j++){
                        res[j][this.dim - i - 1] = this.top[i][j]
                    }
                }
            }
        }
        if(no == 0){
            for (let i = 0; i < this.dim; i++) {
                this.bottom[i] = res[i].slice()
            }
        }
        else if(no == this.dim - 1){
            for(let i = 0; i < this.dim; i++){
                this.top[i] = res[i].slice()
            }
        }
    }

    rotateColumnX(no: number, clockwise: boolean){
        var temp: side[] = []
        const res = Array.from({ length: this.dim }, () => Array(this.dim).fill(null))
        if(clockwise){
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.top[no][i]
                this.top[no][i] = this.front[no][i]
                this.front[no][i] = this.bottom[no][i]
                this.bottom[no][i] = this.back[no][i]
                this.back[no][i] = temp[i]
                if(no == 0){
                    for(let j = 0; j < this.dim; j++){
                        res[j][this.dim - i - 1] = this.left[i][j]
                    }
                }
                else if(no == this.dim - 1){
                    for(let j = 0; j < this.dim; j++){
                        res[j][this.dim - i - 1] = this.right[i][j]
                    }
                }
            }
        }
        else{
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.top[no][i]
                this.top[no][i] = this.back[no][i]
                this.back[no][i] = this.bottom[no][i]
                this.bottom[no][i] = this.front[no][i]
                this.front[no][i] = temp[i]
                if(no == 0){
                    for(let j = 0; j < this.dim; j++){
                        res[this.dim - j - 1][i] = this.left[i][j]
                    }
                }
                else if(no == this.dim - 1){
                    for(let j = 0; j < this.dim; j++){
                        res[this.dim - j - 1][i] = this.right[i][j]
                    }
                }
            }
        }
        if(no == 0){
            for (let i = 0; i < this.dim; i++) {
                this.left[i] = res[i].slice()
            }
        }
        else if(no == this.dim - 1){
            for(let i = 0; i < this.dim; i++){
                this.right[i] = res[i].slice()
            }
        }
    }

    rotateColumnZ(no: number, clockwise: boolean){
        var temp: side[] = []
        const res = Array.from({ length: this.dim }, () => Array(this.dim).fill(null))
        if(clockwise){
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.top[this.dim - i - 1][no]
                this.top[this.dim - i - 1][no] = this.right[no][i]
                this.right[no][i] = this.bottom[this.dim - i - 1][no]
                this.bottom[this.dim - i - 1][no] = this.left[no][i]
                this.left[no][i] = temp[i]
                if(no == 0){
                    for(let j = 0; j < this.dim; j++){
                        res[this.dim - j - 1][i] = this.front[i][j]
                    }
                }
                else if(no == this.dim - 1){
                    for(let j = 0; j < this.dim; j++){
                        res[this.dim - j - 1][i] = this.back[i][j]
                    }
                }
            }
        }
        else{
            for(let i = 0; i < this.dim; i++){
                temp[i] = this.top[i][no]
                this.top[i][no] = this.left[no][i]
                this.left[no][i] = this.bottom[i][no]
                this.bottom[i][no] = this.right[no][i]
                this.right[no][i] = temp[i]
                if(no == 0){
                    for(let j = 0; j < this.dim; j++){
                        res[j][this.dim - i - 1] = this.front[i][j]
                    }
                }
                else if(no == this.dim - 1){
                    for(let j = 0; j < this.dim; j++){
                        res[j][this.dim - i - 1] = this.back[i][j]
                    }
                }
            }
        }
        if(no == 0){
            for (let i = 0; i < this.dim; i++) {
                this.front[i] = res[i].slice()
            }
        }
        else if(no == this.dim - 1){
            for(let i = 0; i < this.dim; i++){
                this.back[i] = res[i].slice()
            }
        }
    }
}