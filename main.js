import * as THREE from './lib/three.module.js'

// Setup
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(5)

//Dynamic scaling for widescreen
//Taken from maze95-js and modified a bit, you can check out maze95-js on my github.
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

const ambientLight = new THREE.AmbientLight(0x38423a)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0xffffff, 2)
scene.add(dirLight)

const bg = new THREE.TextureLoader().load('bg.png')
scene.background = bg

// Avatar

const tex = new THREE.TextureLoader().load('/assets/img/this_image_is_legal_because_it_is_from_the_render96_pack.png')

window.sphere = {
  speed: 0.01,
  zRot: 180,
  xPos: 2
}

const geo = new THREE.SphereGeometry(2, 32, 16)
const object = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex }))
object.position.x = window.sphere.xPos
object.rotation.z = window.sphere.zRot

scene.add(object)

function animate() {
  requestAnimationFrame(animate)
  object.rotation.y += window.sphere.speed

  renderer.render(scene, camera)
}
animate()