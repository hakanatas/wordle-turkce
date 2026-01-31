window.WordleTR = window.WordleTR || {};

window.WordleTR.Board = {
  tiles: [],
  rows: 6,
  cols: 5,

  init: function (wordLength) {
    this.cols = wordLength;
    this.tiles = [];

    var board = document.getElementById('board');
    board.innerHTML = '';
    board.className = 'board-' + wordLength;

    for (var r = 0; r < this.rows; r++) {
      var rowTiles = [];
      for (var c = 0; c < this.cols; c++) {
        var tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.row = r;
        tile.dataset.col = c;
        board.appendChild(tile);
        rowTiles.push(tile);
      }
      this.tiles.push(rowTiles);
    }
  },

  setTileLetter: function (row, col, letter) {
    var tile = this.tiles[row][col];
    if (!tile) return;
    tile.textContent = letter.toLocaleUpperCase('tr-TR');
    tile.classList.add('filled');
  },

  clearTileLetter: function (row, col) {
    var tile = this.tiles[row][col];
    if (!tile) return;
    tile.textContent = '';
    tile.classList.remove('filled');
  },

  revealRow: function (row, evaluation, onComplete) {
    var tiles = this.tiles[row];
    var completed = 0;
    var total = tiles.length;

    tiles.forEach(function (tile, i) {
      setTimeout(function () {
        // Flip in (ilk yari)
        tile.classList.add('flip');

        // Animasyonun ortasinda renk uygula
        setTimeout(function () {
          tile.classList.remove('flip');
          tile.dataset.state = evaluation[i];
          tile.classList.add(evaluation[i]);
          tile.classList.add('flip-out');

          // Flip out bitti
          setTimeout(function () {
            tile.classList.remove('flip-out');
            completed++;
            if (completed === total && onComplete) {
              onComplete();
            }
          }, 250);
        }, 250);
      }, i * 300);
    });
  },

  shakeRow: function (row) {
    var tiles = this.tiles[row];
    tiles.forEach(function (tile) {
      tile.classList.remove('shake');
      // Force reflow
      void tile.offsetWidth;
      tile.classList.add('shake');
      tile.addEventListener('animationend', function handler() {
        tile.classList.remove('shake');
        tile.removeEventListener('animationend', handler);
      });
    });
  },

  bounceRow: function (row) {
    var tiles = this.tiles[row];
    tiles.forEach(function (tile, i) {
      setTimeout(function () {
        tile.classList.add('bounce');
        tile.addEventListener('animationend', function handler() {
          tile.classList.remove('bounce');
          tile.removeEventListener('animationend', handler);
        });
      }, i * 100);
    });
  },

  clearBoard: function () {
    this.tiles = [];
    var board = document.getElementById('board');
    board.innerHTML = '';
  }
};
