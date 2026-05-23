// ============================================================
// MIGRATION SCRIPT — Paste di Google Apps Script editor
// (Extensions > Apps Script) di spreadsheet Anda
// Pilih fungsi "migrateServicesToServicesSheet" dan klik ▶ Run
// ============================================================

function migrateServicesToServicesSheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var homeSheet = ss.getSheetByName('home');
    var servicesSheet = ss.getSheetByName('services');

    if (!homeSheet) {
        Logger.log('ERROR: Sheet "home" tidak ditemukan!');
        return;
    }
    if (!servicesSheet) {
        Logger.log('ERROR: Sheet "services" tidak ditemukan!');
        return;
    }

    // Keys yang perlu dipindahkan dari home → services
    var keysToMove = [
        'services_badge', 'services_title', 'services_highlight',
        'service_1_id', 'service_1_title', 'service_1_desc', 'service_1_icon',
        'service_2_id', 'service_2_title', 'service_2_desc', 'service_2_icon',
        'service_3_id', 'service_3_title', 'service_3_desc', 'service_3_icon',
        'service_4_id', 'service_4_title', 'service_4_desc', 'service_4_icon',
        'features_badge', 'features_title', 'features_highlight', 'features_suffix', 'features_desc',
        'feature_1_icon', 'feature_1_title', 'feature_1_desc',
        'feature_2_icon', 'feature_2_title', 'feature_2_desc',
        'feature_3_icon', 'feature_3_title', 'feature_3_desc',
        'feature_4_icon', 'feature_4_title', 'feature_4_desc',
        'features_floating_title', 'features_floating_desc'
    ];

    // Keys yang bisa dihapus dari home (sudah tidak dipakai)
    var keysToDelete = [
        'fleet_badge', 'fleet_title', 'fleet_highlight',
        'fleet_stat1_label', 'fleet_stat2', 'fleet_stat2_label', 'fleet_stat3_label',
        'cta_title_1', 'cta_title_2', 'cta_desc', 'cta_button'
    ];

    // Baca semua data dari home sheet
    var homeData = homeSheet.getDataRange().getValues();
    var homeHeaders = homeData[0]; // ['key', 'value']
    var keyCol = homeHeaders.indexOf('key');
    var valCol = homeHeaders.indexOf('value');

    if (keyCol === -1 || valCol === -1) {
        Logger.log('ERROR: Sheet "home" harus punya kolom "key" dan "value"');
        return;
    }

    // Baca existing data dari services sheet untuk cek duplikat
    var servicesData = servicesSheet.getDataRange().getValues();
    var existingKeys = [];
    for (var s = 1; s < servicesData.length; s++) {
        if (servicesData[s][0]) existingKeys.push(servicesData[s][0].toString());
    }

    // Kumpulkan rows yang akan dipindahkan
    var rowsToAdd = [];
    var rowsToDeleteFromHome = []; // baris yang di-delete (1-indexed)

    for (var i = 1; i < homeData.length; i++) {
        var key = homeData[i][keyCol] ? homeData[i][keyCol].toString() : '';
        var value = homeData[i][valCol] ? homeData[i][valCol].toString() : '';

        if (keysToMove.indexOf(key) !== -1) {
            // Tambahkan ke services jika belum ada
            if (existingKeys.indexOf(key) === -1) {
                rowsToAdd.push([key, value]);
            }
            rowsToDeleteFromHome.push(i + 1); // +1 karena sheet baris dimulai dari 1
        } else if (keysToDelete.indexOf(key) !== -1) {
            rowsToDeleteFromHome.push(i + 1);
        }
    }

    // Tambahkan rows ke services sheet
    if (rowsToAdd.length > 0) {
        var lastRow = servicesSheet.getLastRow();
        servicesSheet.getRange(lastRow + 1, 1, rowsToAdd.length, 2).setValues(rowsToAdd);
        Logger.log('✅ ' + rowsToAdd.length + ' rows ditambahkan ke sheet "services"');
    } else {
        Logger.log('ℹ️ Tidak ada data baru untuk ditambahkan (sudah ada di services)');
    }

    // Hapus rows dari home sheet (dari bawah ke atas agar index tidak bergeser)
    rowsToDeleteFromHome.sort(function (a, b) { return b - a; });
    for (var d = 0; d < rowsToDeleteFromHome.length; d++) {
        homeSheet.deleteRow(rowsToDeleteFromHome[d]);
    }
    Logger.log('🗑️ ' + rowsToDeleteFromHome.length + ' rows dihapus dari sheet "home"');

    Logger.log('');
    Logger.log('🎉 Migrasi selesai!');
    Logger.log('Sheet "home" sekarang hanya berisi: hero, steps, stats, testimonials');
    Logger.log('Sheet "services" sekarang berisi: services, features, coverage, CTA');
}
