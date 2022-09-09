import * as dat from "dat.gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import galaxy from "../img/galaxy.png";
import nebula from "../img/nebula.png";

const monkeyURL = new URL("../models/monkey.glb", import.meta.url);

//ref : https://www.youtube.com/watch?v=xJAfLdUgdc4

//in three js there are 3 important things
//scene, camera, renderer

// this defines the renderer in three js
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); //NOTE: this dosent make canvas responsive to window size change
renderer.shadowMap.enabled = true; // this enables shadow in the scene (NOTE: this is not a default feature in three js)
// add the renderer to the dom
document.body.appendChild(renderer.domElement);

// this defines a scene in three js
const scene = new THREE.Scene();

// this defines a camera in three js
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// this allows us to move around the scene useing the mouse
const orbitControls = new OrbitControls(camera, renderer.domElement);

// provides x y z axis helper in the scene
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// this defines the default camera position
camera.position.set(-10, 30, 30);
orbitControls.update(); // impliment the camera position change with orbit controls

// createing any object in three js is a 4 step process
const cubeGeometry = new THREE.BoxGeometry(); // 1. create a geometry
const cubeMaterial = new THREE.MeshBasicMaterial({
  //    2. create a material
  // NOTE: MeshBasicMaterial is a material that dosent react to light
  color: 0x00ff00,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial); // 3. create a mesh (geometry + material)
scene.add(cube); // add the mesh to the scene

// mesh properties can be changed after creation
cube.rotation.x = 0.5;
cube.rotation.y = 0.5;

// create a plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true; // this enables shadow on the plane (NOTE: this is not a default feature in three js)
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI; // rotate the plane to be horizontal

const gridHelper = new THREE.GridHelper(30); // create a grid helper
scene.add(gridHelper);

// create a sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true; // this enables sphere to cast shadow (NOTE: this is not a default feature in three js)
scene.add(sphere);
sphere.position.set(0, 4, 0);

// there are 3 types of light in three js
// 1. AmbientLight
// 2. DirectionalLight
// 3. SpotLight

// create a ambient light
// NOTE: AmbientLight is a light that is present everywhere in the scene
// eg: sun light in a room
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// create a directional light
// NOTE: DirectionalLight is a light that is present in a particular direction
// eg: sun light in an open area
// here light rays are parallel
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.right = 5;
// directionalLight.shadow.camera.left = -5;
// directionalLight.shadow.camera.top = 20;
// directionalLight.shadow.camera.bottom = -5;

// direct light helper is used to see the light rays from the directional light
// const dLighthelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLighthelper);

// directional light shadow helper is used to see the shadow from the directional light
// shadow is drawn with the help of an orthographic camera
// const dLightShadowHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(dLightShadowHelper);

// create a spot light
// NOTE: SpotLight is a light that is present in a particular direction
// eg: lamp
const spotLight = new THREE.SpotLight(0xffffff, 0.7);
scene.add(spotLight);

spotLight.castShadow = true;
spotLight.position.set(-30, 50, 0);
spotLight.angle = 0.5;

// light helper is used to see the light rays from the spot light
const sLighthelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLighthelper);

// there are 2 ways to add fog to the scene
// scene.fog = new THREE.Fog(0xffffff, 0.1, 100); // this adds fog to the scene
scene.fog = new THREE.FogExp2(0xffffff, 0.005); // this adds fog to the scene exponentially

// renderer.setClearColor(0xffaaaa); // sets a background color to the scene

// this is used to load a 2d texture
const textureLoader = new THREE.TextureLoader();

// scene.background = textureLoader.load(galaxy); // this sets a background image to the scene
// this is used to load a 3d texture [cube]
const cubeTextureLoader = new THREE.CubeTextureLoader();

scene.background = cubeTextureLoader.load([
  galaxy,
  galaxy,
  galaxy,
  galaxy,
  galaxy,
  galaxy,
]);
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshStandardMaterial({
  //   map: textureLoader.load(nebula),
});
const box2multiMaterial = [
  new THREE.MeshStandardMaterial({
    map: textureLoader.load(nebula),
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load(nebula),
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load(galaxy),
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load(nebula),
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load(nebula),
  }),
  new THREE.MeshStandardMaterial({
    map: textureLoader.load(nebula),
  }),
];
const box2 = new THREE.Mesh(box2Geometry, box2multiMaterial);
scene.add(box2);
box2.castShadow = true;
box2.position.set(0, 2, 10);
// box2.material.map = textureLoader.load(nebula);

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  wireframe: true,
  wireframeLinewidth: 10,
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

const vShader = `
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    }
`;

const fShader = `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

const sphere2geometry = new THREE.SphereGeometry(4);
const sphere2material = new THREE.ShaderMaterial({
  vertexShader: vShader,
  fragmentShader: fShader,
});
const sphere2 = new THREE.Mesh(sphere2geometry, sphere2material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

const modelLoader = new GLTFLoader();

modelLoader.load(
  monkeyURL.href,
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(-12, 0, 0);
  },
  undefined,
  (error) => {
    console.log(error);
  }
);

//add gui to control the scene
const gui = new dat.GUI();

// options for the gui to control
const options = {
  SphereColor: 0x0000ff,
  sphereWireframe: false,
  sphereSpeed: 0.01,
  sphereX: 0,
  sphereZ: 0,
  angle: 0.4,
  penumbra: 0.1,
  intensity: 0.7,
};

// add gui controls
gui.add(options, "sphereX", -10, 10);

gui.add(options, "sphereZ", -10, 10);

gui.add(options, "sphereSpeed", 0, 0.1);

gui.addColor(options, "SphereColor").onChange((color) => {
  sphereMaterial.color.set(color);
});

gui.add(options, "sphereWireframe").onChange((wireframe) => {
  sphereMaterial.wireframe = wireframe;
});

gui.add(options, "angle", 0, 1);

gui.add(options, "penumbra", 0, 1);

gui.add(options, "intensity", 0, 1);

let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

const raycaster = new THREE.Raycaster();

const sphereId = sphere.id;
box2.name = "galaxyBox";

// animation
const animate = (time) => {
  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;

  sphere.position.x = options.sphereX;
  sphere.position.z = options.sphereZ;

  cube.rotation.x = time / 1000;
  cube.rotation.y = time / 1000;

  step += options.sphereSpeed;
  sphere.position.y = 20 * Math.abs(Math.sin(step)) + 4;

  for (let vertex in plane2.geometry.attributes.position.array) {
    plane2.geometry.attributes.position.array[vertex] +=
      Math.random() * 0.5 - 0.25;
  }

  raycaster.setFromCamera(mousePosition, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  for (const intersect of intersects) {
    if (intersect.object.id === sphereId) {
      intersect.object.material.color.set(0xff0000);
    }
    if (intersect.object.name === "galaxyBox") {
      intersect.object.position.z += 0.1;
    }
  }

  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
