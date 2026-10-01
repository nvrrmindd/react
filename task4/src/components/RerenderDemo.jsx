import { useState } from 'react';
import Counter from './Counter.jsx';

function RerenderDemo() {
  const [clicks, setClicks] = useState(0);
  console.log('render RerenderDemo');

  return (
    <div className="box">
      <h3>1. rerender</h3>
      <button onClick={() => setClicks(clicks + 1)}>parent: {clicks}</button>
      <Counter name="child" />
      <p className="hint">check console</p>
    </div>
  );
}

export default RerenderDemo;
