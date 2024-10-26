
import { PromptTemplate } from "@langchain/core/prompts";


// TableData schema
class TableData {
    constructor(topic, assessment, onePoint, twoPoint, threePoint, fourPoint, fivePoint) {
        this.topic = topic || "";
        this.assessment = assessment || "";
        this.onePoint = onePoint || "";
        this.twoPoint = twoPoint || "";
        this.threePoint = threePoint || "";
        this.fourPoint = fourPoint || "";
        this.fivePoint = fivePoint || "";
    }
}

// TableDataList schema
class TableDataList {
    constructor(tables = []) {
        this.tables = tables.map(table => new TableData(
            table.topic,
            table.assessment,
            table.onePoint,
            table.twoPoint,
            table.threePoint,
            table.fourPoint,
            table.fivePoint
        ));
    }
}

// EvaluationCriteria schema
class EvaluationCriteria {
    constructor(question, options = [], scores = []) {
        this.question = question || "";
        this.options = options;
        this.scores = scores;
    }
}

// Create dynamic model (returns an object with dynamic fields)
function createDynamicModel(fieldData) {
    const dynamicModel = {};

    for (const [fieldName, [fieldType, fieldInfo]] of Object.entries(fieldData)) {
        dynamicModel[fieldName] = {
            type: fieldType,
            description: fieldInfo
        };
    }

    return dynamicModel;
}

// Parse table data to create dynamic fields based on topics
function parseTableData(tableDataList) {
    const topics = {};

    for (const row of tableDataList.tables) {
        const topic = row.topic;
        const question = row.assessment;
        const points = [
            row.onePoint, row.twoPoint, row.threePoint, row.fourPoint, row.fivePoint
        ].filter(p => p && p.trim()).map(p => p.trim());

        const evaluation = new EvaluationCriteria(
            question,
            points,
            Array.from({ length: points.length }, (_, i) => i + 1)
        );

        if (topics[topic]) {
            topics[topic].push(evaluation);
        } else {
            topics[topic] = [evaluation];
        }
    }

    const dynamicFields = {};
    for (const [topic, criteria] of Object.entries(topics)) {
        const fieldName = topic.replace(/\s+/g, "_");
        dynamicFields[fieldName] = criteria.length > 1
            ? [Array, `Criteria for ${topic}`]
            : [EvaluationCriteria, `Criteria for ${topic}`];
    }

    return dynamicFields;
}

// Generate conditions string based on table data
function generateConditions(tableDataList) {
    let conditionsStr = "";

    for (const row of tableDataList.tables) {
        const points = [row.onePoint, row.twoPoint, row.threePoint, row.fourPoint, row.fivePoint];
        if (row.topic && row.assessment) {
            let conditionBlock = `## ${row.topic} - ${row.assessment.trim()} ##\n`;
            points.forEach((point, i) => {
                if (point && point.trim()) {
                    conditionBlock += `If the answer matches '${point.trim()}', assign ${i + 1} point(s).\n`;
                }
            });
            conditionsStr += `${conditionBlock}\n`;
        }
    }

    return conditionsStr;
}

// Generate scoring output based on table data, using dynamic model fields
function generateScoringOutput(tableData) {
    const dynamicFields = parseTableData(tableData);
    return createDynamicModel(dynamicFields);
}





const backgroundInfo = PromptTemplate.fromTemplate(`
   
Summary:

{Company}, legally known as {legal_name}, was founded by {founding_team} with the purpose of addressing {problem_addressed} in the {industry_sector}. The company, headquartered in {headquarters_location} and incorporated in {incorporation_location}, successfully launched {product_launched} on {launch_date}. Operating in a competitive landscape with players like {competitors}, their unique value proposition, {unique_value_proposition}, sets them apart. The company's go-to-market strategy focuses on reaching {target_customer_location} via {go_to_market_channels}, aiming to capture a significant share of the market.

Financially, {Company} has reported a revenue of {revenue_last_six_months} and EBITDA of {ebitda_last_six_months} over the last six months, supported by a current cash balance of {cash_balance}. Their monthly burn rate of {monthly_burn_rate} indicates disciplined spending. The founding team’s experience is further highlighted by {team_wins} and their ability to secure prior funding ({prior_funding_experience}). They seek additional funding to meet their goal of raising {fundraising_amount}, with a company valuation of {company_valuation}. Their execution strategy, {execution_vision_team}, reflects their commitment to growth and scalability.
`);

const scoringQ = PromptTemplate.fromTemplate(`
   
    You have access to some 'BackGround Information' and some 'table data', which you have to use to complete the given task. Analyse the answers and create the scoring system based on the below 'table_data' for this entrepreneur. You have to create the scoring based on the answers/ transcripts and the criteria given in the documents

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
 `);



export {
    TableData,
    TableDataList,
    EvaluationCriteria,
    createDynamicModel,
    parseTableData,
    generateConditions,
    backgroundInfo,
    scoringQ,
    generateScoringOutput

}
