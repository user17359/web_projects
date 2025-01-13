import { Cube } from "./Cube";

export enum kind {
    row,
    columnX,
    columnZ
}

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};

export class ShuffleQueue{
    cube: Cube;

    delayTime = 1;
    queue: Array<() => void> = [];
    
    constructor(cube: Cube){
        this.cube = cube;
    }

    addToQueue(k: kind, no: number, clockwise: boolean){
        if(k == kind.row) this.queue.push(() => {this.cube.rotateRow(no, clockwise)})
        else if(k == kind.columnX) this.queue.push(() => {this.cube.rotateColumnX(no, clockwise)})
        else if(k == kind.columnZ) this.queue.push(() => {this.cube.rotateColumnZ(no, clockwise)})
    }

    async exhaustQueue(){
        while(this.queue.length != 0){
            await delay(this.delayTime * 1000);
            let fun = this.queue.pop()
            fun?.();
        }
    }
}