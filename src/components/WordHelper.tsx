import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface WordHelperProps {
  word: string;
  onClose: () => void;
}

const WordHelper = ({ word, onClose }: WordHelperProps) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const getWordExplanation = async (selectedWord: string) => {
    setLoading(true);
    try {
      // Simulate API call - in real implementation, this would call ChatGPT API
      // For demo, using a simple explanation generator
      const mockExplanations: Record<string, string> = {
        'photosynthesis': 'The process by which plants make their own food using sunlight, carbon dioxide, and water.',
        'democracy': 'A system of government where people choose their leaders by voting.',
        'equation': 'A mathematical statement that shows two things are equal, using the = sign.',
        'literature': 'Written works like poems, stories, and plays that are considered to have artistic value.',
        'molecule': 'The smallest unit of a substance that still has all the properties of that substance.',
        'constitution': 'The basic laws and principles that govern a country or organization.',
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockExplanation = mockExplanations[selectedWord.toLowerCase()] || 
        `"${selectedWord}" is an important term in this subject. It refers to a concept that students should understand for their exams.`;

      setExplanation(mockExplanation);
    } catch (error) {
      toast.error('Failed to get word explanation');
      setExplanation('Sorry, unable to explain this word right now.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (word) {
      getWordExplanation(word);
    }
  }, [word]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>Word Helper AI</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {word}
              </span>
            </div>
            
            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600 mt-2">Getting explanation...</p>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-800 leading-relaxed">{explanation}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordHelper;
