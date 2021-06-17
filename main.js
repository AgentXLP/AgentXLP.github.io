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

const ambientLight = new THREE.AmbientLight(0xc8aeeb)
scene.add(ambientLight)

const bg = new THREE.TextureLoader().load('bg.png')
scene.background = bg

// Avatar

const lolTex = new THREE.TextureLoader().load('/assets/lol.png')

const lol = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshPhongMaterial({ map: lolTex }))

scene.add(lol)

function animate() {
  requestAnimationFrame(animate)
  lol.rotation.y += 0.01

  renderer.render(scene, camera)
}
animate()

let mus = new Audio('./assets/aud/smwremix.mp3')
  mus.addEventListener('ended', function() { // Thanks @kingjeffrey on stackoverflow for FF loop support!
    this.currentTime = 0
    this.play()
  }, false)
  mus.play()