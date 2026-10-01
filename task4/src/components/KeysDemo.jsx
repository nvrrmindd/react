import { useState } from 'react';

function KeysDemo() {
  const [items, setItems] = useState([
    { id: 1, text: 'shawarma' },
    { id: 2, text: 'baursak' },
  ]);
  const [nextId, setNextId] = useState(3);

  function addToTop() {
    setItems([{ id: nextId, text: 'new ' + nextId }, ...items]);
    setNextId(nextId + 1);
  }

  return (
    <div className="box">
      <h3>3. keys</h3>
      <button onClick={addToTop}>add on top</button>
      <p className="hint">type smth then add</p>

      <p>key=index</p>
      {items.map((item, index) => (
        <div key={index}>{item.text} <input /></div>
      ))}

      <p>key=id</p>
      {items.map((item) => (
        <div key={item.id}>{item.text} <input /></div>
      ))}
    </div>
  );
}

export default KeysDemo;
