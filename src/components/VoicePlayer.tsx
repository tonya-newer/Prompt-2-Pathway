
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Headphones } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface VoicePlayerProps {
  text: string;
  autoPlay?: boolean;
  className?: string;
}

export const VoicePlayer = ({ text, autoPlay = false, className = '' }: VoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = isMuted ? 0 : 1;

    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Samantha') || 
      voice.name.includes('Alex') || 
      voice.name.includes('Karen') ||
      voice.lang === 'en-US'
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = !isMuted ? 0 : 1;
    }
  };

  return (
    <Card className={`p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg ${className}`}>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <Button
            variant="default"
            size="lg"
            onClick={isPlaying ? stop : speak}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 mr-2" />
            ) : (
              <Play className="h-5 w-5 mr-2" />
            )}
            {isPlaying ? 'Pause Audio' : 'Play Audio'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={toggleMute}
            className="hover:bg-blue-100 border-blue-300"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-gray-400" />
            ) : (
              <Volume2 className="h-5 w-5 text-blue-600" />
            )}
          </Button>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Headphones className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-lg font-bold text-blue-900">Voice Guide Ready</p>
          </div>
          <p className="text-sm text-blue-700 leading-relaxed">{text.substring(0, 120)}...</p>
        </div>
        
        {isPlaying && (
          <div className="flex space-x-1">
            <div className="w-2 h-6 bg-blue-500 animate-pulse rounded-full"></div>
            <div className="w-2 h-8 bg-blue-500 animate-pulse delay-75 rounded-full"></div>
            <div className="w-2 h-6 bg-blue-500 animate-pulse delay-150 rounded-full"></div>
          </div>
        )}
      </div>
    </Card>
  );
};
