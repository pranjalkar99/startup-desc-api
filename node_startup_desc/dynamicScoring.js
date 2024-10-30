
import { PromptTemplate } from "@langchain/core/prompts";

class TableData {
    constructor(topicId, topic, description, maxPoints, questions) {
        this.topicId = topicId || "";
        this.topic = topic || "";
        this.description = description || "";
        this.maxPoints = maxPoints || 5;
        this.questions = questions || [];
    }
}

class Question {
    constructor(questionId, question, scores) {
        this.questionId = questionId || "";
        this.question = question || "";
        this.scores = scores || [];
    }
}

class Score {
    constructor(answer, point) {
        this.answer = answer || "";
        this.point = point || 0;
    }
}

function parseJsonData(jsonData) {
    return jsonData.map(topic => {
        const questions = topic.data.map(q => 
            new Question(
                q.question_id,
                q.question,
                q.scores.map(s => new Score(s.answer, s.point)),
                
            )
        );

        return new TableData(
            topic.topic_id,
            topic.topic,
            topic.topic_description,
            topic.maxPoints,
            questions
        );
    });
}

function generateConditions(tableData) {
    let conditionsStr = "";

    tableData.forEach(topic => {
        conditionsStr += `# ${topic.topic} (Topic ID: ${topic.topicId}) #\n`;
        conditionsStr += `Maximum points: ${topic.maxPoints}\n\n`;

        topic.questions.forEach(question => {
            conditionsStr += `## ${question.question} (Question ID: ${question.questionId}) ##\n`;
            
            question.scores.forEach(score => {
                conditionsStr += `If the answer matches '${score.answer}', assign ${score.point} point(s).\n`;
            });
            conditionsStr += "\n";
        });
        conditionsStr += "\n";
    });

    return conditionsStr;
}

// New function to create the output schema
function createOutputSchema() {
    return {
        type: "array",
        items: {
            type: "object",
            properties: {
                topic_id: { type: "string" },
                question_id: { type: "string" },
                score: { type: "number" },
                concise_reason: { type: "string" }
            },
            required: ["topic_id", "question_id", "score", "concise_reason"]
        }
    };
}

function processData(jsonData) {
    const parsedData = parseJsonData(jsonData);
    const conditions = generateConditions(parsedData);
    const outputSchema = createOutputSchema();
    
    return {
        parsedData,
        conditions,
        outputSchema
    };
}

const scoringQ = PromptTemplate.fromTemplate(`
   
    You have access to some 'Company BackGround Information' and some 'table data', which you have to use to complete the given task. Analyse the answers and create the scoring system based on the below 'table_data' for this entrepreneur. You have to create the scoring based on the answers/ transcripts and the criteria given in the documents

Once you complete the scoring, you will need to average each topic to 5. Some topics have multiple aspects being evaluated. For example, Founder dynamics has two aspects being evaluated. You will need to average them together out of 5. 

If information is not available, say N/A. 


Here is the Background Information:

"""
Company Information:
{company_data}
"""
"""


Here is the table conditions fields that you need to consider for scoring:

{table_data}

Think carefully for a long time  and analyze the summary information of the company carefully, so that you can analyze the number of years it has been in business with, the founder dynamics, mentor support, revenue dynamics, ability to hire talent, commercial saviness, purpose, etc and other impportant information that can be helpful for a investor analyzing a startup for investment. Then consider the fields, against which you need to analyze this company for scoring as per the rules and template defined to you. Try your best to come up with a score instead of N/A. 

You will return expected output in JSON format for the updatted table..

The output should be in the following format:

List of objects with the following fields:
- question_id: The ID of the question
- topic_id: The ID of the topic
- score: The score for the question
- question: The question for which the score is assigned
- reason: The reason for the score assigned based on the company info and the scoring logic defined in the table data.
 Stick to the facts of the company for investment analysis and answering the questions and do not give opinions. If enough necessary information is not present in the company data, then you can assign 0 to the score.
 `);

 export {
    TableData,
    Question,
    Score,
    parseJsonData,
    generateConditions,
    processData,
    scoringQ
};


