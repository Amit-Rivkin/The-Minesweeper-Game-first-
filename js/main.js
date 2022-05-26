'use strict'
const MINE = '💣'
const FLAG = '🚩'


var gIntervalId
var gStartTime
var gBoard;
var gLevel = { size: 4, mines: 2 }
var gGame

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
        isFirstClick: true
    }
    var elLive = document.querySelector('.live span')
    elLive.innerText = gGame.lives
    var elBtn = document.querySelector('.restart span')
    elBtn.innerText = '😁'
}

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

function renderBoard(board) {
    var strHTML = '<table border="4"><tbody>'
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

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countNeighbors(i, j, board)

            }
        }
    }

}

function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector)
    elCell.innerText = value
    elCell.style.backgroundColor = "wheat"
}

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


function checkWin() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isShown) return
            if (currCell.isMine && !currCell.isShown && !currCell.isMarked) return
        }
    }
    clearInterval(gIntervalId)
    gGame.IsVictory = true
    var elBtn = document.querySelector('.restart span')
    elBtn.innerText = '😎'

}

function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            var cell = board[i][j]
            renderCell({ i, j }, cell.minesAroundCount)
            cell.isShown = true

        }
    }
}


function addRandMines() {
    var count = 0
    while (count < gLevel.mines) {
        var i = getRandomInt(0, gBoard.length)
        var j = getRandomInt(0, gBoard[0].length)
        var randCell = gBoard[i][j]
        if (randCell.isMine) continue
        randCell.isMine = true
        count++
    }
}

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

function safeClick() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]

        }
    }
}

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
