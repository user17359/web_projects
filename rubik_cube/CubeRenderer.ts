import { side } from "./Cube";
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
    scene: THREE.Scene;

    constructor (scene: THREE.Scene){
        this.scene = scene;
    }   

    drawSide(type: side, pos: THREE.Vector3, rot: THREE.Euler){
        var plane = new THREE.Mesh( this.geometry, this.sideMaterials.get(type));
        plane.position.set(pos.x, pos.y, pos.z);
        plane.setRotationFromEuler (rot);
        this.scene.add(plane)
    }
}