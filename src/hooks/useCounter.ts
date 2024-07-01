import { useState, useCallback } from "react";

interface UseCounter {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useCounter = (initialValue: number): UseCounter => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((prevCount) => prevCount - 1);
  }, []);

  return { count, increment, decrement };
};

export default useCounter;
