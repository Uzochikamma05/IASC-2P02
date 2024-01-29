import * as THREE from "three";

/*********** 
** SCENE **
************/
// Canvas
const canvas = document.querySelector('.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('gray');

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);
camera.position.set(0, 0, 5);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);

/*************
 ** MESHES **
 *************/

// testSphere
const sphereGeometry = new THREE.SphereGeometry(1);
const sphereMaterial = new THREE.MeshNormalMaterial(); 

// Change to MeshStandardMaterial for a more standard look
const testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

scene.add(testSphere);

/*******************
 ** ANIMATION LOOP **
 ********************/
const clock = new THREE.Clock();

// Responsive Renderer Size
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
const animation = () => 
{
    //Return elapsedTime
    const elapsedTime = clock.getElapsedTime();

    //Animate testSphere
    testSphere.position.z = Math.sin(elapsedTime)

    //Rendered
    renderer.render(scene, camera);

    window.requestAnimationFrame(animation);
};

animation();
