import { useState, useEffect, useRef } from 'react';
import { useInView, animate } from 'motion/react';

interface AnimatedCounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

/**
 * AnimatedCounter Component
 * Block: counter
 * Element: counter__value
 */
export function AnimatedCounter({ to, prefix = "", suffix = "", duration = 2 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, to, {
        duration: duration,
        onUpdate: (value) => setCount(Math.floor(value)),
      });
      return () => controls.stop();
    }
  }, [isInView, to, duration]);

  return (
    <span ref={nodeRef} className="counter">
      <span className="counter__value">
        {prefix}{count}{suffix}
      </span>
    </span>
  );
}
