(function () {
    document.getElementById('pg-tour-btn-screen')?.addEventListener('click', function () {
        (window.feedBackTour || window.slopsmithTour)?.start('player_guide');
    });
})();
