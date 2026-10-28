(function () {
  "use strict";

  var header = document.querySelector(".navigation");
  if (!header) return;

  var panel = header.querySelector("#navigation");
  var menuButton = header.querySelector("[data-menu-toggle]");
  var backdrop = header.querySelector("[data-menu-backdrop]");
  if (!panel || !menuButton || !backdrop) return;

  var desktop = window.matchMedia("(min-width: 992px)");
  var submenuButtons = panel.querySelectorAll("[data-nav-submenu-toggle]");

  function closeSubmenus(except) {
    submenuButtons.forEach(function (button) {
      var item = button.closest(".nav-item.dropdown");
      if (!item || item === except) return;
      item.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    });
  }

  function setSubmenu(button, open) {
    var item = button.closest(".nav-item.dropdown");
    if (!item) return;
    if (open) closeSubmenus(item);
    item.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function setMenuOpen(open, restoreFocus) {
    if (desktop.matches && open) return;

    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    panel.inert = !(open || desktop.matches);
    panel.setAttribute("aria-hidden", panel.inert ? "true" : "false");

    if (open) {
      var firstField = panel.querySelector(".primary-navigation__mobile-search input");
      if (firstField) firstField.focus();
      return;
    }

    closeSubmenus();
    if (restoreFocus) menuButton.focus();
  }

  menuButton.addEventListener("click", function () {
    setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true", false);
  });

  backdrop.addEventListener("click", function () {
    setMenuOpen(false, true);
  });

  submenuButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var item = button.closest(".nav-item.dropdown");
      setSubmenu(button, !item.classList.contains("is-open"));
    });
  });

  panel.addEventListener("pointerover", function (event) {
    if (!desktop.matches) return;
    var item = event.target.closest(".nav-item.dropdown");
    if (!item || !panel.contains(item)) return;
    var button = item.querySelector("[data-nav-submenu-toggle]");
    if (button) button.setAttribute("aria-expanded", "true");
  });

  panel.addEventListener("pointerout", function (event) {
    if (!desktop.matches) return;
    var item = event.target.closest(".nav-item.dropdown");
    if (!item || item.contains(event.relatedTarget) || item.classList.contains("is-open")) return;
    var button = item.querySelector("[data-nav-submenu-toggle]");
    if (button && !item.contains(document.activeElement)) button.setAttribute("aria-expanded", "false");
  });

  panel.addEventListener("focusin", function (event) {
    var item = event.target.closest(".nav-item.dropdown");
    if (!item) return;
    var button = item.querySelector("[data-nav-submenu-toggle]");
    if (button) button.setAttribute("aria-expanded", "true");
  });

  panel.addEventListener("focusout", function (event) {
    var item = event.target.closest(".nav-item.dropdown");
    if (!item || item.classList.contains("is-open")) return;
    window.setTimeout(function () {
      if (item.contains(document.activeElement) || item.matches(":hover")) return;
      var button = item.querySelector("[data-nav-submenu-toggle]");
      if (button) button.setAttribute("aria-expanded", "false");
    }, 0);
  });

  panel.addEventListener("click", function (event) {
    var link = event.target.closest("a[href]");
    if (link && !desktop.matches) setMenuOpen(false, false);
  });

  document.addEventListener("click", function (event) {
    if (!desktop.matches || header.contains(event.target)) return;
    closeSubmenus();
  });

  document.addEventListener("keydown", function (event) {
    var openButton = panel.querySelector('[data-nav-submenu-toggle][aria-expanded="true"]');

    if (event.key === "Escape") {
      if (openButton) {
        setSubmenu(openButton, false);
        openButton.focus();
        event.preventDefault();
        return;
      }
      if (!desktop.matches && header.classList.contains("menu-open")) {
        setMenuOpen(false, true);
        event.preventDefault();
      }
      return;
    }

    if (event.key !== "Tab" || desktop.matches || !header.classList.contains("menu-open")) return;

    var focusables = Array.prototype.slice.call(
      panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled])')
    ).filter(function (element) {
      return element.getClientRects().length > 0;
    });
    if (!focusables.length) return;

    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === menuButton)) {
      event.preventDefault();
      if (document.activeElement === first) menuButton.focus();
      else last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === menuButton)) {
      event.preventDefault();
      if (document.activeElement === menuButton) first.focus();
      else first.focus();
    }
  });

  function handleBreakpointChange() {
    if (desktop.matches) {
      setMenuOpen(false, false);
      return;
    }

    var closed = !header.classList.contains("menu-open");
    panel.inert = closed;
    panel.setAttribute("aria-hidden", closed ? "true" : "false");
  }

  if (desktop.addEventListener) desktop.addEventListener("change", handleBreakpointChange);
  else desktop.addListener(handleBreakpointChange);

  panel.inert = !desktop.matches;
  panel.setAttribute("aria-hidden", desktop.matches ? "false" : "true");
})();
