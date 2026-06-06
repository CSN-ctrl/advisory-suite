import { useCallback, useState } from "react";

const CAP = 50;

export function useUndoStack<T>(initial: T) {
  const [value, setValue] = useState(initial);
  const [past, setPast] = useState<T[]>([]);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      setPast((p) => [...p, prev].slice(-CAP));
      setFuture([]);
      return resolved;
    });
  }, []);

  const reset = useCallback((next: T) => {
    setValue(next);
    setPast([]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1]!;
      setValue((current) => {
        setFuture((f) => [current, ...f].slice(0, CAP));
        return previous;
      });
      return p.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0]!;
      setValue((current) => {
        setPast((p) => [...p, current].slice(-CAP));
        return next;
      });
      return f.slice(1);
    });
  }, []);

  return {
    value,
    set,
    reset,
    undo,
    redo,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    dirty: past.length > 0,
  };
}
