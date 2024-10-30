
import { StringOutputParser, JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { founderSummaryPrompt, founderDynamicsPrompt, talkingpointsMarketoppPrompt, talkingpointsCoachmarketoppPrompt, concernsParagraphPrompt, dominantTraitsPrompt, statusPrompt } from "./allPrompts.js";
import {scoringQ, processData } from "./dynamicScoring.js";
import { transformedDomainatData } from "./xcelManipulations.js";
import { StructuredOutputParser } from "langchain/output_parsers";
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
    const company_data = `{
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
    }`;


    const table_data = [
        {
            "topic_id": "T1",
            "topic": "Founder Dynamics",
            "topic description": "Founders' relationship, expertise, and business dynamics.",
            "maxPoints": 5,
            "data": [
                {
                    "question_id": "Q1",
                    "question": "How long have the founders worked together?",
                    "scores": [
                        { "answer": "Never", "point": 0 },
                        { "answer": "0 - 1 years", "point": 1 },
                        { "answer": "1 - 2 years", "point": 2 },
                        { "answer": "2 - 3 years", "point": 3 },
                        { "answer": "3 - 5 years", "point": 4 },
                        { "answer": "5+ years", "point": 5 }
                    ]
                },
                {
                    "question_id": "Q2",
                    "question": "Do the founders have relevant expertise in the sector they are entering?",
                    "scores": [
                        { "answer": "No", "point": 0 },
                        { "answer": "Two Founders but one founder has over 90% equity", "point": 1 },
                        { "answer": "Two Founders but one founder has over 80% equity", "point": 2 },
                        { "answer": "2 - 3 years", "point": 3 },
                        { "answer": "3 - 5 years", "point": 4 },
                        { "answer": "Yes", "point": 5 }
                    ]
                },
                {
                    "question_id": "Q3",
                    "question": "Are there multiple founders? What is the equity split?",
                    "scores": [
                        { "answer": "Single Founder", "point": 0 },
                        { "answer": "Two Founders but one founder has over 90% equity", "point": 1 },
                        { "answer": "Two Founders but one founder has over 80% equity", "point": 2 },
                        { "answer": "Two Founders but one founder has over 70% equity", "point": 3 },
                        { "answer": "Two Founders but one founder has over 50% equity", "point": 4 },
                        { "answer": "Multiple Founders - equal equity split", "point": 5 }
                    ]
                }
            ]
        },
        {
            "topic_id": "T2",
            "topic": "Commercial Savviness",
            "topic description": "Understanding competitors, customer, and pricing strategy.",
            "maxPoints": 5,
            "data": [
                {
                    "question_id": "Q4",
                    "question": "Can they identify and categorize your direct and indirect competitors?",
                    "scores": [
                        { "answer": "No", "point": 0 },
                        { "answer": "Very basic", "point": 1 },
                        { "answer": "Some identification", "point": 2 },
                        { "answer": "Detailed identification", "point": 3 },
                        { "answer": "Clear categorization", "point": 4 },
                        { "answer": "Strategic insights", "point": 5 }
                    ]
                },
                {
                    "question_id": "Q5",
                    "question": "What makes the product or service unique compared to competitors?",
                    "scores": [
                        { "answer": "No USP", "point": 0 },
                        { "answer": "Basic USP", "point": 1 },
                        { "answer": "Some USP", "point": 2 },
                        { "answer": "Detailed USP", "point": 3 },
                        { "answer": "Clear differentiation", "point": 4 },
                        { "answer": "Evidence-based USP", "point": 5 }
                    ]
                },
                {
                    "question_id": "Q6",
                    "question": "Do they understand who the customer is? Do they have a well-thought-out pricing strategy?",
                    "scores": [
                        { "answer": "None at all", "point": 0 },
                        { "answer": "Very basic understanding", "point": 1 },
                        { "answer": "Decent understanding but no strategy", "point": 2 },
                        { "answer": "Moderate understanding with basic strategy", "point": 3 },
                        { "answer": "Good understanding of customer and pricing", "point": 4 },
                        { "answer": "Clear and articulate understanding of customer and strategy", "point": 5 }
                    ]
                }
            ]
        },
        {
            "topic_id": "T3",
            "topic": "Ability to execute",
            "topic description": "Capability to achieve business goals and outperform rivals.",
            "maxPoints": 5,
            "data": [
                {
                    "question_id": "Q7",
                    "question": "How is the team uniquely positioned to outperform competitors?",
                    "scores": [
                        { "answer": "No clear advantage", "point": 0 },
                        { "answer": "Some advantage but not enough", "point": 1 },
                        { "answer": "Basic strengths", "point": 2 },
                        { "answer": "Detailed strengths", "point": 3 },
                        { "answer": "Relevant experience", "point": 4 },
                        { "answer": "Proven track record", "point": 5 }
                    ]
                }
            ]
        }
    ];

    const investmentProfileQuestions = {
        "investment_profile_questions_and_answers": [
            {
                "id": 1,
                "text": "In which countries do you invest?",
                "important": 1,
                "amber": 0,
                "amber_question_id": null,
                "answer": [
                    "USA",
                    "UK",
                    "Germany",
                    "India"
                ]
            },
            {
                "id": 2,
                "text": "In which sectors do you invest mainly?",
                "important": 0,
                "amber": 0,
                "amber_question_id": 4,
                "answer": [
                    "Software & SaaS",
                    "Healthcare & Biotech"
                ]
            },
            {
                "id": 3,
                "text": "What is your minimum revenue criteria?",
                "important": 0,
                "amber": 0,
                "amber_question_id": 5,
                "answer": "10000000"
            },
            {
                "id": 4,
                "text": "Which other sectors might you consider if all other criteria are met?",
                "important": 0,
                "amber": 1,
                "amber_question_id": 2,
                "answer": [
                    "Fintech"
                ]
            },
            {
                "id": 5,
                "text": "What minimum revenue would you consider if all other criteria are met?",
                "important": 0,
                "amber": 1,
                "amber_question_id": 3,
                "answer": "5000000"
            },
            {
                "id": 6,
                "text": "What is your minimum investment amount?",
                "important": 1,
                "amber": 0,
                "amber_question_id": null,
                "answer": "5000000"
            },
            {
                "id": 7,
                "text": "What is your maximum investment amount?",
                "important": 1,
                "amber": 0,
                "amber_question_id": null,
                "answer": "10000000"
            },
            {
                "id": 8,
                "text": "In which stages do you invest?",
                "important": 1,
                "amber": 0,
                "amber_question_id": null,
                "answer": [
                    "Seed",
                    "Series A",
                    "Series B"
                ]
            }
        ]
    }





    const founderSummary = await founderSummarychain.invoke({company_data: company_data});
    const founderDynamics = await founderDynamicschain.invoke({company_data: company_data});
    const talkingpointsMarketopp = await talkingpointsMarketopp_chain.invoke({company_data: company_data});
    const talking_pointsCoachmarketopp = await talking_pointsCoachmarketopp_chain.invoke({company_data: company_data});
    const concernsPrompt = await concernsPromptchain.invoke({company_data: company_data});



    const table_info = processData(table_data);
    console.log("table_info:", table_info);
    const formattedTAble = table_info.conditions;
    const output_class =table_info.scoringModel;
    console.log("output_class:", output_class);
    const parser = new JsonOutputParser(output_class);
    console.log("parser:", parser);

    const scoringChain = scoringQ.pipe(llm).pipe(parser);

    const scoringOutput = await scoringChain.invoke({ company_data: company_data, table_data: formattedTAble });



    const dominantTraitsOutput = await dominantTraitsPrompt.pipe(llm).pipe(new StringOutputParser()).invoke({company_data: company_data,traits_list: transformedDomainatData}); 

    const statusChain = statusPrompt.pipe(llm).pipe(new StringOutputParser());
    const statusOutput = await statusChain.invoke({company_data: company_data, investmentProfileQuestions: investmentProfileQuestions});

    console.log("Starting Generation of the output");
    console.log(founderSummary);
    console.log(founderDynamics);
    console.log(talkingpointsMarketopp);
    console.log(talking_pointsCoachmarketopp);
    console.log(concernsPrompt);
    console.log("scoringOutput:", scoringOutput);
    console.log("dominantTraitsOutput:", dominantTraitsOutput);
    console.log("statusOutput:", statusOutput);

}


run();