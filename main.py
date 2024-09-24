# main.py
from fastapi import FastAPI, HTTPException
from typing import List, Optional
from pydantic import BaseModel, HttpUrl, EmailStr
from prompt import founder_template,founder_dynamics_template, talking_points_marketopp_template,talking_points_coach_template, concerns_template
from langchain.chains import LLMChain

import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

os.environ['OPENAI_API_KEY'] = os.environ.get('OPENAI_API_KEY')

llm = ChatOpenAI(model="gpt-4o-mini")

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
    primary_contact_email: EmailStr
    primary_contact_phone: str
    pitch_deck_link: HttpUrl
    product_demo_video: Optional[HttpUrl]
    fundraising_amount: str
    company_valuation: str
    equity_split: str
    funding_commitments: Optional[str]
    business_stage: str


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI in Docker! Go to /docs."}




company = {}





@app.post("/submit-company-info/<int:company_id>")
async def submit_company_info(info: CompanyInfo, company_id: int):
    global company
    if company_id in company:
        return {"message": "Company info already submitted"}
    company[company_id] = info
    return {"message": "Company info submitted successfully", "data": info}


@app.post("/api_details/{company_id}")
async def founder_summary(company_id: int):
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
    founder_dynamics_chain = LLMChain(prompt = founder_dynamics_template, llm=llm)
    response2 =  founder_dynamics_chain.invoke(input_json)
    talking_points_marketopp_chain = LLMChain(prompt = talking_points_marketopp_template, llm=llm)
    response3 =  talking_points_marketopp_chain.invoke(input_json)
    talking_points_coach_chain = LLMChain(prompt = talking_points_coach_template, llm=llm)
    response4 =  talking_points_coach_chain.invoke(input_json)
    concerns_chain = LLMChain(prompt = concerns_template, llm=llm)
    response5 =  concerns_chain.invoke(input_json)

    # Return the processed message
    return {"founder_summary": response['text'], "founder_dynamics": response2['text'], "talking_points_marketopp": response3['text'], "talking_points_coach": response4['text'], "concerns": response5['text']}




if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)