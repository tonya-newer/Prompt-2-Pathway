
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface Question {
  id: number;
  type: 'yes-no' | 'this-that' | 'multiple-choice' | 'rating' | 'desires' | 'pain-avoidance';
  question: string;
  description?: string;
  options?: string[];
  voiceScript?: string;
}

interface QuestionCardProps {
  question: Question;
  answer: any;
  onAnswer: (answer: any) => void;
}

export const QuestionCard = ({ question, answer, onAnswer }: QuestionCardProps) => {
  const renderYesNo = () => (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <Button
        variant={answer === 'yes' ? 'default' : 'outline'}
        onClick={() => onAnswer('yes')}
        className="h-16 text-lg"
      >
        Yes
      </Button>
      <Button
        variant={answer === 'no' ? 'default' : 'outline'}
        onClick={() => onAnswer('no')}
        className="h-16 text-lg"
      >
        No
      </Button>
    </div>
  );

  const renderThisThat = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {question.options?.map((option, index) => (
        <Button
          key={index}
          variant={answer === option ? 'default' : 'outline'}
          onClick={() => onAnswer(option)}
          className="h-20 text-left p-4 whitespace-normal"
        >
          {option}
        </Button>
      ))}
    </div>
  );

  const renderMultipleChoice = () => (
    <RadioGroup value={answer} onValueChange={onAnswer} className="mt-6 space-y-3">
      {question.options?.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem value={option} id={`option-${index}`} />
          <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">
            {option}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );

  const renderRating = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">Strongly Disagree</span>
        <span className="text-sm text-gray-500">Strongly Agree</span>
      </div>
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
          <Button
            key={rating}
            variant={answer === rating ? 'default' : 'outline'}
            onClick={() => onAnswer(rating)}
            className="w-12 h-12 p-0"
          >
            {rating}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderDesires = () => (
    <div className="mt-6 space-y-3">
      <p className="text-sm text-gray-600 mb-4">Select all that resonate with you:</p>
      {question.options?.map((option, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
          <Checkbox
            id={`desire-${index}`}
            checked={answer?.includes(option) || false}
            onCheckedChange={(checked) => {
              const currentAnswers = answer || [];
              if (checked) {
                onAnswer([...currentAnswers, option]);
              } else {
                onAnswer(currentAnswers.filter((a: string) => a !== option));
              }
            }}
          />
          <Label htmlFor={`desire-${index}`} className="text-base cursor-pointer flex-1">
            {option}
          </Label>
        </div>
      ))}
    </div>
  );

  const getQuestionTypeLabel = () => {
    const labels = {
      'yes-no': 'Quick Decision',
      'this-that': 'Choose One',
      'multiple-choice': 'Select Option',
      'rating': 'Rate Agreement',
      'desires': 'Multiple Select',
      'pain-avoidance': 'Priority Check'
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
    <Card className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Badge variant="secondary" className="mb-4">
          {getQuestionTypeLabel()}
        </Badge>
        <h2 className="text-2xl font-bold leading-relaxed mb-3">
          {question.question}
        </h2>
        {question.description && (
          <p className="text-gray-600 leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {renderQuestion()}
    </Card>
  );
};
