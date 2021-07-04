import * as THREE from './lib/three.module.js'
import EventEmitter from './_snowpack/pkg/event-emitter-es6.js'

//Misc imports
import { mixer, playerGeo, playerMat } from "./maze95.js"
import { SelectedLVL } from "./levels/level_defines.js"
import "./lib/settings.js"
import { faceObj, startObj } from './lib/object_defines.js'

class Scene extends EventEmitter {
  constructor(gameCanvas = document.querySelector('#game'),
              _width = 512,
              _height = 384){

    //Since we extend EventEmitter we need to instance it from here
    super()

    //THREE scene
    this.scene = new THREE.Scene()

    //Utility
    this.width = _width
    this.height = _height

    //THREE Camera
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 1000)

    //Player object
    this.player = new THREE.Mesh(playerGeo, playerMat)
    this.scene.add(this.player)
    this.player.position.y = -10
    this.player.position.z = -23

    //THREE WebGL renderer
    this.renderer = new THREE.WebGL1Renderer({
      canvas: document.querySelector('#game'),
    })

    //Renderer size
    this.renderer.setSize(this.width, this.height)

    //Clock & redraw function
    this.clock = new THREE.Clock()
    this.update()

    this.amb = new THREE.AmbientLight(0xffffff, SelectedLVL("ambLightIntensity"))
    this.scene.add(this.amb)

    //Ceiling & floor textures and materials
    this.ceilingTex = new THREE.TextureLoader().load(`${window.texturePath}${window.ceilingTexName}`, function ( texture ) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.offset.set(0,0)
      texture.repeat.set(60,50)
    })
    this.ceilingTex.magFilter = THREE.NearestFilter
    this.ceilingMat = new THREE.MeshBasicMaterial({map: this.ceilingTex})
    
    this.floorTex = new THREE.TextureLoader().load(`${window.texturePath}${window.floorTexName}`, function ( texture ) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.offset.set(0,0)
      texture.repeat.set(25,25)
    })
    this.floorTex.magFilter = THREE.NearestFilter
    this.floorMat = new THREE.MeshBasicMaterial({map: this.floorTex})
    
    this.floor = new THREE.Mesh(
      new THREE.BoxGeometry(1000,0.1,1000),
      this.floorMat
    )
    //this.scene.add(this.floor)
    this.floor.position.y = -25
    this.ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(1000,0.1,1000),
      this.ceilingMat
    )
    //this.scene.add(this.ceiling)
    this.ceiling.position.y = 14

    this.delta = this.clock.getDelta()
  }

  drawUsers(positions, id){
    for(let i = 0; i < Object.keys(positions).length; i++){
      if(Object.keys(positions)[i] != id){
        this.users[i].position.set(positions[Object.keys(positions)[i]].position[0],
                                   positions[Object.keys(positions)[i]].position[1],
                                   positions[Object.keys(positions)[i]].position[2]);
      }
    }
  }

  update(){
    requestAnimationFrame(() => this.update())
    this.camera.position.x = this.player.position.x
    //this.camera.position.y = this.player.position.y
    this.camera.position.z = this.player.position.z
    this.camera.rotation.y = this.player.rotation.y

    //Billboards
    startObj.rotation.y = this.player.rotation.y
    faceObj.rotation.y = this.player.rotation.y

    if(mixer) mixer.update(this.delta)

    this.render()
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }
}

export default Scene