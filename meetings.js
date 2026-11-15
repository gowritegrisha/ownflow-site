// Meetings page: the header pill gains a box once you scroll, and the
// walkthrough tab marks the step in view. Plain script, no third-party code.
// Without it the page still reads top to bottom.
(function () {
  var body = document.body;
  function onScroll() {
    body.classList.toggle("scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var links = document.querySelectorAll(".mt-tabs a");
  var steps = document.querySelectorAll(".mt-step");
  if (!links.length || !steps.length || !("IntersectionObserver" in window)) return;

  function mark(id) {
    links.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) mark(entry.target.id);
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );
  steps.forEach(function (step) {
    observer.observe(step);
  });
})();
