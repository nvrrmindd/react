import { useState } from 'react';

function Counter({ name }) {
  const [count, setCount] = useState(0);
  console.log('render Counter', name);

  return (
    <div>
      <b>{name}</b>: {count}{' '}
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

export default Counter;
