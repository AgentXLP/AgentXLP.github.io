import Scene from './scene.js'
import * as THREE from './lib/three.module.js'
import "./lib/keydrown.min.js"
import "./lib/settings.js"
import { io } from './_snowpack/pkg/socket.io-client.js'
import { GLTFLoader } from "./lib/model_loader.js"
import "./lib/object_defines.js"
import { faceObj, startObj } from './lib/object_defines.js'

if(window.location.href.includes("localhost" || "127.0.0.1")) {
  document.title = "Maze 95 JS - LOCAL"
}

//Path to the server
const webSocketServerPath = "http://maze95-js.ga:3000"

//Misc variables
window.spooky
window.spooky = false

let gameStarted = false
window.spd = 0

//Colors
const win95teal = new THREE.Color(0x018281)
const black = new THREE.Color(0x000000)
export const green = new THREE.Color(0x248000)

//Player properties
export const playerGeo = new THREE.CylinderGeometry(10,10,30)
const playerTex = new THREE.TextureLoader().load("./textures/playertex.png")
export const playerMat = new THREE.MeshBasicMaterial({map: playerTex})

//Disable Story Mode button as it does nothing
document.getElementById("storystart").disabled = true

//Action of reset button
const resetButton = document.getElementById("reset")
resetButton.onclick = function resetGame() {
  location.reload()
}

//Textures
const wallTex = new THREE.TextureLoader().load(`${texturePath}${window.wallTexName}`, function ( texture ) {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0,0)
  texture.repeat.set(2,2)
})
wallTex.magFilter = THREE.NearestFilter
const wallMat = new THREE.MeshBasicMaterial({map: wallTex})

//Make connection with server
const socket = io(webSocketServerPath)

//The game scene
export const gameScene = new Scene()
gameScene.scene.background = win95teal

//Some client-server properties
let id
let instances = []
let clients = new Object()

//Cube on title screen
const titleCubeGeo = new THREE.BoxGeometry(15,15,15)
const titleCube = new THREE.Mesh(titleCubeGeo, wallMat)
gameScene.scene.add(titleCube)
titleCube.position.z = -50
titleCube.position.x = 7
titleCube.rotation.y = 0.45

//Fog function
function fog(color, near, far) {
  gameScene.scene.fog = new THREE.Fog(color, near, far);
}
function unfog() {
  gameScene.scene.fog = null
}
if(window.spooky && !gameStarted) {
  console.warn("Cannot enable spooky mode yet, map not loaded.") //Any help on how not to newly warn every single framew would be appreciated
}
if(window.spooky && gameStarted) {
  fog(0x0000, 5, 50)
  amb.color.setHex(0x707070)
}
else {
  unfog()
}

//Music on title screen
let titleMus = new Audio("./audio/mus_bg.mp3")
titleMus.addEventListener('ended', function() { // Thanks @kingjeffrey on stackoverflow for FF loop support!
  this.currentTime = 0
  this.play()
}, false)
titleMus.play()

var mixer
var action

export { mixer, action }

function loadMap() {
  gameScene.scene.remove(titleCube)
  gameScene.scene.add(gameScene.ceiling)
  gameScene.scene.add(gameScene.floor)
  gameScene.scene.add(faceObj)
  gameScene.scene.add(startObj)
  window.spd = 0.9
  gameStarted = true
}

function loadModel() {
  const loader = new GLTFLoader()
  loader.load("./levels/maze/model/model.glb", function (gltf) {
    gameScene.scene.add(gltf.scene)
    gltf.scene.position.y = 46

    mixer = new THREE.AnimationMixer(gltf.scene)

    action = mixer.clipAction(gltf.animations[ 0 ])
    action.setLoop(THREE.LoopOnce)
    action.clampWhenFinished = true
    action.enable = true
    action.play()
    action.play().reset()
  })
}

function clearCanvas() {
  document.getElementById("title").remove()
  document.getElementById("classicstart").remove()
  document.getElementById("storystart").remove()
  titleMus.pause()
}

document.getElementById("classicstart").onclick = function startGame() {
  document.getElementById("classicstart").disabled = true
  gameScene.scene.background = black
  clearCanvas()
  loadModel()
  loadMap()
}

