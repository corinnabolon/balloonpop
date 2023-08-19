//BUTTONS
// let startButton = document.getElementById("start-button") We don't need these anymore because we don't need to disable them as we are hiding the whole div
// let inflateButton = document.getElementById("inflate-button")


//#region GAME LOGIC AND DATA

//DATA
let clickCount = 0
let height = 120
let width = 100
let inflationRate = 20
let maxSize = 300
let highestPopCount = 0
let currentPopCount = 0
let gameLength = 5000
let clockId = 0 //this lets us keep track of the number coming back from the setInterval so that we can stop it
let timeRemaining = 0
let currentPlayer = {}   //this will be an oject, so you add the = {} to make it clearer but you don't have to
let currentColor = "red"
let possibleColors = ["red", "green", "blue", "purple", "pink"]


function startGame() {
    // startButton.setAttribute("disabled", "true")   We don't need these 2 lines anymore because we are hiding the buttons
    // inflateButton.removeAttribute("disabled")
    document.getElementById("game-controls").classList.remove("hidden")
    document.getElementById("main-controls").classList.add("hidden")
    document.getElementById("scoreboard").classList.add("hidden")
    startClock()
    setTimeout(stopGame, gameLength)
    // setTimeout means "run this function after X amount of time"
}

function startClock() {
    timeRemaining = gameLength
    drawClock()
    clockId = setInterval(drawClock, 1000)
    // setInterval runs the function every time a certain number of seconds have passed
    // it gives us back a number which is the ID we'll need if we want to stop the interval
}

function stopClock() {
    clearInterval(clockId)
}

function drawClock() {
    let countdownElement = document.getElementById("countdown")
    countdown.innerText = (timeRemaining / 1000).toString()
    timeRemaining -= 1000
}

function inflate() {
    clickCount ++
    height += inflationRate
    width += inflationRate
    checkBalloonPop()
    draw()
}

function checkBalloonPop() {
    if (height >= maxSize) {
        let balloonElement = document.getElementById("balloon")
        balloonElement.classList.remove(currentColor)
        getRandomColor()
        balloonElement.classList.add(currentColor)
        document.getElementById("pop-sound").play()
        currentPopCount ++
        height = 0
        width = 0        
    }     
}

function getRandomColor() {
    let i = Math.floor(Math.random() * possibleColors.length);
    currentColor = possibleColors[i];
}

function draw() {
    let balloonElement = document.getElementById("balloon")
    let clickCountElement = document.getElementById("click-count")
    let popCountElement = document.getElementById("pop-count")
    let highestPopCountElement = document.getElementById("highest-pop-count")
    let playerNameElem = document.getElementById("player-name")
    
    balloonElement.style.height = height + "px"
    balloonElement.style.width = width + "px"
    
    clickCountElement.innerText = clickCount.toString()
    popCountElement.innerText = currentPopCount.toString()
    highestPopCountElement.innerText = currentPlayer.topScore.toString()
    playerNameElem.innerText = currentPlayer.name.toString()
}

function stopGame() {
    console.log("the game is over")
    // inflateButton.setAttribute("disabled", "true") not needed because hiding the div
    // startButton.removeAttribute("disabled")

    document.getElementById("main-controls").classList.remove("hidden")
    document.getElementById("game-controls").classList.add("hidden")
    document.getElementById("scoreboard").classList.remove("hidden")
    
    clickCount = 0
    height = 120
    width = 100

    if (currentPopCount > currentPlayer.topScore) {
        currentPlayer.topScore = currentPopCount
        savePlayers()
    }
    currentPopCount = 0
    
    stopClock()
    draw()
    drawScoreboard()
}

//#endregion


let players = []
loadPlayers()

function setPlayer(event) {
    event.preventDefault()  //default action of a form is to reload--we want to prevent that
    let form = event.target  //event is what we want to get ahold of

    let playerName = form.playerName.value
    
    currentPlayer = players.find(player => player.name == playerName)

    if (!currentPlayer) {
        currentPlayer = { name: playerName, topScore: 0 }
        players.push(currentPlayer)
        savePlayers()
    }
    
    form.reset()
    document.getElementById("game").classList.remove("hidden")
    form.classList.add("hidden")
    draw()
    drawScoreboard()
}

function changePlayer(){
    document.getElementById("player-form").classList.remove("hidden")
    document.getElementById("game").classList.add("hidden")
}

function savePlayers() {
    window.localStorage.setItem("players", JSON.stringify(players)) //we use stringify because it needs to 
                                    //be a string, but if we use tostring we lose all the associated data
}

function loadPlayers() {
    let playersData = JSON.parse(window.localStorage.getItem("players"))
    if (playersData){
        players = playersData
    } 
}

function drawScoreboard() {
    let template = ""
    players.sort((p1, p2) => p2.topScore - p1.topScore)
    players.forEach(player => {
        template += `
        <div class="d-flex space-between">
        <span>
            <i class="fa-solid fa-circle-user" aria-hidden="true"></i>
            ${player.name}
        </span>
        <span>
            ${player.topScore}
        </span>
    </div>
        `
    })
    document.getElementById("players").innerHTML = template
}

drawScoreboard()