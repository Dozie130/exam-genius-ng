
import React, { useState } from 'react';
import WordHelper from './WordHelper';

interface ClickableTextProps {
  text: string;
  className?: string;
}

const ClickableText = ({ text, className = '' }: ClickableTextProps) => {
  const [selectedWord, setSelectedWord] = useState<string>('');
  const [showHelper, setShowHelper] = useState(false);

  const handleWordClick = (word: string) => {
    // Clean the word of punctuation
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 2) { // Only show helper for words longer than 2 characters
      setSelectedWord(cleanWord);
      setShowHelper(true);
    }
  };

  const renderClickableText = (text: string) => {
    const words = text.split(/(\s+)/);
    
    return words.map((word, index) => {
      if (word.trim() === '') return word; // Return whitespace as-is
      
      return (
        <span
          key={index}
          onClick={() => handleWordClick(word)}
          className="cursor-pointer hover:bg-blue-100 hover:text-blue-800 rounded px-1 transition-colors duration-150"
          title="Tap for explanation"
        >
          {word}
        </span>
      );
    });
  };

  return (
    <>
      <div className={className}>
        {renderClickableText(text)}
      </div>
      
      {showHelper && (
        <WordHelper 
          word={selectedWord} 
          onClose={() => setShowHelper(false)} 
        />
      )}
    </>
  );
};

export default ClickableText;
