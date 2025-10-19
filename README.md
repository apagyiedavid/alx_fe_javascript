Dynamic Quote Generator

A web application that allows users to add, view, and filter motivational quotes. It syncs with a mock server to fetch and update quotes, ensuring data consistency across sessions and devices.

📌 Features

Add New Quotes: Users can input new quotes along with their categories.

View Random Quotes: Display a random quote from the stored collection.

Category Filtering: Filter quotes by category for targeted inspiration.

Data Synchronization: Periodically syncs with a mock server to fetch and update quotes.

Conflict Resolution: Server data takes precedence in case of discrepancies.

User Notifications: Alerts users when data is updated or conflicts are resolved.

⚙️ Technologies Used

Frontend: HTML, CSS, JavaScript

Server Simulation: JSONPlaceholder (https://jsonplaceholder.typicode.com/posts
)

🚀 Getting Started

Clone the Repository

git clone https://github.com/yourusername/dynamic-quote-generator.git
cd dynamic-quote-generator


Open the Application

Open index.html in your preferred web browser.

Usage

Add a new quote by entering text and selecting a category.

View a random quote displayed on the page.

Filter quotes by category using the dropdown menu.

🔄 Data Sync & Conflict Resolution

The application fetches quotes from a mock server (JSONPlaceholder) every 30 seconds.

Local data is merged with server data, with server data taking precedence in case of discrepancies.

Users are notified when data is updated or conflicts are resolved.

🧪 Testing

Ensure the following functionalities are working:

Data Syncing: Verify that local data is synced with the server data.

Conflict Resolution: Ensure that server data takes precedence in case of discrepancies.

UI Notifications: Confirm that users are notified when data is updated.
