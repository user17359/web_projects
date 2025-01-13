import * as THREE from 'three'
import { CubeRenderer } from './CubeRenderer';
import { side } from './Cube';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const cubeRender = new CubeRenderer(scene);
cubeRender.drawSide(side.blue, new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0, 0, 'XYZ'));

camera.r
camera.position.z = 5;

function animate() {
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );