import * as THREE from 'three'
import { CubeRenderer } from './CubeRenderer';
import { Cube, side } from './Cube';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { faceDirection } from 'three/examples/jsm/nodes/Nodes.js';
import { kind, ShuffleQueue } from './ShuffleQueue';

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

const shuffleQueue = new ShuffleQueue(cube);

//cube.rotateRow(2, true);
//cube.rotateColumnX(2, true);
//cube.rotateColumnZ(2, false);

camera.position.set( 5, 5, 5 );
camera.lookAt( scene.position );
controls.update();


shuffleQueue.addToQueue(kind.columnX, 2, true);
shuffleQueue.addToQueue(kind.row, 2, true);
shuffleQueue.addToQueue(kind.columnZ, 0, false);



function animate() {
    controls.update();
    cubeRender.drawCube(cube);
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

await shuffleQueue.exhaustQueue();