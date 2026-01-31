window.WordleTR = window.WordleTR || {};

window.WordleTR.Game = {
  targetWord: '',
  currentRow: 0,
  currentCol: 0,
  currentGuess: [],
  maxGuesses: 6,
  wordLength: 5,
  isGameOver: false,
  isRevealing: false,
  evaluations: [],

  WIN_MESSAGES: ['Dahiyane!', 'Muhtesem!', 'Harika!', 'Guzel!', 'Iyi!', 'Zar zor!'],

  init: function (wordLength) {
    this.wordLength = wordLength || 5;
    this.reset();
  },

  reset: function () {
    this.currentRow = 0;
    this.currentCol = 0;
    this.currentGuess = [];
    this.isGameOver = false;
    this.isRevealing = false;
    this.evaluations = [];

    var Dict = window.WordleTR.Dictionary;
    this.targetWord = Dict.getRandomWord(this.wordLength);

    var Board = window.WordleTR.Board;
    Board.init(this.wordLength);

    var Keyboard = window.WordleTR.Keyboard;
    Keyboard.resetKeys();
  },

  normalizeLetter: function (letter) {
    return letter.toLocaleLowerCase('tr-TR');
  },

  addLetter: function (letter) {
    if (this.isGameOver || this.isRevealing) return;
    if (this.currentCol >= this.wordLength) return;

    var normalized = this.normalizeLetter(letter);
    this.currentGuess.push(normalized);

    var Board = window.WordleTR.Board;
    Board.setTileLetter(this.currentRow, this.currentCol, normalized);
    this.currentCol++;
  },

  removeLetter: function () {
    if (this.isGameOver || this.isRevealing) return;
    if (this.currentCol <= 0) return;

    this.currentCol--;
    this.currentGuess.pop();

    var Board = window.WordleTR.Board;
    Board.clearTileLetter(this.currentRow, this.currentCol);
  },

  submitGuess: function () {
    if (this.isGameOver || this.isRevealing) return;

    // Uzunluk kontrolu
    if (this.currentGuess.length !== this.wordLength) {
      window.WordleTR.App.showToast('Yeterli harf yok');
      window.WordleTR.Board.shakeRow(this.currentRow);
      return;
    }

    var guessWord = this.currentGuess.join('');

    // Sozluk kontrolu
    var Dict = window.WordleTR.Dictionary;
    if (!Dict.isValidWord(guessWord)) {
      window.WordleTR.App.showToast('Kelime listede yok');
      window.WordleTR.Board.shakeRow(this.currentRow);
      return;
    }

    // Degerlendirme
    var guess = this.currentGuess.slice();
    var target = this.targetWord.split('');
    var evaluation = this.evaluateGuess(guess, target);
    this.evaluations.push(evaluation);

    // Animasyonu baslat
    this.isRevealing = true;
    var self = this;
    var Board = window.WordleTR.Board;
    var Keyboard = window.WordleTR.Keyboard;
    var currentRow = this.currentRow;

    Board.revealRow(currentRow, evaluation, function () {
      // Klavye durumunu guncelle
      for (var i = 0; i < guess.length; i++) {
        Keyboard.updateKeyState(guess[i], evaluation[i]);
      }

      self.isRevealing = false;

      // Kazanma kontrolu
      var isWin = evaluation.every(function (e) { return e === 'correct'; });
      if (isWin) {
        self.handleWin(currentRow);
        return;
      }

      // Kaybetme kontrolu
      self.currentRow++;
      if (self.currentRow >= self.maxGuesses) {
        self.handleLoss();
        return;
      }

      // Sonraki satira gec
      self.currentCol = 0;
      self.currentGuess = [];
    });
  },

  evaluateGuess: function (guess, target) {
    var result = new Array(guess.length).fill('absent');
    var targetLetterCount = {};

    // Hedef kelimenin harf frekans haritasi
    for (var i = 0; i < target.length; i++) {
      var letter = target[i];
      targetLetterCount[letter] = (targetLetterCount[letter] || 0) + 1;
    }

    // GECIS 1: Dogru pozisyon (yesil)
    for (var i = 0; i < guess.length; i++) {
      if (guess[i] === target[i]) {
        result[i] = 'correct';
        targetLetterCount[guess[i]]--;
      }
    }

    // GECIS 2: Yanlis pozisyon (sari)
    for (var i = 0; i < guess.length; i++) {
      if (result[i] === 'correct') continue;
      if (targetLetterCount[guess[i]] && targetLetterCount[guess[i]] > 0) {
        result[i] = 'present';
        targetLetterCount[guess[i]]--;
      }
    }

    return result;
  },

  handleWin: function (row) {
    this.isGameOver = true;
    var message = this.WIN_MESSAGES[row] || 'Tebrikler!';

    var self = this;
    setTimeout(function () {
      window.WordleTR.Board.bounceRow(row);
    }, 200);

    window.WordleTR.App.showToast(message, 2000);

    // Istatistikleri kaydet
    if (window.WordleTR.Stats) {
      window.WordleTR.Stats.recordWin(row + 1);
    }

    // Istatistik modalini goster
    setTimeout(function () {
      if (window.WordleTR.Stats) {
        window.WordleTR.Stats.renderStatsModal();
      }
      window.WordleTR.Modal.open('modal-stats');
    }, 2500);
  },

  handleLoss: function () {
    this.isGameOver = true;
    var target = this.targetWord.toLocaleUpperCase('tr-TR');
    window.WordleTR.App.showToast('Kelime: ' + target, 4000);

    // Istatistikleri kaydet
    if (window.WordleTR.Stats) {
      window.WordleTR.Stats.recordLoss();
    }

    // Istatistik modalini goster
    setTimeout(function () {
      if (window.WordleTR.Stats) {
        window.WordleTR.Stats.renderStatsModal();
      }
      window.WordleTR.Modal.open('modal-stats');
    }, 3000);
  }
};
