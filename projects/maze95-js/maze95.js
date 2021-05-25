import * as THREE from './lib/three.module.js'
import { GLTFLoader } from "./lib/GLTFLoader.js"
import { SelectedLVL } from "./levels/level_defines.js"
import "./lib/keydrown.min.js"

var width = 512
var height = 384

const widescreen = false //experimental

if(widescreen == true) {
  width = innerWidth
  height = innerHeight
}
else {
  width = 512
  height = 384
}

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(60,width/height)
let green = new THREE.MeshBasicMaterial({color: 0x248000})
let red = new THREE.MeshBasicMaterial({color: 0xfc0303})

const faceTexture = new THREE.TextureLoader().load("./textures/end.png")
let face = new THREE.MeshStandardMaterial({map: faceTexture, transparent: true})

let col = SelectedLVL("col")
let dir = new THREE.Vector3()
scene.add(camera)

if(!SelectedLVL("lvlMus") == "mus_none") {
  let mus = new Audio('../audio/' + SelectedLVL("lvlMus") + '.mp3')
  mus.addEventListener('ended', function() { // Thanks @kingjeffrey on stackoverflow for FF loop support!
    this.currentTime = 0
    this.play()
  }, false)
  mus.play()
}
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
})
renderer.setPixelRatio(window.devicePixelRatio)
if(widescreen == false) {
  renderer.setSize(width, height)
}
else {
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function redraw() {
  requestAnimationFrame(redraw)
  player.getWorldDirection(dir)
  camera.position.x = player.position.x
  camera.position.y = player.position.y
  camera.position.z = player.position.z
  camera.rotation.y = player.rotation.y

  faceObj.rotation.y = player.rotation.y

  renderer.render(scene, camera)
}

const spd = 0.85

function collisionCheck() {
  let inc = 0
  while(col.length > inc) {
      // The increment is per collision cube, it checks for collision on each coordinate for a cube, and if it does not return true then it will keep going to the next collision cube. //
      if(player.position.x > col[inc][0] && player.position.x < col[inc][3] && player.position.z > col[inc][2] && player.position.z < col[inc][5]) return true
      inc += 1
  }
  return false
} //Credits to @luphoria for help with implementing the collision (broken because I am braindead as of now)

const loader = new GLTFLoader();
loader.load(SelectedLVL("lvlDir"), function (gltf) {
	scene.add(gltf.scene)
})

let playergeo = new THREE.BoxGeometry(10,10,10)
let player = new THREE.Mesh(playergeo,green)
scene.add(player)

const faceObj = new THREE.Mesh(
  new THREE.BoxGeometry(28,28,0),
  face
)
scene.add(faceObj)
faceObj.position.x = 79.06862060467722
faceObj.position.y = -2.5
faceObj.position.z = -382.39951746882235

/*const testCube = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  red
)
scene.add(testCube)
testCube.position.x = 14.056
testCube.position.y = -16.8789
testCube.position.z = 14.0612

const testCube2 = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  green
)
scene.add(testCube2)
testCube2.position.x = 14.056
testCube2.position.y = 11.221
testCube2.position.z = 14.0612

const testCube3 = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  red
)
scene.add(testCube3)
testCube3.position.x = -14.056
testCube3.position.y = -16.8789
testCube3.position.z = 14.0612

const testCube4 = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  green
)
scene.add(testCube4)
testCube4.position.x = -14.056
testCube4.position.y = 11.221
testCube4.position.z = 14.0612

const testCube5 = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  red
)
scene.add(testCube5)
testCube5.position.x = 14.056
testCube5.position.y = -16.8789
testCube5.position.z = -41.3134

const testCube6 = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  green
)
scene.add(testCube6)
testCube6.position.x = 14.056
testCube6.position.y = 11.221
testCube6.position.z = -41.3134

const testCube7 = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  red
)
scene.add(testCube7)
testCube7.position.x = -14.056
testCube7.position.y = -16.8789
testCube7.position.z = -41.3134

const testCube8 = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  green
)
scene.add(testCube8)
testCube8.position.x = -14.056
testCube8.position.y = 11.221
testCube8.position.z = -41.3134*/

const amb = new THREE.AmbientLight(0xffffff, 1.7)
scene.add(amb)

function rotateD(speed) {
  player.rotation.y -= speed
}

function rotateA(speed) {
  player.rotation.y += speed
}

function moveW(speed) {
  player.position.x += -Math.sin(player.rotation.y) * speed;
  player.position.z += -Math.cos(player.rotation.y) * speed;
}

function moveS(speed) {
	player.position.x -= -Math.sin(player.rotation.y) * speed;
	player.position.z -= -Math.cos(player.rotation.y) * speed;
}

kd.W.down(function(){moveW(spd)})
kd.A.down(function(){rotateA(spd/18)})
kd.S.down(function(){moveS(spd)})
kd.D.down(function(){rotateD(spd/18)})

/*function move(type,speed) {
  switch(type) {
      case "move":
          //if(kd.Q.isDown()) speed *= 1.7
          player.getWorldDirection(dir)
          // Could applyScaledVector, however splitting X and Z application allows for collision detection to "slide" you down walls.
          player.position.x += dir.x * (speed/2)
          if(!collisionCheck()) player.position.x -= dir.x * (speed/2)
          player.position.z += dir.z * (speed/2)
          if(!collisionCheck()) player.position.z -= dir.z * (speed/2)
          break
      case "rotate":
          player.rotation.y += speed/28
          break
      default: // fallback
          throw "you do not exist " + type // theoretically this should never be called
  }
}

// key input checks
kd.W.down(function(){move("move",-spd)})
kd.A.down(function(){move("rotate",spd)})
kd.S.down(function(){move("move",spd)})
kd.D.down(function(){move("rotate",-spd)})*/

kd.L.down(
  function() {
    console.log(player.position)
    console.log(player.rotation.y)
  }
)
//Execute keydrown tick and run redraw
kd.run(function(){kd.tick()})
redraw()
//F in the chat for luphoria aswell, his Discord account got disabled because he entered a trap server afaik, Tragic.