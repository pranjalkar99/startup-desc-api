
from langchain_core.output_parsers import JsonOutputParser

from langchain_core.prompts import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_openai import ChatOpenAI


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


background_info= '''

Summary:

{Company}, legally known as {legal_name}, was founded by {founding_team} with the purpose of addressing {problem_addressed} in the {industry_sector}. The company, headquartered in {headquarters_location} and incorporated in {incorporation_location}, successfully launched {product_launched} on {launch_date}. Operating in a competitive landscape with players like {competitors}, their unique value proposition, {unique_value_proposition}, sets them apart. The company's go-to-market strategy focuses on reaching {target_customer_location} via {go_to_market_channels}, aiming to capture a significant share of the market.

Financially, {Company} has reported a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months} over the last six months, supported by a current cash balance of {cash_balance}. Their monthly burn rate of {monthly_burn_rate} indicates disciplined spending. The founding team’s experience is further highlighted by {team_wins} and their ability to secure prior funding ({prior_funding_experience}). They seek additional funding to meet their goal of raising {fundraising_amount}, with a company valuation of {company_valuation}. Their execution strategy, {execution_vision_team}, reflects their commitment to growth and scalability.

"""

'''

scoring_q = f''' You have access to some `BackGround Information ` and some `table data`, which you have to use to complete the given task. Analyse the answers and create the scoring system based on the below `table_data` for this entrepreneur. You have to create the scoring based on the answers/ transcripts and the criteria given in the documents

Once you complete the scoring, you will need to average each topic to 5. Some topics have multiple aspects being evaluated. For example, Founder dynamics has two aspects being evaluated. You will need to average them together out of 5. 

If information is not available, say N/A. 


Here is the Background Information:

{background_info}


Here is the table that you need to consider for scoring:

{table_data}


You will return expected output in JSON format for the updatted table..
'''

# Define your desired data structure.
from typing import List, Optional

class EvaluationCriteria(BaseModel):
    question: str
    options: List[Optional[str]]  # This will hold the scoring options for each question
    scores: List[int]  # This will hold the corresponding scores for each option

class ScoringOutput(BaseModel):
    Founder_Background: EvaluationCriteria = Field(description="Background of the founder")
    Team_Coachability: EvaluationCriteria = Field(description="Coachable qualities of the team")
    Founder_Dynamics: List[EvaluationCriteria] = Field(description="Dynamics among founders")
    Commercial_Savviness: List[EvaluationCriteria] = Field(description="Understanding of the commercial landscape")
    Ability_to_Execute: List[EvaluationCriteria] = Field(description="Execution capabilities of the team")
    Ability_to_Attract_Talent: List[EvaluationCriteria] = Field(description="Talent attraction capabilities")
    Innovation: EvaluationCriteria = Field(description="Innovation metrics")
    Market_Opportunity: EvaluationCriteria = Field(description="Potential market opportunity")
    Traction_Funding: List[EvaluationCriteria] = Field(description="Funding and traction status")
    Purpose: EvaluationCriteria = Field(description="Commitment and investment in the venture")

parser = JsonOutputParser(pydantic_object=ScoringOutput)

scoring_prompt = PromptTemplate(
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
