import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "OrbitControls";

/**********
** SETUP **
***********/
// Sizes
const sizes = {
    width: window.innerWidth / 2.5,
    height: window.innerWidth / 2.5,
    aspectRatio: 1
};

/***********
** SCENE **
***********/
// Canvas
const canvas = document.querySelector('.webgl2');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('gray');

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
);
camera.position.set(0, 0, 20);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/***********
** LIGHTS **
************/
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white ambient light
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White directional light
directionalLight.position.set(5, 10, 5); // Position the light
directionalLight.castShadow = true; // Enable shadow casting
scene.add(directionalLight);

/***********
** MESHES **
************/
// Ellipsoid Geometry
const ellipsoidGeometry = new THREE.SphereGeometry(1, 32, 16); // Increase the radius to make ellipsoids bigger

// Ellipsoid Materials
const orangeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#5B568D')
});
const pinkMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#A11F10')
});
const aquaMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#000435')
});

const drawEllipsoid = (i, material) => {
    const ellipsoid = new THREE.Mesh(ellipsoidGeometry, material);
    ellipsoid.position.x = (Math.random() - 0.5) * 10;
    ellipsoid.position.z = (Math.random() - 0.5) * 10;
    ellipsoid.position.y = i - 10;

    // Adjust the scale to make ellipsoids wider
    ellipsoid.scale.set(1.5, 1, 1); // Adjust scale as needed for wider shape

    ellipsoid.rotation.x = Math.random() * 2 * Math.PI;
    ellipsoid.rotation.y = Math.random() * 2 * Math.PI;
    ellipsoid.rotation.z = Math.random() * 2 * Math.PI;

    ellipsoid.castShadow = true; // Enable shadow casting
    ellipsoid.receiveShadow = true; // Enable shadow receiving

    scene.add(ellipsoid);
};

const findTermInParsedText = (term, material) => {
    for (let i = 0; i < uiobj.textArray.length; i++) {
        if (uiobj.textArray[i] === term) {
            const n = (100 / uiobj.textArray.length) * i * 0.2;
            for (let a = 0; a < 5; a++) {
                drawEllipsoid(n, material);
            }
        }
    }
};

/**********************
** TEXT PARSERS & UI **
***********************/
let preset = {};

const uiobj = {
    text: '',
    textArray: [],
    term1: 'telescreen',
    term2: 'gin',
    term3: 'hate',
    rotateCamera: false,
    spinEllipses: false,
    rotateEnabled: false // Flag to track if camera rotation is enabled
};

const parseTextandTerms = () => {
    const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()
    uiobj.textArray = parsedText.split(/[^\w']+/)

    findTermInParsedText(uiobj.term1, orangeMaterial)
    findTermInParsedText(uiobj.term2, pinkMaterial)
    findTermInParsedText(uiobj.term3, aquaMaterial)
};

fetch("https://gist.githubusercontent.com/vlandham/2549b64121112dd9e4dacc47c959472a/raw/4e6883bbab5ab0d42fc4b9555d93e22aefd7baed/1984.txt")
    .then(response => response.text())
    .then((data) => {
        uiobj.text = data
        parseTextandTerms()
    });

// UI
const ui = new dat.GUI({
    container: document.querySelector('#parent2')
});

// Interaction Folders
const spheresFolder = ui.addFolder('Filter Terms');

spheresFolder
    .add(orangeMaterial, 'visible')
    .name(`${uiobj.term1}`);

spheresFolder
    .add(pinkMaterial, 'visible')
    .name(`${uiobj.term2}`);

spheresFolder
    .add(aquaMaterial, 'visible')
    .name(`${uiobj.term3}`);

spheresFolder
    .add(uiobj, 'spinEllipses')
    .name('Spin Ellipses');

const cameraFolder = ui.addFolder('Camera');

cameraFolder
    .add(uiobj, 'rotateEnabled') // Add control for enabling camera rotation
    .name('Rotate Camera')
    .onChange((value) => {
        uiobj.rotateCamera = value;
    });

/*******************
** ANIMATION LOOP **
********************/
const clock = new THREE.Clock();

const animation = () => {
    const elapsedTime = clock.getElapsedTime();

    if (uiobj.rotateCamera && uiobj.rotateEnabled) { // Only rotate camera if both flags are true
        // Move camera in a circular motion around the center
        const radius = 20;
        const angle = elapsedTime * 0.1;
        camera.position.x = Math.sin(angle) * radius;
        camera.position.z = Math.cos(angle) * radius;

        // Bob the camera up and down slightly
        camera.position.y = Math.sin(elapsedTime * 0.5) * 2;

        camera.lookAt(scene.position);
    }

    if (uiobj.spinEllipses) {
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].type === "Mesh") {
                scene.children[i].rotation.x += 0.01;
                scene.children[i].rotation.y += 0.01;
                scene.children[i].rotation.z += 0.01;
            }
        }
    }

    controls.update(); // Always update OrbitControls to allow dragging and zooming

    renderer.render(scene, camera);

    window.requestAnimationFrame(animation);
};

animation();
