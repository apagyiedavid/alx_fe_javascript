// Configuration & State
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Stay hungry, stay foolish.", category: "Life" }
];

// --- STEP 1: UI GENERATION & CORE LOGIC ---

// Populate the dropdown with unique categories
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastFilter = localStorage.getItem('lastFilter') || 'all';
    categoryFilter.value = lastFilter;
}

// Show a random quote based on current filter
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes in this category.";
        return;
    }

    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><span>- ${randomQuote.category}</span>`;
}

// Function triggered by the dropdown
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastFilter', selectedCategory);
    showRandomQuote();
}

// Create the Add Quote Form dynamically
function createAddQuoteForm() {
    const container = document.createElement('div');
    container.style.marginTop = "20px";

    container.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="submitQuote">Add Quote</button>
    `;
    document.body.appendChild(container);

    document.getElementById('submitQuote').onclick = addQuote;
}

// Add a new quote locally and push to server
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        const newQuote = { text, category };
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        
        textInput.value = '';
        categoryInput.value = '';
        
        populateCategories();
        syncQuotes(); // Triggers the POST request with headers
        alert("Quote added!");
    }
}

// --- STEP 2: SERVER SYNCING & CONFLICT RESOLUTION ---

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const serverData = await response.json();
        
        // Mocking server data to match our schema
        const serverQuotes = serverData.slice(0, 5).map(post => ({
            text: post.title,
            category: "Server"
        }));

        resolveConflicts(serverQuotes);
    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}

// Updated syncQuotes with the specific Content-Type header
async function syncQuotes() {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            body: JSON.stringify(quotes),
            headers: { 
                'Content-Type': 'application/json; charset=UTF-8' 
            },
        });
        
        if (response.ok) {
            showSyncNotification("Quotes synced with server!");
        }
    } catch (error) {
        console.error("Sync failed:", error);
    }
}

function resolveConflicts(serverQuotes) {
    let localUpdated = false;

    serverQuotes.forEach(sQuote => {
        const exists = quotes.some(lQuote => lQuote.text === sQuote.text);
        if (!exists) {
            quotes.push(sQuote);
            localUpdated = true;
        }
    });

    if (localUpdated) {
        localStorage.setItem('quotes', JSON.stringify(quotes));
        populateCategories();
        showSyncNotification("New quotes were merged from the server.");
    }
}

function showSyncNotification(message) {
    const notifyDiv = document.createElement('div');
    notifyDiv.className = 'sync-notification';
    notifyDiv.textContent = message;
    document.body.appendChild(notifyDiv);
    setTimeout(() => notifyDiv.remove(), 3000);
}

// --- INITIALIZATION ---

setInterval(fetchQuotesFromServer, 30000);

document.addEventListener('DOMContentLoaded', () => {
    createAddQuoteForm();
    populateCategories();
    showRandomQuote();
    fetchQuotesFromServer();

    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
});