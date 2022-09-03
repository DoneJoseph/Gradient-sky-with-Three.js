import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { TrackballControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/TrackballControls.js";

console.clear();

/* SETUP */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* CONTROLS */
const controls = new TrackballControls(camera, renderer.domElement);

/* LIGHT */
const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

/* SKY */
const skyGeom = new THREE.IcosahedronGeometry(2, 1);
const material = new THREE.ShaderMaterial({
  uniforms: {
    colors: {
      value: [new THREE.Color(0xA768FA), new THREE.Color(0x0047FF)]
    }
  },
  side: THREE.BackSide,
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 colors[2];
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(mix(colors[0], colors[1], vUv.y), 1.0);
    }
  `
});
const sky = new THREE.Mesh(skyGeom, material);
scene.add(sky);

/* BOXES */
const boxGeom = new THREE.BoxGeometry(0.1, 0.1, 0.1);
for (let i = 0; i < 80; i++) {
  const boxMat = new THREE.MeshLambertMaterial({
    color: new THREE.Color(`hsl(${(Math.random() * 120 + 260) % 360}, 70%, 70%)`)
  });
  const box = new THREE.Mesh(boxGeom, boxMat);
  box.position.randomDirection().multiplyScalar(Math.random() * 4);
  scene.add(box);
}

/* RENDERING */
function render() {
  requestAnimationFrame(render);
  
  controls.update();
  
  renderer.render(scene, camera);
}

/* EVENTS */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

requestAnimationFrame(render);