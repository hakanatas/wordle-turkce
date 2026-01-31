window.WordleTR = window.WordleTR || {};

window.WordleTR.Theme = {
  init: function () {
    var saved = localStorage.getItem('wordleTR_theme') || 'light';
    this.apply(saved);

    var toggle = document.getElementById('toggle-theme');
    if (toggle) {
      toggle.checked = saved === 'dark';
      toggle.addEventListener('change', function () {
        this.toggle();
      }.bind(this));
    }
  },

  toggle: function () {
    var current = document.documentElement.dataset.theme;
    var next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
    localStorage.setItem('wordleTR_theme', next);

    var toggle = document.getElementById('toggle-theme');
    if (toggle) {
      toggle.checked = next === 'dark';
    }
  },

  apply: function (theme) {
    document.documentElement.dataset.theme = theme;
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        'content',
        theme === 'dark' ? '#121213' : '#6aaa64'
      );
    }
  }
};
