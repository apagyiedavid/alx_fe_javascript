document.addEventListener("DOMContentLoaded", () => {
  // DOM references
  const quoteTextEl      = document.getElementById("quoteText");
  const quoteCategoryEl  = document.getElementById("quoteCategory");
  const randomQuoteBtn   = document.getElementById("randomQuoteBtn");
  const newQuoteText     = document.getElementById("newQuoteText");
  const newQuoteCat      = document.getElementById("newQuoteCategory");
  const addQuoteBtn      = document.getElementById("addQuoteBtn");
  const exportBtn        = document.getElementById("exportBtn");
  const importFileEl     = document.getElementById("importFile");
  const feedbackEl       = document.getElementById("feedback");
  const categoryFilterEl = document.getElementById("categoryFilter");
  const syncBtn          = document.getElementById("syncBtn"); // if you added this

  // Storage keys
  const STORAGE_KEY        = "quotesArray";
  const STORAGE_FILTER_KEY = "lastSelectedCategory";

  // Simulated server URL
  const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Using as simulation

  // The quotes array
  let quotes = [];

  /*** WEB STORAGE & FILTERING FUNCTIONS ***/
  function loadQuotesFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          quotes = parsed;
        }
      } catch (err) {
        console.error("Error parsing stored quotes:", err);
      }
    }
  }

  function saveQuotesToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  }

  function populateCategories() {
    const categories = Array.from(new Set(quotes.map(q => q.category)));
    categoryFilterEl.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value     = cat;
      opt.textContent = cat;
      categoryFilterEl.appendChild(opt);
    });
    const last = localStorage.getItem(STORAGE_FILTER_KEY);
    if (last && (last === "all" || categories.includes(last))) {
      categoryFilterEl.value = last;
    } else {
      categoryFilterEl.value = "all";
    }
  }

  function filterQuotes() {
    const selected = categoryFilterEl.value;
    localStorage.setItem(STORAGE_FILTER_KEY, selected);

    const filtered = selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

    if (filtered.length === 0) {
      quoteTextEl.textContent     = "No quotes found for this category.";
      quoteCategoryEl.textContent = "";
    } else {
      const idx = Math.floor(Math.random() * filtered.length);
      const q   = filtered[idx];
      quoteTextEl.textContent     = `"${q.text}"`;
      quoteCategoryEl.textContent = `— Category: ${q.category}`;
    }
    feedbackEl.textContent = "";
  }

  /*** Quote Display & Add ***/
  function showRandomQuote() {
    filterQuotes();
  }

  function addQuote() {
    const text     = newQuoteText.value.trim();
    const category = newQuoteCat.value.trim();
    if (text === "" || category === "") {
      feedbackEl.style.color   = "red";
      feedbackEl.textContent   = "Please fill in both quote text and category.";
      return;
    }
    quotes.push({ text: text, category: category });
    saveQuotesToStorage();
    populateCategories();

    newQuoteText.value = "";
    newQuoteCat.value  = "";

    feedbackEl.style.color   = "green";
    feedbackEl.textContent   = "Quote added and categories updated!";
    filterQuotes();
  }

  /*** Import/Export JSON ***/
  function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob    = new Blob([dataStr], { type: "application/json" });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement("a");
    a.href        = url;
    a.download    = "quotes_export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    feedbackEl.style.color   = "green";
    feedbackEl.textContent   = "Quotes exported!";
  }

  function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) {
          throw new Error("JSON is not array");
        }
        imported.forEach(obj => {
          if (obj.text && typeof obj.category === "string") {
            quotes.push({ text: obj.text, category: obj.category });
          }
        });
        saveQuotesToStorage();
        populateCategories();
        feedbackEl.style.color   = "green";
        feedbackEl.textContent   = "Quotes imported successfully!";
        filterQuotes();
      } catch (err) {
        feedbackEl.style.color   = "red";
        feedbackEl.textContent   = "Import failed: invalid JSON.";
        console.error("Import error:", err);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  /*** SIMULATED SERVER SYNC & CONFLICT RESOLUTION ***/
  async function fetchFromServer() {
    try {
      const response = await fetch(SERVER_URL);
      const serverData = await response.json();
      // Convert server data into quotes format
      const serverQuotes = serverData.slice(0, 5).map(item => ({
        text:     item.title || item.body || "",
        category: "Server"
      }));
      handleServerData(serverQuotes);
    } catch (err) {
      console.error("Error fetching from server:", err);
    }
  }

  function handleServerData(serverQuotes) {
    let conflicts = 0;
    const localArr = [...quotes];
    serverQuotes.forEach(sq => {
      const exists = localArr.some(lq => lq.text === sq.text);
      if (!exists) {
        localArr.push(sq);
        conflicts++;
      }
    });
    if (conflicts > 0) {
      quotes = localArr;
      saveQuotesToStorage();
      populateCategories();
      filterQuotes();
      alert(`${conflicts} new quote(s) synced from the server.`);
    }
  }

  /*** Event Listeners ***/
  categoryFilterEl.addEventListener("change", filterQuotes);
  randomQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);
  exportBtn.addEventListener("click", exportQuotes);
  importFileEl.addEventListener("change", importFromJsonFile);
  if (syncBtn) {
    syncBtn.addEventListener("click", fetchFromServer);
  }

  // Periodic sync every 60 seconds
  setInterval(fetchFromServer, 60000);

  /*** Initialization ***/
  loadQuotesFromStorage();
  if (quotes.length === 0) {
    quotes = [
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "The purpose of our lives is to be happy.",                   category: "Philosophy" },
      { text: "Get busy living or get busy dying.",                          category: "Motivation" }
    ];
    saveQuotesToStorage();
  }
  populateCategories();
  filterQuotes();
});
