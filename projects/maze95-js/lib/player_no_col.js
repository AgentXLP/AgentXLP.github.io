import { player } from "../maze95.js"

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

export { rotateD, rotateA, moveS, moveW }