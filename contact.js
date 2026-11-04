/*
 * The support address and the help URL live only in support.json, which the
 * Mac app also bundles (jg-1). Edit that file, not this one.
 * With no valid address the mail buttons are hidden and the page says "Support address: not set yet".
 */
const SUPPORT_UNSET = "Support address: not set yet";

/* Same rule as supportAddress in apps/desktop/src/diagnostics/support.ts. */
function supportAddress(raw) {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (value === "" || value.length > 254) return null;
  const at = value.indexOf("@");
  if (at <= 0 || at !== value.lastIndexOf("@")) return null;
  const local = value.slice(0, at);
  const labels = value.slice(at + 1).split(".");
  if (local.length > 64 || !/^[A-Za-z0-9_+-]+(?:\.[A-Za-z0-9_+-]+)*$/.test(local)) return null;
  if (labels.length < 2) return null;
  if (!labels.every((l) => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(l))) return null;
  if (!/^[A-Za-z]{2,63}$/.test(labels[labels.length - 1])) return null;
  return value;
}

function applySupport(address) {
  document.querySelectorAll("a[data-subject]").forEach((el) => {
    if (!address) {
      el.hidden = true;
      el.removeAttribute("href");
      return;
    }
    const subject = el.getAttribute("data-subject") || "";
    el.href = `mailto:${address}?subject=${encodeURIComponent(subject)}`;
    el.hidden = false;
  });
  document.querySelectorAll("[data-address]").forEach((el) => {
    el.textContent = address || SUPPORT_UNSET;
  });
}

applySupport(null);
fetch("support.json", { cache: "no-store" })
  .then((res) => (res.ok ? res.json() : null))
  .then((config) => applySupport(supportAddress(config && config.supportEmail)))
  .catch(() => applySupport(null));
