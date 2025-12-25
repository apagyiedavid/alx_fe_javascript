// Step 1: Initial Data Structure
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Tech" },
    { text: "Stay hungry, stay foolish.", category: "Life" }
];

// Step 2: Function to Display a Random Quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Select a random index
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];

    // Clear previous content
    quoteDisplay.innerHTML = ''; 
    
    // Create elements for the quote
    const quoteText = document.createElement('p');
    quoteText.textContent = selectedQuote.text;
    
    const quoteCategory = document.createElement('span');
    quoteCategory.textContent = `Category: ${selectedQuote.category}`;

    // Append to display
    quoteDisplay.appendChild(quoteText);
    quoteDisplay.appendChild(quoteCategory);
}

// Step 3: Function to Add a New Quote to the Array
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (newQuoteText && newQuoteCategory) {
        // Add the new quote object to the array
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        
        // Clear the input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        alert("Quote added successfully!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Step 4: IMPLEMENTATION of createAddQuoteForm
// This function dynamically creates the HTML form elements
function createAddQuoteForm() {
    const container = document.createElement('div');
    container.id = "addQuoteForm"; // Useful for styling

    // Create the Quote Input
    const inputQuote = document.createElement('input');
    inputQuote.id = 'newQuoteText';
    inputQuote.type = 'text';
    inputQuote.placeholder = 'Enter a new quote';
    
    // Create the Category Input
    const inputCategory = document.createElement('input');
    inputCategory.id = 'newQuoteCategory';
    inputCategory.type = 'text';
    inputCategory.placeholder = 'Enter quote category';
    
    // Create the Add Button
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Quote';
    
    // Attach the addQuote function to the button click
    addBtn.addEventListener('click', addQuote);

    // Append all parts to the container
    container.appendChild(inputQuote);
    container.appendChild(inputCategory);
    container.appendChild(addBtn);
    
    // Finally, append the whole container to the body of the page
    document.body.appendChild(container);
}

// --- INITIALIZATION ---

// Add listener to the existing "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Call the function to build the form when the script loads
createAddQuoteForm();