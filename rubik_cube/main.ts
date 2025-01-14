import * as THREE from 'three'
import { CubeRenderer } from './CubeRenderer'
import { Cube, side } from './Cube'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { faceDirection } from 'three/examples/jsm/nodes/Nodes.js'
import { kind, ShuffleQueue } from './ShuffleQueue'
import { DrawSteering, steeringType } from './DrawSteering'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

scene.background = new THREE.Color( 0xd3d3ff )

const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )

const controls = new OrbitControls( camera, renderer.domElement )
controls.enablePan = false
controls.mouseButtons = {LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.ZOOM, RIGHT: THREE.MOUSE.ROTATE}

const cube = new Cube()
const cubeRender = new CubeRenderer(scene)
const drawSteering = new DrawSteering(scene)

drawSteering.drawAll(cube.dim)

const shuffleQueue = new ShuffleQueue(cube)



camera.position.set( 5, 5, 5 )
camera.lookAt( scene.position )
controls.update()

var raycaster = new THREE.Raycaster()
var mouse = new THREE.Vector2()

window.addEventListener('click', onMouseClick)

//shuffleQueue.addToQueue(kind.columnX, 2, true)
//shuffleQueue.addToQueue(kind.row, 2, true)
//shuffleQueue.addToQueue(kind.columnZ, 0, false)



function animate() {
    controls.update()
    cubeRender.drawCube(cube)
	renderer.render( scene, camera )
}

renderer.setAnimationLoop( animate )

await shuffleQueue.exhaustQueue()

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(drawSteering.steeringPlanes)

    if (intersects.length > 0) {
        const intersectedPlane = intersects[0].object

        console.log(`Clicked plane ID: ${intersectedPlane.userData.id}`)
        console.log(`NO: ${intersectedPlane.userData.no}`)

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
    }
}