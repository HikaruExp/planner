// Script to parse Excel files from plansheets folder
import XLSX from 'xlsx';
import { readdir } from 'fs/promises';
import { join } from 'path';

const plansheetDir = './plansheets';

async function parseAllExcel() {
    const files = await readdir(plansheetDir);
    const xlsxFiles = files.filter(f => f.endsWith('.xlsx'));

    const results = {};

    for (const file of xlsxFiles) {
        const filePath = join(plansheetDir, file);
        const workbook = XLSX.readFile(filePath);

        console.log(`\n${'='.repeat(60)}`);
        console.log(`📁 File: ${file}`);
        console.log('='.repeat(60));

        results[file] = {};

        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

            console.log(`\n📊 Sheet: ${sheetName}`);
            console.log('-'.repeat(40));

            // Print data in a readable format
            data.forEach((row, i) => {
                if (row.some(cell => cell !== '')) {
                    console.log(`Row ${i}: ${JSON.stringify(row)}`);
                }
            });

            results[file][sheetName] = data;
        }
    }

    // Output as JSON for easy import
    console.log('\n\n📋 JSON OUTPUT FOR IMPORT:');
    console.log(JSON.stringify(results, null, 2));
}

parseAllExcel().catch(console.error);
