import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

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
// Replace the current torusKnot with a TorusGeometry
const torusGeometry = new THREE.TorusGeometry(0.8, 0.2, 16, 100); // Increase radius from 0.5 to 0.8
const torusMaterial = new THREE.MeshNormalMaterial();
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
torusMesh.position.set(6, 1.5, 2); // Position similar to previous torusKnot
torusMesh.rotation.set(Math.PI / 2, Math.PI / 2, 0); // Rotate the torus to face the cave wall upward
torusMesh.castShadow = true;
scene.add(torusMesh);

// Add another mesh (ConeGeometry)
const coneGeometry = new THREE.ConeGeometry(0.7, 1.5, 32); // Increase radius to 0.7 and height to 1.5
const coneMaterial = new THREE.MeshNormalMaterial();
const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
coneMesh.position.set(4, 1, -1.5); // Position to cast shadow on cave wall
coneMesh.castShadow = true;
scene.add(coneMesh);

// SUN
const sunGeometry = new THREE.SphereGeometry()
const sunMaterial = new THREE.MeshLambertMaterial({
    emissive: new THREE.Color('orange'),
    emissiveIntensity: 20
})
const sun = new THREE.Mesh(sunGeometry, sunMaterial)
scene.add(sun)

/***********
** LIGHTS **
************/
/*
// Ambient Light
const ambientLight = new THREE.AmbientLight(
    new THREE.Color('white')
)
scene.add(ambientLight)
*/

// Directional Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
)
directionalLight.target = caveWall
directionalLight.position.set(10, 2.5, 0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
scene.add(directionalLight)

// Directional Light Helper
//const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
//scene.add(directionalLightHelper)

/*******
** UI **
********/
/*
const ui = new dat.GUI()

const uiObject = {}

uiObject.reset = () =>
{
    directionalLight.position.set(8.6, 1.7, 0)
}

// Directional Light
const lightPositionFolder = ui.addFolder('Directional Light Position')

lightPositionFolder
    .add(directionalLight.position, 'x')
    .min(-10)
    .max(20)
    .step(0.1)

lightPositionFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(0.1)

lightPositionFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(0.1)

lightPositionFolder
    .add(uiObject, 'reset')
    .name('Reset position')
*/

/*********************
** DOM INTERACTIONS **
**********************/
// domObject
const domObject = {
    part: 1,
    firstChange: false,
    secondChange: false,
    thirdChange: false,
    fourthChange: false
}

// continue-reading
document.querySelector('#continue-reading').onclick = function() {
    document.querySelector('#part-two').classList.remove('hidden')
    document.querySelector('#part-one').classList.add('hidden')
    domObject.part = 2
}

// restart
document.querySelector('#restart').onclick = function() {
    document.querySelector('#part-two').classList.add('hidden')
    document.querySelector('#part-one').classList.remove('hidden')
    domObject.part = 1

    // reset domObject changes
    domObject.firstChange = false
    domObject.secondChange = false
    domObject.thirdChange = false
    domObject.fourthChange = false

    // reset directionalLight
    directionalLight.position.set(10, 2.5, 0)
}

// first change
document.querySelector('#first-change').onclick = function() {
    domObject.firstChange = true
}

// second change
document.querySelector('#second-change').onclick = function() {
    domObject.secondChange = true
}

// third change
document.querySelector('#third-change').onclick = function() {
    domObject.thirdChange = true
}

// fourth change
document.querySelector('#fourth-change').onclick = function() {
    domObject.fourthChange = true
}

/*******************
** ANIMATION LOOP **
********************/
const clock = new THREE.Clock();
let coneVisible = true;
let coneTimeout;

// Animate
const animation = () => {
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime();

    // Animate Objects
    // torusMesh.rotation.y = elapsedTime
    // torusKnot.position.z = Math.sin(elapsedTime * 0.5) * 2

    // Update directionalLightHelper
    // directionalLightHelper.update()

    // Update sun position to match directionalLight position
    sun.position.copy(directionalLight.position);

    // Controls
    controls.update();

    // DOM INTERACTIONS
    // part 1
    if (domObject.part === 1) {
        camera.position.set(1.1, 0.3, 1.3);
        camera.lookAt(-5, 0, 1.5);
    }

    // part 2
    if (domObject.part === 2) {
        camera.position.set(9.9, 3.5, 10.5);
        camera.lookAt(0, 0, 0);
    }

    // first-change
    if (domObject.firstChange) {
        // Animate torusMesh rotation
        torusMesh.rotation.y = elapsedTime;
        torusMesh.rotation.z = elapsedTime;
    }

    // second-change
    if (domObject.secondChange) {
        // Animate coneMesh (previously cube) to move towards torusMesh (previously sphere)
        coneMesh.position.z = Math.sin(elapsedTime * 0.5) * 2;

        // Check if the cone has reached the front of the torus
        if (coneMesh.position.z >= 0 && coneVisible) {
            // Hide cone after 1 second
            coneTimeout = setTimeout(() => {
                coneMesh.visible = false;
                coneVisible = false;
            }, 2000);
        }

        // Check if the cone has moved back behind the torus
        if (coneMesh.position.z < 0 && !coneVisible) {
            // Show cone after 0.5 second (faster reappearance)
            clearTimeout(coneTimeout); // Clear any previous timeout
            coneTimeout = setTimeout(() => {
                coneMesh.visible = true;
                coneVisible = true;
            }, 10); // Reduced timeout duration to 100 milliseconds
        }
    }

    // third-change
    if (domObject.thirdChange) {
        // Stop torusMesh rotation
    torusMesh.rotation.set(0, 0, 0); // Set rotation to zero
        // Reset cone position to its original position
        coneMesh.position.set(4, 1, -1.5); // Original position of the cone
    }

    // fourth-change
    if (domObject.fourthChange) {
        const targetPosition = new THREE.Vector3(0, 10, 0); // Target position
        const animationDuration = 5; // Duration in seconds
        const totalFrames = 60 * animationDuration; // Total frames
        const initialPosition = directionalLight.position.clone(); // Initial position
    
        let currentFrame = 0;
    
        // Animation function
        const animateLight = () => {
            // Calculate the interpolation factor based on current frame
            const t = currentFrame / totalFrames;
    
            // Interpolate between initial and target positions
            directionalLight.position.lerpVectors(initialPosition, targetPosition, t);
    
            // Increment current frame
            currentFrame++;
    
            // Check if animation is complete
            if (currentFrame < totalFrames) {
                // Continue animation
                requestAnimationFrame(animateLight);
            } else {
                // Animation is complete, reset animation parameters
                currentFrame = 0;
                domObject.fourthChange = false; // Reset fourthChange flag
                resetLight(); // Move light back to its original position
            }
        };
    
        animateLight();
    }

    // Renderer
    renderer.render(scene, camera);

    // Request next frame
    window.requestAnimationFrame(animation);
};

animation();
