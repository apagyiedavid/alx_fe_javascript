document.addEventListener("DOMContentLoaded", () => {
  // Initial quotes array
  const quotes = [
    { text: "Life is what happens when you're busy making other plans.",   category: "Life" },
    { text: "The purpose of our lives is to be happy.",                   category: "Philosophy" },
    { text: "Get busy living or get busy dying.",                          category: "Motivation" }
  ];

  // Element references
  const quoteTextEl     = document.getElementById("quoteText");
  const quoteCategoryEl = document.getElementById("quoteCategory");
  const randomQuoteBtn  = document.getElementById("randomQuoteBtn");
  const newQuoteText    = document.getElementById("newQuoteText");
  const newQuoteCat     = document.getElementById("newQuoteCategory");
  const addQuoteBtn     = document.getElementById("addQuoteBtn");
  const feedbackEl      = document.getElementById("feedback");

  // Function to display a random quote from array
  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteTextEl.textContent     = "No quotes available.";
      quoteCategoryEl.textContent = "";
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote       = quotes[randomIndex];
    quoteTextEl.textContent     = `"${quote.text}"`;
    quoteCategoryEl.textContent = `— Category: ${quote.category}`;
    feedbackEl.textContent      = "";  // clear any feedback
  }

  // Function to handle adding a new quote
  function addQuote() {
    const text     = newQuoteText.value.trim();
    const category = newQuoteCat.value.trim();

    if (text === "" || category === "") {
      feedbackEl.style.color = "red";
      feedbackEl.textContent = "Please fill in both quote text and category.";
      return;
    }

    // Add new quote object to array
    quotes.push({ text: text, category: category });

    // Clear input fields
    newQuoteText.value = "";
    newQuoteCat.value  = "";
    feedbackEl.style.color = "green";
    feedbackEl.textContent = "Quote added successfully!";

    // Optionally, automatically show it
    showRandomQuote();
  }

  // Event listeners
  randomQuoteBtn.addEventListener("click", showRandomQuote);
  addQuoteBtn.addEventListener("click", addQuote);

  // On page load, show one quote
  showRandomQuote();
});
