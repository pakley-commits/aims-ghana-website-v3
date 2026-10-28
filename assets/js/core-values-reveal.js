(function () {
  "use strict";

  var icons = document.querySelectorAll(".core-values .core-value-box img");
  if (!icons.length || !("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(
    function (entries, currentObserver) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-in-view");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.01,
      rootMargin: "0px 0px -4% 0px"
    }
  );

  icons.forEach(function (icon, index) {
    icon.classList.add("core-value-icon--reveal");
    icon.style.setProperty("--core-value-delay", index * 130 + "ms");
    observer.observe(icon);
  });
})();
