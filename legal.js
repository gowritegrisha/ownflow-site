/*
 * Renders the aviso legal owner rows from the JSON block #aviso-legal in
 * legal.html. That block is the only copy of the owner details. Edit it, not
 * this file. While a required field is empty, or the JSON is invalid, the page
 * adds a "Pendiente" row, and `python3 website/check-site.py --publish` fails.
 * The correo uses the same address rule as the support address (contact.js).
 */
const AVISO_FIELDS = [
  { key: "nombre", label: "Nombre y apellidos", required: true },
  { key: "nif", label: "NIF o NIE", required: true },
  { key: "domicilio", label: "Domicilio a efectos de notificaciones", required: true },
  { key: "correo", label: "Correo electrónico", required: true },
  { key: "registro", label: "Datos registrales", required: false },
];

function avisoData() {
  const block = document.getElementById("aviso-legal");
  if (!block) return null;
  try {
    const data = JSON.parse(block.textContent);
    return data && typeof data === "object" && !Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

function avisoValue(data, key) {
  const raw = data ? data[key] : null;
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (value === "") return null;
  if (key === "correo") return typeof supportAddress === "function" ? supportAddress(value) : null;
  return value;
}

function avisoRow(label, value, mail) {
  const row = document.createElement("div");
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  if (mail) {
    const a = document.createElement("a");
    a.href = `mailto:${value}`;
    a.textContent = value;
    dd.appendChild(a);
  } else {
    dd.textContent = value;
  }
  row.append(dt, dd);
  return row;
}

function renderAviso() {
  const list = document.getElementById("titular");
  if (!list) return;
  const data = avisoData();
  let missing = data === null;
  AVISO_FIELDS.forEach((field) => {
    const value = avisoValue(data, field.key);
    if (value === null) {
      if (field.required) missing = true;
      return;
    }
    list.appendChild(avisoRow(field.label, value, field.key === "correo"));
  });
  if (missing) list.appendChild(avisoRow("Datos del titular", "Pendiente", false));
}

renderAviso();
