const skyboxes = [
    "bbh",
    "cloud_floor",
    "ssl",
    "water",
    "water"
]

const boxes = []
let currentBox = 0

window.onload = () => {
    document.body.style.backgroundImage = `url("assets/${skyboxes[Math.floor(Math.random() * skyboxes.length)]}.png")`

    boxes.push(document.getElementById("boxmain"))
    boxes.push(document.getElementById("boxplay"))
}

window.switchBox = (index) => {
    boxes[currentBox].hidden = true
    boxes[index].hidden = false
    currentBox = index
}