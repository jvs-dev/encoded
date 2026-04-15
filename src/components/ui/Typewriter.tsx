import { useState, useEffect } from 'react';

/**
 * Typewriter Component
 * Block: typewriter
 * Element: typewriter__text, typewriter__cursor
 */
export function Typewriter() {
  const phrases = [
    "Engenharia digital para resultados reais.",
    "Engenharia digital para escalar suas vendas.",
    "Engenharia digital para seu negócio."
  ];
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = phrases[currentPhraseIndex];
      const baseText = "Engenharia digital para ";
      
      if (!isDeleting) {
        // Typing
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === fullText) {
          // Finished typing full phrase
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        const nextText = fullText.substring(0, currentText.length - 1);
        setCurrentText(nextText);
        setTypingSpeed(50);

        // Stop deleting when we reach the base text
        if (nextText === baseText || nextText === "") {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex]);

  return (
    <span className="typewriter">
      <span className="typewriter__text">{currentText}</span>
      <span className="typewriter__cursor border-r-4 border-white ml-1 animate-pulse"></span>
    </span>
  );
}
