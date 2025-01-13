import { Cube, side } from "./Cube";
import * as THREE from 'three'

export class CubeRenderer{

    geometry = new THREE.PlaneGeometry( 1, 1 );
    sideMaterials : Map<side, THREE.Material> = 
        new Map([
            [side.white, new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} )],
            [side.green, new THREE.MeshBasicMaterial( {color: 0x00ff00, side: THREE.DoubleSide} )],
            [side.red, new THREE.MeshBasicMaterial( {color: 0xff0000, side: THREE.DoubleSide} )],
            [side.blue, new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide} )],
            [side.yellow, new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} )],
            [side.orange, new THREE.MeshBasicMaterial( {color: 0xfe8a18, side: THREE.DoubleSide} )],
        ]);
    fillMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
    scene: THREE.Scene;
    offset = 1.1; 
    currentCubeGroup: THREE.Group | null = null;

    constructor (scene: THREE.Scene){
        this.scene = scene;
    }   

    drawSide(type: side, pos: THREE.Vector3, rot: THREE.Euler, parentGroup: THREE.Group){
        var plane = new THREE.Mesh( this.geometry, this.sideMaterials.get(type));
        plane.position.set(pos.x, pos.y, pos.z);
        plane.setRotationFromEuler (rot);
        parentGroup.add(plane);
    }

    drawCube(cube: Cube){
        if (this.currentCubeGroup) {
            this.scene.remove(this.currentCubeGroup);
        }

        const cubeGroup = new THREE.Group();

        for(let i = 0; i < cube.dim; i++){
            for(let j = 0; j < cube.dim; j++){
                this.drawSide(cube.front[i][j], new THREE.Vector3((i - 1) * this.offset, (j - 1) * this.offset, this.offset * cube.dim / 2), new THREE.Euler(0, 0, 0, "XYZ"), cubeGroup)
                this.drawSide(cube.back[i][j], new THREE.Vector3((i - 1) * this.offset, (j - 1) * this.offset, -this.offset * cube.dim / 2), new THREE.Euler(0, 0, 0, "XYZ"), cubeGroup)
                this.drawSide(cube.top[i][j], new THREE.Vector3((i - 1) * this.offset, this.offset * cube.dim / 2, -(j - 1) * this.offset), new THREE.Euler(Math.PI / 2, 0, 0, "XYZ"), cubeGroup)
                this.drawSide(cube.bottom[i][j], new THREE.Vector3((i - 1) * this.offset, -this.offset * cube.dim / 2, -(j - 1) * this.offset), new THREE.Euler(Math.PI / 2, 0, 0, "XYZ"), cubeGroup)
                this.drawSide(cube.right[i][j], new THREE.Vector3(this.offset * cube.dim / 2, (j - 1) * this.offset, -(i - 1) * this.offset), new THREE.Euler(0, Math.PI / 2, 0, "XYZ"), cubeGroup)
                this.drawSide(cube.left[i][j], new THREE.Vector3(-this.offset * cube.dim / 2, (j - 1) * this.offset, -(i - 1) * this.offset), new THREE.Euler(0, Math.PI / 2, 0, "XYZ"), cubeGroup)
            }
        }

        // Add fill
        var fillGeometry = new THREE.BoxGeometry(this.offset * cube.dim - 0.01, this.offset * cube.dim - 0.01, this.offset * cube.dim - 0.01);
        var fill = new THREE.Mesh(fillGeometry, this.fillMaterial);
        this.scene.add(fill);

        this.scene.add(cubeGroup);

        this.currentCubeGroup = cubeGroup;
    }
}