import * as THREE from './three.module.js'
import { SelectedLVL } from "../levels/level_defines.js"

let finPos = SelectedLVL("finPos")
let startlogoPos = SelectedLVL("startLogoPos")

//Texture defines
const faceTexture = new THREE.TextureLoader().load("./textures/fin.png")
faceTexture.magFilter = THREE.NearestFilter
const face = new THREE.MeshStandardMaterial({map: faceTexture, transparent: true, opacity: 0.65})

const startTexture = new THREE.TextureLoader().load("./textures/start.png")
startTexture.magFilter = THREE.NearestFilter
const startMat = new THREE.MeshBasicMaterial({map: startTexture, transparent: true, opacity: 0.6})

//Face usually used as the indicator to make a new maze rise from the ashes of the old one.
export const faceObj = new THREE.Mesh(
    new THREE.BoxGeometry(16,9.5,0),
    face
  )
faceObj.position.x = finPos[0]
faceObj.position.y = finPos[1]
faceObj.position.z = finPos[2]

export const startObj = new THREE.Mesh(
  new THREE.BoxGeometry(23,30,0),
  startMat
)
startObj.position.x = startlogoPos[0]
startObj.position.y = startlogoPos[1]
startObj.position.z = startlogoPos[2]