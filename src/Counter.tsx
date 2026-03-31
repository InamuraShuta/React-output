import { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>カウント: {count}</h1>
      <button data-testid="Cbutton" onClick={() => setCount(count + 1)}>増やす</button>
    </div>
  );
};