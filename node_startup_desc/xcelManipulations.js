import xlsx from 'xlsx';


// Load the Excel file
const workbook = xlsx.readFile('Yareta Psychometric Domains and Scales.xlsx');

// Access the first sheet by name
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert sheet data to JSON
const jsonData = xlsx.utils.sheet_to_json(worksheet);


const transformedDomainatData = jsonData.map(item => ({
    "TraitNo": item['#'],
    "TraitName": item['V2 Scale'],
    "def": item['Scale Definition - to be used with GPT']
  }));
  
//   console.log(transformedDomainatData);



export{
    transformedDomainatData
}