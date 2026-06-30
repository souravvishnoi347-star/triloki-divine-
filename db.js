const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

// On Vercel, use /tmp (writable). Locally, use project directory.
const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel ? '/tmp/database.sqlite' : path.resolve(__dirname, 'database.sqlite');

// Copy the bundled database to /tmp on Vercel (cold start)
if (isVercel) {
    const srcDb = path.resolve(__dirname, 'database.sqlite');
    if (fs.existsSync(srcDb) && !fs.existsSync(dbPath)) {
        fs.copyFileSync(srcDb, dbPath);
    }
}

const db = new sqlite3.Database(dbPath);

// Initialize DB schema
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS TourPackages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        cover_image TEXT,
        transport_badge TEXT,
        duration TEXT,
        route TEXT,
        price TEXT,
        inclusions TEXT,
        itinerary_details TEXT,
        category TEXT,
        exclusions TEXT,
        important_notes TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hero_heading TEXT,
        phone TEXT,
        email TEXT,
        location TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password_hash TEXT
    )`);

    // Seed default admin if not exists
    db.get("SELECT * FROM Admins WHERE email = 'admin@triloki.in'", (err, row) => {
        if (!row) {
            const hash = bcrypt.hashSync('admin123', 10);
            db.run("INSERT INTO Admins (email, password_hash) VALUES (?, ?)", ['admin@triloki.in', hash]);
        }
    });

    // Seed default settings if empty
    db.get("SELECT * FROM Settings WHERE id = 1", (err, row) => {
        if (!row) {
            db.run(`INSERT INTO Settings (hero_heading, phone, email, location) 
                    VALUES (?, ?, ?, ?)`, 
                    ['Experience the Divine: Premium Char Dham Yatra by Helicopter & Road', 
                     '+91 8445214371', 
                     'support@trilokigroup.in', 
                     'Uchapul near Railway Bridge Arya Nagar Haridwar']);
        }
    });
});

module.exports = db;
