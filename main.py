# main.py
from fastapi import FastAPI, HTTPException
from typing import List, Optional
from pydantic import BaseModel, HttpUrl
from prompt import founder_template,founder_dynamics_template, talking_points_marketopp_template,talking_points_coach_template, concerns_template
from langchain.chains import LLMChain
from fastapi.middleware.cors import CORSMiddleware
from celery import Celery
from celery.result import AsyncResult

import requests


import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

import numpy as np
# from trulens.core import Feedback
# from trulens.providers.openai import OpenAI
# from trulens.apps.langchain import TruChain
from scoring import scoring_prompt



load_dotenv()

# provider = OpenAI()



os.environ['OPENAI_API_KEY'] = os.environ.get('OPENAI_API_KEY')

llm = ChatOpenAI(model="gpt-4o-mini")

API_KEY = os.environ.get('API_KEY', 'your-api-key')

celery_app = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)


class CompanyInfo(BaseModel):
    Company: str
    legal_name: str
    description: str
    website: HttpUrl
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
    co_founders_linkedin: List[HttpUrl]
    founder_story: str
    expectations_from_investor: str
    primary_contact_first_name: str
    primary_contact_last_name: str
    primary_contact_email: str
    primary_contact_phone: str
    pitch_deck_link: HttpUrl
    product_demo_video: Optional[HttpUrl]
    fundraising_amount: str
    company_valuation: str
    equity_split: str
    funding_commitments: Optional[str]
    business_stage: str


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (you can restrict this to specific origins)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI in Docker! Go to /docs."}

def validate_api_key(api_key: str = Header(...)):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return api_key


company = {}





@app.post("/submit-company-info/")
async def submit_company_info(info: CompanyInfo, company_id: int):
    print("data submitted")
    global company
    if company_id in company:
        return {"message": "Company info already submitted"}
    company[company_id] = info
    return {"message": "Company info submitted successfully", "data": info}


