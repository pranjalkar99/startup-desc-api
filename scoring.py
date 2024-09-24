

table_data = '''

Topic 	What is being assessed/evaluated	1 Point	2 Points	3 Points	4 Points	5 Points
Founder Background	How long have you been in the industry?	0 - 1 years	1 - 2 years	2 - 3 years	3 - 5 years	5 + years
Team Coachability	Do they have a mentor that supports them across this journey	No				Yes
Founder Dynamics  	How long have the founders worked together?	0 - 1 years	1 - 2 years	2 - 3 years	3 - 5 years	5+ years
Founder Dynamics	Do the founders have relevant expertise in the sector they are entering?	0 - 1 years	1 - 2 years	2 - 3 years	3 - 5 years	5+ years
Founder Dynamics	Are there multiple founders? What is the equity split?	Single Founder		Two Founders but one founder has over 80% equity		Multiple Founders - equal equity split
Commercial Savviness
	Can they identify and categorize your direct and indirect competitors?	Unable to identify	Basic identification	Detailed identification	Clear categorization	Strategic insights
Commercial Savviness	What makes the product or service unique compared to competitors?	No clear USP	Basic USP	Detailed USP	Clear differentiation	Evidence-based USP
Commercial Savviness	Do they understand who the customer is?
  Do they have a well thought out pricing strategy?	No clear understanding of customer and pricing		Moderately articulate who the customer is and moderately understand competitor pricing. Moderately understand product differentiators. Why pricing works this way		Clearly articulate who the customer is and clearly understand competitor pricing. Clearly understand product differentiators. Why pricing works this way
Ability to execute	How is the team uniquely positioned to outperform competitors?	No clear advantage	Basic strengths	Detailed strengths	Relevant experience	Proven track record
Ability to attract exceptional talent	What is the level of experience of board members in relevant industries?	No experience	Basic experience	Moderate experience	Extensive experience	Extensive experience with proven success
Ability to attract exceptional talent	What is the level of experience of the senior leadership team in relevant industries?	No experience	Basic experience	Moderate experience	Extensive experience	Extensive experience with proven success
Ability to attract exceptional talent	How long has the senior leadership team been with the organization?	Less than 1 year	1 - 2 years	2 - 3 years	3 - 5 years	More than 5 years
Innovation	Does the business have IP	No patents	1-2 patents	3-5 patents	6-10 patents	10+ patents
Market Opportunity	Can this be a $1B company within 7  years?	NO				Yes
Traction & Funding	Does the business have traction? 	No	`	Interest / LOIs		Revenue
Traction & Funding	Run Rate of the raise and how long will it last 	3 months	6 months	12 months	18 months +	Not needed again 
Ability to execute	DO the founders have a track record of execution? And have they proven this already at the current business?	No track record		Strong track record but yet to prove at the current business		Strong track record and strong growth in the current business
Purpose	What did they give up to come here? Are they full time here? Have they deployed their own capital?	Part Time/ only 3rd party capital		Deployed Capital/ Part time or No Capital deployed/ Full Time		Deployed own capital, full time employed at the current venture




'''

scoring_q = f'''Analyse the answers and create the scoring system based on the below `table_data` for this entrepreneur. You have to create the scoring based on the answers/ transcripts and the criteria given in the documents

Once you complete the scoring, you will need to average each topic to 5. Some topics have multiple aspects being evaluated. For example, Founder dynamics has two aspects being evaluated. You will need to average them together out of 5. 

If information is not available, say N/A. 



Here is the table that you need to consider for scoring:

{table_data}


You will return expected output in JSON format for the updatted table..
'''