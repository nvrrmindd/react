const KEY = 'books';
const seed = [
  { id: 1, title: 'The Hobbit', author: 'J. R. R. Tolkien', genre: 'Fantasy', year: 1937, pages: 310, rating: 5, description: 'Bilbo goes on an unexpected journey.', available: true, updatedAt: '2026-10-01' },
  { id: 2, title: '1984', author: 'George Orwell', genre: 'Dystopia', year: 1949, pages: 328, rating: 5, description: 'Big Brother is watching you.', available: false, updatedAt: '2026-10-01' },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Programming', year: 2008, pages: 464, rating: 4, description: 'How to write readable code.', available: true, updatedAt: '2026-10-01' },
];
function load() {
  const saved = localStorage.getItem(KEY);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

function save(books) {
  localStorage.setItem(KEY, JSON.stringify(books));
}

function today() {
  return new Date().toLocaleString();
}

function fakeRequest(work) {
  return new Promise((resolve, reject) => {
    const delay = 500 + Math.random() * 2000;
    setTimeout(() => {
      if (Math.random() < 0.15) {
        reject(new Error('Server error. Please try again.'));
        return;
      }
      try {
        resolve(work());
      } catch (err) {
        reject(err);
      }
    }, delay);
  });
}

// List returns only short info
export function getBooks() {
  return fakeRequest(() =>
    load().map(({ id, title, author, available }) => ({ id, title, author, available }))
  );
}

// Details return all fields
export function getBook(id) {
  return fakeRequest(() => {
    const book = load().find((b) => b.id === id);
    if (!book) throw new Error('Book not found');
    return book;
  });
}

export function createBook(data) {
  return fakeRequest(() => {
    const book = { ...data, id: Date.now(), available: true, updatedAt: today() };
    save([...load(), book]);
    return book;
  });
}

export function updateBook(id, data) {
  return fakeRequest(() => {
    const books = load();
    const old = books.find((b) => b.id === id);
    if (!old) throw new Error('Book not found');
    const book = { ...old, ...data, updatedAt: today() };
    save(books.map((b) => (b.id === id ? book : b)));
    return book;
  });
}

export function deleteBook(id) {
  return fakeRequest(() => {
    save(load().filter((b) => b.id !== id));
    return id;
  });
}

// The "action" on selected item: borrow / return the book
export function toggleAvailable(id) {
  return fakeRequest(() => {
    const books = load();
    const old = books.find((b) => b.id === id);
    if (!old) throw new Error('Book not found');
    const book = { ...old, available: !old.available, updatedAt: today() };
    save(books.map((b) => (b.id === id ? book : b)));
    return book;
  });
}
