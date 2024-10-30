
import { StringOutputParser, JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { founderSummaryPrompt, founderDynamicsPrompt, talkingpointsMarketoppPrompt, talkingpointsCoachmarketoppPrompt, concernsParagraphPrompt } from "./allPrompts.js";
import {  generateConditions, generateScoringOutput,  scoringQ} from "./dynamicScoring.js";
async function run() {


    process.env['OPENAI_API_KEY'] = process.env.OPENAI_API_KEY;


    const llm = new ChatOpenAI({ model: "gpt-4o-mini" });


    const founderSummarychain = founderSummaryPrompt.pipe(llm).pipe(new StringOutputParser());
    const founderDynamicschain = founderDynamicsPrompt.pipe(llm).pipe(new StringOutputParser());
    const talkingpointsMarketopp_chain = talkingpointsMarketoppPrompt.pipe(llm).pipe(new StringOutputParser());
    const talking_pointsCoachmarketopp_chain = talkingpointsCoachmarketoppPrompt.pipe(llm).pipe(new StringOutputParser());
    const concernsPromptchain = concernsParagraphPrompt.pipe(llm).pipe(new StringOutputParser());




    // Get the company data from DB or API
    // Example company data
    const company_data = {
        "Company": "Acme Tech Solutions",
        "legal_name": "Acme Tech Solutions Inc.",
        "description": "Acme Tech Solutions is a leading provider of cloud-based AI solutions designed to enhance operational efficiency for enterprises.",
        "website": "https://acmetechsolutions.com/",
        "product_launched": "AI-Powered Analytics Platform",
        "launch_date": "2022-07-10",
        "industry_sector": "Artificial Intelligence",
        "headquarters_location": "New York, NY, USA",
        "incorporation_location": "Delaware, USA",
        "revenue_last_six_months": "$1,800,000",
        "ebitda_last_six_months": "$400,000",
        "revenue_trend_explanation": "Revenue growth has accelerated due to increased demand for AI-driven analytics in large enterprises.",
        "total_customers_six_months_ago": 25,
        "notable_customers": "Tesla, IBM, Oracle",
        "monthly_burn_rate": "$120,000",
        "cash_balance": "$950,000",
        "target_customer_location": "Global",
        "go_to_market_channels": "Direct sales, online marketing, reseller partnerships",
        "problem_addressed": "Enterprises struggle to leverage data effectively for strategic decision-making.",
        "competitors": "Palantir, Tableau, Alteryx",
        "unique_value_proposition": "Real-time AI insights with minimal setup and seamless integration into existing enterprise systems.",
        "outside_funding_raised": "$4,500,000",
        "assistance_needed": "We are seeking additional strategic investors to help scale our product and reach new markets.",
        "applied_to_500_previously": "No",
        "progress_since_last_application": "N/A",
        "founding_team": "John Doe, Sarah Lee",
        "reason_for_starting_company": "We saw an opportunity to help companies unlock the potential of their data using AI.",
        "execution_vision_team": "Our team has extensive experience in AI, cloud computing, and enterprise software solutions.",
        "prior_funding_experience": "We successfully raised $2M in seed funding from venture capital firms.",
        "team_wins": "Launched product ahead of schedule and secured partnerships with major enterprises.",
        "business_highlights": [
            "Secured partnerships with 10 Fortune 500 companies",
            "Grew annual recurring revenue by 200% in the last year",
            "Featured in Forbes Top 50 AI Companies to Watch"
        ],
        "full_time_employees": 50,
        "part_time_employees": 10,
        "co_founders": [
            "John Doe",
            "Sarah Lee"
        ],
        "co_founders_linkedin": [
            "https://linkedin.com/in/johndoe",
            "https://linkedin.com/in/sarahlee"
        ],
        "founder_story": "John and Sarah met while working at a top AI firm and shared a vision of making data-driven insights more accessible to businesses of all sizes.",
        "expectations_from_investor": "We expect guidance on market expansion, introductions to strategic partners, and support with scaling operations.",
        "primary_contact_first_name": "John",
        "primary_contact_last_name": "Doe",
        "primary_contact_email": "john.doe@acmetechsolutions.com",
        "primary_contact_phone": "+1-212-555-1234",
        "pitch_deck_link": "https://acmetechsolutions.com/pitch-deck",
        "product_demo_video": "https://acmetechsolutions.com/demo-video",
        "fundraising_amount": "$7,000,000",
        "company_valuation": "$35,000,000",
        "equity_split": "Founders: 65%, Investors: 35%",
        "funding_commitments": "$2,000,000 committed",
        "business_stage": "Series A"
    };


    const table_data = {
        "tables": [
            {
                "topic": "Founder Background",
                "assessment": "How long have you been in the industry?",
                "one_point": "0 - 1 years",
                "two_point": "1 - 2 years",
                "three_point": "2 - 3 years",
                "four_point": "3 - 5 years",
                "five_point": "5 + years"
            },
            {
                "topic": "Team Coachability",
                "assessment": "Do they have a mentor that supports them across this journey?",
                "one_point": "No",
                "two_point": "",
                "three_point": "",
                "four_point": "",
                "five_point": "Yes"
            },
            {
                "topic": "Founder Dynamics",
                "assessment": "How long have the founders worked together?",
                "one_point": "0 - 1 years",
                "two_point": "1 - 2 years",
                "three_point": "2 - 3 years",
                "four_point": "3 - 5 years",
                "five_point": "5+ years"
            },
            {
                "topic": "Founder Dynamics",
                "assessment": "Do the founders have relevant expertise in the sector they are entering?",
                "one_point": "0 - 1 years",
                "two_point": "1 - 2 years",
                "three_point": "2 - 3 years",
                "four_point": "3 - 5 years",
                "five_point": "5+ years"
            },
            {
                "topic": "Founder Dynamics",
                "assessment": "Are there multiple founders? What is the equity split?",
                "one_point": "Single Founder",
                "two_point": "",
                "three_point": "Two Founders but one founder has over 80% equity",
                "four_point": "",
                "five_point": "Multiple Founders - equal equity split"
            },
            {
                "topic": "Commercial Savviness",
                "assessment": "Can they identify and categorize your direct and indirect competitors?",
                "one_point": "Unable to identify",
                "two_point": "Basic identification",
                "three_point": "Detailed identification",
                "four_point": "Clear categorization",
                "five_point": "Strategic insights"
            }
        ]
    }



    // const founderSummary = await founderSummarychain.invoke(company_data);
    // const founderDynamics = await founderDynamicschain.invoke(company_data);
    // const talkingpointsMarketopp = await talkingpointsMarketopp_chain.invoke(company_data);
    // const talking_pointsCoachmarketopp = await talking_pointsCoachmarketopp_chain.invoke(company_data);
    // const concernsPrompt = await concernsPromptchain.invoke(company_data);

    

    const formattedTAble = generateConditions(table_data);
    company_data['table_data']= formattedTAble;
    console.log("formattedTAble:", company_data['table_data']);
    const output_class = generateScoringOutput(table_data);
    console.log("output_class:", output_class);
    const parser = new JsonOutputParser(output_class);
    console.log("parser:", parser);

    const scoringChain = scoringQ.pipe(llm).pipe(parser);

    const scoringOutput = await scoringChain.invoke(company_data, formattedTAble);

    
    // console.log(founderSummary);
    // console.log(founderDynamics);
    // console.log(talkingpointsMarketopp);
    // console.log(talking_pointsCoachmarketopp);
    // console.log(concernsPrompt);
    console.log("scoringOutput:", scoringOutput);



}


run();