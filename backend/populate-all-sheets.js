// ============================================================
// POPULATE ALL SHEETS — Paste di Google Apps Script editor
// (Extensions > Apps Script) di Google Spreadsheet Anda
// Pilih fungsi "populateAllSheets" dan klik ▶ Run
// ============================================================
// Script ini akan menambahkan semua konten halaman ke sheet
// masing-masing (home, about, services, fleet, contact)
// agar bisa diedit langsung dari spreadsheet.
// ============================================================

function populateAllSheets() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    populateHomeSheet(ss);
    populateAboutSheet(ss);
    populateServicesSheet(ss);
    populateFleetSheet(ss);
    populateContactSheet(ss);

    Logger.log('');
    Logger.log('🎉🎉🎉 SELESAI! Semua sheet telah dipopulasi!');
    Logger.log('Sekarang Anda bisa mengedit konten website langsung dari spreadsheet.');
}

// ============================================================
// Helper: tambahkan rows ke sheet KV, skip jika key sudah ada
// ============================================================
function addRowsToKVSheet(ss, sheetName, rows) {
    var sheet = ss.getSheetByName(sheetName);

    // Buat sheet jika belum ada
    if (!sheet) {
        sheet = ss.insertSheet(sheetName);
        sheet.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
        Logger.log('📄 Sheet "' + sheetName + '" dibuat baru');
    }

    // Baca existing keys
    var data = sheet.getDataRange().getValues();
    var existingKeys = [];
    for (var i = 1; i < data.length; i++) {
        if (data[i][0]) existingKeys.push(data[i][0].toString());
    }

    // Pastikan header ada
    if (data.length === 0 || (data[0][0] !== 'key' && data[0][1] !== 'value')) {
        sheet.getRange(1, 1, 1, 2).setValues([['key', 'value']]);
    }

    // Filter rows yang belum ada
    var rowsToAdd = [];
    var skipped = [];
    for (var j = 0; j < rows.length; j++) {
        if (existingKeys.indexOf(rows[j][0]) === -1) {
            rowsToAdd.push(rows[j]);
        } else {
            skipped.push(rows[j][0]);
        }
    }

    // Tambahkan rows
    if (rowsToAdd.length > 0) {
        var lastRow = sheet.getLastRow();
        sheet.getRange(lastRow + 1, 1, rowsToAdd.length, 2).setValues(rowsToAdd);
        Logger.log('✅ Sheet "' + sheetName + '": ' + rowsToAdd.length + ' rows ditambahkan');
    } else {
        Logger.log('ℹ️ Sheet "' + sheetName + '": Semua data sudah ada');
    }

    if (skipped.length > 0) {
        Logger.log('   ⏭️ Keys di-skip: ' + skipped.join(', '));
    }
}

// ============================================================
// HOME SHEET
// Konten: Hero, Steps, Stats, Testimonials, Features
// ============================================================
function populateHomeSheet(ss) {
    var rows = [
        // --- Hero Section ---
        ['hero_badge', 'Premium Logistics & Travel'],
        ['hero_title_1', 'ELITE'],
        ['hero_title_2', 'TRANSPORT'],
        ['hero_title_3', 'SOLUTIONS.'],
        ['hero_desc', 'Experience the next generation of transportation with our modern fleet of premium vehicles designed for ultimate comfort, safety, and reliability.'],
        ['hero_feature_1', 'Safe & Secure'],
        ['hero_feature_2', 'On-Time Always'],
        ['hero_feature_3', 'Premium Service'],
        ['hero_cta_1', 'Explore Fleet'],
        ['hero_cta_2', 'Book Now'],

        // --- Steps Section ---
        ['steps_badge', 'Simple Process'],
        ['steps_title', 'How It'],
        ['steps_highlight', 'Works'],
        ['steps_prefix', 'STEP'],
        ['step_1_step', '1'],
        ['step_1_title', 'Choose Vehicle'],
        ['step_1_desc', 'Pilih armada sesuai kebutuhan perjalanan Anda.'],
        ['step_1_icon', 'Bus'],
        ['step_2_step', '2'],
        ['step_2_title', 'Set Schedule'],
        ['step_2_desc', 'Tentukan jadwal keberangkatan dan tujuan.'],
        ['step_2_icon', 'Calendar'],
        ['step_3_step', '3'],
        ['step_3_title', 'Confirmation'],
        ['step_3_desc', 'Konfirmasi pemesanan dan lakukan pembayaran.'],
        ['step_3_icon', 'CheckCircle2'],
        ['step_4_step', '4'],
        ['step_4_title', 'Enjoy Trip'],
        ['step_4_desc', 'Nikmati perjalanan dengan armada premium kami.'],
        ['step_4_icon', 'Star'],

        // --- Stats Section ---
        ['stats_trips', '5000+'],
        ['stats_clients', '500+'],
        ['stats_ontime', '99%'],
        ['stats_fleetunits', '50+'],
        ['stat_1_key', 'trips'],
        ['stat_1_label', 'Trips Completed'],
        ['stat_1_icon', 'MapPin'],
        ['stat_2_key', 'clients'],
        ['stat_2_label', 'Happy Clients'],
        ['stat_2_icon', 'Users'],
        ['stat_3_key', 'onTime'],
        ['stat_3_label', 'On-Time Rate'],
        ['stat_3_icon', 'Clock'],
        ['stat_4_key', 'fleetUnits'],
        ['stat_4_label', 'Fleet Units'],
        ['stat_4_icon', 'Truck'],

        // --- Testimonials Section ---
        ['testimonials_badge', 'Testimonials'],
        ['testimonials_title', 'Client'],
        ['testimonials_highlight', 'Stories'],
        ['testimonial_1_review', 'Layanan transportasi terbaik yang pernah kami gunakan. Armada premium dan tepat waktu.'],
        ['testimonial_1_name', 'Ahmad Rizki'],
        ['testimonial_1_role', 'CEO, PT Logistik Nusantara'],
        ['testimonial_2_review', 'TransElite selalu menjadi pilihan utama untuk event korporat kami. Profesional dan reliable.'],
        ['testimonial_2_name', 'Sari Dewi'],
        ['testimonial_2_role', 'Event Manager, Global Corp'],
        ['testimonial_3_review', 'Pengiriman cargo skala besar jadi lebih mudah dan aman dengan TransElite. Sangat recommended!'],
        ['testimonial_3_name', 'Budi Santoso'],
        ['testimonial_3_role', 'Supply Chain Director'],

        // --- Features Section (shared with Services page) ---
        ['features_floating_title', 'Elite Quality'],
        ['features_floating_desc', 'Standar pelayanan premium untuk kenyamanan Anda.'],
    ];

    addRowsToKVSheet(ss, 'home', rows);
}

