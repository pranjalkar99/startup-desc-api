import { PromptTemplate } from "@langchain/core/prompts";

const founderSummaryPrompt = PromptTemplate.fromTemplate(`
    Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.
    
    Summary:
    
    {Company}, legally known as {legal_name}, was founded by {founding_team} with the purpose of addressing {problem_addressed} in the {industry_sector}. The company, headquartered in {headquarters_location} and incorporated in {incorporation_location}, successfully launched {product_launched} on {launch_date}. Operating in a competitive landscape with players like {competitors}, their unique value proposition, {unique_value_proposition}, sets them apart. The company's go-to-market strategy focuses on reaching {target_customer_location} via {go_to_market_channels}, aiming to capture a significant share of the market.
    
    Financially, {Company} has reported a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months} over the last six months, supported by a current cash balance of {cash_balance}. Their monthly burn rate of {monthly_burn_rate} indicates disciplined spending. The founding teams experience is further highlighted by {team_wins} and their ability to secure prior funding ({prior_funding_experience}). They seek additional funding to meet their goal of raising {fundraising_amount}, with a company valuation of {company_valuation}. Their execution strategy, {execution_vision_team}, reflects their commitment to growth and scalability.
`);

const founderDynamicsPrompt = PromptTemplate.fromTemplate(`
    Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.

    Summary:

    {Company}, legally registered as {legal_name}, is focused on addressing {problem_addressed} within the {industry_sector}. The founders, {founding_team}, launched {product_launched} on {launch_date}, aiming to capture {target_customer_location}. They’ve built the company from {headquarters_location}, leveraging a unique value proposition of {unique_value_proposition} to stand out from competitors like {competitors}. The founders, driven by {reason_for_starting_company}, are strategically targeting customers through channels like {go_to_market_channels}. 

    Financial performance in the last six months shows a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months}, with {total_customers_six_months_ago} customers as of six months ago, including notable clients such as {notable_customers}. With a monthly burn rate of {monthly_burn_rate} and a current cash balance of {cash_balance}, the team is efficiently managing its resources. Their experience with {prior_funding_experience} has enabled them to raise {outside_funding_raised}, positioning them well for future fundraising goals of {fundraising_amount}. Their vision and execution strategy are supported by the team’s achievements like {team_wins} and a clear focus on {execution_vision_team}.
`);

const talkingpointsMarketoppPrompt = PromptTemplate.fromTemplate(`
    Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.

    Summary:

    {Company}, legally known as {legal_name}, has been making strides in the {industry_sector} by solving {problem_addressed} with their innovative product/service, {product_launched}. Since launching on {launch_date}, the company has targeted {target_customer_location} through {go_to_market_channels}. Their financial performance, with a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months}, shows steady growth. They differentiate themselves through {unique_value_proposition}, while key competitors include {competitors}.

    The company has a strong financial position with a cash balance of {cash_balance}, though their monthly burn rate of {monthly_burn_rate} reflects ongoing operational costs. The founding team’s leadership, including {co_founders}, has propelled the company forward, driving customer acquisition and growth, including {total_customers_six_months_ago} customers and notable partnerships with {notable_customers}. They have also successfully raised {outside_funding_raised}, and are looking to secure additional investment of {fundraising_amount} at a valuation of {company_valuation}, with {equity_split} equity split among founders. Their execution strategy, {execution_vision_team}, ensures they are well-positioned to seize new market opportunities.
`);

const talkingpointsCoachmarketoppPrompt = PromptTemplate.fromTemplate(`
    Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.

    Summary:

    {Company}, formally known as {legal_name}, was established to address {problem_addressed} within the {industry_sector}. The founders, {co_founders}, have successfully launched {product_launched} on {launch_date}, from their headquarters in {headquarters_location}. Their strategy revolves around targeting {target_customer_location} through {go_to_market_channels}, differentiating the company from competitors such as {competitors} with their unique value proposition: {unique_value_proposition}. The founders’ decision to create the company stems from {reason_for_starting_company}, and their execution strategy revolves around {execution_vision_team}.

    The company has made significant progress in its financial performance, generating {revenue_last_six_months} in revenue and {ebitda_last_six_months} in EBITDA over the last six months. With a burn rate of {monthly_burn_rate} and a current cash balance of {cash_balance}, they are managing expenses prudently. Their ability to attract notable customers like {notable_customers} has been instrumental in growth. They have raised {outside_funding_raised} and are currently seeking to raise {fundraising_amount}, at a valuation of {company_valuation}, to fuel their next stage of growth. The founders’ past wins, such as {team_wins}, and prior funding experience ({prior_funding_experience}) further demonstrate their readiness for expansion.
`);

