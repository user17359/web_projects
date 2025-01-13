import * as THREE from 'three'
import { CubeRenderer } from './CubeRenderer';
import { Cube, side } from './Cube';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

scene.background = new THREE.Color( 0xd3d3ff );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.mouseButtons = {LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.ZOOM, RIGHT: THREE.MOUSE.ROTATE};

const cube = new Cube();
const cubeRender = new CubeRenderer(scene);

cube.rotateRow(0, false);
//cube.rotateColumnX(1, false);
cube.rotateColumnZ(2, false);

camera.position.set( 5, 5, 5 );
camera.lookAt( scene.position );
controls.update();

function animate() {
    controls.update();
    cubeRender.drawCube(cube);

	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );