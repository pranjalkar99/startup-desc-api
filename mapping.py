from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
import os,json
from dotenv import load_dotenv

load_dotenv()

# Define the data models
class Question(BaseModel):
    question: str
    questionId: str

class RequestBody(BaseModel):
    investmentProfileQuestions: List[Question]
    csvData: List[str]

class QuestionMapping(BaseModel):
    questionId: str
    mappedField: str
    confidence: float
    field_index: int

class ResponseBody(BaseModel):
    mappings: List[QuestionMapping]

# Initialize FastAPI app
app = FastAPI()

# Set OpenAI API key using environment variable
os.environ['OPENAI_API_KEY'] = os.environ.get('OPENAI_API_KEY')
llm = ChatOpenAI(model="gpt-4o-mini")

output_parser = JsonOutputParser()

# Create the prompt template
prompt_template = PromptTemplate(
    template="""You are an expert in mapping questions to their corresponding data fields.
    
Given the following question and list of available fields, determine which field the question is most likely asking about.

Question: {question}

Available Fields:
{fields}

Provide your response in the following JSON format:
{{
    "mappedField": "name_of_field",
    "confidence": 0.0 to 1.0 (how confident you are in this mapping)
}}

Rules:
1. Only select from the available fields provided
2. If no field seems appropriate, return '' for mappedField
3. Base confidence score on how well the question matches the field
4. Consider semantic meaning, not just keyword matching

Response:""",
    input_variables=["question", "fields"]
)

@app.post("/map-questions", response_model=ResponseBody)
async def map_questions(request: RequestBody):
    # Extract all available fields from the request
    if not request.csvData or not request.csvData[0]:
        raise HTTPException(status_code=400, detail="CSV data is empty or invalid")
    
    available_fields = request.csvData

    mappings = []
    
    for question in request.investmentProfileQuestions:
        # Format the prompt with the current question and available fields
        prompt = prompt_template.format(
            question=question.question,
            fields="\n".join(available_fields)  # Join the fields with newlines for better readability
        )

        # Call the LLM with the generated prompt
        response = llm.predict(prompt)

        # Parse the LLM response as JSON
        try:
            result = json.loads(response)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse LLM response")


        

        # Create the mapping
        mapping = QuestionMapping(
            questionId=question.questionId,
            mappedField=result.get("mappedField", ""),  # Default to empty string if not provided
            confidence=result.get("confidence", 0.0),  # Default to 0.0 if not provided
            field_index = available_fields.index(result.get("mappedField", "")) if result.get("mappedField", "") in available_fields else None
        )
        mappings.append(mapping)

    return ResponseBody(mappings=mappings)

# Example usage
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get('PORT', 8000)))
