const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.serialize(() => {
    console.log("Adding exclusions column...");
    db.run("ALTER TABLE TourPackages ADD COLUMN exclusions TEXT", (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.error(err);
        } else {
            console.log("exclusions column added or already exists.");
        }
    });

    console.log("Adding important_notes column...");
    db.run("ALTER TABLE TourPackages ADD COLUMN important_notes TEXT", (err) => {
        if (err && !err.message.includes("duplicate column name")) {
            console.error(err);
        } else {
            console.log("important_notes column added or already exists.");
            
            // Set some default exclusions and notes for existing packages so they don't look empty
            const defaultExclusions = "GST (5%) is applicable extra.|Any kind of food or beverages not included in the package.|Any personal expenses such as tips, laundry, telephone bills.|Any cost arising due to natural calamities.";
            const defaultNotes = "MUST CARRY: Authentic Government ID Card.|Comfortable warm clothing and good walking shoes.|Package prices are dynamic and subject to change.|100% advance payment required for booking confirmation.";
            
            db.run("UPDATE TourPackages SET exclusions = ?, important_notes = ? WHERE exclusions IS NULL", [defaultExclusions, defaultNotes], () => {
                console.log("Default values populated.");
                db.close();
            });
        }
    });
});
