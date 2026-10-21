import { useState } from 'react';

const empty = { title: '', author: '', genre: '', year: '', pages: '', rating: '5', description: '' };

export default function BookForm({ initial, busy, onSave, onCancel }) {
  const [form, setForm] = useState(initial || empty);

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;
    onSave({
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim(),
      year: Number(form.year),
      pages: Number(form.pages),
      rating: Number(form.rating),
      description: form.description.trim(),
    });
  }

  return (
    <form className="form" onSubmit={submit}>
      <h2>{initial ? 'Edit book' : 'New book'}</h2>
      <input name="title" placeholder="Title *" value={form.title} onChange={change} required />
      <input name="author" placeholder="Author *" value={form.author} onChange={change} required />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={change} />
      <input name="year" type="number" placeholder="Year" value={form.year} onChange={change} />
      <input name="pages" type="number" placeholder="Pages" value={form.pages} onChange={change} />
      <select name="rating" value={form.rating} onChange={change}>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>{'★'.repeat(n)}</option>
        ))}
      </select>
      <textarea name="description" placeholder="Description" value={form.description} onChange={change} />
      <div className="row">
        <button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
        <button type="button" onClick={onCancel} disabled={busy}>Cancel</button>
      </div>
    </form>
  );
}
