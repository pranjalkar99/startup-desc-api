from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, create_model
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
import json

import json

from typing import List, Dict

class TableData(BaseModel):
    topic: str
    assessment: str
    one_point: str
    two_point: str
    three_point: str
    four_point: str
    five_point: str

class TableDataList(BaseModel):
    tables: List[TableData]

class EvaluationCriteria(BaseModel):
    question: str
    options: List[Optional[str]]  
    scores: List[int]  



def create_dynamic_model(field_data: Dict[str, Any]) -> Any:
    """
    Create a dynamic Pydantic model based on the given field data.
    Each field represents a unique topic, and the evaluation criteria are mapped to each topic.
    """
    dynamic_model_fields = {}

    
    for field_name, (field_type, field_info) in field_data.items():
        
        dynamic_model_fields[field_name] = (field_type, field_info)
    
    
    return create_model('DynamicScoringModel', **dynamic_model_fields)

def parse_table_data(table_data_list: TableDataList) -> Dict[str, Any]:
    """
    Parses a list of TableData objects into a dictionary of dynamic fields
    based on topics and evaluation criteria.

    Args:
        table_data_list (TableDataList): A list of TableData objects.

    Returns:
        Dict[str, Any]: A dictionary with topics as keys and dynamic field definitions.
    """

    topics = {}

    # Iterate through the list of TableData objects
    for row in table_data_list['tables']:
        topic = row['topic']  # Extract the topic
        question = row['assessment']  # Extract the assessment question
        points = [row['one_point'], row['two_point'], row['three_point'], row['four_point'], row['five_point']]  # Extract known point keys
 # Extract points

        # Clean up points, removing empty ones
        points = [p.strip() for p in points if p.strip()]

        # Create an EvaluationCriteria object for this row
        evaluation = EvaluationCriteria(
            question=question,
            options=points,
            scores=list(range(1, len(points) + 1))  # Score points from 1 to N
        )

        # Group evaluations by topic
        if topic in topics:
            topics[topic].append(evaluation)
        else:
            topics[topic] = [evaluation]

    # Generate dynamic fields for each topic
    dynamic_fields = {}
    for topic, criteria in topics.items():
        field_name = topic.replace(" ", "_")  # Convert topic to a valid field name
        if len(criteria) > 1:
            # If there are multiple criteria for a topic, use a list
            dynamic_fields[field_name] = (List[EvaluationCriteria], Field(description=f"Criteria for {topic}"))
        else:
            # If only one criterion, use a single EvaluationCriteria
            dynamic_fields[field_name] = (EvaluationCriteria, Field(description=f"Criteria for {topic}"))

    return dynamic_fields


def generate_conditions(table_data_list: TableDataList) -> str:
    """
    Generate conditions from a list of TableData objects.

    Args:
        table_data_list (TableDataList): A list containing the table data.

    Returns:
        str: A formatted string containing the conditions.
    """

    conditions_str = ""
    print(table_data_list)

    # Iterate over each TableData object in the list
    for row in table_data_list['tables']:
        points = [row['one_point'], row['two_point'], row['three_point'], row['four_point'], row['five_point']]  # Extract known point keys

        # Create a condition block for the current row
        if row['topic'] and row['assessment']:  # Ensure both topic and assessment are present
            condition_block = f"## {row['topic']} - {row['assessment'].strip()} ##\n"

            for i, point in enumerate(points):
                if point and point.strip():  # Only include non-empty points
                    condition_block += f"If the answer matches '{point.strip()}', assign {i + 1} point(s).\n"

            conditions_str += condition_block + "\n"

    return conditions_str



def generate_scoring_output(table_data: dict) -> Dict[str, Any]:
    
    dynamic_fields = parse_table_data(table_data)

    print(dynamic_fields)

    
    DynamicScoringModel = create_dynamic_model(dynamic_fields)

    print(DynamicScoringModel)

    return DynamicScoringModel


background_info= '''

Summary:

{Company}, legally known as {legal_name}, was founded by {founding_team} with the purpose of addressing {problem_addressed} in the {industry_sector}. The company, headquartered in {headquarters_location} and incorporated in {incorporation_location}, successfully launched {product_launched} on {launch_date}. Operating in a competitive landscape with players like {competitors}, their unique value proposition, {unique_value_proposition}, sets them apart. The company's go-to-market strategy focuses on reaching {target_customer_location} via {go_to_market_channels}, aiming to capture a significant share of the market.

Financially, {Company} has reported a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months} over the last six months, supported by a current cash balance of {cash_balance}. Their monthly burn rate of {monthly_burn_rate} indicates disciplined spending. The founding team’s experience is further highlighted by {team_wins} and their ability to secure prior funding ({prior_funding_experience}). They seek additional funding to meet their goal of raising {fundraising_amount}, with a company valuation of {company_valuation}. Their execution strategy, {execution_vision_team}, reflects their commitment to growth and scalability.

"""

'''

scoring_q = ''' You have access to some `BackGround Information ` and some `table data`, which you have to use to complete the given task. Analyse the answers and create the scoring system based on the below `table_data` for this entrepreneur. You have to create the scoring based on the answers/ transcripts and the criteria given in the documents

Once you complete the scoring, you will need to average each topic to 5. Some topics have multiple aspects being evaluated. For example, Founder dynamics has two aspects being evaluated. You will need to average them together out of 5. 

If information is not available, say N/A. 


Here is the Background Information:

"""
Summary:

{Company}, legally known as {legal_name}, was founded by {founding_team} with the purpose of addressing {problem_addressed} in the {industry_sector}. The company, headquartered in {headquarters_location} and incorporated in {incorporation_location}, successfully launched {product_launched} on {launch_date}. Operating in a competitive landscape with players like {competitors}, their unique value proposition, {unique_value_proposition}, sets them apart. The company's go-to-market strategy focuses on reaching {target_customer_location} via {go_to_market_channels}, aiming to capture a significant share of the market.

Financially, {Company} has reported a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months} over the last six months, supported by a current cash balance of {cash_balance}. Their monthly burn rate of {monthly_burn_rate} indicates disciplined spending. The founding team’s experience is further highlighted by {team_wins} and their ability to secure prior funding ({prior_funding_experience}). They seek additional funding to meet their goal of raising {fundraising_amount}, with a company valuation of {company_valuation}. Their execution strategy, {execution_vision_team}, reflects their commitment to growth and scalability.

"""
"""


Here is the table conditions fields that you need to consider for scoring:

{table_data}

Think carefully for a long time  and analyze the summary information of the company carefully, so that you can analyze the number of years it has been in business with, the founder dynamics, mentor support, revenue dynamics, ability to hire talent, commercial saviness, purpose, etc and other impportant information that can be helpful for a investor analyzing a startup for investment. Then consider the fields, against which you need to analyze this company for scoring as per the rules and template defined to you. Try your best to come up with a score instead of N/A. 

You will return expected output in JSON format for the updatted table..
'''