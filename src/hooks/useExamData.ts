
import { useState, useEffect } from 'react';

export interface Question {
  id: string;
  subject: string;
  examType: 'WAEC' | 'JAMB' | 'NECO';
  year: number;
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
}

export interface ExamData {
  examType: 'WAEC' | 'JAMB' | 'NECO';
  subject: string;
  year: number;
  questions: Question[];
  duration: number;
}

// Sample data for demonstration
const sampleQuestions: Question[] = [
  {
    id: '1',
    subject: 'English',
    examType: 'WAEC',
    year: 2023,
    question: 'Choose the option that best completes the following sentence: The students were asked to _____ their assignment before the deadline.',
    options: ['submit', 'submitted', 'submitting', 'submission'],
    correctOption: 'A',
    explanation: 'The correct answer is "submit" because after "asked to", we use the base form of the verb (infinitive without "to").'
  },
  {
    id: '2',
    subject: 'English',
    examType: 'WAEC',
    year: 2023,
    question: 'Which of the following is an example of a metaphor?',
    options: ['He runs like the wind', 'Time is money', 'The door creaked loudly', 'She arrived early'],
    correctOption: 'B',
    explanation: '"Time is money" is a metaphor because it directly compares time to money without using "like" or "as".'
  },
  {
    id: '3',
    subject: 'English',
    examType: 'WAEC',
    year: 2023,
    question: 'What is the plural form of "child"?',
    options: ['childs', 'children', 'childes', 'child'],
    correctOption: 'B',
    explanation: '"Children" is the irregular plural form of "child". It does not follow the standard rule of adding "s" or "es".'
  },
  {
    id: '4',
    subject: 'Mathematics',
    examType: 'JAMB',
    year: 2023,
    question: 'If 2x + 5 = 13, what is the value of x?',
    options: ['3', '4', '5', '6'],
    correctOption: 'B',
    explanation: 'Solving: 2x + 5 = 13, subtract 5 from both sides: 2x = 8, divide by 2: x = 4.'
  },
  {
    id: '5',
    subject: 'Mathematics',
    examType: 'JAMB',
    year: 2023,
    question: 'What is the area of a rectangle with length 8cm and width 5cm?',
    options: ['13 cm²', '26 cm²', '40 cm²', '80 cm²'],
    correctOption: 'C',
    explanation: 'Area of rectangle = length × width = 8cm × 5cm = 40 cm².'
  }
];

export const useExamData = () => {
  const [availableExams, setAvailableExams] = useState<ExamData[]>([]);

  useEffect(() => {
    // Simulate loading exam data
    const exams: ExamData[] = [
      {
        examType: 'WAEC',
        subject: 'English',
        year: 2023,
        questions: sampleQuestions.filter(q => q.subject === 'English' && q.examType === 'WAEC'),
        duration: 45
      },
      {
        examType: 'JAMB',
        subject: 'Mathematics',
        year: 2023,
        questions: sampleQuestions.filter(q => q.subject === 'Mathematics' && q.examType === 'JAMB'),
        duration: 30
      },
      {
        examType: 'WAEC',
        subject: 'Biology',
        year: 2023,
        questions: sampleQuestions.slice(0, 3), // Using sample questions for demo
        duration: 60
      },
      {
        examType: 'NECO',
        subject: 'Physics',
        year: 2023,
        questions: sampleQuestions.slice(0, 4), // Using sample questions for demo
        duration: 50
      }
    ];
    
    setAvailableExams(exams);
  }, []);

  const getExamById = (examType: string, subject: string, year: number): ExamData | undefined => {
    return availableExams.find(
      exam => exam.examType === examType && exam.subject === subject && exam.year === year
    );
  };

  return {
    availableExams,
    getExamById
  };
};
