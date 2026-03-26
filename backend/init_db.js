require('dotenv').config();
const mysql = require('mysql2/promise');

async function initDB() {
    console.log('Connecting to MySQL...');
    // Create connection without database selected to create it first
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
    });

    try {
        console.log(`Creating database ${process.env.DB_NAME}...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'transgo_premium'}\``);
        
        console.log('Connecting to the database...');
        await connection.query(`USE \`${process.env.DB_NAME || 'transgo_premium'}\``);

        // 1. SERVICES
        await connection.query(`
            CREATE TABLE IF NOT EXISTS services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                \`desc\` TEXT NOT NULL,
                icon VARCHAR(100) NOT NULL
            )
        `);
        // 2. FLEETS
        await connection.query(`
            CREATE TABLE IF NOT EXISTS fleets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                cap VARCHAR(100) NOT NULL,
                type VARCHAR(100) NOT NULL,
                img VARCHAR(255) NOT NULL
            )
        `);
        // 3. FLEET FEATURES
        await connection.query(`
            CREATE TABLE IF NOT EXISTS fleet_features (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fleet_id INT NOT NULL,
                feature_name VARCHAR(255) NOT NULL,
                FOREIGN KEY (fleet_id) REFERENCES fleets(id) ON DELETE CASCADE
            )
        `);
        // 4. SLIDES
        await connection.query(`
            CREATE TABLE IF NOT EXISTS slides (
                id INT PRIMARY KEY,
                image VARCHAR(255) NOT NULL,
                alt VARCHAR(255) NOT NULL,
                badge VARCHAR(255) NOT NULL,
                stat VARCHAR(100) NOT NULL,
                statLabel VARCHAR(255) NOT NULL
            )
        `);
        // 5. FEATURES
        await connection.query(`
            CREATE TABLE IF NOT EXISTS features (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                \`desc\` TEXT NOT NULL,
                icon VARCHAR(100) NOT NULL
            )
        `);
        // 6. TESTIMONIALS
        await connection.query(`
            CREATE TABLE IF NOT EXISTS testimonials (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(255) NOT NULL,
                review TEXT NOT NULL
            )
        `);
        // 7. STATS
        await connection.query(`
            CREATE TABLE IF NOT EXISTS stats (
                id INT PRIMARY KEY,
                trips VARCHAR(100),
                clients VARCHAR(100),
                onTime VARCHAR(100),
                fleetUnits VARCHAR(100)
            )
        `);
        // 8. STEPS
        await connection.query(`
            CREATE TABLE IF NOT EXISTS steps (
                id INT AUTO_INCREMENT PRIMARY KEY,
                step VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                \`desc\` TEXT NOT NULL,
                icon VARCHAR(100) NOT NULL
            )
        `);
        // 9. COVERAGE AREAS
        await connection.query(`
            CREATE TABLE IF NOT EXISTS coverage_areas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )
        `);

        console.log('Clearing existing data...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        const tables = ['services', 'fleet_features', 'fleets', 'slides', 'features', 'testimonials', 'stats', 'steps', 'coverage_areas'];
        for (const table of tables) {
            await connection.query(`TRUNCATE TABLE ${table}`);
        }
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('Seeding Data...');

        // Seed Services
        const services = [
            ['Bus Rental', 'Charter bus untuk travel, company trip, dan perjalanan eksekutif.', 'Bus'],
            ['Truck Rental', 'Angkutan barang skala kecil hingga besar dengan armada modern.', 'Truck'],
            ['Cargo Delivery', 'Pengiriman antar kota dan nasional yang aman dan tepat waktu.', 'Package'],
            ['Logistics Solution', 'End-to-end supply chain manajemen untuk bisnis Anda.', 'Globe']
        ];
        for (const s of services) {
            await connection.query('INSERT INTO services (title, `desc`, icon) VALUES (?, ?, ?)', s);
        }

        // Seed Fleets
        const fleets = [
            ['Luxury Jetbus 5', '50 Seats', 'Bus', 'bus-fleet.jpg', ["AC & Air Suspension", "Toilet", "Karaoke", "Reclining Seat"]],
            ['Hiace Premio', '14 Seats', 'Travel', 'hiace-premio.png', ["AC", "Audio & Entertainment", "Spacious Legroom", "USB Charger"]],
            ['Wingbox Tronton', '20 Ton', 'Cargo', 'truck-fleet.png', ["GPS Tracking", "Hydraulic Door", "Waterproof", "Heavy Duty Engine"]],
            ['Scania K410IB', '55 Seats', 'Bus', 'scania.jpg', ["Air Suspension", "AC", "Luxury Seat", "DVD / Video"]],
            ['Blind Van', '1.5 Ton', 'Cargo', 'blind-van.png', ["Fast Delivery", "City Routing", "Secure Lock", "24/7 Availability"]]
        ];
        let fleetId = 1;
        for (const f of fleets) {
            await connection.query('INSERT INTO fleets (name, cap, type, img) VALUES (?, ?, ?, ?)', [f[0], f[1], f[2], f[3]]);
            for (const feature of f[4]) {
                await connection.query('INSERT INTO fleet_features (fleet_id, feature_name) VALUES (?, ?)', [fleetId, feature]);
            }
            fleetId++;
        }

        // Seed Slides
        const slides = [
            [0, "bus-fleet.jpg", 'Premium Bus Fleet', 'Bus Fleet', '50+', 'Unit\nBus'],
            [1, "truck-fleet.png", 'Truck Fleet', 'Truck Fleet', '120+', 'Unit\nTruck'],
            [2, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200', 'Cargo Services', 'Cargo', '1000+', 'Shipments\nDelivered']
        ];
        for (const s of slides) {
            await connection.query('INSERT INTO slides (id, image, alt, badge, stat, statLabel) VALUES (?, ?, ?, ?, ?, ?)', s);
        }

        // Seed Features
        const features = [
            ["Premium Fleet Quality", "Armada modern dengan perawatan berkala dan standar kualitas tinggi.", "Star"],
            ["Professional Driver", "Pengemudi bersertifikat dan berpengalaman bertahun-tahun.", "Users"],
            ["On-Time Guarantee", "Komitmen ketepatan waktu dalam setiap perjalanan dan pengiriman.", "Clock"],
            ["Real-time Tracking", "Pantau armada dan kargo Anda secara akurat dan transparan.", "MapPin"],
            ["24/7 Customer Support", "Layanan pelanggan yang selalu siap melayani Anda kapanpun.", "Headset"]
        ];
        for (const f of features) {
            await connection.query('INSERT INTO features (title, `desc`, icon) VALUES (?, ?, ?)', f);
        }

        // Seed Testimonials
        const testimonials = [
            ["Budi Santoso", "Event Organizer", "Layanan TransElite sangat memuaskan, armada bus selalu bersih dan tepat waktu. Klien kami sangat senang dengan fasilitas eksekutifnya."],
            ["Andi Wijaya", "Logistics Manager", "Proses pengiriman kargo menjadi jauh lebih mudah sejak kerja sama dengan TransElite. Tracking akurat dan barang selalu sampai tepat waktu."],
            ["Rina S.", "HR Director", "Sewa bus untuk company trip tahunan berjalan lancar tanpa kendala. Driver sangat profesional dan berdedikasi. Highly recommended!"]
        ];
        for (const t of testimonials) {
            await connection.query('INSERT INTO testimonials (name, role, review) VALUES (?, ?, ?)', t);
        }

        // Seed Stats
        await connection.query('INSERT INTO stats (id, trips, clients, onTime, fleetUnits) VALUES (1, ?, ?, ?, ?)', ["10K+", "500+", "99%", "50+"]);

        // Seed Steps
        const steps = [
            ["01", "Book Service", "Hubungi kami melalui telepon atau formulir pemesanan online.", "PhoneCall"],
            ["02", "Confirm Detail", "Tim kami akan mengkonfirmasi jadwal, rute, dan armada yang sesuai.", "CheckCircle2"],
            ["03", "Dispatch", "Armada diberangkatkan tepat waktu dengan pengemudi profesional.", "Truck"],
            ["04", "Safe Delivery", "Tiba di tujuan dengan aman, nyaman, dan tepat waktu.", "MapPin"]
        ];
        for (const s of steps) {
            await connection.query('INSERT INTO steps (step, title, `desc`, icon) VALUES (?, ?, ?, ?)', s);
        }

        // Seed Coverage Areas
        const areas = ["Jawa", "Sumatera", "Bali & Nusa Tenggara", "Kalimantan", "Sulawesi Selatan", "Sulawesi Utara", "Papua", "Lintas Pulau"];
        for (const a of areas) {
            await connection.query('INSERT INTO coverage_areas (name) VALUES (?)', [a]);
        }

        console.log('✅ Database Initialization & Seeding Complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error during database initialization:', err);
        process.exit(1);
    }
}

initDB();
