'use strict'
const MINE = '💣'
const FLAG = '🚩'


var gBoard;
var gLevel ={size:4, mines:2}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,

}


function initGame() {
    gBoard = buildBoard()
    addRandMines()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    console.table(gBoard);
    gLevel={}
}

function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.size; i++) {
        board.push([])
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: true,
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
                strHTML += `<td class="cell ${className}" onclick="cellClicked(this, ${i},${j})">${cell}</td>`
            } else {
                strHTML += `<td class="cell ${className}" onclick="cellClicked(this, ${i},${j})"></td>`
            }

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elTable = document.querySelector('.table')
    elTable.innerHTML = strHTML
}




function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
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
}

function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j]
    console.log(cell);
    if (!cell.isMine && !cell.isShown) {
        cell.isShown = true
        renderCell({ i, j }, cell.minesAroundCount)
    }

    if (cell.isMine) {
        cell.isShown = true
        console.log('Game Over');
        renderCell({ i, j }, MINE)
    }
}
function cellMarked(elCell) {

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
