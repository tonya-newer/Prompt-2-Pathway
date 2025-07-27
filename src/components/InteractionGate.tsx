import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Volume2, Play } from 'lucide-react';

interface InteractionGateProps {
  onInteraction: () => void;
  title?: string;
  description?: string;
}

export const InteractionGate = ({ 
  onInteraction, 
  title = "Ready to Begin?",
  description = "Tap to start your voice-guided experience" 
}: InteractionGateProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onInteraction();
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className={`max-w-md w-full p-8 text-center bg-white shadow-2xl rounded-2xl transition-all duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <Volume2 className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 text-base leading-relaxed">{description}</p>
        </div>
        
        <Button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Play className="h-6 w-6 mr-3" />
          Start Assessment
        </Button>
        
        <p className="text-xs text-gray-500 mt-4">
          🎧 For the best experience, use headphones or speakers
        </p>
      </Card>
    </div>
  );
};