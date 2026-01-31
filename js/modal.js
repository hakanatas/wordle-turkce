window.WordleTR = window.WordleTR || {};

window.WordleTR.Modal = {
  init: function () {
    // Overlay'e tiklayinca kapat
    var overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(function (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          this.close(overlay.id);
        }
      }.bind(this));
    }.bind(this));

    // X butonuna tiklayinca kapat
    var closeBtns = document.querySelectorAll('.modal-close');
    closeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var modal = btn.closest('.modal-overlay');
        if (modal) {
          this.close(modal.id);
        }
      }.bind(this));
    }.bind(this));

    // Escape ile kapat
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        this.closeAll();
      }
    }.bind(this));

    // Header butonlari
    var btnHelp = document.getElementById('btn-help');
    var btnStats = document.getElementById('btn-stats');
    var btnSettings = document.getElementById('btn-settings');

    if (btnHelp) {
      btnHelp.addEventListener('click', function () {
        this.open('modal-help');
      }.bind(this));
    }

    if (btnStats) {
      btnStats.addEventListener('click', function () {
        if (window.WordleTR.Stats) {
          window.WordleTR.Stats.renderStatsModal();
        }
        this.open('modal-stats');
      }.bind(this));
    }

    if (btnSettings) {
      btnSettings.addEventListener('click', function () {
        this.open('modal-settings');
      }.bind(this));
    }
  },

  open: function (modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
    }
  },

  close: function (modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
    }
  },

  closeAll: function () {
    var modals = document.querySelectorAll('.modal-overlay.active');
    modals.forEach(function (m) {
      m.classList.remove('active');
    });
  }
};