//On moved
gameScene.on('userMoved', ()=>{
  socket.emit('move', [gameScene.player.position.x, gameScene.player.position.y, gameScene.player.position.z]);
})

//On connection server sends the client their ID
socket.on('introduction', (_id, _clientNum, _ids)=>{

  for(let i = 0; i < _ids.length; i++){
    if(_ids[i] != _id){
      clients[_ids[i]] = {
        mesh: new THREE.Mesh(
          playerGeo,
          playerMat
        )
      }

      //Add initial users to the scene
      gameScene.scene.add(clients[_ids[i]].mesh)
    }
  }

  console.log(clients)

  id = _id
  console.log(`Client ID is ${id}`)

})

//Run when a new user has connected to the server
socket.on('newUserConnected', (clientCount, _id, _ids)=>{
  document.getElementById("numberonline").innerHTML = `Players online: ${clientCount}`
  let alreadyHasUser = false
  for(let i = 0; i < Object.keys(clients).length; i++){
    if(Object.keys(clients)[i] == _id){
      alreadyHasUser = true
      break
    }
  }
  if(_id != id && !alreadyHasUser){
    console.log('A new user connected with the id: ' + _id)
    clients[_id] = {
      mesh: new THREE.Mesh(
        playerGeo,
        playerMat
      )
    }

    //Add initial users to the scene
    gameScene.scene.add(clients[_id].mesh)
    clients[_id].mesh.position.y = -10
    clients[_id].mesh.position.z = -23
  }

})

//Run when a user disconnects
socket.on('userDisconnected', (clientCount, _id, _ids)=>{
  //Update the data from the server
  document.getElementById("numberonline").innerHTML = `Players online: ${clientCount}`

  if(_id != id){
    console.log('A user disconnected with the id: ' + _id)
    gameScene.scene.remove(clients[_id].mesh)
    delete clients[_id]
  }
})

socket.on('connect', ()=>{})

//Update when one of the users moves in space
socket.on('userPositions', _clientProps =>{
  // console.log('Positions of all users are ', _clientProps, id)
  // console.log(Object.keys(_clientProps)[0] == id)
  for(let i = 0; i < Object.keys(_clientProps).length; i++){
    if(Object.keys(_clientProps)[i] != id){

      //Store the values
      let oldPos = clients[Object.keys(_clientProps)[i]].mesh.position
      let newPos = _clientProps[Object.keys(_clientProps)[i]].position

      //Create a vector 3 and lerp the new values with the old values
      let lerpedPos = new THREE.Vector3()
      lerpedPos.x = THREE.Math.lerp(oldPos.x, newPos[0], 0.3)
      lerpedPos.y = THREE.Math.lerp(oldPos.y, newPos[1], 0.3)
      lerpedPos.z = THREE.Math.lerp(oldPos.z, newPos[2], 0.3)

      //Set the position
      clients[Object.keys(_clientProps)[i]].mesh.position.set(lerpedPos.x, lerpedPos.y, lerpedPos.z)
    }
  }
})

//Move functions
function rotateD(speed) {
  gameScene.player.rotation.y -= speed
  socket.emit('move', [gameScene.player.position.x, gameScene.player.position.y, gameScene.player.position.z])
}

function rotateA(speed) {
  gameScene.player.rotation.y += speed
  socket.emit('move', [gameScene.player.position.x, gameScene.player.position.y, gameScene.player.position.z])
}

function moveW(speed) {
  gameScene.player.position.x += -Math.sin(gameScene.player.rotation.y) * speed
  gameScene.player.position.z += -Math.cos(gameScene.player.rotation.y) * speed
  socket.emit('move', [gameScene.player.position.x, gameScene.player.position.y, gameScene.player.position.z])
}

function moveS(speed) {
  gameScene.player.position.x -= -Math.sin(gameScene.player.rotation.y) * speed
  gameScene.player.position.z -= -Math.cos(gameScene.player.rotation.y) * speed
  socket.emit('move', [gameScene.player.position.x, gameScene.player.position.y, gameScene.player.position.z])
}

kd.W.down(function(){moveW(window.spd)})
kd.A.down(function(){rotateA(window.spd/window.rotDiv)})
kd.S.down(function(){moveS(window.spd)})
kd.D.down(function(){rotateD(window.spd/window.rotDiv)})

kd.run(function(){kd.tick()})