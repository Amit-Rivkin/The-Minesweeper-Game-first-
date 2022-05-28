'use strict'
const MINE = '💣'
const FLAG = '🚩'


var gIntervalId
var gStartTime
var gBoard;
var gLevel = { size: 4, mines: 2 }
var gGame

//Reset & load the game
function initGame() {
    gBoard = buildBoard()
    resetTimer()
    addRandMines()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gGame = {
        isOn: true,
        lives: 3,
        IsVictory: false,
        isFirstClick: true,
        safeClick: 3
    }
    var elLive = document.querySelector('.live span')
    elLive.innerText = gGame.lives
    var elBtn = document.querySelector('.restart span')
    elBtn.innerText = '😁'
    var elBtn = document.querySelector('.buttons span')
    elBtn.innerText = gGame.safeClick
}

//Build the game matrix
function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.size; i++) {
        board.push([])
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false

            }

        }

    }

    return board
}

//Render the game matrix to the HTML page
function renderBoard(board) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var className = getClassName({ i, j })
            if (currCell.isShown) {
                var cell = (!currCell.isMine) ? currCell.minesAroundCount : MINE
                strHTML += `<td class="cell ${className}" onclick="cellClicked(this, ${i},${j})" oncontextmenu="cellMarked(this, ${i}, ${j})">${cell}</td>`
            } else {
                strHTML += `<td class="cell ${className}" onclick="cellClicked(this, ${i},${j})" oncontextmenu="cellMarked(this, ${i}, ${j})"></td>`
            }
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elTable = document.querySelector('.table')
    elTable.innerHTML = strHTML
}

// Check the amount of mines around the cell
function countNeighbors(cellI, cellJ, board) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            var cell = board[i][j]
            if (cell.isMine) neighborsCount++;
        }
    }
    return neighborsCount;
}

//Update the amount of mines around the cell
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j]
            if (!cell.isMine) {
                cell.minesAroundCount = countNeighbors(i, j, board)

            }
        }
    }

}

//Render the cell to the HTML page
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector)
    elCell.innerText = value
    elCell.style.backgroundColor = "wheat"
}

//Right click functions 
function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j]
    if (gGame.isFirstClick) {
        if (cell.isMine) return
        gGame.isFirstClick = false
    }
    if (!gGame.isOn) return
    if (!gIntervalId) startTimer()
    if (cell.isMarked) return
    if (cell.isShown) return
    if (!cell.isMine && !cell.isShown) {
        cell.isShown = true
        renderCell({ i, j }, cell.minesAroundCount)
        checkWin()
    }
    if (cell.minesAroundCount === 0 && !cell.isMine) {
        cell.isShown = true
        renderCell({ i, j }, cell.minesAroundCount)
        expandShown(gBoard, i, j)
        checkWin()
    }


    if (cell.isMine) {
        var elBtn = document.querySelector('.restart span')
        elBtn.innerText = '🤯'
        if (cell.isShown) return
        gGame.lives--
        updateLives()
        cell.isShown = true
        renderCell({ i, j }, MINE)
        if (gGame.lives === 0) {

            gGame.isOn = false
            revealMines()
            clearInterval(gIntervalId)

            var elBtn = document.querySelector('.restart span')
            elBtn.innerText = '😭'
        }
    }
}

//Left click functions
function cellMarked(elCell, i, j) {
    var cell = gBoard[i][j]
    if (!gGame.isOn) {
        clearInterval(gIntervalId)
        return
    }

    if (cell.isShown) return
    if (cell.isMarked) {
        cell.isMarked = false
        elCell.innerText = ''
        renderCell({ i, j }, '')
        elCell.style.backgroundColor = ''
        checkWin()
    } else {
        cell.isMarked = true
        elCell.innerText = FLAG
        renderCell({ i, j }, FLAG)
        checkWin()
    }
}

// Check if the user win
function checkWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown) return
            if (cell.isMine && !cell.isShown && !cell.isMarked) return
        }
    }
    clearInterval(gIntervalId)
    gGame.IsVictory = true
    var elBtn = document.querySelector('.restart span')
    elBtn.innerText = '😎'

}

//Show more than one empty cell if they empty
function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            var cell = board[i][j]
            cell.isShown = true
            renderCell({ i, j }, cell.minesAroundCount)

        }
    }
}

//Add the mines at random cells evrey load 
function addRandMines() {
    var count = 0
    while (count < gLevel.mines) {
        var i = getRandomInt(0, gBoard.length)
        var j = getRandomInt(0, gBoard[0].length)
        var cell = gBoard[i][j]
        cell.isMine = true
        count++
    }
}

//Let the user to choose the difficulty of the game
function chooseDifficulty(level) {
    gLevel.size = level
    switch (level) {
        case 4:
            gLevel.mines = 2
            break;
        case 8:
            gLevel.mines = 12
            break;
        case 12:
            gLevel.mines = 30
            break;
    }
    initGame()
}

//Show all the mines location if the user lose
function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                cell.isShown = true
                renderCell({ i, j }, MINE)
            }
        }

    }
}

// Let the user see one random cell that is not a mine for sure
function safeClick() {
    if (gGame.safeClick === 0) return
    var safeCells = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown) {
                var newPos = { i, j }
                safeCells.push(newPos)
            }
        }
    }
    gGame.safeClick--



    var randomNum = getRandomInt(0, safeCells.length)
    var randomCell = safeCells[randomNum]
    var elCell = document.querySelector(`.cell-${randomCell.i}-${randomCell.j}`)
    elCell.classList.add('safe-click')
    var elBtn = document.querySelector('.buttons span')
    elBtn.innerText = gGame.safeClick
    setTimeout(() => {
        elCell.classList.remove('safe-click')
    }, 700);

}

//update the dom lives
function updateLives() {
    var elLive = document.querySelector('.live span')
    elLive.innerText = gGame.lives

}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function startTimer() {
    gStartTime = Date.now()
    gIntervalId = setInterval(updateTime, 80)
}

function updateTime() {
    var now = Date.now()
    var diff = now - gStartTime
    var secondsPast = diff / 1000
    var elTimerSpan = document.querySelector('.timer span')
    elTimerSpan.innerText = secondsPast.toFixed(3)

}

function resetTimer() {
    var elTimer = document.querySelector('.timer span')
    elTimer.innerText = ''
    if (gIntervalId) clearInterval(gIntervalId)
    gStartTime = 0
    gIntervalId = 0
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}