const concernsParagraphPrompt = PromptTemplate.fromTemplate(`
    Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.

    Summary:

    {Company}, legally known as {legal_name}, is focused on addressing {problem_addressed} in the {industry_sector}. The product/service, {product_launched}, launched on {launch_date}, aims to tackle key issues in the market. The company's go-to-market strategy targets {target_customer_location}, leveraging {go_to_market_channels}, but competitors such as {competitors} could present challenges. Despite these challenges, their unique value proposition—{unique_value_proposition}—offers a strong differentiator.

    Financially, while the company reported {revenue_last_six_months} in revenue and {ebitda_last_six_months} EBITDA over the last six months, there are concerns over the monthly burn rate of {monthly_burn_rate} and the sustainability of their cash balance ({cash_balance}). Their goal of raising {fundraising_amount} at a valuation of {company_valuation} will be crucial to maintaining growth. With {full_time_employees} full-time and {part_time_employees} part-time employees, the team’s ability to execute effectively will be vital. The company's previous wins ({team_wins}) and the leadership of the founding team {founding_team} offer hope, but challenges in competition and resource management remain key concerns.

    Remember to provide output in the following type of  Output Structure. Choose the headings, and paragraphs based on the prompts above.It may or may not be similar to this example below, but follow the format.
    - <b>Product and Market Validation Stage</b> 
        Paraph description
    - <b>Limited Financial Runway</b>  
        Paraph description
    - <b>Small Team Size</b>
        Paraph description
        - <b>Execution Risks</b>
            Paraph description
            - <b>Market Risks</b>
                Paraph description
                - <b>Product Risks</b>
                    Paraph description
`);




const dominantTraitsPrompt = PromptTemplate.fromTemplate(`
    You are an expert in psychometric analysis and investor psychology, with years of experience in startups analysis. You've been given a JSON data array containing many traits, each with a trait number, name, and a specific description relevant to performance and decision-making. You also have a company summary that includes its vision, mission, target market, and competitive advantages,etc.

    Ypur task is to analyze the company/startup first critically and then evaluate and analyze the traits in the context of this company's profile. Identify the 3 traits that are likely to resonate most with potential investors, given based entirely on the company's profile. Consider the following factors:

JSON Array of Traits (including trait number, name, and description): {traits_list}
###

Company Summary: 

{Company}, legally registered as {legal_name}, is focused on addressing {problem_addressed} within the {industry_sector}. The founders, {founding_team}, launched {product_launched} on {launch_date}, aiming to capture {target_customer_location}. They’ve built the company from {headquarters_location}, leveraging a unique value proposition of {unique_value_proposition} to stand out from competitors like {competitors}. The founders, driven by {reason_for_starting_company}, are strategically targeting customers through channels like {go_to_market_channels}. 

    Financial performance in the last six months shows a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months}, with {total_customers_six_months_ago} customers as of six months ago, including notable clients such as {notable_customers}. With a monthly burn rate of {monthly_burn_rate} and a current cash balance of {cash_balance}, the team is efficiently managing its resources. Their experience with {prior_funding_experience} has enabled them to raise {outside_funding_raised}, positioning them well for future fundraising goals of {fundraising_amount}. Their vision and execution strategy are supported by the team’s achievements like {team_wins} and a clear focus on {execution_vision_team}.
    ###

Analyze carefully and inspect the traits that would be most appealing to investors based on the company's profile. For example, ypu can Consider the following criterias:

    Alignment with Company Vision and Mission: Which traits reflect qualities that directly support the company's long-term objectives, making it more attractive to investors with a growth-oriented mindset? (Use context from the given company summary ANalysis)

    Market Positioning: Which traits strengthen the company's ability to differentiate itself in the market, highlighting unique attributes or decision-making skills that enhance investor confidence? (Use context from the given company summary ANalysis)

    Risk and Stability: Which traits suggest an ability to manage risk effectively, adapt to changes, and make intuitive yet reliable decisions under uncertainty?  (Use context from the given company summary ANalysis)

Please return the TraitNum, names and reason of the top 3 traits you identify, the reason must be a brief explanation of why each trait would be advantageous to this particular company's investor appeal, in  JSON output format.MAke sure to follow the format of the output below.

Example Output:

        "TraitNum": "16",
        "TraitName": "Trait Name 1",
        "reason": "This trait aligns with the company's vision by..."
   
`);


