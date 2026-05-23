// ============================================================
// GOOGLE APPS SCRIPT - Paste ini ke Apps Script editor
// (Extensions > Apps Script) di Google Spreadsheet Anda
// ============================================================
// Setelah paste, Deploy ulang:
// Deploy > New deployment > Web App > Execute as: Me, Access: Anyone
// ============================================================

// ============================================================
// CLEANUP: Jalankan fungsi ini SEKALI dari Apps Script editor
// untuk menghapus sheet yang tidak digunakan.
// Caranya: Pilih fungsi "cleanupSheets" dari dropdown > klik Run
// ============================================================
function cleanupSheets() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetsToKeep = ['slides', 'fleets'];
  var allSheets = spreadsheet.getSheets();

  // Pastikan minimal ada 1 sheet yang akan dipertahankan
  var keptCount = 0;
  allSheets.forEach(function (sheet) {
    if (sheetsToKeep.indexOf(sheet.getName()) !== -1) keptCount++;
  });

  if (keptCount === 0) {
    Logger.log('ERROR: Tidak ada sheet "slides", "fleets", atau "fleet_features" yang ditemukan!');
    return;
  }

  var deleted = [];
  allSheets.forEach(function (sheet) {
    var name = sheet.getName();
    if (sheetsToKeep.indexOf(name) === -1) {
      spreadsheet.deleteSheet(sheet);
      deleted.push(name);
    }
  });

  if (deleted.length > 0) {
    Logger.log('Sheet yang dihapus: ' + deleted.join(', '));
  } else {
    Logger.log('Tidak ada sheet yang perlu dihapus.');
  }
  Logger.log('Sheet yang tersisa: ' + sheetsToKeep.join(', '));
}

function doGet(e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetName = e.parameter.sheet;

  // Jika tidak ada parameter sheet, kembalikan daftar sheet
  if (!sheetName) {
    var sheets = spreadsheet.getSheets().map(function (s) { return s.getName(); });
    return ContentService.createTextOutput(JSON.stringify({ sheets: sheets }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Sheet not found: " + sheetName }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var data = sheet.getDataRange().getValues();

  if (data.length === 0) {
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0];
  var rows = [];

  for (var i = 1; i < data.length; i++) {
    // Skip empty rows
    if (data[i].every(function (cell) { return cell === "" || cell === null; })) continue;

    var row = {};
    for (var j = 0; j < headers.length; j++) {
      if (headers[j] !== "") {
        row[headers[j]] = data[i][j];
      }
    }
    rows.push(row);
  }

  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}