@app.post("/api_details/{company_id}")
async def founder_summary(row_id: str, submission_id: str, info: CompanyInfo):



    table_data = '''
Topic,What is being assessed/evaluated,1 Point,2 Points,3 Points,4 Points,5 Points
Founder Background,How long have you been in the industry?,0 - 1 years,1 - 2 years,2 - 3 years,3 - 5 years,5 + years
Team Coachability,Do they have a mentor that supports them across this journey,No,,,,Yes
Founder Dynamics,How long have the founders worked together?,0 - 1 years,1 - 2 years,2 - 3 years,3 - 5 years,5+ years
Founder Dynamics,Do the founders have relevant expertise in the sector they are entering?,0 - 1 years,1 - 2 years,2 - 3 years,3 - 5 years,5+ years
Founder Dynamics,Are there multiple founders? What is the equity split?,Single Founder,,Two Founders but one founder has over 80% equity,,Multiple Founders - equal equity split
Commercial Savviness,Can they identify and categorize your direct and indirect competitors?,Unable to identify,Basic identification,Detailed identification,Clear categorization,Strategic insights
Commercial Savviness,What makes the product or service unique compared to competitors?,No clear USP,Basic USP,Detailed USP,Clear differentiation,Evidence-based USP
Commercial Savviness,"Do they understand who the customer is?
 Do they have a well thought out pricing strategy?",No clear understanding of customer and pricing,,Moderately articulate who the customer is and moderately understand competitor pricing. Moderately understand product differentiators. Why pricing works this way,,Clearly articulate who the customer is and clearly understand competitor pricing. Clearly understand product differentiators. Why pricing works this way
Ability to execute,How is the team uniquely positioned to outperform competitors?,No clear advantage,Basic strengths,Detailed strengths,Relevant experience,Proven track record
Ability to attract exceptional talent,What is the level of experience of board members in relevant industries?,No experience,Basic experience,Moderate experience,Extensive experience,Extensive experience with proven success
Ability to attract exceptional talent,What is the level of experience of the senior leadership team in relevant industries?,No experience,Basic experience,Moderate experience,Extensive experience,Extensive experience with proven success
Ability to attract exceptional talent,How long has the senior leadership team been with the organization?,Less than 1 year,1 - 2 years,2 - 3 years,3 - 5 years,More than 5 years
Innovation,Does the business have IP,No patents,1-2 patents,3-5 patents,6-10 patents,10+ patents
Market Opportunity,Can this be a $1B company within 7 years?,NO,,,,Yes
Traction & Funding,Does the business have traction?,No,`,Interest / LOIs,,Revenue
Traction & Funding,Run Rate of the raise and how long will it last,3 months,6 months,12 months,18 months +,Not needed again
Ability to execute,DO the founders have a track record of execution? And have they proven this already at the current business?,No track record,,Strong track record but yet to prove at the current business,,Strong track record and strong growth in the current business
Purpose,What did they give up to come here? Are they full time here? Have they deployed their own capital?,Part Time/ only 3rd party capital,,Deployed Capital/ Part time or No Capital deployed/ Full Time,,"Deployed own capital, full time employed at the current venture"


'''
    # Check if the company_id exists in the global company data
    if company_id not in company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Extract the company data for the given company_id
    company_data = company[company_id]

    # Construct the input JSON based on the CompanyInfo model
    input_json = {
        "Company": company_data.Company,
        "legal_name": company_data.legal_name,
        "description": company_data.description,
        "website": company_data.website,
        "product_launched": company_data.product_launched,
        "launch_date": company_data.launch_date,
        "industry_sector": company_data.industry_sector,
        "headquarters_location": company_data.headquarters_location,
        "incorporation_location": company_data.incorporation_location,
        "revenue_last_six_months": company_data.revenue_last_six_months,
        "ebitda_last_six_months": company_data.ebitda_last_six_months,
        "revenue_trend_explanation": company_data.revenue_trend_explanation,
        "total_customers_six_months_ago": company_data.total_customers_six_months_ago,
        "notable_customers": company_data.notable_customers,
        "monthly_burn_rate": company_data.monthly_burn_rate,
        "cash_balance": company_data.cash_balance,
        "target_customer_location": company_data.target_customer_location,
        "go_to_market_channels": company_data.go_to_market_channels,
        "problem_addressed": company_data.problem_addressed,
        "competitors": company_data.competitors,
        "unique_value_proposition": company_data.unique_value_proposition,
        "outside_funding_raised": company_data.outside_funding_raised,
        "assistance_needed": company_data.assistance_needed,
        "applied_to_500_previously": company_data.applied_to_500_previously,
        "progress_since_last_application": company_data.progress_since_last_application,
        "founding_team": company_data.founding_team,
        "reason_for_starting_company": company_data.reason_for_starting_company,
        "execution_vision_team": company_data.execution_vision_team,
        "prior_funding_experience": company_data.prior_funding_experience,
        "team_wins": company_data.team_wins,
        "business_highlights": company_data.business_highlights,
        "full_time_employees": company_data.full_time_employees,
        "part_time_employees": company_data.part_time_employees,
        "co_founders": company_data.co_founders,
        "co_founders_linkedin": company_data.co_founders_linkedin,
        "founder_story": company_data.founder_story,
        "expectations_from_investor": company_data.expectations_from_investor,
        "primary_contact_first_name": company_data.primary_contact_first_name,
        "primary_contact_last_name": company_data.primary_contact_last_name,
        "primary_contact_email": company_data.primary_contact_email,
        "primary_contact_phone": company_data.primary_contact_phone,
        "pitch_deck_link": company_data.pitch_deck_link,
        "product_demo_video": company_data.product_demo_video,
        "fundraising_amount": company_data.fundraising_amount,
        "company_valuation": company_data.company_valuation,
        "equity_split": company_data.equity_split,
        "funding_commitments": company_data.funding_commitments,
        "business_stage": company_data.business_stage
    }

    # Create an instance of LLMChain and invoke it with the input JSON
    llm_chain = LLMChain(prompt=founder_template, llm=llm)
    response =  llm_chain.invoke(input_json)
    # f_answer_relevance = Feedback(
    # provider.relevance_with_cot_reasons, name="Answer Relevance").on_input_output()

    # print(f_answer_relevance)

    
    founder_dynamics_chain = LLMChain(prompt = founder_dynamics_template, llm=llm)
    response2 =  founder_dynamics_chain.invoke(input_json)
    talking_points_marketopp_chain = LLMChain(prompt = talking_points_marketopp_template, llm=llm)
    response3 =  talking_points_marketopp_chain.invoke(input_json)
    talking_points_coach_chain = LLMChain(prompt = talking_points_coach_template, llm=llm)
    response4 =  talking_points_coach_chain.invoke(input_json)
    concerns_chain = LLMChain(prompt = concerns_template, llm=llm)
    response5 =  concerns_chain.invoke(input_json)

    try:
        updated_json = input_json.copy()
        updated_json.update({"table_data": table_data})
        scoring_chain = LLMChain(prompt=scoring_prompt, llm=llm)
        response6 = scoring_chain.invoke(input_json)
        print(response6['text'])
    except Exception as e:
        print(e)
        # return {"message": "Error in creating scoring chain"}

    # Return the processed message
    return {"founder_summary": response['text'], "founder_dynamics": response2['text'], "talking_points_marketopp": response3['text'], "talking_points_coach": response4['text'], "concerns": response5['text'], "scoring": response6['text']}




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port= int(os.environ.get('PORT', 8080)))