// ============================================================
// ABOUT SHEET
// Konten: Header, Story, Vision, Mission, Values, CTA
// ============================================================
function populateAboutSheet(ss) {
    var rows = [
        // --- Header ---
        ['about_badge', 'About Us'],
        ['header_title_1', 'DRIVING THE'],
        ['header_highlight', 'FUTURE'],
        ['header_title_2', 'OF LOGISTICS'],
        ['header_desc', 'TransElite adalah penyedia layanan transportasi dan logistik premium yang berdedikasi untuk memberikan solusi pengiriman dan perjalanan yang aman, efisien, dan modern.'],

        // --- Our Story ---
        ['story_title_1', 'A Legacy of'],
        ['story_highlight', 'Excellence'],
        ['story_para_1', 'Berdiri sejak lebih dari satu dekade lalu, TransElite bertransformasi dari penyedia armada lokal menjadi perusahaan penyedia solusi logistik dan transportasi nasional berskala premium.'],
        ['story_para_2', 'Kami memahami bahwa di dunia logistik modern, efisiensi dan keandalan adalah kunci utama.'],
        ['story_badge', '10+ YEARS'],
        ['story_badge_sub', 'Experience'],

        // --- Vision & Mission ---
        ['vision_title', 'Our Vision'],
        ['vision_text', 'Menjadi penyedia layanan transportasi dan logistik premium nomor satu di Indonesia.'],
        ['mission_title', 'Our Mission'],
        ['mission_1', 'Menyediakan armada transportasi darat modern berstandar premium.'],
        ['mission_2', 'Menerapkan keunggulan operasional 24/7.'],
        ['mission_3', 'Membangun kemitraan strategis dengan entitas korporat nasional.'],

        // --- Core Values ---
        ['values_title_1', 'Our Core'],
        ['values_title_2', 'Values'],
        ['value_1_title', 'Integrity'],
        ['value_1_desc', 'Menjalankan operasional dengan standar integritas dan keamanan tertinggi di industri.'],
        ['value_2_title', 'Reliability'],
        ['value_2_desc', 'Akurat dan dapat diandalkan adalah janji utama yang selalu kami penuhi bagi setiap klien.'],
        ['value_3_title', 'Excellence'],
        ['value_3_desc', 'Berkomitmen pada inovasi berkelanjutan untuk selalu berada di garis depan layanan logistik.'],

        // --- CTA ---
        ['cta_title_1', 'Partner With'],
        ['cta_title_2', 'TransElite Today'],
        ['cta_desc', 'Tingkatkan efisiensi bisnis Anda dengan dukungan sistem logistik dan transportasi terbaik.'],
        ['cta_button', 'Contact Us Now'],
    ];

    addRowsToKVSheet(ss, 'about', rows);
}