const statusPrompt = PromptTemplate.fromTemplate(`
    You are tasked with evaluating an startup investment against a dynamic investment profile schema, using both the provided 'investment profile questions' and the summary of the 'company data' context. Your goal is to classify the application based on specific eligibility criteria as either "Accepted," "Rejected," or "Potential."

    To do this, you will need to consider:
1. The investment profile questions 
2. The summary of the company's data and context

### Criteria for Classification

1. **Important Questions**:
   - These questions are marked with an "important" field set to 1.
   - **Mandatory Matching**: If any important question does not match the applicant's answer exactly, the application should be classified as "Rejected."
   - **Proceed to Next Step**: If all important questions match, proceed to evaluate the non-important questions.

2. **Non-Important Questions with Fallbacks (Amber)**:
   - These questions have an "important" field set to 0 and may include a fallback or "amber" question, indicated by an "amber" field set to 1 and a valid "amber_question_id."
   - **Matching Logic for Non-Important Questions**:
     - If a non-important question does not match the applicant’s answer but has an associated amber question, proceed to check the amber question.
     - **Amber Question Matching**:
         - If the amber question matches while the original non-important question does not, classify the application as "Potential."
         - If neither the non-important question nor the amber question match, classify the application as "Rejected."
     - **No Amber Fallback**: If a non-important question does not match and lacks an amber fallback, classify the application as "Rejected."

3. **Final Classification**:
   - **Accepted**: If all important questions match, and either all non-important questions match or are compensated by matching amber questions, classify as "Accepted."
   - **Rejected**: If any important question fails to match, or if any non-important question without an amber fallback fails to match, classify as "Rejected."
   - **Potential**: If any non-important questions are mismatched but compensated by matching amber questions, classify as "Potential."

Now let's review the investment profile questions and company summary, and apply these criteria to classify the application:


### Investment Profile Questions and Applicant's Answers
{investmentProfileQuestions}

### Company Summary
Company Summary for Reference:

  **Overview**:
  {Company}, legally registered as {legal_name}, operates in the {industry_sector} sector, tackling {problem_addressed} through its {product_launched}. Since its launch on {launch_date}, the company has targeted {target_customer_location} using {go_to_market_channels}.

  **Financial Performance**:
  Recent figures reveal a revenue of {revenue_last_six_months} with an EBITDA of {ebitda_last_six_months}, supported by a cash balance of {cash_balance}. However, with a monthly burn rate of {monthly_burn_rate}, the company maintains a focused approach to growth and sustainability.

  **Differentiation & Market Position**:
  {Company}'s unique value proposition, {unique_value_proposition}, distinguishes it from competitors such as {competitors}. 

  **Leadership & Team**:
  Led by {co_founders}, the team has driven significant customer acquisition, now totaling {total_customers_six_months_ago}, and established strategic partnerships with notable clients like {notable_customers}. 

  **Fundraising Goals**:
  After successfully raising {outside_funding_raised}, the company seeks additional funding of {fundraising_amount}, with a valuation of {company_valuation} and an equity split of {equity_split} among founders. The execution strategy, {execution_vision_team}, outlines a clear path to capitalize on upcoming market opportunities.

Okay, now Classify the application based on the above criteria, considering the company’s context. Your final output should be one of the following: "Accepted," "Rejected," or "Potential,", along with a reason for the reasoning based on these criteria.
The output must be in JSON format,containing these fields shown below.
status: "Accepted" | "Rejected" | "Potential",
reason: "Brief explanation of the classification decision."
`);


export {
    founderSummaryPrompt,
    founderDynamicsPrompt,
    talkingpointsMarketoppPrompt,
    talkingpointsCoachmarketoppPrompt,
    concernsParagraphPrompt,
    dominantTraitsPrompt,
    statusPrompt
};
