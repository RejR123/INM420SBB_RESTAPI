const RAPIDAPI_KEY = "4966589cc4msh00fbdf5d3c63f5cp1d62eejsnee73b194b9b5";

const termInput = document.getElementById("termInput");
const searchBtn = document.getElementById("searchBtn");
const clearBtn = document.getElementById("clearBtn");

const statusEl = document.getElementById("status");
const resultWrap = document.getElementById("result");

const wordTitle = document.getElementById("wordTitle");
const definitionEl = document.getElementById("definition");
const exampleEl = document.getElementById("example");

const historyList = document.getElementById("historyList");


// =======================================================
// EVENTS
// =======================================================
searchBtn.addEventListener("click", runSearch);

clearBtn.addEventListener("click", clearSearch);

termInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});

// load saved history when page opens
loadHistory();


// =======================================================
// SEARCH FUNCTION
// =======================================================
async function runSearch() {

  const term = termInput.value.trim();

  if (!term) {
    statusEl.textContent = "Type a word first.";
    resultWrap.classList.add("hidden");
    return;
  }

  statusEl.textContent = `Searching for "${term}"...`;
  resultWrap.classList.add("hidden");

  try {

    const response = await fetch(
      `https://mashape-community-urban-dictionary.p.rapidapi.com/define?term=${encodeURIComponent(term)}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "mashape-community-urban-dictionary.p.rapidapi.com",
          "x-rapidapi-key": RAPIDAPI_KEY
        }
      }
    );

    const data = await response.json();

    if (!data.list || data.list.length === 0) {
      statusEl.textContent = "No definition found.";
      return;
    }

    const top = data.list[0];

    wordTitle.textContent = top.word;
    definitionEl.textContent = cleanText(top.definition);
    exampleEl.textContent = cleanText(top.example);

    resultWrap.classList.remove("hidden");
    statusEl.textContent = "Result loaded.";

    saveToHistory(term);

  } catch (error) {
    statusEl.textContent = "Error fetching data.";
    console.error(error);
  }
}


// =======================================================
// CLEAR SEARCH
// =======================================================
function clearSearch() {

  termInput.value = "";
  wordTitle.textContent = "";
  definitionEl.textContent = "";
  exampleEl.textContent = "";

  resultWrap.classList.add("hidden");
  statusEl.textContent = "Search cleared.";
}


// =======================================================
// CLEAN TEXT
// =======================================================
function cleanText(text) {
  return text.replace(/\[|\]/g, "");
}


// =======================================================
// SEARCH HISTORY (LOCAL STORAGE)
// =======================================================
function saveToHistory(term) {

  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // remove duplicate
  history = history.filter(item => item !== term);

  // newest first
  history.unshift(term);

  // limit list
  history = history.slice(0, 8);

  localStorage.setItem("searchHistory", JSON.stringify(history));

  renderHistory();
}

function loadHistory() {
  renderHistory();
}

function renderHistory() {

  const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

  historyList.innerHTML = "";

  history.forEach(term => {

    const li = document.createElement("li");
    li.textContent = term;

    li.addEventListener("click", () => {
      termInput.value = term;
      runSearch();
    });

    historyList.appendChild(li);
  });
}


// =======================================================
// CLASSIC MATRIX RAIN
// =======================================================
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters =
  "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const chars = letters.split("");

const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

function drawMatrix() {

  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff41";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {

    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

setInterval(drawMatrix, 35);


// =======================================================
// RESIZE SUPPORT
// =======================================================
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});