// ============================================================
// SERVICES SHEET
// Konten: Services, Features, Coverage, Ecosystem section
// ============================================================
function populateServicesSheet(ss) {
    var rows = [
        // --- Services Section Header ---
        ['services_badge', 'Our Services'],
        ['services_title', 'Premium'],
        ['services_highlight', 'Solutions'],

        // --- Service Items ---
        ['service_1_id', '1'],
        ['service_1_title', 'Executive Travel'],
        ['service_1_desc', 'Layanan transportasi eksekutif kelas premium untuk perjalanan bisnis dan korporat.'],
        ['service_1_icon', 'Briefcase'],
        ['service_2_id', '2'],
        ['service_2_title', 'Cargo Logistics'],
        ['service_2_desc', 'Solusi logistik kargo terintegrasi dengan armada tronton dan wingbox modern.'],
        ['service_2_icon', 'Package'],
        ['service_3_id', '3'],
        ['service_3_title', 'Event Transport'],
        ['service_3_desc', 'Penyediaan armada massal untuk event korporat, MICE, dan konferensi nasional.'],
        ['service_3_icon', 'Users'],
        ['service_4_id', '4'],
        ['service_4_title', 'Airport Transfer'],
        ['service_4_desc', 'Layanan antar-jemput bandara premium dengan ketepatan waktu terjamin.'],
        ['service_4_icon', 'PlaneTakeoff'],

        // --- Features Section Header ---
        ['features_badge', 'Why Choose Us'],
        ['features_title', 'The'],
        ['features_highlight', 'Elite'],
        ['features_suffix', 'Advantage'],
        ['features_desc', 'Kami memberikan standar layanan tertinggi dalam industri transportasi dan logistik.'],

        // --- Feature Items ---
        ['feature_1_icon', 'ShieldCheck'],
        ['feature_1_title', 'Safety First'],
        ['feature_1_desc', 'Protokol keamanan berlapis dan armada terawat dengan standar internasional.'],
        ['feature_2_icon', 'Clock'],
        ['feature_2_title', 'Always On-Time'],
        ['feature_2_desc', 'Komitmen ketepatan waktu 99% dengan sistem monitoring real-time.'],
        ['feature_3_icon', 'Award'],
        ['feature_3_title', 'Premium Fleet'],
        ['feature_3_desc', 'Armada modern dengan fasilitas kelas premium untuk kenyamanan maksimal.'],
        ['feature_4_icon', 'Headphones'],
        ['feature_4_title', '24/7 Support'],
        ['feature_4_desc', 'Tim dukungan pelanggan profesional siap melayani sepanjang waktu.'],

        // --- Coverage Area Section ---
        ['coverage_title', 'Nationwide'],
        ['coverage_highlight', 'Coverage'],
        ['coverage_desc', 'Jaringan operasional kami mencakup kota-kota besar di seluruh Indonesia.'],
        ['coverage_1', 'Jakarta'],
        ['coverage_2', 'Surabaya'],
        ['coverage_3', 'Bandung'],
        ['coverage_4', 'Semarang'],
        ['coverage_5', 'Yogyakarta'],
        ['coverage_6', 'Medan'],
        ['coverage_7', 'Makassar'],
        ['coverage_8', 'Bali'],

        // --- Ecosystem Section (Services page only) ---
        ['eco_title_1', 'Comprehensive'],
        ['eco_title_2', 'Transport Ecosystem'],
        ['eco_para_1', 'TransElite menyediakan ekosistem transportasi hulu ke hilir.'],
        ['eco_para_2', 'Setiap layanan dirancang dengan protokol keamanan ketat dan dukungan kru profesional.'],
        ['eco_feature_1', 'Terintegrasi penuh dengan ekosistem IT logistik'],
        ['eco_feature_2', 'Perlindungan asuransi pengiriman komprehensif'],
        ['eco_feature_3', 'Skalabilitas tinggi untuk proyek tender korporasi'],
    ];

    addRowsToKVSheet(ss, 'services', rows);
}

