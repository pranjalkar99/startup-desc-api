import { PromptTemplate } from "@langchain/core/prompts";

const founderSummaryPrompt = PromptTemplate.fromTemplate(`
   You are a experienced VC/Investor Analayser with yeras of experience in analyzing companies for investment opprtunities.Given the company info below , generate a comprehensive two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.
    
    Company Info:
    
   {company_data}
     Try to follow the format below:
      Follow these steps to create the summary:

    1. First Paragraph - Company Overview and Market Position:
       - Begin with company name, legal name, and founding team
       - State the core problem they're addressing and their industry
       - Include their location details and product launch information
       - Describe their competitive positioning and unique value proposition
       - Explain their go-to-market strategy and target market

    2. Second Paragraph - Financial Position and Future Plans:
       - Detail their financial performance (revenue, EBITDA)
       - Include current cash position and burn rate
       - Highlight founding team's achievements and funding experience
       - State their fundraising goals and valuation
       - End with their execution strategy and growth plans

       Key points to remember:
    - Focus on facts, avoid opinions or evaluative statements
    - Maintain a professional, objective tone
    - Present information in a logical, flowing narrative
    - Ensure all key metrics and data points are accurately represented
    - Create clear connections between related pieces of information for investment perspectives.
`);

const founderDynamicsPrompt = PromptTemplate.fromTemplate(`
    Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the founder’s journey and what brought them here? What motivated them to set up this business. Was there any moment that motivated them to set up this business? What did they do before setting up this venture? How did the founders know each other? 

    Company Info:
    {company_data}


       Key points to remember:
    - Focus on facts, avoid opinions or evaluative statements
    - Maintain a professional, objective tone
    - Present information in a logical, flowing narrative
    - Ensure all key metrics and data points are accurately represented
    - Create clear connections between related pieces of information for investment perspectives.

    `);

const talkingpointsMarketoppPrompt = PromptTemplate.fromTemplate(`
    Now, using the responses provided above, generate a two-paragraph summary. For the first Paragraph, prepare response in single paragraph by following questions - Do they truly understand the Market Size their business is addressing through a logical response. Do they have a clear unique and defensible business vs their competitors. Do not create a list and prepare a single paragraph - Verify independently the market sizing as well.
    For second paragraph, Does the team have the necessary skill set in the field they are a founder of through previous work experience. If its a technology driven business, is there a CTO (Chief Technical Office) or someone with technical knowledge. Have the team raised money before in this or previous ventures. Do not create a list and prepare a single paragraph. DO they have a proper plan in place? Do they have a plan to execute the vision?

    Company Info:
    {company_data}
`);

const talkingpointsCoachmarketoppPrompt = PromptTemplate.fromTemplate(`
    Now, using the responses provided above, generate a two-paragraph summary.prepare a response in single paragraph by following questions  - Do they have good mentors around them and do they respect them. Have they responded to failure in a positive way where they have shown growth from it and humility. What sacrifices they made to launch this business?. Do not create a list and prepare a single paragraph.

    Company Info:
    {company_data}
`);

const concernsParagraphPrompt = PromptTemplate.fromTemplate(`
    Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.

    Here is the company Info:

    {company_data}.

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

Company Info: 

{company_data} 
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

### Company Info and Context
{company_data}
## 

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
