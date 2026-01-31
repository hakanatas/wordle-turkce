window.WordleTR = window.WordleTR || {};

window.WordleTR.Keyboard = {
  TURKISH_LETTERS: 'abcçdefgğhıijklmnoöprsştuüvyz',
  STATE_PRIORITY: { 'correct': 3, 'present': 2, 'absent': 1 },

  init: function () {
    // Ekran klavyesi - event delegation
    var keyboard = document.getElementById('keyboard');
    keyboard.addEventListener('click', function (e) {
      var keyEl = e.target.closest('.key');
      if (!keyEl) return;

      var value = keyEl.dataset.key;
      var game = window.WordleTR.Game;
      if (!game) return;

      if (value === 'Enter') {
        game.submitGuess();
      } else if (value === 'Backspace') {
        game.removeLetter();
      } else {
        game.addLetter(value);
      }
    });

    // Fiziksel klavye
    document.addEventListener('keydown', function (e) {
      // Modal aciksa klavye girisini engelle
      var activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) return;

      if (e.ctrlKey || e.metaKey || e.altKey) return;

      var game = window.WordleTR.Game;
      if (!game) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        game.submitGuess();
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        game.removeLetter();
        return;
      }

      var normalized = e.key.toLocaleLowerCase('tr-TR');
      if (this.TURKISH_LETTERS.indexOf(normalized) !== -1 && normalized.length === 1) {
        e.preventDefault();
        game.addLetter(normalized);
      }
    }.bind(this));
  },

  updateKeyState: function (letter, newState) {
    var keyEl = document.querySelector('.key[data-key="' + letter + '"]');
    if (!keyEl) return;

    var currentState = keyEl.dataset.state || '';
    var currentPriority = this.STATE_PRIORITY[currentState] || 0;
    var newPriority = this.STATE_PRIORITY[newState] || 0;

    if (newPriority > currentPriority) {
      keyEl.dataset.state = newState;
      // Onceki durum siniflarini kaldir
      keyEl.classList.remove('key-correct', 'key-present', 'key-absent');
      keyEl.classList.add('key-' + newState);
    }
  },

  resetKeys: function () {
    var keys = document.querySelectorAll('.key');
    keys.forEach(function (key) {
      delete key.dataset.state;
      key.classList.remove('key-correct', 'key-present', 'key-absent');
    });
  }
};
