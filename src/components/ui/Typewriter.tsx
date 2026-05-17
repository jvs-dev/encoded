import { useState, useEffect } from 'react';

/**
 * Typewriter Component
 */
export function Typewriter() {
  const phrases = [
    `Engenharia digital para resultados reais.`,
    `Engenharia digital para impulsionar marcas.`,
    `Engenharia digital para quem quer crescer.`  
  ];
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Use the longest phrase to reserve space
  const longestPhrase = phrases.reduce((a, b) => a.length > b.length ? a : b);

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
  }, [currentText, isDeleting, currentPhraseIndex, phrases]);

  const baseText = "Engenharia digital para ";
  const hasBaseText = currentText.startsWith(baseText);
  const part1 = hasBaseText ? baseText.trim() : currentText;
  const part2 = hasBaseText ? currentText.substring(baseText.length) : "";
  const longestPart2 = longestPhrase.substring(baseText.length);

  return (
    <span className="relative inline-block w-full text-center">
      {/* Phantom text to reserve space */}
      <span className="invisible opacity-0 block pointer-events-none select-none w-full" aria-hidden="true">
        {baseText.trim()}
        <br />
        {longestPart2}
      </span>
      {/* Actual typewriter text */}
      <span className="absolute top-0 left-0 w-full flex flex-col items-center justify-center pointer-events-none">
        <span className="typewriter flex flex-col items-center">
          <span className="typewriter__text text-white">
            {part1}
            {hasBaseText && <br />}
            <span className="text-primary inline-flex items-center">
              {part2}
              <span className={`typewriter__cursor border-r-4 ${hasBaseText ? 'border-primary' : 'border-white'} h-[0.9em] ml-1 animate-pulse`}></span>
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}
