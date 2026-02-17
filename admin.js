const form = document.getElementById("admin-form");
const output = document.getElementById("json-output");
const copyBtn = document.getElementById("copy-btn");
const applyBtn = document.getElementById("apply-btn");
const resetBtn = document.getElementById("reset-btn");
const STORAGE_KEY = "marta-board-data";

const baseData = await fetch("./board-data.json", { cache: "no-store" }).then((r) => r.json());
const storedData = localStorage.getItem(STORAGE_KEY);
const initialData = storedData ? JSON.parse(storedData) : baseData;

function field(label, name, value) {
  return `
    <label>
      <span>${label}</span>
      <input name="${name}" value="${value}" required />
    </label>
  `;
}

function trainFields(prefix, title, trains) {
  return `
    <section class="fieldset">
      <h3>${title}</h3>
      ${trains
        .map(
          (train, i) => `
          <h4>Train ${i + 1}</h4>
          ${field("Line", `${prefix}_${i}_line`, train.line)}
          ${field("Destination", `${prefix}_${i}_destination`, train.destination)}
          ${field("Minutes", `${prefix}_${i}_minutes`, train.minutes)}
        `
        )
        .join("")}
    </section>
  `;
}

form.innerHTML = `
  ${field("Station Name", "stationName", initialData.stationName)}
  ${field("Alert Text", "alert", initialData.alert)}
  ${trainFields("northbound", "Northbound", initialData.northbound)}
  ${trainFields("southbound", "Southbound", initialData.southbound)}
`;

function collect(prefix) {
  const trains = [];
  for (let i = 0; i < 2; i += 1) {
    trains.push({
      line: form.elements[`${prefix}_${i}_line`].value,
      destination: form.elements[`${prefix}_${i}_destination`].value,
      minutes: Number(form.elements[`${prefix}_${i}_minutes`].value)
    });
  }
  return trains;
}

function currentData() {
  return {
    stationName: form.elements.stationName.value,
    alert: form.elements.alert.value,
    northbound: collect("northbound"),
    southbound: collect("southbound")
  };
}

function refreshJson() {
  output.value = JSON.stringify(currentData(), null, 2);
}

form.addEventListener("input", refreshJson);
refreshJson();

applyBtn.addEventListener("click", () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData()));
  applyBtn.textContent = "Applied";
  setTimeout(() => {
    applyBtn.textContent = "Apply";
  }, 1200);
});

resetBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(output.value);
  copyBtn.textContent = "Copied";
  setTimeout(() => {
    copyBtn.textContent = "Copy JSON";
  }, 1200);
});
