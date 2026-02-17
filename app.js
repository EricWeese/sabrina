const northboundEl = document.getElementById("northbound");
const southboundEl = document.getElementById("southbound");
const alertEl = document.getElementById("alert");
const stationEl = document.getElementById("station-name");
const clockEl = document.getElementById("clock");
const STORAGE_KEY = "marta-board-data";

function badgeClass(line) {
  return String(line).toLowerCase().includes("gold") ? "badge--gold" : "badge--red";
}

function createRow(train) {
  const row = document.createElement("article");
  row.className = "arrival";
  row.innerHTML = `
    <span class="badge ${badgeClass(train.line)}">${train.line}</span>
    <span>${train.destination}</span>
    <span class="min">${train.minutes} min</span>
  `;
  return row;
}

function renderDirection(target, trains) {
  target.innerHTML = "";
  trains.forEach((train) => target.appendChild(createRow(train)));
}

async function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }

  const response = await fetch("./board-data.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load board data (${response.status})`);
  }
  return response.json();
}

function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

async function render() {
  const data = await loadData();
  stationEl.textContent = data.stationName;
  alertEl.textContent = data.alert;
  renderDirection(northboundEl, data.northbound);
  renderDirection(southboundEl, data.southbound);
}

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    render();
  }
});

updateClock();
setInterval(updateClock, 1000);
render();
setInterval(render, 30000);
