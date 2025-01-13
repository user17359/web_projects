import * as THREE from 'three'
import { CubeRenderer } from './CubeRenderer';
import { side } from './Cube';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.mouseButtons = {LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.ZOOM, RIGHT: THREE.MOUSE.ROTATE};

const cubeRender = new CubeRenderer(scene);
cubeRender.drawSide(side.blue, new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0, 0, 'XYZ'));

camera.r
camera.position.z = 5;
controls.update();

function animate() {
    controls.update();
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );