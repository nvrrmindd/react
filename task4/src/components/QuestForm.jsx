import { useState } from 'react';

function QuestForm({ onAdd }) {
  const [title, setTitle] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (title === '') return;
    onAdd(title);
    setTitle('');
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New quest" />
      <button type="submit">Add</button>
    </form>
  );
}

export default QuestForm;
