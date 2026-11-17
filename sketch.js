let cnv;
let margin = 20
let fetchedData;
let selectedEvent;
let centre;
let revealTimer, revealEnd;

let colours = {

  bg: '#534b52',
  buttons: '#2d232e',
  text: '#f1f0ea',
  
  border: '#2d232e',
  health: '#e0ddcf'
}

async function getEvents(month, day) {
  let url = `https://byabbe.se/on-this-day/${month}/${day}/events.json`
  fetchedData = await httpGet(url)
  //console.log(fetchedData)

  let i = getRandomInt(fetchedData.events.length - 1)
  selectedEvent = fetchedData.events[i]

  fetchedData.events.splice(i, 1)
}

let font;
let fontName = "ScienceGothic-Light"
async function initFont() {
  font = await loadFont(`${fontName}.ttf`);
  textFont(font);
}

function simplifyYear(yr) {
  if (yr.includes("AD")) {
    return Number(yr.replace(" ", "").replace("AD", ""))
  }

  if (yr.includes("BC")) {
    yr = Number(yr.replace(" ", "").replace("BC", ""))
    return 0 - yr
  }

  return Number(yr)

}

function setup() {

  // DEBUGGING

  // END OFDEBUG

  initFont()
  cnv = createCanvas(windowWidth - margin, windowHeight - margin);
  cnv.position(margin / 2, margin / 2, 'fixed');
  //loadPhysics()

  textSize(32)
  textAlign(CENTER, CENTER)
  //textStyle(ITALIC)
  textWrap(WORD)
  rectMode(CENTER)

  centre = { x: width / 2, y: height / 2 }

  loadInputs()
}

function windowResized() {
  resizeCanvas(windowWidth - margin, windowHeight - margin);
  centre = { x: width / 2, y: height / 2 }
}

let currentScreen = "enterDate"
let borderWeight = 30

function draw() {
  background(colours.bg);
  noFill()
  strokeWeight(borderWeight)
  stroke(colours.border)
  rect(centre.x, centre.y, width-borderWeight,height-borderWeight)

  strokeWeight(1)
  noStroke()
  fill(colours.text)
  if (currentScreen == "enterDate") {
    text("Enter A Date:", centre.x, centre.y - 150, width)
  }

  if (currentScreen == "getReady") {
    if (typeof selectedEvent == 'object') {
      text("Click to Reveal Event", centre.x, centre.y, width)
    } else {
      text("Loading", centre.x, centre.y, width)
    }

  }

  if (currentScreen == "showingEvent") {
    //line(width/2, 0, width/2, height)
    text(selectedEvent.description, centre.x, centre.y, width / 1.5)
    text(`${selectedDay} / ${selectedMonth} / ????`, centre.x, centre.y + 100, width)
  }

  if (currentScreen == "revealingGuesses") {
    let curMs = millis()
    let elapsed = 0
    let p1Display = p1ConfirmedGuess
    let p2Display = p2ConfirmedGuess
    let guessorDamage = "Guess"
    if (curMs > revealEnd) {
      elapsed = curMs - revealEnd
      if (elapsed > 3000) {
        p1Display = currentPoints.p1
        p2Display = currentPoints.p2
        guessorDamage = "Damage"

        if ((newButton.elt.style.display === 'none')) {
          console.log('Showing New Button')
          newButton.show()

          // Deal damage
          if (currentPoints.p1 > currentPoints.p2) { // Whoever furthest is damaged
            healths.p1 -= currentPoints.p1
          } else {
            healths.p2 -= currentPoints.p2
          }

          healths.p1 = Math.max(0, healths.p1)
          healths.p2 = Math.max(0, healths.p2)

          if (healths.p1 == 0 || healths.p2 == 0) {
            someoneDied = true
            newButton.html('End Game')
          }
        }
      }

    }


    let remainingMs = revealEnd - curMs
    let answerAlpha = Math.min(255, Math.max(0, 5000 - remainingMs))
    let g1Alpha = Math.min(255, Math.max(0, 2000 - remainingMs))
    let g2Alpha = Math.min(255, Math.max(0, 0 - remainingMs))

    let gap = 100

    let c = color(colours.text)
    fill(c)
    text(selectedEvent.description, centre.x, centre.y - gap * 2, width / 1.5)

    text('Answer:', centre.x, centre.y + gap, width)
    text(`P1 ${guessorDamage}:`, margin + 150, centre.y + gap, width)
    text(`P2 ${guessorDamage}:`, width - 150, centre.y + gap, width)

    c.setAlpha(answerAlpha)
    fill(c)
    text(selectedEvent.year, centre.x, centre.y + gap + 50, width)

    c.setAlpha(g1Alpha)
    fill(c)
    text(p1Display, margin + 150, centre.y + gap + 50, width)

    c.setAlpha(g2Alpha)
    fill(c)
    text(p2Display, width - 150, centre.y + gap + 50, width)
    fill(colours.text)
  }

  // Game end
  if (currentScreen == "gameEnd") {
    let winner;
    if (healths.p1 == 0) {
      winner = "Player 2"
    } else 
    {
      winner = "Player 1"
    }

    text(`Winner: ${winner}`, centre.x, centre.y)
    newGameButton.show()
  }

  // Healthbars
  push()

  let bar = {
    x: 10, y: 10, w: 200, h: 10
  }

  let w1 = (healths.p1 / 3000) * bar.w
  let w2 = (healths.p2 / 3000) * bar.w
  let rx = width - bar.x - bar.w

  rectMode(CORNER)

  noStroke()
  fill(colours.health)

  rect(bar.x, bar.y, w1, bar.h)
  rect(rx, bar.y, w2, bar.h)

  noFill()
  stroke(0)

  rect(bar.x, bar.y, bar.w, bar.h)
  rect(rx, bar.y, bar.w, bar.h)

  pop()
}

function mousePressed() {
  if (currentScreen == "getReady" && typeof selectedEvent == 'object') {
    currentScreen = "showingEvent"
    toggleGuessInputs(true)
  }
}
