import { Cube } from "./Cube"

export enum kind {
    row,
    columnX,
    columnZ
}

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms))
}

export class ShuffleQueue{
    cube: Cube

    delayTime = 0.3
    queue: Array<() => void> = []
    
    constructor(cube: Cube){
        this.cube = cube
    }

    addToQueue(k: kind, no: number, clockwise: boolean){
        if(k == kind.row) this.queue.push(() => {this.cube.rotateRow(no, clockwise)})
        else if(k == kind.columnX) this.queue.push(() => {this.cube.rotateColumnX(no, clockwise)})
        else if(k == kind.columnZ) this.queue.push(() => {this.cube.rotateColumnZ(no, clockwise)})
    }

    async exhaustQueue(){
        while(this.queue.length != 0){
            await delay(this.delayTime * 1000)
            let fun = this.queue.pop()
            fun?.()
        }
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    getQueue(numberOfShuffles = 3){
        for(let i = 0; i < numberOfShuffles; i++){
            const randpmKind = this.getRandomInt(6)
            const randomNo = this.getRandomInt(3)

            switch (randpmKind){
                case 0:
                    this.addToQueue(kind.row, randomNo, true)
                    break;
                case 1:
                    this.addToQueue(kind.row, randomNo, false)
                    break;
                case 2:
                    this.addToQueue(kind.columnX, randomNo, true)
                    break;
                case 3:
                    this.addToQueue(kind.columnX, randomNo, false)
                    break;
                case 4:
                    this.addToQueue(kind.columnZ, randomNo, true)
                    break;
                case 5:
                    this.addToQueue(kind.columnZ, randomNo, false)
                    break;
            }
        }
    }
}