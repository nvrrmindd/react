import { useState, useEffect } from 'react';
import { getBooks, getBook, createBook, updateBook, deleteBook, toggleAvailable } from './api.js';
import BookDetails from './components/BookDetails.jsx';
import BookForm from './components/BookForm.jsx';

export default function App() {
  // list
  const [books, setBooks] = useState([]);
  const [listStatus, setListStatus] = useState('loading'); // loading | error | success
  const [listError, setListError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  // selected item details
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState(null);
  const [detailsStatus, setDetailsStatus] = useState('idle'); // idle | loading | error | success
  const [detailsError, setDetailsError] = useState('');
  const [detailsKey, setDetailsKey] = useState(0);

  // actions
  const [busy, setBusy] = useState(false); // true while create/edit/delete/toggle is running
  const [formMode, setFormMode] = useState(null); // null | 'create' | 'edit'
  const [message, setMessage] = useState(null); // { text, ok }

  // 1. Load the list. Runs on start and every time Reload is clicked (reloadKey changes).
  useEffect(() => {
    let ignore = false; // cleanup sets this, so an old response is ignored

    setListStatus('loading');
    getBooks()
      .then((data) => {
        if (ignore) return;
        setBooks(data);
        setListStatus('success');
      })
      .catch((err) => {
        if (ignore) return;
        setListError(err.message);
        setListStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  // 2. Load details of the selected book.
  // If the user clicks another book, cleanup runs for the previous request -> its result is ignored.
  // This prevents race conditions (old slow response can't overwrite new details).
  useEffect(() => {
    if (selectedId === null) return;
    let ignore = false;

    setDetails(null);
    setDetailsStatus('loading');
    getBook(selectedId)
      .then((data) => {
        if (ignore) return;
        setDetails(data);
        setDetailsStatus('success');
      })
      .catch((err) => {
        if (ignore) return;
        setDetailsError(err.message);
        setDetailsStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [selectedId, detailsKey]);

  // 3. Hide the message after 3 seconds. Cleanup clears the timer.
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  function selectBook(id) {
    setFormMode(null);
    setSelectedId(id);
  }

  // Updates the item in the list and in the details (only if that item is still open)
  function applyUpdate(book) {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === book.id ? { id: book.id, title: book.title, author: book.author, available: book.available } : b
      )
    );
    setDetails((prev) => (prev && prev.id === book.id ? book : prev));
  }

  // Stale closures: we save the id at the moment the action starts.
  // Even if the user selects another book while waiting, the response updates the correct book.
  // busy=true disables all action buttons, so two conflicting actions can't run at once.
  function handleToggle() {
    const id = selectedId;
    setBusy(true);
    toggleAvailable(id)
      .then((book) => {
        applyUpdate(book);
        setMessage({ text: `"${book.title}" is now ${book.available ? 'available' : 'borrowed'}`, ok: true });
      })
      .catch((err) => setMessage({ text: err.message, ok: false }))
      .finally(() => setBusy(false));
  }

  function handleDelete() {
    const id = selectedId;
    if (!confirm('Delete this book?')) return;
    setBusy(true);
    deleteBook(id)
      .then(() => {
        setBooks((prev) => prev.filter((b) => b.id !== id));
        setSelectedId((cur) => (cur === id ? null : cur));
        setDetails((prev) => (prev && prev.id === id ? null : prev));
        setMessage({ text: 'Book deleted', ok: true });
      })
      .catch((err) => setMessage({ text: err.message, ok: false }))
      .finally(() => setBusy(false));
  }

  function handleSave(data) {
    setBusy(true);

    if (formMode === 'create') {
      createBook(data)
        .then((book) => {
          setBooks((prev) => [...prev, { id: book.id, title: book.title, author: book.author, available: book.available }]);
          setFormMode(null);
          setSelectedId(book.id);
          setMessage({ text: 'Book created', ok: true });
        })
        .catch((err) => setMessage({ text: err.message, ok: false }))
        .finally(() => setBusy(false));
    } else {
      const id = details.id;
      updateBook(id, data)
        .then((book) => {
          applyUpdate(book);
          setFormMode(null);
          setMessage({ text: 'Book updated', ok: true });
        })
        .catch((err) => setMessage({ text: err.message, ok: false }))
        .finally(() => setBusy(false));
    }
  }

  return (
    <div className="app">
      <h1>Book Library</h1>

      <div className="row">
        <button onClick={() => setReloadKey((k) => k + 1)} disabled={listStatus === 'loading'}>
          Reload
        </button>
        <button onClick={() => setFormMode('create')} disabled={busy}>
          Add book
        </button>
      </div>

      {message && <div className={message.ok ? 'msg ok' : 'msg error'}>{message.text}</div>}

      <div className="layout">
        {/* LIST */}
        <div className="panel">
          {listStatus === 'loading' && <p className="muted">Loading books...</p>}

          {listStatus === 'error' && (
            <div className="error">
              <p>{listError}</p>
              <button onClick={() => setReloadKey((k) => k + 1)}>Try again</button>
            </div>
          )}

          {listStatus === 'success' && books.length === 0 && <p className="muted">No books yet. Add the first one!</p>}

          {listStatus === 'success' &&
            books.map((b) => (
              <div
                key={b.id}
                className={b.id === selectedId ? 'item selected' : 'item'}
                onClick={() => selectBook(b.id)}
              >
                <b>{b.title}</b>
                <span className="muted"> — {b.author}</span>
                <span className="badge">{b.available ? 'Available' : 'Borrowed'}</span>
              </div>
            ))}
        </div>

        {/* DETAILS / FORM */}
        <div className="panel">
          {formMode === 'create' && (
            <BookForm busy={busy} onSave={handleSave} onCancel={() => setFormMode(null)} />
          )}

          {formMode === 'edit' && details && (
            <BookForm initial={details} busy={busy} onSave={handleSave} onCancel={() => setFormMode(null)} />
          )}

          {formMode === null && (
            <>
              {selectedId === null && <p className="muted">Select a book to see details</p>}

              {selectedId !== null && detailsStatus === 'loading' && <p className="muted">Loading details...</p>}

              {selectedId !== null && detailsStatus === 'error' && (
                <div className="error">
                  <p>{detailsError}</p>
                  <button onClick={() => setDetailsKey((k) => k + 1)}>Try again</button>
                </div>
              )}

              {selectedId !== null && detailsStatus === 'success' && details && (
                <BookDetails
                  book={details}
                  busy={busy}
                  onToggle={handleToggle}
                  onEdit={() => setFormMode('edit')}
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
