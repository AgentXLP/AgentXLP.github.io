import { SelectedLVL } from "../levels/level_defines.js"
import { player } from "../maze95.js"

export const col = SelectedLVL("col")

function collisionCheck() {
    let inc = 0
    while(col.length > inc) {
        // The increment is per collision cube, it checks for collision on each coordinate for a cube, and if it does not return true then it will keep going to the next collision cube. //
        if(player.position.x > col[inc][0] && player.position.x < col[inc][3] && player.position.z > col[inc][2] && player.position.z < col[inc][5]) return true
        inc += 1
    }
    return false
  } //Credits to @luphoria for help with implementing the collision (broken because I am braindead as of now)

function move(type,speed) {
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

export { move }