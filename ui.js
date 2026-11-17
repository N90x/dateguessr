let monthSelect, daySelect;
let confirmButton, newButton;

let p1Guess, p2Guess;
let p1ConfirmedGuess, p2ConfirmedGuess;

let selectedMonth, selectedDay;

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function monthNum(month) {
    return months.indexOf(month) + 1
}

let someoneDied = false
function getNewEvent() {

    if (someoneDied) {
        newButton.html('Next Round')
        currentScreen = "gameEnd"
    } else {
        let i = getRandomInt(fetchedData.events.length - 1)
        selectedEvent = fetchedData.events[i]
        fetchedData.events.splice(i, 1)
        currentScreen = "getReady"
        currentPoints = { p1: 0, p2: 0 }
    }


    newButton.hide()

}

function loadInputs() {
    monthSelect = createSelect()
    let uiPos = { x: centre.x, y: centre.y - 200 }
    for (let month of months) {
        monthSelect.option(month)
    }
    monthSelect.size(200, 100)
    monthSelect.position(uiPos.x, uiPos.y + 100)
    monthSelect.style('color', colours.text);
    monthSelect.style('font-size', "32px");
    monthSelect.style('background-color', colours.buttons);

    daySelect = createSelect()
    for (let i = 1; i <= 31; i++) {
        daySelect.option(i)
    }
    daySelect.selected(1)
    daySelect.size(100, 100)
    daySelect.position(uiPos.x - daySelect.width, uiPos.y + 100)
    daySelect.style('font-size', "32px");
    daySelect.style('color', colours.text);
    daySelect.style('background-color', colours.buttons);

    confirmButton = createButton('Enter')
    confirmButton.size(300, 50)
    confirmButton.position(uiPos.x - daySelect.width, monthSelect.y + monthSelect.height + 10)
    confirmButton.mousePressed(function () {
        toggleInputs(false)
        currentScreen = "getReady"
        selectedMonth = monthNum(monthSelect.selected())
        selectedDay = daySelect.selected()
        getEvents(selectedMonth, selectedDay)
    })
    confirmButton.style('color', colours.text);
    confirmButton.style('background-color', colours.buttons);
    confirmButton.style('font-size', "24px");

    newGameButton = createButton('New Game')
    newGameButton.size(300, 50)
    newGameButton.position(centre.x, centre.y + 200)
    newGameButton.mousePressed(function () {
        currentScreen = "enterDate"
        newGameButton.hide()
        toggleInputs(true)
        currentPoints = { p1: 0, p2: 0 }
        healths = { p1: 3000, p2: 3000 }
    })
    newGameButton.style('color', colours.text);
    newGameButton.style('background-color', colours.buttons);
    newGameButton.style('font-size', "24px");
    newGameButton.hide()

    newButton = createButton('Next Round')
    newButton.size(200, 50)
    newButton.position(centre.x - newButton.width / 2, height - newButton.height * 1.1)
    newButton.mousePressed(getNewEvent)
    newButton.hide()
    newButton.style('color', colours.text);
    newButton.style('background-color', colours.buttons);
    newButton.style('font-size', "24px");

    p1Guess = createInput()
    p1Guess.position(margin * 1.1, height - p1Guess.height)
    p1Guess.hide()
    p1Guess.changed(function () {
        p1ConfirmedGuess = simplifyYear(p1Guess.value())
        //console.log(typeof p1Guess.value())
        console.log(`Player One Guesses ${p1ConfirmedGuess}`)
        p1Guess.value('')
        p1Guess.hide()
        processGuesses()
    })
    p1Guess.style('color', colours.text);
    p1Guess.style('background-color', colours.buttons);

    p2Guess = createInput()
    p2Guess.position(width - p2Guess.width - margin * 0.1, height - p2Guess.height)
    p2Guess.hide()
    p2Guess.changed(function () {
        p2ConfirmedGuess = simplifyYear(p2Guess.value())
        //console.log(typeof p2Guess.value())
        console.log(`Player Two Guesses ${p2ConfirmedGuess}`)
        p2Guess.value('')
        p2Guess.hide()
        processGuesses()
    })
    p2Guess.style('color', colours.text);
    p2Guess.style('background-color', colours.buttons);
}

// Points are bad!
let currentPoints = { p1: 0, p2: 0 }
let healths = { p1: 3000, p2: 3000 }

function processGuesses() {
    if (typeof p1ConfirmedGuess == "number" && typeof p2ConfirmedGuess == "number") {
        currentScreen = "revealingGuesses"
        let answer = simplifyYear(selectedEvent.year)

        currentPoints = {
            p1: Math.abs(answer - p1ConfirmedGuess),
            p2: Math.abs(answer - p2ConfirmedGuess),
        }

        console.log(`Answer: ${answer}\n${currentPoints}`)

        revealEnd = millis() + 7000
    }
}

function toggleGuessInputs(foo) {
    if (foo) {
        p1Guess.show()
        p2Guess.show()
    } else {
        p1Guess.hide()
        p2Guess.hide()
    }
}

function toggleInputs(foo) {
    if (foo) {
        monthSelect.show()
        daySelect.show()
        confirmButton.show()
    } else {
        monthSelect.hide()
        daySelect.hide()
        confirmButton.hide()
    }

}