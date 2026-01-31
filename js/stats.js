window.WordleTR = window.WordleTR || {};

window.WordleTR.Stats = {
  STORAGE_KEY: 'wordleTR_stats',
  data: null,

  init: function () {
    this.load();
  },

  getDefault: function () {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    };
  },

  load: function () {
    try {
      var stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
      } else {
        this.data = this.getDefault();
      }
    } catch (e) {
      this.data = this.getDefault();
    }
  },

  save: function () {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      // localStorage dolu veya erisim yok
    }
  },

  recordWin: function (guessCount) {
    this.data.gamesPlayed++;
    this.data.gamesWon++;
    this.data.currentStreak++;
    if (this.data.currentStreak > this.data.maxStreak) {
      this.data.maxStreak = this.data.currentStreak;
    }
    if (this.data.guessDistribution[guessCount] !== undefined) {
      this.data.guessDistribution[guessCount]++;
    }
    this.save();
  },

  recordLoss: function () {
    this.data.gamesPlayed++;
    this.data.currentStreak = 0;
    this.save();
  },

  getWinPercentage: function () {
    if (this.data.gamesPlayed === 0) return 0;
    return Math.round((this.data.gamesWon / this.data.gamesPlayed) * 100);
  },

  renderStatsModal: function () {
    // Ozet sayilar
    var statPlayed = document.getElementById('stat-played');
    var statWinPct = document.getElementById('stat-win-pct');
    var statCurrentStreak = document.getElementById('stat-current-streak');
    var statMaxStreak = document.getElementById('stat-max-streak');

    if (statPlayed) statPlayed.textContent = this.data.gamesPlayed;
    if (statWinPct) statWinPct.textContent = this.getWinPercentage();
    if (statCurrentStreak) statCurrentStreak.textContent = this.data.currentStreak;
    if (statMaxStreak) statMaxStreak.textContent = this.data.maxStreak;

    // Tahmin dagilimi cubuk grafigi
    var dist = this.data.guessDistribution;
    var maxVal = 0;
    for (var key in dist) {
      if (dist[key] > maxVal) maxVal = dist[key];
    }

    var Game = window.WordleTR.Game;
    var lastGuess = Game && Game.isGameOver && !Game.evaluations.every(function (e) {
      return e.some(function (s) { return s !== 'correct'; });
    }) ? Game.evaluations.length : -1;

    for (var g = 1; g <= 6; g++) {
      var bar = document.querySelector('.dist-bar[data-guess="' + g + '"]');
      if (!bar) continue;

      var val = dist[g] || 0;
      bar.textContent = val;

      var pct = maxVal > 0 ? Math.max((val / maxVal) * 100, 8) : 8;
      bar.style.width = pct + '%';

      bar.classList.remove('highlight');
      if (g === lastGuess) {
        bar.classList.add('highlight');
      }
    }
  },

  generateShareText: function () {
    var Game = window.WordleTR.Game;
    if (!Game) return '';

    var emojiMap = {
      'correct': '\u{1F7E9}',
      'present': '\u{1F7E8}',
      'absent': '\u2B1B'
    };

    var attempts = Game.isGameOver && Game.evaluations.length <= 6
      ? Game.evaluations.length
      : 'X';

    var isWin = Game.evaluations.length > 0 &&
      Game.evaluations[Game.evaluations.length - 1].every(function (e) {
        return e === 'correct';
      });

    if (!isWin) attempts = 'X';

    var text = 'Wordle Turkce (' + Game.wordLength + ' harf) ' + attempts + '/6\n\n';

    for (var i = 0; i < Game.evaluations.length; i++) {
      var row = Game.evaluations[i];
      text += row.map(function (state) { return emojiMap[state]; }).join('') + '\n';
    }

    return text.trim();
  },

  shareResults: function () {
    var text = this.generateShareText();
    if (!text) return;

    if (navigator.share) {
      navigator.share({ text: text }).catch(function () {
        // Kullanici iptal etti
      });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        window.WordleTR.App.showToast('Panoya kopyalandi!', 2000);
      }).catch(function () {
        window.WordleTR.App.showToast('Kopyalanamadi', 2000);
      });
    } else {
      // Fallback
      window.WordleTR.App.showToast('Paylasim desteklenmiyor', 2000);
    }
  }
};
