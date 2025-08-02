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
        question: "Are you already using tools like ChatGPT, Gemini, or Claude in your daily routine?",
        voiceScript: "Let's start simple. Are you already using tools like ChatGPT, Gemini, or Claude in your daily routine?"
      },
      {
        id: 2,
        type: "yes-no",
        question: "Be honest with yourself here— have you ever felt lost or overwhelmed when trying to figure out what AI even is?",
        voiceScript: "Be honest with yourself here— have you ever felt lost or overwhelmed when trying to figure out what AI even is?"
      },
      {
        id: 3,
        type: "yes-no",
        question: "This one's important— have you ever tried using an AI tool, but then gave up because you weren't sure how to use it effectively?",
        voiceScript: "This one's important— have you ever tried using an AI tool, but then gave up because you weren't sure how to use it effectively?"
      },
      {
        id: 4,
        type: "yes-no",
        question: "Let's talk about your expectations. Do you believe that AI could help you save time or money, even if you're not sure where to begin?",
        voiceScript: "Let's talk about your expectations. Do you believe that AI could help you save time or money, even if you're not sure where to begin?"
      },
      {
        id: 5,
        type: "this-that",
        question: "Which one feels more like you— are you just curious about AI but unsure where to begin, or have you tried a few tools and now want a more structured path?",
        options: [
          "Just curious about AI but unsure where to begin",
          "Tried a few tools and now want a more structured path"
        ],
        voiceScript: "Which one feels more like you— are you just curious about AI but unsure where to begin, or have you tried a few tools and now want a more structured path?"
      },
      {
        id: 6,
        type: "this-that",
        question: "Let's talk learning style— would you rather get a quick checklist or watch a short video that walks you through your first steps?",
        options: [
          "Get a quick checklist",
          "Watch a short video that walks me through first steps"
        ],
        voiceScript: "Let's talk learning style— would you rather get a quick checklist or watch a short video that walks you through your first steps?"
      },
      {
        id: 7,
        type: "this-that",
        question: "Picture this: You get one instant AI benefit today. Would you want more productivity—or a better way to earn more income?",
        options: [
          "More productivity",
          "A better way to earn more income"
        ],
        voiceScript: "Picture this: You get one instant AI benefit today. Would you want more productivity—or a better way to earn more income?"
      },
      {
        id: 8,
        type: "yes-no",
        question: "Clarity can change everything— would having a clear beginner-friendly roadmap make you feel more confident using AI?",
        voiceScript: "Clarity can change everything— would having a clear beginner-friendly roadmap make you feel more confident using AI?"
      },
      {
        id: 9,
        type: "yes-no",
        question: "No tech headaches here— would you love to start using AI without feeling overwhelmed or too 'techie'?",
        voiceScript: "No tech headaches here— would you love to start using AI without feeling overwhelmed or too 'techie'?"
      },
      {
        id: 10,
        type: "yes-no",
        question: "Here's the big picture— do you think learning the right AI tools now would give you peace of mind about your future success?",
        voiceScript: "Here's the big picture— do you think learning the right AI tools now would give you peace of mind about your future success?"
      },
      {
        id: 11,
        type: "yes-no",
        question: "Let's keep it real— if I gave you a simple 3-step AI checklist right now, would you actually try it?",
        voiceScript: "Let's keep it real— if I gave you a simple 3-step AI checklist right now, would you actually try it?"
      },
      {
        id: 12,
        type: "yes-no",
        question: "This is about commitment— are you willing to spend just 30 minutes learning how AI could improve your everyday life?",
        voiceScript: "This is about commitment— are you willing to spend just 30 minutes learning how AI could improve your everyday life?"
      },
      {
        id: 13,
        type: "yes-no",
        question: "Here's something exclusive— would you like me to send you a free AI starter kit to help you get going today?",
        voiceScript: "Here's something exclusive— would you like me to send you a free AI starter kit to help you get going today?"
      },
      {
        id: 14,
        type: "yes-no",
        question: "Let's take it further— would you be interested in joining a free live AI workshop where we walk through tools together?",
        voiceScript: "Let's take it further— would you be interested in joining a free live AI workshop where we walk through tools together?"
      },
      {
        id: 15,
        type: "yes-no",
        question: "And finally— would you be open to a quick call so I can show you how AI could support your specific goals?",
        voiceScript: "And finally— would you be open to a quick call so I can show you how AI could support your specific goals?"
      }
    ]
  }
];