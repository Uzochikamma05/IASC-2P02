import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**********
** SETUP **
***********/
// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

/**********
** SCENE **
***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(9.9, 3.5, 10.5)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** MESHES **
************/
const caveMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
})

// caveWall
const caveWallGeometry = new THREE.PlaneGeometry(10, 5)
const caveWall = new THREE.Mesh(caveWallGeometry, caveMaterial)
caveWall.rotation.y = Math.PI * 0.5
caveWall.position.set(-5, 0, 0)
caveWall.receiveShadow = true
scene.add(caveWall)

// barrierWall
const barrierWallGeometry = new THREE.PlaneGeometry(10, 2)
const barrierWall = new THREE.Mesh(barrierWallGeometry, caveMaterial)
barrierWall.rotation.y = Math.PI * 0.5
barrierWall.position.set(5, -1.5, 0)
scene.add(barrierWall)

// caveFloor
const caveFloorGeometry = new THREE.PlaneGeometry(10, 10)
const caveFloor = new THREE.Mesh(caveFloorGeometry, caveMaterial)
caveFloor.rotation.x = Math.PI * 0.5
caveFloor.position.set(0, -2.5, 0)
scene.add(caveFloor)

// OBJECTS
// Replace the current torusKnot mesh with a SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.position.set(6, 1.5, 0); // Position similar to previous torusKnot
sphereMesh.castShadow = true;
scene.add(sphereMesh);

// Add another mesh (ConeGeometry)
const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
const coneMaterial = new THREE.MeshNormalMaterial();
const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.position.set(4, 1.5, 0); // Position to cast shadow on cave wall
coneMesh.castShadow = true;
scene.add(coneMesh);

/***********
** LIGHTS **
************/
// Directional Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
)
directionalLight.position.set(10, 2.5, 0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
scene.add(directionalLight)

/*********************
** DOM INTERACTIONS **
**********************/
// DOM Object
const domObject = {
    part: 1,
    firstChange: false,
    secondChange: false,
    thirdChange: false,
    fourthChange: false
}

// Animation triggers
document.querySelector('#first-change').onclick = function() {
    domObject.firstChange = true
}

document.querySelector('#second-change').onclick = function() {
    domObject.secondChange = true
}

document.querySelector('#third-change').onclick = function() {
    domObject.thirdChange = true
}

document.querySelector('#fourth-change').onclick = function() {
    domObject.fourthChange = true
}

/*******************
** ANIMATION LOOP **
********************/
const clock = new THREE.Clock()

// Animate
const animation = () => {
    const elapsedTime = clock.getElapsedTime()

    // Apply animations based on DOM interactions
    if (domObject.firstChange) {
        sphereMesh.rotation.y = elapsedTime
        sphereMesh.rotation.z = elapsedTime
    }

    if (domObject.secondChange) {
        sphereMesh.position.y = Math.sin(elapsedTime * 0.5) * 6
    }

    if (domObject.thirdChange) {
        sphereMesh.position.y = 2
    }

    if (domObject.fourthChange) {
        directionalLight.position.y -= 0.05
    }

    // Render scene
    renderer.render(scene, camera)

    // Request next frame
    window.requestAnimationFrame(animation)
}

animation()
