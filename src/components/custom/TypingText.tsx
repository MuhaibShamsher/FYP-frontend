import { useState, useEffect } from 'react';
import styles from './styles/TypingText.module.css';

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  showCursor?: boolean;
}

export default function TypingText({
  text,
  speed = 100,
  className = '',
  showCursor = true,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && <span className={styles.cursor} />}
    </span>
  );
}
