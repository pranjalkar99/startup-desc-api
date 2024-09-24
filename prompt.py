from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.llms import OpenAI
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

os.environ['OPENAI_API_KEY'] = os.environ.get('OPENAI_API_KEY')




founder_q_prompt = """
Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.

Summary:

{Company}, legally known as {legal_name}, was founded by {founding_team} with the purpose of addressing {problem_addressed} in the {industry_sector}. The company, headquartered in {headquarters_location} and incorporated in {incorporation_location}, successfully launched {product_launched} on {launch_date}. Operating in a competitive landscape with players like {competitors}, their unique value proposition, {unique_value_proposition}, sets them apart. The company's go-to-market strategy focuses on reaching {target_customer_location} via {go_to_market_channels}, aiming to capture a significant share of the market.

Financially, {Company} has reported a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months} over the last six months, supported by a current cash balance of {cash_balance}. Their monthly burn rate of {monthly_burn_rate} indicates disciplined spending. The founding team’s experience is further highlighted by {team_wins} and their ability to secure prior funding ({prior_funding_experience}). They seek additional funding to meet their goal of raising {fundraising_amount}, with a company valuation of {company_valuation}. Their execution strategy, {execution_vision_team}, reflects their commitment to growth and scalability.

"""

founder_dynamics_q_prompt = """
Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.

Summary:

{Company}, legally registered as {legal_name}, is focused on addressing {problem_addressed} within the {industry_sector}. The founders, {founding_team}, launched {product_launched} on {launch_date}, aiming to capture {target_customer_location}. They’ve built the company from {headquarters_location}, leveraging a unique value proposition of {unique_value_proposition} to stand out from competitors like {competitors}. The founders, driven by {reason_for_starting_company}, are strategically targeting customers through channels like {go_to_market_channels}. 

Financial performance in the last six months shows a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months}, with {total_customers_six_months_ago} customers as of six months ago, including notable clients such as {notable_customers}. With a monthly burn rate of {monthly_burn_rate} and a current cash balance of {cash_balance}, the team is efficiently managing its resources. Their experience with {prior_funding_experience} has enabled them to raise {outside_funding_raised}, positioning them well for future fundraising goals of {fundraising_amount}. Their vision and execution strategy are supported by the team’s achievements like {team_wins} and a clear focus on {execution_vision_team}.

"""

talking_points_q_marketopp_prompt = """
Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.

Summary:

{Company}, legally known as {legal_name}, has been making strides in the {industry_sector} by solving {problem_addressed} with their innovative product/service, {product_launched}. Since launching on {launch_date}, the company has targeted {target_customer_location} through {go_to_market_channels}. Their financial performance, with a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months}, shows steady growth. They differentiate themselves through {unique_value_proposition}, while key competitors include {competitors}.

The company has a strong financial position with a cash balance of {cash_balance}, though their monthly burn rate of {monthly_burn_rate} reflects ongoing operational costs. The founding team’s leadership, including {co_founders}, has propelled the company forward, driving customer acquisition and growth, including {total_customers_six_months_ago} customers and notable partnerships with {notable_customers}. They have also successfully raised {outside_funding_raised}, and are looking to secure additional investment of {fundraising_amount} at a valuation of {company_valuation}, with {equity_split} equity split among founders. Their execution strategy, {execution_vision_team}, ensures they are well-positioned to seize new market opportunities.

"""
talking_points_coach_q_prompt = """
Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.

Summary:

{Company}, formally known as {legal_name}, was established to address {problem_addressed} within the {industry_sector}. The founders, {co_founders}, have successfully launched {product_launched} on {launch_date}, from their headquarters in {headquarters_location}. Their strategy revolves around targeting {target_customer_location} through {go_to_market_channels}, differentiating the company from competitors such as {competitors} with their unique value proposition: {unique_value_proposition}. The founders’ decision to create the company stems from {reason_for_starting_company}, and their execution strategy revolves around {execution_vision_team}.

The company has made significant progress in its financial performance, generating {revenue_last_six_months} in revenue and {ebitda_last_six_months} in EBITDA over the last six months. With a burn rate of {monthly_burn_rate} and a current cash balance of {cash_balance}, they are managing expenses prudently. Their ability to attract notable customers like {notable_customers} has been instrumental in growth. They have raised {outside_funding_raised} and are currently seeking to raise {fundraising_amount}, at a valuation of {company_valuation}, to fuel their next stage of growth. The founders’ past wins, such as {team_wins}, and prior funding experience ({prior_funding_experience}) further demonstrate their readiness for expansion.
"""


concerns_q_prompt = """
Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.

Summary:

{Company}, legally known as {legal_name}, is focused on addressing {problem_addressed} in the {industry_sector}. The product/service, {product_launched}, launched on {launch_date}, aims to tackle key issues in the market. The company's go-to-market strategy targets {target_customer_location}, leveraging {go_to_market_channels}, but competitors such as {competitors} could present challenges. Despite these challenges, their unique value proposition—{unique_value_proposition}—offers a strong differentiator.

Financially, while the company reported {revenue_last_six_months} in revenue and {ebitda_last_six_months} EBITDA over the last six months, there are concerns over the monthly burn rate of {monthly_burn_rate} and the sustainability of their cash balance ({cash_balance}). Their goal of raising {fundraising_amount} at a valuation of {company_valuation} will be crucial to maintaining growth. With {full_time_employees} full-time and {part_time_employees} part-time employees, the team’s ability to execute effectively will be vital. The company's previous wins ({team_wins}) and the leadership of the founding team {founding_team} offer hope, but challenges in competition and resource management remain key concerns.

"""



