import { Cube, side } from "./Cube";
import * as THREE from 'three'

export enum steeringType{
    rowClockwise,
    rowCounterclockwise,
    columnXClockwise,
    columnXCounterclockwise,
    columnZClockwise,
    columnZCounterclockwise
}

export class DrawSteering{
    
    geometry = new THREE.PlaneGeometry( 0.5, 0.3 )
    material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} )
    scene: THREE.Scene
    offset = 1.101
    steeringPlanes: Array<THREE.Mesh> = [] 
    currentId = 0;

    constructor (scene: THREE.Scene){
        this.scene = scene
    }   

    drawOne(type: steeringType, pos: THREE.Vector3, rot: THREE.Euler, no: number){
        var plane = new THREE.Mesh( this.geometry, this.material)
        plane.position.set(pos.x, pos.y, pos.z)
        plane.setRotationFromEuler (rot)
        plane.userData = { id: this.currentId, color: 0xff0000, no: no, type: type };
        this.currentId += 1;
        this.steeringPlanes.push(plane)
        this.scene.add(plane)
    }

    drawAll(dim: number){
        for (let side = 0; side < 6; side++) {
            for (let i = 0; i < dim; i++) {
                switch (side) {
                    case 0: // Front face
                        this.drawOne(
                            steeringType.columnXClockwise,
                            new THREE.Vector3(
                                (i - 1) * this.offset,
                                this.offset * dim / 2 - 0.15,
                                this.offset * dim / 2
                            ),
                            new THREE.Euler(0, 0, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.columnXCounterclockwise,
                            new THREE.Vector3(
                                (i - 1) * this.offset,
                                -this.offset * dim / 2 + 0.15,
                                this.offset * dim / 2
                            ),
                            new THREE.Euler(0, Math.PI, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.rowClockwise,
                            new THREE.Vector3(
                                this.offset * dim / 2 - 0.15,
                                (i - 1) * this.offset,
                                this.offset * dim / 2
                            ),
                            new THREE.Euler(0, 0, Math.PI / 2, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.rowCounterclockwise,
                            new THREE.Vector3(
                                -this.offset * dim / 2 + 0.15,
                                (i - 1) * this.offset,
                                this.offset * dim / 2
                            ),
                            new THREE.Euler(0, 0, -Math.PI / 2, "XYZ"),
                            i
                        );
                        break;
        
                    case 1: // Back face
                        this.drawOne(
                            steeringType.columnXCounterclockwise,
                            new THREE.Vector3(
                                (i - 1) * this.offset,
                                this.offset * dim / 2 - 0.15,
                                -this.offset * dim / 2
                            ),
                            new THREE.Euler(0, Math.PI, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.columnXClockwise,
                            new THREE.Vector3(
                                (i - 1) * this.offset,
                                -this.offset * dim / 2 + 0.15,
                                -this.offset * dim / 2
                            ),
                            new THREE.Euler(0, 0, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.rowCounterclockwise,
                            new THREE.Vector3(
                                this.offset * dim / 2 - 0.15,
                                (i - 1) * this.offset,
                                -this.offset * dim / 2
                            ),
                            new THREE.Euler(0, Math.PI, -Math.PI / 2, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.rowClockwise,
                            new THREE.Vector3(
                                -this.offset * dim / 2 + 0.15,
                                (i - 1) * this.offset,
                                -this.offset * dim / 2
                            ),
                            new THREE.Euler(0, Math.PI, Math.PI / 2, "XYZ"),
                            i
                        );
                        break;
        
                    case 2: // Top face
                        this.drawOne(
                            steeringType.columnXCounterclockwise,
                            new THREE.Vector3(
                                (i - 1) * this.offset,
                                this.offset * dim / 2,
                                this.offset * dim / 2 - 0.15
                            ),
                            new THREE.Euler(-Math.PI / 2, 0, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.columnXClockwise,
                            new THREE.Vector3(
                                (i - 1) * this.offset,
                                this.offset * dim / 2,
                                -this.offset * dim / 2 + 0.15
                            ),
                            new THREE.Euler(Math.PI / 2, Math.PI, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.columnZCounterclockwise,
                            new THREE.Vector3(
                                this.offset * dim / 2 - 0.15,
                                this.offset * dim / 2,
                                (i - 1) * this.offset
                            ),
                            new THREE.Euler(Math.PI / 2, 0, Math.PI / 2, "XYZ"),
                            dim - i - 1
                        );
                        this.drawOne(
                            steeringType.columnZClockwise,
                            new THREE.Vector3(
                                -this.offset * dim / 2 + 0.15,
                                this.offset * dim / 2,
                                (i - 1) * this.offset
                            ),
                            new THREE.Euler(-Math.PI / 2, 0, Math.PI / 2, "XYZ"),
                            dim - i - 1
                        );
                        break;
        
                    case 3: // Bottom face
                        this.drawOne(
                            steeringType.columnXClockwise,
                            new THREE.Vector3(
                                (i - 1) * this.offset,
                                -this.offset * dim / 2,
                                this.offset * dim / 2 - 0.15
                            ),
                            new THREE.Euler(Math.PI / 2, 0, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.columnXCounterclockwise,
                            new THREE.Vector3(
                                (i - 1) * this.offset,
                                -this.offset * dim / 2,
                                -this.offset * dim / 2 + 0.15
                            ),
                            new THREE.Euler(-Math.PI / 2, Math.PI, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.columnZClockwise,
                            new THREE.Vector3(
                                this.offset * dim / 2 - 0.15,
                                -this.offset * dim / 2,
                                (i - 1) * this.offset
                            ),
                            new THREE.Euler(Math.PI / 2, 0, -Math.PI / 2, "XYZ"),
                            dim - i - 1
                        );
                        this.drawOne(
                            steeringType.columnZCounterclockwise,
                            new THREE.Vector3(
                                -this.offset * dim / 2 + 0.15,
                                -this.offset * dim / 2,
                                (i - 1) * this.offset
                            ),
                            new THREE.Euler(Math.PI / 2, 0, -Math.PI / 2, "XYZ"),
                            dim - i - 1
                        );
                        break;
        
                    case 4: // Right face
                        this.drawOne(
                            steeringType.rowCounterclockwise,
                            new THREE.Vector3(
                                this.offset * dim / 2,
                                (i - 1) * this.offset,
                                this.offset * dim / 2 - 0.15
                            ),
                            new THREE.Euler(Math.PI / 2, Math.PI / 2, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.rowClockwise,
                            new THREE.Vector3(
                                this.offset * dim / 2,
                                (i - 1) * this.offset,
                                -this.offset * dim / 2 + 0.15
                            ),
                            new THREE.Euler(Math.PI / 2, -Math.PI / 2, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.columnZClockwise,
                            new THREE.Vector3(
                                this.offset * dim / 2,
                                this.offset * dim / 2 - 0.15,
                                (i - 1) * this.offset,
                            ),
                            new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
                            dim - i - 1
                        );
                        this.drawOne(
                            steeringType.columnZCounterclockwise,
                            new THREE.Vector3(
                                this.offset * dim / 2,
                                -this.offset * dim / 2 + 0.15,
                                (i - 1) * this.offset,
                            ),
                            new THREE.Euler(0, -Math.PI / 2, 0, "XYZ"),
                            dim - i - 1
                        );
                        break;
        
                    case 5: // Left face
                        this.drawOne(
                            steeringType.rowClockwise,
                            new THREE.Vector3(
                                -this.offset * dim / 2,
                                (i - 1) * this.offset,
                                this.offset * dim / 2 - 0.15
                            ),
                            new THREE.Euler(Math.PI / 2, -Math.PI / 2, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.rowCounterclockwise,
                            new THREE.Vector3(
                                -this.offset * dim / 2,
                                (i - 1) * this.offset,
                                -this.offset * dim / 2 + 0.15
                            ),
                            new THREE.Euler(Math.PI / 2, Math.PI / 2, 0, "XYZ"),
                            i
                        );
                        this.drawOne(
                            steeringType.columnZCounterclockwise,
                            new THREE.Vector3(
                                -this.offset * dim / 2,
                                this.offset * dim / 2 - 0.15,
                                (i - 1) * this.offset,
                            ),
                            new THREE.Euler(0, Math.PI / 2, 0, "XYZ"),
                            dim - i - 1
                        );
                        this.drawOne(
                            steeringType.columnZClockwise,
                            new THREE.Vector3(
                                -this.offset * dim / 2,
                                -this.offset * dim / 2 + 0.15,
                                (i - 1) * this.offset,
                            ),
                            new THREE.Euler(0, -Math.PI / 2, 0, "XYZ"),
                            dim - i - 1
                        );
                        break;
                }
            }
        }
        
    }
}