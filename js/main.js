'use strict'
const MINE = '💣'
const FLAG = '🚩'


var gBoard;
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,

}



function initGame() {
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    console.table(gBoard);
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
    board[0][1].isMine = true
    board[0][3].isMine = true
    return board
}

function renderBoard(board) {
    var strHTML = '<table border="4"><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            currCell.minesAroundCount = setMinesNegsCount(board)
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
    console.log(neighborsCount);
    return neighborsCount;
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {

        }
        return countNeighbors(i, j, board)
    }

}

function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector)
    // if(gBoard[location.i][location.j].isMine){
    // }
    elCell.innerText = value
}

function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j]
    console.log(cell);
    if (cell.isMine) {
        cell.isShown = true
        console.log('Game Over');
        renderCell({ i, j }, MINE)
    }





}
function cellMarked(elCell) {

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}