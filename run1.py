# main.py
from fastapi import FastAPI, HTTPException, Header, BackgroundTasks
from fastapi import Header
from typing import List, Optional
from pydantic import BaseModel, HttpUrl
from prompt import founder_template, founder_dynamics_template, talking_points_marketopp_template, talking_points_coach_template, concerns_template
from langchain.chains import LLMChain
from fastapi.middleware.cors import CORSMiddleware
from celery import Celery, current_task
from celery.result import AsyncResult

import os
import requests
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

# from scoring import scoring_prompt
from dynamic_scoring import *

load_dotenv()

# FastAPI app
app = FastAPI()

# Celery configuration
celery_app = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI configuration
os.environ['OPENAI_API_KEY'] = os.environ.get('OPENAI_API_KEY')
llm = ChatOpenAI(model="gpt-4-0613")

# API Key (replace with a more secure method in production)
API_KEY = os.environ.get('API_KEY', 'your-api-key')

# Pydantic models
class CompanyInfo(BaseModel):
    Company: str
    legal_name: str
    description: str
    website: str
    product_launched: str
    launch_date: Optional[str]
    industry_sector: str
    headquarters_location: str
    incorporation_location: str
    revenue_last_six_months: str
    ebitda_last_six_months: str
    revenue_trend_explanation: Optional[str]
    total_customers_six_months_ago: int
    notable_customers: Optional[str]
    monthly_burn_rate: str
    cash_balance: str
    target_customer_location: str
    go_to_market_channels: str
    problem_addressed: str
    competitors: str
    unique_value_proposition: str
    outside_funding_raised: Optional[str]
    assistance_needed: str
    applied_to_500_previously: Optional[str]
    progress_since_last_application: Optional[str]
    founding_team: str
    reason_for_starting_company: str
    execution_vision_team: str
    prior_funding_experience: Optional[str]
    team_wins: Optional[str]
    business_highlights: List[str]
    full_time_employees: int
    part_time_employees: int
    co_founders: List[str]
    co_founders_linkedin: List[str]
    founder_story: str
    expectations_from_investor: str
    primary_contact_first_name: str
    primary_contact_last_name: str
    primary_contact_email: str
    primary_contact_phone: str
    pitch_deck_link: str
    product_demo_video: Optional[str]
    fundraising_amount: str
    company_valuation: str
    equity_split: str
    funding_commitments: Optional[str]
    business_stage: str

# Helper function to validate API key
def validate_api_key(api_key: str = Header(...)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI with Celery! Go to /docs for API documentation."}

@celery_app.task(name="process_company_data")
def process_company_data(company_data: dict, row_id: str, submission_id: str, table_data: str):
    input_json = company_data
    task_id = current_task.request.id

    # Send webhook notification
    webhook_url = os.environ.get('WEBHOOK_URL', 'https://webhook.site/c28523bf-7fc0-4ad9-afbb-cd476a82057d')

    # Process data using LLMChain
    llm_chain = LLMChain(prompt=founder_template, llm=llm)
    response = llm_chain.invoke(input_json)
    

    requests.post(webhook_url, json={
        "row_id": row_id,
        "submission_id": submission_id,
        "status": "completed",
        "result":  response['text'],
        "type": 'FOUNDER_SUMMARY',
        "task_id": task_id
    })

    founder_dynamics_chain = LLMChain(prompt=founder_dynamics_template, llm=llm)
    response2 = founder_dynamics_chain.invoke(input_json)

    requests.post(webhook_url, json={
        "row_id": row_id,
        "submission_id": submission_id,
        "status": "completed",
        "result":  response2['text'],
        "type": 'FOUNDER_DYNAMICS',
        "task_id": task_id
    })

    talking_points_marketopp_chain = LLMChain(prompt=talking_points_marketopp_template, llm=llm)
    response3 = talking_points_marketopp_chain.invoke(input_json)

    requests.post(webhook_url, json={
        "row_id": row_id,
        "submission_id": submission_id,
        "status": "completed",
        "result":  response3['text'],
        "type": 'TALKING_MARKETOPP',
        "task_id": task_id
    })

    talking_points_coach_chain = LLMChain(prompt=talking_points_coach_template, llm=llm)
    response4 = talking_points_coach_chain.invoke(input_json)
    

    requests.post(webhook_url, json={
        "row_id": row_id,
        "submission_id": submission_id,
        "status": "completed",
        "result":  response4['text'],
        "type": 'TALKING_COACH',
        "task_id": task_id
    })

    concerns_chain = LLMChain(prompt=concerns_template, llm=llm)
    response5 = concerns_chain.invoke(input_json)

    requests.post(webhook_url, json={
        "row_id": row_id,
        "submission_id": submission_id,
        "status": "completed",
        "result":  response5['text'],
        "type": 'CONCERNS',
        "task_id": task_id
    })
    input_json['table_data'] = generate_conditions(table_data)

    output_class = generate_scoring_output(table_data)
    parser = JsonOutputParser(pydantic_object=output_class)
    
    dynamic_scoring_prompt = PromptTemplate(
        template=scoring_q,
        input_variables=[
            "Company", "legal_name", "founding_team", "problem_addressed", "industry_sector",
            "headquarters_location", "incorporation_location", "product_launched", "launch_date",
            "competitors", "unique_value_proposition", "target_customer_location", "go_to_market_channels",
            "revenue_last_six_months", "ebitda_last_six_months", "cash_balance", "monthly_burn_rate",
            "team_wins", "prior_funding_experience", "fundraising_amount", "company_valuation", 
            "execution_vision_team", "table_data"
        ],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )

    scoring_chain = LLMChain(prompt=dynamic_scoring_prompt, llm=llm)
    response6 = scoring_chain.invoke(input_json)

    requests.post(webhook_url, json={
        "row_id": row_id,
        "submission_id": submission_id,
        "status": "completed",
        "result":  response6['text'],
        "type": 'SCORING',
        "task_id": task_id
    })

    result = {
        "founder_summary": response['text'],
        "founder_dynamics": response2['text'],
        "talking_points_marketopp": response3['text'],
        "talking_points_coach": response4['text'],
        "concerns": response5['text'],
        "scoring": response6['text']
    }

    
    # requests.post(webhook_url, json={
    #     "row_id": row_id,
    #     "submission_id": submission_id,
    #     "status": "completed",
    #     "result": result
    # })

    return result

@app.post("/submit-and-process-company")
async def submit_and_process_company(
    info: CompanyInfo,
    table_data: str,
    row_id: str,
    submission_id: str,
    # api_key: str = Header(...)
):
    # validate_api_key(api_key)

    # Convert CompanyInfo to dict
    company_data = info.dict()

    # Queue the task for processing
    task = process_company_data.delay(company_data, row_id, submission_id, table_data)

    return {"message": "Company info submitted and processing started", "task_id": task.id}

@app.get("/task-status/{task_id}")
async def get_task_status(task_id: str):#, api_key: str = Header(...)):
    # validate_api_key(api_key)
    task_result = AsyncResult(task_id)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result if task_result.ready() else None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get('PORT', 8080)))

# In a separate file named 'celery_worker.py':
from celery import Celery

app = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')

# Include the tasks from main.py
app.autodiscover_tasks(['run'])

# To run the Celery worker:
# celery -A celery_worker worker --loglevel=info

# To run Flower for monitoring:
# celery -A celery_worker flower


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get('PORT', 8080)))