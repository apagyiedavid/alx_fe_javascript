// Configuration
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Step 1: Fetch Quotes from the "Server"
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const serverData = await response.json();
        
        // Simulating server-to-quote conversion
        // (JSONPlaceholder returns posts, we map them to our quote structure)
        const serverQuotes = serverData.slice(0, 5).map(post => ({
            text: post.title,
            category: "Server"
        }));

        resolveConflicts(serverQuotes);
    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}

// Step 2: Post Data to the Server (Simulation)
async function syncQuotes() {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            body: JSON.stringify(quotes),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        
        if (response.ok) {
            showSyncNotification("Quotes synced with server!");
        }
    } catch (error) {
        console.error("Sync failed:", error);
    }
}

// Step 3: Conflict Resolution Strategy
function resolveConflicts(serverQuotes) {
    let localUpdated = false;

    serverQuotes.forEach(sQuote => {
        // Check if the server quote already exists locally
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

// Step 4: UI Notification System
function showSyncNotification(message) {
    const notifyDiv = document.createElement('div');
    notifyDiv.className = 'sync-notification';
    notifyDiv.textContent = message;
    document.body.appendChild(notifyDiv);

    // Fade out after 3 seconds
    setTimeout(() => notifyDiv.remove(), 3000);
}

// Step 5: Periodic Syncing (Every 30 seconds)
setInterval(fetchQuotesFromServer, 30000);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateCategories();
    fetchQuotesFromServer(); // Initial sync
});