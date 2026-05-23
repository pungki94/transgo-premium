// ============================================================
// ADD USE CASES TO FLEET SHEET
// Paste script ini ke Google Apps Script editor
// (Extensions > Apps Script) di Google Spreadsheet Anda
// Pilih fungsi "addUseCasesToFleetSheet" dan klik ▶ Run
// ============================================================

function addUseCasesToFleetSheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var fleetSheet = ss.getSheetByName('fleet');

    if (!fleetSheet) {
        Logger.log('ERROR: Sheet "fleet" tidak ditemukan!');
        return;
    }

    // Data use cases yang akan ditambahkan
    var useCaseRows = [
        ['usecases_title', 'Ideal'],
        ['usecases_highlight', 'Use Cases'],
        ['usecases_desc', 'Berbagai skenario perjalanan dan pengiriman yang cocok menggunakan armada kami.'],
        ['usecase_1_icon', 'Briefcase'],
        ['usecase_1_title', 'Corporate Events'],
        ['usecase_1_desc', 'Sempurna untuk Rakernas, Outing Perusahaan, atau Study Tour Eksekutif dengan fasilitas VVIP.'],
        ['usecase_2_icon', 'PlaneTakeoff'],
        ['usecase_2_title', 'Airport Transfer'],
        ['usecase_2_desc', 'Mobilitas cepat dari dan ke bandara internasional dengan armada Hiace Premio.'],
        ['usecase_3_icon', 'PackageOpen'],
        ['usecase_3_title', 'Industrial Logistics'],
        ['usecase_3_desc', 'Angkutan kargo logistik skala besar dengan Wingbox Tronton dan Blind Van.'],
    ];

    // Baca existing keys dari fleet sheet untuk cek duplikat
    var fleetData = fleetSheet.getDataRange().getValues();
    var existingKeys = [];
    for (var i = 1; i < fleetData.length; i++) {
        if (fleetData[i][0]) existingKeys.push(fleetData[i][0].toString());
    }

    // Filter rows yang belum ada
    var rowsToAdd = [];
    var skipped = [];
    for (var j = 0; j < useCaseRows.length; j++) {
        var key = useCaseRows[j][0];
        if (existingKeys.indexOf(key) === -1) {
            rowsToAdd.push(useCaseRows[j]);
        } else {
            skipped.push(key);
        }
    }

    // Tambahkan rows ke fleet sheet
    if (rowsToAdd.length > 0) {
        var lastRow = fleetSheet.getLastRow();
        fleetSheet.getRange(lastRow + 1, 1, rowsToAdd.length, 2).setValues(rowsToAdd);
        Logger.log('✅ ' + rowsToAdd.length + ' rows ditambahkan ke sheet "fleet"');
    } else {
        Logger.log('ℹ️ Semua data use cases sudah ada di sheet "fleet"');
    }

    if (skipped.length > 0) {
        Logger.log('⏭️ Keys yang di-skip (sudah ada): ' + skipped.join(', '));
    }

    Logger.log('');
    Logger.log('🎉 Selesai! Data use cases sekarang bisa diedit langsung dari spreadsheet.');
    Logger.log('Keys yang tersedia:');
    Logger.log('  - usecases_title, usecases_highlight, usecases_desc');
    Logger.log('  - usecase_1_icon, usecase_1_title, usecase_1_desc');
    Logger.log('  - usecase_2_icon, usecase_2_title, usecase_2_desc');
    Logger.log('  - usecase_3_icon, usecase_3_title, usecase_3_desc');
}
