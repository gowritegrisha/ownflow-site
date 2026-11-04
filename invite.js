/*
 * The invite form on download.html (jg-15). It posts one address to the jg-14
 * route POST /api/v1/invite-requests.
 *
 * Off by default. The switch is data-invite-endpoint on the form. While it is
 * empty or not an https address, the form stays hidden, nothing is sent, and
 * the mail button stays. It must be the full https address ending
 * /invite-requests. Set it only after the privacy notice with the invite
 * paragraph is accepted and published (see website/README.md).
 *
 * The route answers 202 for every outcome, so any 2xx shows the same sentence
 * from the page. A filled honeypot (the hidden "website" field) shows it too
 * and sends nothing. No answer at all (offline, a timeout, or a non-2xx such
 * as the 404 while the server switch is off) shows a retry line that says
 * nothing about the server. Nothing here logs the address.
 */
const INVITE_INVALID = "Enter an email address, like name@example.com.";
const INVITE_RETRY = "Your request didn't send. Check your connection, or try again later.";
const INVITE_TIMEOUT_MS = 15000;

/* Same rule as normalizeEmail in packages/shared/src/auth.ts. */
function inviteAddress(raw) {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (value === "" || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
  return value;
}

function inviteEndpoint(raw) {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return null;
  if (!url.pathname.endsWith("/invite-requests")) return null;
  return url.href;
}

function setupInvite(form) {
  const endpoint = inviteEndpoint(form.getAttribute("data-invite-endpoint"));
  const email = form.querySelector('input[name="email"]');
  const trap = form.querySelector('input[name="website"]');
  const button = form.querySelector('button[type="submit"]');
  const error = form.querySelector("[data-invite-error]");
  const done = document.querySelector("[data-invite-done]");
  if (!endpoint || !email || !trap || !button || !error || !done) return;
  let sending = false;
  let pending = 0;

  function clearError() {
    clearTimeout(pending);
    error.textContent = "";
    error.hidden = true;
  }

  // Empty first, then the text a moment later, so a screen reader announces
  // the same line again on a second failed try.
  function showError(text) {
    clearError();
    error.hidden = false;
    pending = setTimeout(() => {
      error.textContent = text;
    }, 50);
  }

  function finish() {
    form.hidden = true;
    done.hidden = false;
    done.focus();
  }

  email.addEventListener("input", () => {
    if (email.getAttribute("aria-invalid") !== "true") return;
    email.removeAttribute("aria-invalid");
    clearError();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (sending) return;
    clearError();
    email.removeAttribute("aria-invalid");
    if (trap.value.trim() !== "") {
      finish();
      return;
    }
    const address = inviteAddress(email.value);
    if (!address) {
      email.setAttribute("aria-invalid", "true");
      showError(INVITE_INVALID);
      email.focus();
      return;
    }
    // aria-disabled, not disabled, so focus stays on the button while it sends.
    sending = true;
    button.setAttribute("aria-disabled", "true");
    form.setAttribute("aria-busy", "true");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), INVITE_TIMEOUT_MS);
    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: address, website: trap.value }),
      credentials: "omit",
      cache: "no-store",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("not sent");
        finish();
      })
      .catch(() => showError(INVITE_RETRY))
      .finally(() => {
        clearTimeout(timer);
        sending = false;
        button.removeAttribute("aria-disabled");
        form.removeAttribute("aria-busy");
      });
  });

  form.hidden = false;
  document.querySelectorAll("[data-invite-fallback]").forEach((el) => {
    el.hidden = true;
  });
}

document.querySelectorAll("form[data-invite-endpoint]").forEach(setupInvite);
