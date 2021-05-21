const skin = window.myMario.skinData = {"overalls":[127,83,0,255,167,0],"hat":[127,127,0,255,255,0],"shirt":[127,127,0,255,255,0],"gloves":[127,127,127,255,255,255],"boots":[57,42,7,114,84,14],"skin":[127,96,60,254,193,121],"hair":[57,50,0,115,101,0],"parachute":[127,127,0,255,255,0],"customCapState":0}

const map = prompt('Insert map ID, these include:\nCastle Grounds: 16\nBob-omb Battlefield: 9\nWhomps Fortress: 24\nMushroom Battlefield: 1000\nCTF/Race Map: 1001\nGlider Jungle: 1003\nDolphin Town: 1006')


if (!window.location.href == 'https://sm64js.com') {
    window.location.href = 'https://sm64js.com'
    window.setTimeout(loadGame, 3500)
} else {
    loadGame()
}

function loadGame () {
    myMario.skinData = skin
    document.getElementById('mapSelect').value = map
    document.getElementById('playerNameButton').click()
    document.getElementById('startbutton').click()
}