(function () {
  "use strict";

  var cards = document.querySelectorAll(
    ".mission-model__card, .aims-model__card"
  );
  if (!cards.length) return;

  var mobile = window.matchMedia("(max-width: 767px)");
  var updateScheduled = false;

  function updateActiveCard() {
    var viewportCenter = window.innerHeight / 2;
    var activeCard = null;
    var nearestDistance = Infinity;

    cards.forEach(function (card) {
      var bounds = card.getBoundingClientRect();
      var isVisible = bounds.bottom > 0 && bounds.top < window.innerHeight;
      var distance = Math.abs(
        (bounds.top + bounds.bottom) / 2 - viewportCenter
      );

      if (isVisible && distance < nearestDistance) {
        activeCard = card;
        nearestDistance = distance;
      }
    });

    cards.forEach(function (card) {
      card.classList.toggle("is-in-view", card === activeCard);
    });
  }

  function scheduleUpdate() {
    if (updateScheduled) return;
    updateScheduled = true;

    window.requestAnimationFrame(function () {
      updateScheduled = false;
      if (mobile.matches) updateActiveCard();
    });
  }

  function updateScrollReveal() {
    cards.forEach(function (card) {
      card.classList.remove("is-in-view");
    });

    if (mobile.matches) {
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);
      updateActiveCard();
      return;
    }

    window.removeEventListener("scroll", scheduleUpdate);
    window.removeEventListener("resize", scheduleUpdate);
  }

  mobile.addEventListener("change", updateScrollReveal);
  updateScrollReveal();
})();
