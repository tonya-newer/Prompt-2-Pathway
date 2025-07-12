
import { AssessmentTemplate } from '@/types/assessment';

export const assessmentTemplates: AssessmentTemplate[] = [
  {
    id: 1,
    title: "Personal Clarity Flow",
    description: "Discover your path to personal and professional clarity",
    audience: "individual",
    tags: ["clarity", "personal-growth", "career"],
    questions: [
      {
        id: 1,
        type: "yes-no",
        question: "Do you have a clear vision of where you want to be in 3 years?",
        voiceScript: "Let's start with your vision. Do you have a clear picture of where you want to be in three years from now?"
      },
      {
        id: 2,
        type: "rating",
        question: "How confident do you feel about your current direction in life?",
        voiceScript: "On a scale of 1 to 10, how confident do you feel about your current direction in life?"
      },
      {
        id: 3,
        type: "this-that",
        question: "What motivates you more right now?",
        options: [
          "Achieving specific goals and milestones",
          "Finding deeper meaning and purpose"
        ],
        voiceScript: "Think about what drives you most. What motivates you more right now?"
      },
      {
        id: 4,
        type: "desires",
        question: "Which of these areas would you most like to improve?",
        options: [
          "Career advancement and professional growth",
          "Work-life balance and personal time",
          "Financial security and independence",
          "Relationships and social connections",
          "Health and personal wellness",
          "Learning new skills and knowledge"
        ],
        voiceScript: "Now let's explore the areas where you'd like to see improvement. Select all that resonate with you."
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "What's your biggest challenge right now?",
        options: [
          "Lack of clarity about my next steps",
          "Too many options and can't decide",
          "Fear of making the wrong choice",
          "Feeling stuck in my current situation",
          "Not enough time or resources"
        ],
        voiceScript: "Every journey has its challenges. What would you say is your biggest challenge right now?"
      }
    ]
  },
  {
    id: 2,
    title: "Business Growth Flow",
    description: "Assess your business readiness and growth opportunities",
    audience: "business",
    tags: ["business", "growth", "strategy"],
    questions: [
      {
        id: 1,
        type: "yes-no",
        question: "Do you have a clear growth strategy for the next 12 months?",
        voiceScript: "Let's talk about your business growth. Do you have a clear strategy for the next twelve months?"
      },
      {
        id: 2,
        type: "rating",
        question: "How confident are you in your current marketing approach?",
        voiceScript: "Rate your confidence in your current marketing approach on a scale of 1 to 10."
      },
      {
        id: 3,
        type: "this-that",
        question: "What's your primary focus right now?",
        options: [
          "Acquiring new customers and expanding reach",
          "Optimizing operations and improving efficiency"
        ],
        voiceScript: "Every business has priorities. What's your primary focus right now?"
      },
      {
        id: 4,
        type: "desires",
        question: "Which business areas need the most attention?",
        options: [
          "Marketing and lead generation",
          "Sales process and conversion",
          "Operations and workflow",
          "Team building and management",
          "Financial planning and cash flow",
          "Product or service development"
        ],
        voiceScript: "Let's identify where your business needs attention. Select all areas that could use improvement."
      },
      {
        id: 5,
        type: "multiple-choice",
        question: "What's holding your business back the most?",
        options: [
          "Limited marketing budget or resources",
          "Lack of clear systems and processes",
          "Too much manual work, not enough automation",
          "Difficulty finding and retaining good people",
          "Competition and market challenges"
        ],
        voiceScript: "Now let's identify what might be holding your business back. What would you say is the biggest obstacle?"
      }
    ]
  },
  {
    id: 3,
    title: "Marketing Readiness Assessment",
    description: "Evaluate your marketing foundation and growth potential",
    audience: "business",
    tags: ["marketing", "digital", "readiness"],
    questions: [
      {
        id: 1,
        type: "yes-no",
        question: "Do you have a documented marketing strategy?",
        voiceScript: "Let's assess your marketing readiness. Do you have a documented marketing strategy in place?"
      },
      {
        id: 2,
        type: "rating",
        question: "How well do you understand your ideal customer?",
        voiceScript: "On a scale of 1 to 10, how well would you say you understand your ideal customer?"
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Which marketing channels are you currently using?",
        options: [
          "Social media marketing",
          "Email marketing campaigns",
          "Content marketing and blogging",
          "Paid advertising (Google, Facebook)",
          "Networking and referrals",
          "None of the above consistently"
        ],
        voiceScript: "Tell me about your current marketing activities. Which channels are you actively using?"
      }
    ]
  },
  {
    id: 4,
    title: "Career Transition Readiness",
    description: "Assess your readiness for a career change or advancement",
    audience: "individual",
    tags: ["career", "transition", "professional"],
    questions: [
      {
        id: 1,
        type: "yes-no",
        question: "Are you actively looking to change your career or role?",
        voiceScript: "Let's explore your career transition. Are you actively looking to change your career or current role?"
      },
      {
        id: 2,
        type: "rating",
        question: "How satisfied are you with your current job or career?",
        voiceScript: "Rate your satisfaction with your current job or career path on a scale of 1 to 10."
      },
      {
        id: 3,
        type: "pain-avoidance",
        question: "Which work situations cause you the most stress?",
        options: [
          "Lack of growth opportunities",
          "Poor work-life balance",
          "Insufficient compensation",
          "Toxic workplace culture",
          "Boring or unchallenging work",
          "Lack of recognition or appreciation"
        ],
        voiceScript: "Let's identify what's not working. Which work situations cause you the most stress or dissatisfaction?"
      }
    ]
  }
];
