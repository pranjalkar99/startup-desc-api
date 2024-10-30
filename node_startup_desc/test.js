import { ChatPromptTemplate } from "@langchain/core/prompts";
import { processData } from "./dynamicScoring.js";

async function run() {

  const jsonData = [
    {
      "topic_id": "T1",
      "topic": "Founder Dynamics",
      "topic description": "Founders' relationship, expertise, and business dynamics.",
      "maxPoints": 5,
      "data": [
        {
          "question_id": "Q1",
          "question": "How long have the founders worked together?",
          "scores": [
            { "answer": "Never", "point": 0 },
            { "answer": "0 - 1 years", "point": 1 },
            { "answer": "1 - 2 years", "point": 2 },
            { "answer": "2 - 3 years", "point": 3 },
            { "answer": "3 - 5 years", "point": 4 },
            { "answer": "5+ years", "point": 5 }
          ]
        },
        {
          "question_id": "Q2",
          "question": "Do the founders have relevant expertise in the sector they are entering?",
          "scores": [
            { "answer": "No", "point": 0 },
            { "answer": "Two Founders but one founder has over 90% equity", "point": 1 },
            { "answer": "Two Founders but one founder has over 80% equity", "point": 2 },
            { "answer": "2 - 3 years", "point": 3 },
            { "answer": "3 - 5 years", "point": 4 },
            { "answer": "Yes", "point": 5 }
          ]
        },
        {
          "question_id": "Q3",
          "question": "Are there multiple founders? What is the equity split?",
          "scores": [
            { "answer": "Single Founder", "point": 0 },
            { "answer": "Two Founders but one founder has over 90% equity", "point": 1 },
            { "answer": "Two Founders but one founder has over 80% equity", "point": 2 },
            { "answer": "Two Founders but one founder has over 70% equity", "point": 3 },
            { "answer": "Two Founders but one founder has over 50% equity", "point": 4 },
            { "answer": "Multiple Founders - equal equity split", "point": 5 }
          ]
        }
      ]
    },
    {
      "topic_id": "T2",
      "topic": "Commercial Savviness",
      "topic description": "Understanding competitors, customer, and pricing strategy.",
      "maxPoints": 5,
      "data": [
        {
          "question_id": "Q4",
          "question": "Can they identify and categorize your direct and indirect competitors?",
          "scores": [
            { "answer": "No", "point": 0 },
            { "answer": "Very basic", "point": 1 },
            { "answer": "Some identification", "point": 2 },
            { "answer": "Detailed identification", "point": 3 },
            { "answer": "Clear categorization", "point": 4 },
            { "answer": "Strategic insights", "point": 5 }
          ]
        },
        {
          "question_id": "Q5",
          "question": "What makes the product or service unique compared to competitors?",
          "scores": [
            { "answer": "No USP", "point": 0 },
            { "answer": "Basic USP", "point": 1 },
            { "answer": "Some USP", "point": 2 },
            { "answer": "Detailed USP", "point": 3 },
            { "answer": "Clear differentiation", "point": 4 },
            { "answer": "Evidence-based USP", "point": 5 }
          ]
        },
        {
          "question_id": "Q6",
          "question": "Do they understand who the customer is? Do they have a well-thought-out pricing strategy?",
          "scores": [
            { "answer": "None at all", "point": 0 },
            { "answer": "Very basic understanding", "point": 1 },
            { "answer": "Decent understanding but no strategy", "point": 2 },
            { "answer": "Moderate understanding with basic strategy", "point": 3 },
            { "answer": "Good understanding of customer and pricing", "point": 4 },
            { "answer": "Clear and articulate understanding of customer and strategy", "point": 5 }
          ]
        }
      ]
    },
    {
      "topic_id": "T3",
      "topic": "Ability to execute",
      "topic description": "Capability to achieve business goals and outperform rivals.",
      "maxPoints": 5,
      "data": [
        {
          "question_id": "Q7",
          "question": "How is the team uniquely positioned to outperform competitors?",
          "scores": [
            { "answer": "No clear advantage", "point": 0 },
            { "answer": "Some advantage but not enough", "point": 1 },
            { "answer": "Basic strengths", "point": 2 },
            { "answer": "Detailed strengths", "point": 3 },
            { "answer": "Relevant experience", "point": 4 },
            { "answer": "Proven track record", "point": 5 }
          ]
        }
      ]
    }
  ];

  const result = processData(jsonData);
  console.log(result.conditions); // View scoring conditions
  console.log(result.scoringModel); // View dynamic scoring model
}

run();
