// Meetings page: header pill, walkthrough tabs, reveal on scroll, mobile menu.
// Plain script, no third-party code. Without it the page still reads top to bottom.
(function () {
  var body = document.body;
  var steps = Array.prototype.slice.call(document.querySelectorAll(".mt-step"));
  var links = document.querySelectorAll(".mt-tabs a");
  var menu = document.querySelector(".nav-menu");
  var ticking = false;

  function mark(id) {
    links.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var grid = document.querySelector(".mt-walk-grid");
  var panel = document.querySelector(".mt-steps");
  var wide = window.matchMedia("(min-width: 56rem) and (min-height: 640px)");
  var STICKY_TOP = 96;

  // Wide windows: one sticky panel that swaps as you scroll through the section.
  function stacked() {
    return body.classList.contains("mt-js") && wide.matches && grid && panel;
  }

  function span() {
    return grid.offsetHeight - panel.offsetHeight;
  }

  function stepIndex() {
    var progress = (STICKY_TOP - grid.getBoundingClientRect().top) / span();
    progress = Math.max(0, Math.min(1, progress));
    return Math.min(steps.length - 1, Math.floor(progress * steps.length));
  }

  function sync() {
    ticking = false;
    body.classList.toggle("scrolled", window.scrollY > 40);
    if (!steps.length) return;
    var current;
    if (stacked()) {
      var index = stepIndex();
      steps.forEach(function (step, i) {
        step.classList.toggle("on", i === index);
      });
      current = steps[index].id;
    } else {
      // Narrow windows: the last card whose top has passed a line 40% down.
      var line = window.innerHeight * 0.4;
      current = steps[0].id;
      steps.forEach(function (step) {
        if (step.getBoundingClientRect().top <= line) current = step.id;
      });
    }
    mark(current);
  }

  // In the stacked layout a tab scrolls to its share of the section.
  links.forEach(function (link, i) {
    link.addEventListener("click", function (event) {
      if (!stacked()) return;
      event.preventDefault();
      var top = window.scrollY + grid.getBoundingClientRect().top - STICKY_TOP;
      window.scrollTo({ top: top + (span() * (i + 0.5)) / steps.length });
    });
  });

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(sync);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // Reveal blocks as they come into view. The class only hides them once the script runs.
  var reveal = document.querySelectorAll("[data-reveal]");
  if (reveal.length && "IntersectionObserver" in window) {
    body.classList.add("mt-js");
    var seen = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            seen.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    reveal.forEach(function (el) {
      seen.observe(el);
    });
  }

  sync();

  // The mobile menu closes on Escape, on a click outside, and after a link.
  if (menu) {
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.open) {
        menu.open = false;
        menu.querySelector("summary").focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (menu.open && !menu.contains(event.target)) menu.open = false;
    });
    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) menu.open = false;
    });
  }
})();
