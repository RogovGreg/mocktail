type Author = {
  name: string
  birthYear?: number
  nationality?: string
}

type Book = {
  title: string
  author: Author // must be Serbian
  publishedYear: number
  genres: string[]
  isAvailable: boolean
  ISBN?: string // optional property
}

// const BASE_URL = 'localhost'
const BASE_URL = 'http://161.35.207.106/api/v1/mock/019a0ead-e208-760f-920d-5114e22a0f14';
const API_ENDPOINT = '/books';
const BEARER_TOKEN = 'VY4fG9T9CHfNxYh+M7f3gQFEa8TkbwqjSQbeyvfEoaw=';

// Main application logic
async function fetchBooks(): Promise<Book[]> {
  try {
    const response = await fetch(`${BASE_URL}${API_ENDPOINT}`, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const books: Book[] = await response.json();
    return books;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}

function renderBooks(books: Book[]): string {
  return `
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Birth Year</th>
          <th>Published Year</th>
          <th>Genres</th>
          <th>Available</th>
          <th>ISBN</th>
        </tr>
      </thead>
      <tbody>
        ${books.map(book => `
          <tr>
            <td>${book.title}</td>
            <td>${book.author.name}</td>
            <td>${book.author.birthYear || 'N/A'}</td>
            <td>${book.publishedYear}</td>
            <td>${book.genres.join(', ')}</td>
            <td>${book.isAvailable ? 'Yes' : 'No'}</td>
            <td>${book.ISBN || 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderEmptyTable(errorMessage: string): string {
  return `
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Birth Year</th>
          <th>Published Year</th>
          <th>Genres</th>
          <th>Available</th>
          <th>ISBN</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="7" style="text-align: center; padding: 40px; color: #666; font-style: italic;">
            ${errorMessage}
          </td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderError(error: string): string {
  return `
    <div style="color: red; padding: 20px; border: 1px solid red; border-radius: 4px;">
      <h3>Error loading books</h3>
      <p>${error}</p>
      <p>Please check:</p>
      <ul>
        <li>API endpoint is correct: ${API_ENDPOINT}</li>
        <li>Bearer token is valid</li>
        <li>Backend service is running</li>
      </ul>
    </div>
  `;
}

// Initialize the application
async function init() {
  const appElement = document.getElementById('app');
  
  if (!appElement) {
    console.error('App element not found');
    return;
  }

  try {
    const books = await fetchBooks();
    appElement.innerHTML = renderBooks(books);
  } catch (error) {
    appElement.innerHTML = renderEmptyTable('Failed to fetch books');
  }
}

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', init);
