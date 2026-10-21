export default function BookDetails({ book, busy, onToggle, onEdit, onDelete }) {
  return (
    <div className="details">
      <h2>{book.title}</h2>
      <p><b>Author:</b> {book.author}</p>
      <p><b>Genre:</b> {book.genre || '—'}</p>
      <p><b>Year:</b> {book.year || '—'}</p>
      <p><b>Pages:</b> {book.pages || '—'}</p>
      <p><b>Rating:</b> {'★'.repeat(book.rating)}</p>
      <p><b>Status:</b> {book.available ? '✅ Available' : '📕 Borrowed'}</p>
      <p><b>Description:</b> {book.description || '—'}</p>
      <p className="muted">Last updated: {book.updatedAt}</p>

      <div className="row">
        <button onClick={onToggle} disabled={busy}>
          {busy ? 'Please wait...' : book.available ? 'Borrow' : 'Return'}
        </button>
        <button onClick={onEdit} disabled={busy}>Edit</button>
        <button className="danger" onClick={onDelete} disabled={busy}>Delete</button>
      </div>
    </div>
  );
}
