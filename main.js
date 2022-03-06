import * as THREE from "./assets/lib/three.module.js"
import { GLTFLoader } from "./assets/lib/model_loader.js"
import { $ } from "./assets/lib/jLite.js"

(()=> { 
window.hideText = function() {
  document.getElementById("texts").hidden = !document.getElementById("texts").hidden
}
window.redirect = function(site) {
  window.location.href = `https://${site}`
}
if (window.innerWidth <= 320) window.location.href = "/classic.html"
window.addEventListener("keydown", e => {
  if (e.key == "Escape") window.hideText()
})

console.log("%cWhat are you doing here? 😳😳", "font-size: 40px;")

let rand = Math.floor(Math.random() * 4)
switch (rand) {
  case 1:
    $.css("fullCanvas", "background-image: url('/assets/img/castle.png');")
    break
  case 2:
    $.css("fullCanvas", "background-image: url('/assets/img/maze.png');")
    break
  case 3:
    $.css("fullCanvas", "background-image: url('/assets/img/castle.png');")
    break
}
if (rand != 0) return

// Setup
const scene = new THREE.Scene()
scene.fog = new THREE.Fog(0x00, 1, 3700)

window.cameraObj = {
  fov: 60,
  rotation: 1.55
}

const speed = 1.5

const camera = new THREE.PerspectiveCamera(window.cameraObj.fov, window.innerWidth / window.innerHeight, 1, 5000)
camera.position.x = -800
camera.position.y = -120

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

//Dynamic scaling for widescreen
//Taken from maze95-js and modified a bit
window.addEventListener('resize', () =>
{
  // Update sizes
  const width = window.innerWidth
  const height = window.innerHeight

    // Update camera
  camera.aspect = width / height
  camera.updateProjectionMatrix()

    // Update renderer
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)

//Variable for keeping track of library placement
let increment = 0

//Loads in a library model
function loadMap(xIncrement) {
  const loader = new GLTFLoader()
  loader.load("./assets/library.glb", function (gltf) {
    gltf.scene.position.y = -250
    gltf.scene.position.x = xIncrement
    scene.add(gltf.scene)
  })
}
loadMap()

//Places a library -949 intervals from the previous one on the X axis
function loadMapAhead() {
  increment += -949
  loadMap(increment)
}

//Initial loading
for (let i = 0; i < 4; i++) {
  loadMapAhead()
}

//Spawns in 2 new library geometries in front of you every 10 seconds
setInterval(function() {
  for (let i = 0; i < 1; i++) {
    loadMapAhead()
  }
}, 10000)

function animate() {
  requestAnimationFrame(animate)

  camera.position.x += -speed
  camera.rotation.y = window.cameraObj.rotation
  camera.fov = window.cameraObj.fov
  camera.updateProjectionMatrix()

  renderer.render(scene, camera)
}
animate()
})()