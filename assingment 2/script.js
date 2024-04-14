import * as THREE from "three"
import * as dat from "lil-gui"
import { OrbitControls } from "OrbitControls"

/**********
** SETUP **
***********/
// Sizes
const sizes = {
    width: window.innerWidth / 2.5,
    height: window.innerWidth / 2.5,
    aspectRatio: 1
}

/***********
** SCENE **
***********/
// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#485461')

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.aspectRatio,
    0.1,
    100
)
camera.position.set(0, 0, 20)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

// Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***********
** LIGHTS **
************/

// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Colored lights
const redLight = new THREE.PointLight(0xff0000, 15, 15); // Increased intensity to 2
redLight.position.set(5, 5, 5);
redLight.distance = 20; // Increased size
scene.add(redLight);

// Change blue light to red
const blueLight = new THREE.PointLight(0xff0000, 15, 15); // Change color to red
blueLight.position.set(-5, -5, -5); // Change y position to -5
blueLight.distance = 20; // Increased size
scene.add(blueLight);

/***********
** MESHES **
************/
// Sphere Geometry
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);

// Sphere Materials (retain these)
const redMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#c30101')
});
const greenMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#feb204')
});
const blueMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1F669B')
});

const drawSphere = (i, material) => {
    const sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.position.x = (Math.random() - 0.5) * 10;
    sphere.position.z = (Math.random() - 0.5) * 10;
    sphere.position.y = i - 10;

    sphere.rotation.x = Math.random() * 2 * Math.PI;
    sphere.rotation.y = Math.random() * 2 * Math.PI;
    sphere.rotation.z = Math.random() * 2 * Math.PI;

    scene.add(sphere);
};


/**********************
** TEXT PARSERS & UI **
***********************/
let preset = {}

const uiobj = {
    text: '',
    textArray: [],
    term1: 'winston',
    term2: 'brother',
    term3: 'goldstein',
    rotateCamera: false
    
}

// Text Parsers
// Parse Text and Terms
const parseTextandTerms = () =>
{
    // Strip periods and downcase text
    const parsedText = uiobj.text.replaceAll(".", "").toLowerCase()
    //console.log(parsedText)

    // Tokenize text
    uiobj.textArray = parsedText.split(/[^\w']+/)
    //console.log(uiobj.textArray)

    // Find term 1
    findTermInParsedText(uiobj.term1, redMaterial)

    // Find term 2
    findTermInParsedText(uiobj.term2, greenMaterial)

    // Find term 3
    findTermInParsedText(uiobj.term3, blueMaterial)

}

const findTermInParsedText = (term, material) =>
{
    for (let i=0; i < uiobj.textArray.length; i++)
    {
        //console.log(i, uiobj.textArray[i])
        if(uiobj.textArray[i] === term)
        {
         //console.log(i, term)
         // convert i into n, which is a value between 0 and 20
         const n = (100 / uiobj.textArray.length) * i * 0.2
         
         // call drawCube function 5 times using converted n value
         for(let a=0; a < 5; a++)
         {
            drawSphere(n, material)
         }

        }
    }
}

// Load source text
fetch("https://gist.githubusercontent.com/vlandham/2549b64121112dd9e4dacc47c959472a/raw/4e6883bbab5ab0d42fc4b9555d93e22aefd7baed/1984.txt")
    .then(response => response.text())
    .then((data) =>
    {
        uiobj.text = data
        parseTextandTerms()
    }
    )

// UI
const ui = new dat.GUI({
    container: document.querySelector('#parent1')
})

// Interaction Folders
    // Sphere Folder
    const sphereFolder = ui.addFolder('Filter Terms')

    sphereFolder
        .add(redMaterial, 'visible')
        .name(`${uiobj.term1}`)

    sphereFolder
        .add(greenMaterial, 'visible')
        .name(`${uiobj.term2}`)

    sphereFolder
        .add(blueMaterial, 'visible')
        .name(`${uiobj.term3}`)
  

    // Camera Folder
    const cameraFolder = ui.addFolder('Camera')

    cameraFolder
        .add(uiobj, 'rotateCamera')
        .name('Rotate Camera')

/*******************
** ANIMATION LOOP **
********************/
const clock = new THREE.Clock()

// Animate
const animation = () => {
    // Return elapsedTime
    const elapsedTime = clock.getElapsedTime();

     // Rotate lights
     redLight.position.x = Math.sin(elapsedTime) * 5;
     redLight.position.z = Math.cos(elapsedTime) * 5;
     blueLight.position.x = Math.cos(elapsedTime) * 5;
     blueLight.position.z = Math.sin(elapsedTime) * 5;

    // Orbit Controls
    controls.update();

    // Camera Rotation
    if (uiobj.rotateCamera) {
        camera.position.x = Math.sin(elapsedTime * 0.2) * 16;
        camera.position.z = Math.cos(elapsedTime * 0.2) * 16;
    }

    // Define rotation animation for spheres
    const rotationSpeed = 0.1;
    const rotationAngle = elapsedTime * rotationSpeed;
    const reverseRotation = Math.floor(elapsedTime / 2) % 2 === 0; // Reverse rotation every 2 seconds

    // Define shaking parameters
    const shakeIntensity = 0.02; // Adjust as needed

    scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            // Rotate spheres faster
            if (!reverseRotation) {
                child.rotation.y = -rotationAngle * 2; // Rotate faster counterclockwise
            } else {
                child.rotation.y = rotationAngle * 2; // Rotate faster clockwise
            }

            // Add shaking effect
            const shakeX = Math.random() * shakeIntensity - shakeIntensity / 2;
            const shakeY = Math.random() * shakeIntensity - shakeIntensity / 2;
            const shakeZ = Math.random() * shakeIntensity - shakeIntensity / 2;
            child.position.x += shakeX;
            child.position.y += shakeY;
            child.position.z += shakeZ;
        }
    });

    // Renderer
    renderer.render(scene, camera);

    // Request next frame
    window.requestAnimationFrame(animation);
};

animation();
