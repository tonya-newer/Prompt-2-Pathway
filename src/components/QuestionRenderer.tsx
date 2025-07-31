import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/types/assessment';
import { Check } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  answer: any;
  onAnswer: (answer: any) => void;
}

export const QuestionRenderer = ({ 
  question, 
  questionIndex, 
  totalQuestions, 
  answer, 
  onAnswer 
}: QuestionRendererProps) => {
  const renderYesNo = () => (
    <div className="grid grid-cols-2 gap-6 mt-8">
      <Button
        variant={answer === 'yes' ? 'default' : 'outline'}
        onClick={() => onAnswer('yes')}
        className={`h-20 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative ${
          answer === 'yes' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 ring-4 ring-green-200' 
            : 'bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 border-2 border-green-300'
        }`}
      >
        {answer === 'yes' && (
          <Check className="absolute top-2 right-2 h-6 w-6 text-white" />
        )}
        ✓ Yes
      </Button>
      <Button
        variant={answer === 'no' ? 'default' : 'outline'}
        onClick={() => onAnswer('no')}
        className={`h-20 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative ${
          answer === 'no' 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 ring-4 ring-red-200' 
            : 'bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-700 border-2 border-red-300'
        }`}
      >
        {answer === 'no' && (
          <Check className="absolute top-2 right-2 h-6 w-6 text-white" />
        )}
        ✗ No
      </Button>
    </div>
  );

  const renderThisThat = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {question.options?.map((option, index) => (
        <Button
          key={index}
          variant={answer === option ? 'default' : 'outline'}
          onClick={() => onAnswer(option)}
          className={`h-24 text-left p-6 whitespace-normal rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative ${
            answer === option 
              ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white border-0 ring-4 ring-blue-200' 
              : 'bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-2 border-blue-200 text-gray-800'
          } font-medium`}
        >
          {answer === option && (
            <Check className="absolute top-3 right-3 h-6 w-6 text-white" />
          )}
          {option}
        </Button>
      ))}
    </div>
  );

  const renderMultipleChoice = () => (
    <div className="mt-8 space-y-4">
      <RadioGroup value={answer} onValueChange={onAnswer} className="space-y-4">
        {question.options?.map((option, index) => (
          <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
            answer === option 
              ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-400 ring-2 ring-blue-200' 
              : 'bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-transparent hover:border-blue-200'
          }`}>
            <RadioGroupItem value={option} id={`option-${index}`} className="text-blue-600" />
            <Label htmlFor={`option-${index}`} className="text-lg cursor-pointer flex-1 font-medium text-gray-700">
              {option}
            </Label>
            {answer === option && (
              <Check className="h-5 w-5 text-blue-600" />
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );

  const renderRating = () => (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-red-500">Strongly Disagree</span>
        <span className="text-sm font-medium text-green-500">Strongly Agree</span>
      </div>
      <div className="flex justify-center space-x-3 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
          <Button
            key={rating}
            variant={answer === rating ? 'default' : 'outline'}
            onClick={() => onAnswer(rating)}
            className={`w-14 h-14 p-0 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative ${
              answer === rating 
                ? 'ring-4 ring-blue-200' 
                : ''
            }`}
            style={{
              background: answer === rating 
                ? `linear-gradient(135deg, hsl(${rating * 12}, 70%, 60%), hsl(${rating * 12 + 20}, 70%, 50%))`
                : undefined
            }}
          >
            {answer === rating && (
              <Check className="absolute -top-1 -right-1 h-4 w-4 text-white bg-blue-600 rounded-full p-0.5" />
            )}
            {rating}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderDesires = () => (
    <div className="mt-8 space-y-4">
      <p className="text-lg text-gray-600 mb-6 font-medium">Select all that resonate with you:</p>
      {question.options?.map((option, index) => (
        <div key={index} className={`flex items-start space-x-4 p-5 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
          answer?.includes(option) 
            ? 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-400 ring-2 ring-purple-200' 
            : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:border-purple-300 border-gray-200'
        }`}>
          <Checkbox
            id={`option-${index}`}
            checked={answer?.includes(option) || false}
            onCheckedChange={(checked) => {
              const currentAnswers = answer || [];
              if (checked) {
                onAnswer([...currentAnswers, option]);
              } else {
                onAnswer(currentAnswers.filter((a: string) => a !== option));
              }
            }}
            className="mt-1"
          />
          <Label htmlFor={`option-${index}`} className="text-lg cursor-pointer flex-1 font-medium text-gray-700 leading-relaxed">
            {option}
          </Label>
          {answer?.includes(option) && (
            <Check className="h-5 w-5 text-purple-600 mt-1" />
          )}
        </div>
      ))}
    </div>
  );

  const getQuestionTypeLabel = () => {
    const labels = {
      'yes-no': '✓ Quick Decision',
      'this-that': '🎯 Choose One',
      'multiple-choice': '📝 Select Option',
      'rating': '⭐ Rate Agreement',
      'desires': '💭 Multiple Select',
      'pain-avoidance': '🚨 Priority Check'
    };
    return labels[question.type] || 'Question';
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'yes-no':
        return renderYesNo();
      case 'this-that':
        return renderThisThat();
      case 'multiple-choice':
        return renderMultipleChoice();
      case 'rating':
        return renderRating();
      case 'desires':
      case 'pain-avoidance':
        return renderDesires();
      default:
        return renderMultipleChoice();
    }
  };

  return (
    <Card className="p-10 max-w-5xl mx-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-blue-100 shadow-2xl rounded-2xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Badge variant="secondary" className="px-4 py-2 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
            {getQuestionTypeLabel()}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-2 border-gray-300 rounded-full">
            {questionIndex + 1} of {totalQuestions}
          </Badge>
        </div>
        
        {/* Voice transcript - enhanced visual treatment */}
        {question.voiceScript && (
          <div className="bg-gradient-to-r from-blue-100 via-purple-50 to-blue-100 border-l-8 border-blue-500 p-8 mb-8 rounded-r-2xl shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 p-3 rounded-full flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.318 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.318l4.065-2.816z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.146 6.146a.5.5 0 01.708 0L15 8.293l2.146-2.147a.5.5 0 01.708.708L15.707 9l2.147 2.146a.5.5 0 01-.708.708L15 9.707l-2.146 2.147a.5.5 0 01-.708-.708L14.293 9l-2.147-2.146a.5.5 0 010-.708z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-blue-700 mb-2 uppercase tracking-wide">Voice Guide</h3>
                <p className="text-blue-900 text-base sm:text-lg md:text-xl leading-relaxed font-medium break-words">
                  {question.voiceScript}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {renderQuestion()}
    </Card>
  );
};
