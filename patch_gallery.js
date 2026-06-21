/**
 * Restructure Gallery Sheet Script
 * 
 * This script adds KV metadata rows at the top of the Gallery sheet,
 * followed by a blank separator, then the existing table data.
 * 
 * Run with: node patch_gallery.js
 */

const GOOGLE_SHEETS_ID = '1gi0jDSZv39xF4TdiyeHE6NwsIMplQuvLxyqPOTdX6A4';
const GOOGLE_API_KEY = 'AIzaSyD0SxpjbbZ7nbSF0qbyWcU-9Kq1eGyZIEc';

// We'll use the Google Sheets API to read current data, then show the user
// the exact structure they need to set up in the spreadsheet.

async function main() {
    // Fetch current gallery data
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/Gallery?key=${GOOGLE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const currentRows = data.values || [];

    console.log('=== CURRENT Gallery Sheet Structure ===');
    currentRows.forEach((row, i) => {
        console.log(`Row ${i + 1}: ${JSON.stringify(row)}`);
    });

    console.log('\n=== NEW Gallery Sheet Structure (please update manually) ===');
    console.log('');
    console.log('Row 1:  A1=gallery_badge        B1=Memories');
    console.log('Row 2:  A2=gallery_title         B2=Our');
    console.log('Row 3:  A3=gallery_highlight      B3=Gallery');
    console.log('Row 4:  A4=gallery_desc           B4=Moment perjalanan luar biasa bersama para pelanggan kami.');
    console.log('Row 5:  A5=gallery_empty          B5=Belum ada foto galeri.');
    console.log('Row 6:  A6=gallery_modal_add      B6=Add New Photo');
    console.log('Row 7:  A7=gallery_modal_edit     B7=Edit Photo');
    console.log('Row 8:  A8=gallery_modal_cancel   B8=Cancel');
    console.log('Row 9:  A9=gallery_modal_save     B9=Save Changes');
    console.log('Row 10: A10=gallery_modal_add_btn B10=Upload Photo');
    console.log('Row 11: (BLANK - separator row)');
    console.log('Row 12: id | fleet name | judul | tanggal | image | description');
    console.log('Row 13+: (your existing gallery data)');
}

main().catch(console.error);
