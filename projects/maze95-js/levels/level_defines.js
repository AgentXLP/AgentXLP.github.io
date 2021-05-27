import { maze_entry } from "./maze/script.js"
import { bigroom_entry } from "./bigroom/script.js"

function lvlEntry() {
    var select = document.getElementById("lvlSel")
    var selectedVal = select.options[select.selectedIndex].value

    switch (selectedVal) {
        case "maze":
            return maze_entry
        case "bigroom":
            return bigroom_entry
    }
}

export const SelectedLVL = (req) => {
    let selected_lvl = lvlEntry()
    switch(req) {
        case "lvlName":
            return selected_lvl[0]
        case "lvlDir":
            return selected_lvl[1]
        case "lvlMus":
            return selected_lvl[2]
        case "pos":
            return selected_lvl[3]
        case "col":
            return selected_lvl[4]
        case "ambLightIntensity":
            return selected_lvl[5]
        case "finPos":
            return selected_lvl[6]
        case "startLogoPos":
            return selected_lvl[7]
        default:
            throw "Unimplemented data " + req
    }
}