founder_template = PromptTemplate(input_variables=[
        "Company", "legal_name", "founding_team", "problem_addressed", 
        "industry_sector", "headquarters_location", "incorporation_location", 
        "product_launched", "launch_date", "competitors", 
        "unique_value_proposition", "target_customer_location", 
        "go_to_market_channels", "revenue_last_six_months", 
        "ebitda_last_six_months", "cash_balance", "monthly_burn_rate", 
        "team_wins", "prior_funding_experience", "fundraising_amount", 
        "company_valuation", "execution_vision_team"
    ], template=founder_q_prompt)

founder_dynamics_template = PromptTemplate(
    input_variables=[
        "Company", "legal_name", "problem_addressed", "industry_sector", 
        "founding_team", "product_launched", "launch_date", 
        "target_customer_location", "go_to_market_channels", 
        "revenue_last_six_months", "ebitda_last_six_months", 
        "total_customers_six_months_ago", "notable_customers", 
        "monthly_burn_rate", "cash_balance", "prior_funding_experience", 
        "outside_funding_raised", "fundraising_amount", "team_wins", 
        "execution_vision_team"
    ],
    template = founder_dynamics_q_prompt)



talking_points_marketopp_template = PromptTemplate(
    input_variables=[
        "Company", "legal_name", "industry_sector", "problem_addressed", 
        "product_launched", "launch_date", "target_customer_location", 
        "go_to_market_channels", "revenue_last_six_months", 
        "ebitda_last_six_months", "unique_value_proposition", 
        "competitors", "cash_balance", "monthly_burn_rate", 
        "co_founders", "total_customers_six_months_ago", 
        "notable_customers", "outside_funding_raised", 
        "fundraising_amount", "company_valuation", "equity_split", 
        "execution_vision_team"
    ],template=talking_points_q_marketopp_prompt)

talking_points_coach_template = PromptTemplate(
    input_variables=[
        "Company", "legal_name", "problem_addressed", "industry_sector", 
        "co_founders", "product_launched", "launch_date", 
        "headquarters_location", "target_customer_location", 
        "go_to_market_channels", "competitors", "unique_value_proposition", 
        "reason_for_starting_company", "execution_vision_team", 
        "revenue_last_six_months", "ebitda_last_six_months", 
        "monthly_burn_rate", "cash_balance", "notable_customers", 
        "outside_funding_raised", "fundraising_amount", "company_valuation", 
        "team_wins", "prior_funding_experience"
    ],
    template=talking_points_coach_q_prompt)

concerns_template = PromptTemplate(
    input_variables=[
        "Company", "legal_name", "problem_addressed", "industry_sector", 
        "product_launched", "launch_date", "target_customer_location", 
        "go_to_market_channels", "competitors", "unique_value_proposition", 
        "revenue_last_six_months", "ebitda_last_six_months", 
        "monthly_burn_rate", "cash_balance", "fundraising_amount", 
        "company_valuation", "full_time_employees", 
        "part_time_employees", "team_wins", "founding_team"
    ],
    template=concerns_q_prompt)



# Create the LLMChain for report generation


# # Example dictionary with company details (just an example, you will provide the real data)
# company_data = {
#     "Company": "InnovateTech",
#     "legal_name": "Innovate Technologies Inc.",
#     "website": "www.innovatetech.com",
#     "headquarters": "San Francisco, CA",
#     "incorporation_location": "Delaware",
#     "industry_sector": "Technology",
#     "business_description": "InnovateTech provides AI-driven solutions to optimize business processes.",
#     "launched": "Yes",
#     "launch_date": "2023-01-01",
#     "revenue": "$500,000",
#     "ebitda": "$50,000",
#     "revenue_trend": "Increasing by 20% MoM",
#     "total_customers": "100",
#     "notable_customers": "TechCorp, DataSolutions",
#     "burn_rate": "$30,000",
#     "cash_balance": "$200,000",
#     "target_customers": "North America, Europe",
#     "go_to_market_channels": "Direct sales, Partnerships",
#     "problem_addressed": "Businesses struggle with inefficient processes that lead to high operational costs.",
#     "competitors": "Competitor A, Competitor B",
#     "differentiation": "Our AI solution integrates seamlessly with existing business software.",
#     "raised_funding": "$1M",
#     "previous_funding": "$500,000",
#     "accelerator_assistance": "We need mentorship in scaling operations and expanding our customer base.",
#     "founder_reason": "We saw a gap in how AI was being used to solve operational inefficiencies.",
#     "founder_strength": "The founding team has over 30 years of combined experience in AI and business automation.",
#     "team_wins": "Secured partnerships with two Fortune 500 companies.",
#     "highlight_1": "Achieved 20% MoM revenue growth.",
#     "highlight_2": "Secured $1M in funding.",
#     "highlight_3": "Built a team of 20 AI engineers.",
#     "full_time_employees": "20",
#     "part_time_employees": "5",
#     "co_founders": "John Doe, Jane Smith",
#     "founders_reflection": "We believe our unique approach to AI automation will revolutionize the industry.",
#     "investor_expectation": "We expect our investors to provide strategic guidance and mentorship.",
#     "primary_contact_first_name": "John",
#     "primary_contact_last_name": "Doe",
#     "primary_contact_email": "john@innovatetech.com",
#     "primary_contact_phone": "+1-555-1234",
#     "pitch_deck_link": "www.innovatetech.com/pitch-deck",
#     "product_demo_link": "www.innovatetech.com/product-demo",
#     "fundraising_amount": "$5M",
#     "valuation": "$20M",
#     "equity_split": "40% founders, 60% investors",
#     "funding_commitments": "$2M",
#     "business_stage": "Scaling",
#     "founder_vision": "We aim to become the global leader in AI-powered business automation solutions."
# }

# # Run the LLMChain to generate the summary
# summary = llm_chain.run(company_data)

# # Output the result
# print(summary)