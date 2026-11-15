// Meetings page: marks the walkthrough tab for the step in view.
// Plain script, no third-party code. Without it the three steps still read in order.
(function () {
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