// ============================================================
// FLEET SHEET
// Konten: Page content, Vehicle data, Use Cases
// ============================================================
function populateFleetSheet(ss) {
    var rows = [
        // --- Page Header ---
        ['page_badge', 'Our Vehicles'],
        ['page_title', 'Premium'],
        ['page_highlight', 'Fleet'],
        ['page_desc', 'Eksplorasi armada premium kami yang dirancang khusus untuk kenyamanan eksekutif dan efisiensi logistik kelas berat.'],
        ['empty_text', 'Armada tidak ditemukan untuk kategori ini.'],

        // --- Vehicle Data ---
        ['vehicle_1_id', '1'],
        ['vehicle_1_image', 'bus-fleet.jpg'],
        ['vehicle_1_alt', 'Toyota Hiace Premio'],
        ['vehicle_1_name', 'Toyota Hiace Premio'],
        ['vehicle_1_cap', '14 Seats'],
        ['vehicle_1_type', 'Hiace-Premio'],
        ['vehicle_1_category', 'Passenger'],
        ['vehicle_1_features', 'Reclining Seat, AC, Audio System, LED TV'],
        ['vehicle_2_id', '2'],
        ['vehicle_2_image', 'bus-fleet.jpg'],
        ['vehicle_2_alt', 'Mitsubishi Colt Diesel'],
        ['vehicle_2_name', 'Mitsubishi Colt Diesel'],
        ['vehicle_2_cap', '5 Ton'],
        ['vehicle_2_type', 'Tronton'],
        ['vehicle_2_category', 'Cargo'],
        ['vehicle_2_features', 'GPS Tracking, Hydraulic Tail Gate, Box Aluminium'],
        ['vehicle_3_id', '3'],
        ['vehicle_3_image', 'bus-fleet.jpg'],
        ['vehicle_3_alt', 'Medium Bus 33 Seat'],
        ['vehicle_3_name', 'Medium Bus 33 Seat'],
        ['vehicle_3_cap', '33 Seats'],
        ['vehicle_3_type', 'Medium-Bus'],
        ['vehicle_3_category', 'Passenger'],
        ['vehicle_3_features', 'AC, Reclining Seat, Audio, Bagasi Luas'],
        ['vehicle_4_id', '4'],
        ['vehicle_4_image', 'bus-fleet.jpg'],
        ['vehicle_4_alt', 'Big Bus 59 Seat'],
        ['vehicle_4_name', 'Big Bus 59 Seat'],
        ['vehicle_4_cap', '59 Seats'],
        ['vehicle_4_type', 'Big-Bus'],
        ['vehicle_4_category', 'Passenger'],
        ['vehicle_4_features', 'AC, Toilet, LED TV, Reclining Seat, Audio'],
        ['vehicle_5_id', '5'],
        ['vehicle_5_image', 'blind-van.png'],
        ['vehicle_5_alt', 'Toyota HiAce Blind Van'],
        ['vehicle_5_name', 'Toyota HiAce Blind Van'],
        ['vehicle_5_cap', '1000 Kg'],
        ['vehicle_5_type', 'Blind-Van'],
        ['vehicle_5_category', 'Cargo'],
        ['vehicle_5_features', 'Cargo Area Luas, Pintu Geser, AC, Power Steering'],
        ['vehicle_6_id', '6'],
        ['vehicle_6_image', 'truck-fleet.png'],
        ['vehicle_6_alt', 'Mitsubishi Fuso Fighter'],
        ['vehicle_6_name', 'Mitsubishi Fuso Fighter'],
        ['vehicle_6_cap', '8-10 Ton'],
        ['vehicle_6_type', 'Wing-Box'],
        ['vehicle_6_category', 'Cargo'],
        ['vehicle_6_features', 'Wing Box Aluminium, GPS Tracking, Hydraulic Tail Gate'],

        // --- Ideal Use Cases ---
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

    addRowsToKVSheet(ss, 'fleet', rows);
}

// ============================================================
// CONTACT SHEET
// Konten: Contact info, WhatsApp, Social Media, Footer
// ============================================================
function populateContactSheet(ss) {
    var rows = [
        // --- Contact Page ---
        ['contact_title_1', 'Siap Untuk'],
        ['contact_title_2', 'Berangkat?'],
        ['contact_desc', 'Hubungi tim konsultan transportasi kami untuk penawaran harga terbaik.'],
        ['wa_button', 'HUBUNGI VIA WHATSAPP'],
        ['wa_text', 'Halo TransElite, saya ingin bertanya mengenai layanan transportasi Anda. Mohon informasi lebih lanjut.'],

        // --- Contact Info ---
        ['wa_number', '6287788332767'],
        ['phone', '+62 877 8833 2767'],
        ['email', 'book@transelite.com'],
        ['address', '193 Steele Street, New York, NY 10001'],

        // --- Social Media ---
        ['facebook', '#'],
        ['instagram', '#'],
        ['twitter', '#'],
        ['linkedin', '#'],

        // --- Footer ---
        ['footer_desc', 'Providing top-tier transport and logistics solutions. Your reliable partner in moving your business forward with confidence.'],
        ['copyright', 'Made With ❤️© 2025 PT Integrasi Performa Amanah (Grasfam). All Rights Reserved.'],
        ['quick_links_title', 'Quick Links'],
        ['contact_us_title', 'Contact Us'],
        ['newsletter_title', 'Subscribe Newsletter'],
        ['newsletter_desc', 'Stay updated with our latest news and special offers. We promise not to spam your inbox.'],
        ['email_placeholder', 'Enter your email'],
    ];

    addRowsToKVSheet(ss, 'contact', rows);
}
