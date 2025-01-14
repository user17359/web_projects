import * as THREE from 'three'
import { CubeRenderer } from './CubeRenderer'
import { Cube, side } from './Cube'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { faceDirection } from 'three/examples/jsm/nodes/Nodes.js'
import { kind, ShuffleQueue } from './ShuffleQueue'
import { DrawSteering, steeringType } from './DrawSteering'
import { Leaderboard } from './Leaderboard'
import { Counter } from './Counter'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

const listener = new THREE.AudioListener();
camera.add( listener );

const clickSound = new THREE.Audio( listener );
const winSound = new THREE.Audio( listener );

scene.background = new THREE.Color( 0xd3d3ff )

const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'sounds/click.wav', function( buffer ) {
	clickSound.setBuffer( buffer );
	clickSound.setVolume( 1 );
});
audioLoader.load( 'sounds/win.wav', function( buffer ) {
	winSound.setBuffer( buffer );
	winSound.setVolume( 1 );
});

const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const controls = new OrbitControls( camera, renderer.domElement )
controls.enablePan = false
controls.mouseButtons = {LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.ZOOM, RIGHT: THREE.MOUSE.ROTATE}

const cube = new Cube()
const cubeRender = new CubeRenderer(scene)
const drawSteering = new DrawSteering(scene)

var interactable = false;

drawSteering.drawAll(cube.dim)

const shuffleQueue = new ShuffleQueue(cube)
const counter = new Counter();
const leaderboard = new Leaderboard()
leaderboard.reshuffle = shuffleUp;

camera.position.set( 5, 5, 5 )
camera.lookAt( scene.position )
controls.update()

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()

window.addEventListener('click', onMouseClick)

document.getElementById("reshuffle")!.onclick = () => {
    cube.reset();
    shuffleUp();
};


function animate() {
    controls.update()
    cubeRender.drawCube(cube)
	renderer.render( scene, camera )
}

renderer.setAnimationLoop( animate )

await shuffleUp()

function onMouseClick(event) {
    if(interactable){
        listener.context.resume();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObjects(drawSteering.steeringPlanes)

        if (intersects.length > 0) {
            const intersectedPlane = intersects[0].object
            switch(intersectedPlane.userData.type) {
                case steeringType.rowClockwise:
                    cube.rotateRow(intersectedPlane.userData.no, true)
                    break;
                case steeringType.rowCounterclockwise:
                    cube.rotateRow(intersectedPlane.userData.no, false)
                    break;
                case steeringType.columnXClockwise:
                    cube.rotateColumnX(intersectedPlane.userData.no, true)
                    break;
                case steeringType.columnXCounterclockwise:
                    cube.rotateColumnX(intersectedPlane.userData.no, false)
                    break;
                case steeringType.columnZClockwise:
                    cube.rotateColumnZ(intersectedPlane.userData.no, false)
                    break;
                case steeringType.columnZCounterclockwise:
                    cube.rotateColumnZ(intersectedPlane.userData.no, true)
                    break;
                
            }
            counter.updateCounter();
            if(cube.checkVictory()){
                counter.stopCounter();
                interactable = false;
                console.log("Victory royale!")
                winSound.play()
                leaderboard.showLeaderboard("Miau", counter.count)
            }
            else{
                clickSound.play()
            }
        }
    }
}

async function shuffleUp(){
    counter.resetCounter()
    interactable = false;
    shuffleQueue.getQueue()
    await shuffleQueue.exhaustQueue().then(() => {interactable = true; counter.startCounter()})
}
