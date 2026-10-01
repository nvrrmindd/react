import { useState } from 'react';
import Counter from './Counter.jsx';

function StateDemo() {
  const [isAigerim, setIsAigerim] = useState(true);
  const [show, setShow] = useState(true);

  return (
    <div className="box">
      <h3>2. state</h3>
      <button onClick={() => setIsAigerim(!isAigerim)}>swap</button>

      <p>no key</p>
      {isAigerim ? <Counter name="Aigerim" /> : <Counter name="Zhasulan" />}

      <p>with key</p>
      {isAigerim ? <Counter key="aigerim" name="Aigerim" /> : <Counter key="zhasulan" name="Zhasulan" />}

      <p>hide/show</p>
      <button onClick={() => setShow(!show)}>{show ? 'hide' : 'show'}</button>
      {show && <Counter name="temp" />}
    </div>
  );
}

export default StateDemo;
