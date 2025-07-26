import { AssessmentTemplate } from '@/types/assessment';

export const assessmentTemplates: AssessmentTemplate[] = [
  {
    id: 1,
    title: "Career Clarity Assessment",
    description: "Discover your ideal career path and unlock your professional potential",
    audience: "business",
    tags: ["career", "professional development", "purpose"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    questions: [
      {
        id: 1,
        type: "yes-no",
        question: "Do you feel excited about your work most days?",
        voiceScript: "Let's start with something important. Do you feel excited about your work most days?"
      },
      {
        id: 2,
        type: "rating",
        question: "How satisfied are you with your current career trajectory?",
        voiceScript: "On a scale of 1 to 10, how satisfied are you with your current career trajectory?"
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "What motivates you most in your professional life?",
        options: [
          "Making a meaningful impact",
          "Financial success and security",
          "Creative expression and innovation",
          "Leadership and influence",
          "Work-life balance and flexibility"
        ],
        voiceScript: "Think about what drives you professionally. What motivates you most in your work life?"
      },
      {
        id: 4,
        type: "desires",
        question: "Which professional skills would you most like to develop?",
        options: [
          "Leadership and management",
          "Communication and presentation",
          "Technical and digital skills",
          "Creative and innovative thinking",
          "Strategic planning and analysis",
          "Networking and relationship building"
        ],
        voiceScript: "Looking at your professional growth, which skills would you most like to develop? Select all that appeal to you."
      },
      {
        id: 5,
        type: "this-that",
        question: "When facing career decisions, are you more:",
        options: [
          "Risk-taking and adventurous",
          "Cautious and security-focused"
        ],
        voiceScript: "When it comes to career decisions, are you more of a risk-taker or do you prefer security and caution?"
      }
    ]
  },
  {
    id: 2,
    title: "Relationship Readiness Check",
    description: "Understand your readiness for meaningful relationships and personal connections",
    audience: "individual",
    tags: ["relationships", "personal growth", "connection"],
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
    questions: [
      {
        id: 1,
        type: "yes-no",
        question: "Do you feel comfortable being vulnerable with others?",
        voiceScript: "Let's explore your relationship readiness. Do you feel comfortable being vulnerable with others?"
      },
      {
        id: 2,
        type: "rating",
        question: "How satisfied are you with your current social connections?",
        voiceScript: "Rate your satisfaction with your current social connections on a scale of 1 to 10."
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "What do you value most in relationships?",
        options: [
          "Trust and honesty",
          "Fun and shared experiences",
          "Deep emotional connection",
          "Mutual support and growth",
          "Independence and space"
        ],
        voiceScript: "What do you value most in your relationships? Choose what matters most to you."
      }
    ]
  },
  {
    id: 3,
    title: "Wellness & Life Balance Assessment",
    description: "Evaluate your current wellness practices and discover areas for improvement",
    audience: "individual",
    tags: ["wellness", "health", "balance", "lifestyle"],
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    questions: [
      {
        id: 1,
        type: "yes-no",
        question: "Do you have a consistent daily routine that supports your wellbeing?",
        voiceScript: "Let's talk about your wellness. Do you have a consistent daily routine that supports your wellbeing?"
      },
      {
        id: 2,
        type: "rating",
        question: "How would you rate your current stress levels?",
        voiceScript: "On a scale of 1 to 10, with 10 being very high stress, how would you rate your current stress levels?"
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Which wellness area needs the most attention in your life?",
        options: [
          "Physical fitness and exercise",
          "Mental health and stress management",
          "Nutrition and healthy eating",
          "Sleep quality and rest",
          "Work-life balance"
        ],
        voiceScript: "Which wellness area needs the most attention in your life right now?"
      }
    ]
  },
  {
    id: 4,
    title: "Financial Freedom Readiness",
    description: "Assess your financial mindset and readiness for building wealth",
    audience: "business",
    tags: ["finance", "wealth", "money mindset", "investing"],
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop",
    questions: [
      {
        id: 1,
        type: "yes-no",
        question: "Do you have a clear understanding of your monthly expenses?",
        voiceScript: "Let's talk about your financial awareness. Do you have a clear understanding of your monthly expenses?"
      },
      {
        id: 2,
        type: "rating",
        question: "How comfortable are you with your current financial situation?",
        voiceScript: "Rate your comfort level with your current financial situation on a scale of 1 to 10."
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "What's your biggest financial priority right now?",
        options: [
          "Building an emergency fund",
          "Paying off debt",
          "Saving for retirement",
          "Investing for growth",
          "Increasing income"
        ],
        voiceScript: "What's your biggest financial priority right now? Choose your top concern."
      }
    ]
  },
  {
    id: 5,
    title: "Leadership Potential Assessment",
    description: "Discover your natural leadership strengths and areas for development",
    audience: "business",
    tags: ["leadership", "management", "influence", "team building"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
    questions: [
      {
        id: 1,
        type: "yes-no",
        question: "Do people often come to you for advice or guidance?",
        voiceScript: "Let's explore your leadership potential. Do people often come to you for advice or guidance?"
      },
      {
        id: 2,
        type: "rating",
        question: "How comfortable are you with making difficult decisions?",
        voiceScript: "On a scale of 1 to 10, how comfortable are you with making difficult decisions?"
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "What leadership style feels most natural to you?",
        options: [
          "Collaborative and team-focused",
          "Decisive and directive",
          "Inspirational and visionary",
          "Supportive and coaching-oriented",
          "Innovative and change-driven"
        ],
        voiceScript: "What leadership style feels most natural to you? Think about how you naturally interact with others."
      }
    ]
  },
  {
    id: 6,
    title: "Life Satisfaction & Fulfillment Check",
    description: "Evaluate your overall life satisfaction and identify areas that need attention",
    audience: "individual",
    tags: ["life satisfaction", "fulfillment", "happiness", "personal growth"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    questions: [
      {
        id: 1,
        type: "yes-no",
        question: "Do you wake up most days feeling purposeful and motivated?",
        voiceScript: "Let's reflect on your life satisfaction. Do you wake up most days feeling purposeful and motivated?"
      },
      {
        id: 2,
        type: "rating",
        question: "How fulfilled do you feel with your life overall?",
        voiceScript: "On a scale of 1 to 10, how fulfilled do you feel with your life overall?"
      },
      {
        id: 3,
        type: "pain-avoidance",
        question: "Which life areas cause you the most dissatisfaction?",
        options: [
          "Work and career stagnation",
          "Relationship conflicts or loneliness",
          "Financial stress and insecurity",
          "Health and energy issues",
          "Lack of personal growth or learning",
          "Missing sense of purpose or meaning"
        ],
        voiceScript: "Let's identify what's not working. Which work situations cause you the most stress or dissatisfaction?"
      }
    ]
  },
  {
    id: 1753400777288,
    title: "Are You AI-Ready? Let's Find Out",
    description: "Discover your readiness to embrace AI and unlock new levels of productivity in your personal and professional life.",
    audience: "business",
    tags: ["AI", "technology", "readiness", "productivity"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    questions: [
      {
        id: 1,
        type: "yes-no",
        question: "Do you currently use any AI tools like ChatGPT, Claude, or Gemini in your daily work or personal life?",
        voiceScript: "Let's dive right in. Do you currently use any AI tools like ChatGPT, Claude, or Gemini in your daily work or personal life?"
      },
      {
        id: 2,
        type: "rating",
        question: "On a scale of 1-10, how comfortable are you with adopting new technology in general?",
        voiceScript: "On a scale of 1 to 10, how comfortable are you with adopting new technology in general? Think about your past experiences with learning new apps, software, or devices."
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "What best describes your current knowledge level about AI?",
        options: [
          "I'm a complete beginner with little to no knowledge",
          "I know the basics but haven't used AI tools much",
          "I've experimented with some AI tools",
          "I use AI tools regularly and understand their capabilities",
          "I consider myself advanced in AI applications"
        ],
        voiceScript: "What best describes your current knowledge level about AI? Choose the option that most accurately reflects where you are right now."
      },
      {
        id: 4,
        type: "this-that",
        question: "When it comes to new technology, are you typically:",
        options: [
          "An early adopter who tries new things quickly",
          "A careful observer who waits to see how others use it first"
        ],
        voiceScript: "When it comes to new technology, are you typically an early adopter who tries new things quickly, or a careful observer who waits to see how others use it first?"
      },
      {
        id: 5,
        type: "desires",
        question: "Which areas of your life would you most like to improve with AI assistance?",
        options: [
          "Work productivity and efficiency",
          "Creative projects and content creation",
          "Learning and skill development",
          "Personal organization and planning",
          "Communication and writing",
          "Research and information gathering"
        ],
        voiceScript: "Which areas of your life would you most like to improve with AI assistance? Select all the areas that interest you."
      },
      {
        id: 6,
        type: "yes-no",
        question: "Have you ever felt overwhelmed by the rapid pace of technological change?",
        voiceScript: "Have you ever felt overwhelmed by the rapid pace of technological change? It's okay to be honest here."
      },
      {
        id: 7,
        type: "rating",
        question: "How important is it for you to stay current with technology trends in your field?",
        voiceScript: "On a scale of 1 to 10, how important is it for you to stay current with technology trends in your field?"
      },
      {
        id: 8,
        type: "multiple-choice",
        question: "What's your biggest concern about using AI tools?",
        options: [
          "They might replace my job or make my skills obsolete",
          "Privacy and security of my personal information",
          "The learning curve seems too steep",
          "They're too expensive or complex",
          "I'm worried about becoming too dependent on them",
          "I don't have any major concerns"
        ],
        voiceScript: "What's your biggest concern about using AI tools? Choose the option that resonates most with your feelings."
      },
      {
        id: 9,
        type: "pain-avoidance",
        question: "Which work-related frustrations would you most like to eliminate?",
        options: [
          "Repetitive, time-consuming tasks",
          "Writer's block or creative blocks",
          "Information overload and research time",
          "Poor organization and lost productivity",
          "Difficulty keeping up with industry changes",
          "Inefficient communication and collaboration"
        ],
        voiceScript: "Which work-related frustrations would you most like to eliminate? Think about the pain points that slow you down or stress you out."
      },
      {
        id: 10,
        type: "this-that",
        question: "When learning something new, do you prefer:",
        options: [
          "Structured, step-by-step instruction",
          "Hands-on experimentation and discovery"
        ],
        voiceScript: "When learning something new, do you prefer structured, step-by-step instruction, or hands-on experimentation and discovery?"
      },
      {
        id: 11,
        type: "yes-no",
        question: "Do you believe AI will create more opportunities than it eliminates?",
        voiceScript: "Here's a big picture question: Do you believe AI will create more opportunities than it eliminates?"
      },
      {
        id: 12,
        type: "rating",
        question: "How confident are you in your ability to adapt to AI-powered changes in your industry?",
        voiceScript: "On a scale of 1 to 10, how confident are you in your ability to adapt to AI-powered changes in your industry?"
      },
      {
        id: 13,
        type: "multiple-choice",
        question: "What would most motivate you to start using AI tools regularly?",
        options: [
          "Seeing clear evidence of time savings",
          "Having someone teach me step-by-step",
          "Knowing my competitors are using them",
          "Understanding they're secure and private",
          "Having affordable, easy-to-use options available"
        ],
        voiceScript: "What would most motivate you to start using AI tools regularly? Think about what would tip the scales for you."
      },
      {
        id: 14,
        type: "desires",
        question: "Which benefits of AI are most appealing to you personally?",
        options: [
          "Saving time on routine tasks",
          "Enhancing creativity and brainstorming",
          "Making better, data-driven decisions",
          "Learning new skills more efficiently",
          "Improving work quality and accuracy",
          "Having a 24/7 intelligent assistant"
        ],
        voiceScript: "Which benefits of AI are most appealing to you personally? Select all the benefits that excite you."
      },
      {
        id: 15,
        type: "this-that",
        question: "Looking ahead, are you more:",
        options: [
          "Excited about AI's potential to transform your life",
          "Cautious about moving too quickly with AI adoption"
        ],
        voiceScript: "As we wrap up, looking ahead, are you more excited about AI's potential to transform your life, or cautious about moving too quickly with AI adoption?"
      }
    ]
  }
];