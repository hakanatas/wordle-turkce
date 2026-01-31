window.WordleTR = window.WordleTR || {};

window.WordleTR.Dictionary = {
  answers: {},
  validSets: {},

  init: function () {
    [4, 5, 6].forEach(function (len) {
      var key = 'WORDS_' + len;
      var data = window.WordleTR[key];
      if (data) {
        this.answers[len] = data.answers;
        this.validSets[len] = new Set(
          data.answers.concat(data.valid || [])
        );
      }
    }.bind(this));
  },

  getRandomWord: function (length) {
    var words = this.answers[length];
    if (!words || words.length === 0) return null;
    var index = Math.floor(Math.random() * words.length);
    return words[index];
  },

  isValidWord: function (word) {
    var length = word.length;
    var set = this.validSets[length];
    if (!set) return false;
    return set.has(word);
  }
};
