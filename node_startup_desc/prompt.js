import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";

async function run() {
// load_dotenv();

// process.env['OPENAI_API_KEY'] = process.env.OPENAI_API_KEY;

const promptTemplate = PromptTemplate.fromTemplate(`
Now, using the responses provided above, generate a two-paragraph summary. Focus on capturing the essence of the business vision, the problem being solved, the founding team's strengths, and their execution strategy. Stick to the facts and do not give opinions.

Summary:

{Company}, legally known as {legal_name}, was founded by {founding_team} with the purpose of addressing {problem_addressed} in the {industry_sector}. The company, headquartered in {headquarters_location} and incorporated in {incorporation_location}, successfully launched {product_launched} on {launch_date}. Operating in a competitive landscape with players like {competitors}, their unique value proposition, {unique_value_proposition}, sets them apart. The company's go-to-market strategy focuses on reaching {target_customer_location} via {go_to_market_channels}, aiming to capture a significant share of the market.

Financially, {Company} has reported a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months} over the last six months, supported by a current cash balance of {cash_balance}. Their monthly burn rate of {monthly_burn_rate} indicates disciplined spending. The founding team’s experience is further highlighted by {team_wins} and their ability to secure prior funding ({prior_funding_experience}). They seek additional funding to meet their goal of raising {fundraising_amount}, with a company valuation of {company_valuation}. Their execution strategy, {execution_vision_team}, reflects their commitment to growth and scalability.
`);



// Define the rest of the templates similarly
const llm =  new ChatOpenAI({ model: "gpt-4o-mini" }); 
const company_data = {
    "Company": "TechInnovate Solutions",
    "legal_name": "TechInnovate LLC",
    "founding_team": ["Alice Johnson", "Bob Lee", "Carol Smith"],
    "problem_addressed": "inefficient data processing in logistics",
    "industry_sector": "logistics and supply chain management",
    "headquarters_location": "San Francisco, California",
    "incorporation_location": "Delaware, USA",
    "product_launched": "StreamlineX",
    "launch_date": "March 15, 2023",
    "competitors": ["LogiTech Solutions", "SupplyChainPro", "DataFlow Inc."],
    "unique_value_proposition": "real-time AI-driven data optimization",
    "target_customer_location": "North America and Europe",
    "go_to_market_channels": ["direct sales", "online platforms", "strategic partnerships"],
    "revenue_last_six_months": "$3.5 million",
    "ebitda_last_six_months": "$700,000",
    "cash_balance": "$1.2 million",
    "monthly_burn_rate": "$150,000",
    "team_wins": "launching two previous startups with successful exits",
    "prior_funding_experience": "$5 million in Series A funding from top VCs",
    "fundraising_amount": "$10 million",
    "company_valuation": "$50 million",
    "execution_vision_team": "scaling operations and expanding into APAC market by 2025"
}



const chain =  promptTemplate.pipe(llm).pipe(new StringOutputParser());

const summry = await chain.invoke(company_data);
// Run the LLMChain to generate the summary
// const summary = llm_chain.run(company_data);

// Output the result
console.log(summry);
}


run();