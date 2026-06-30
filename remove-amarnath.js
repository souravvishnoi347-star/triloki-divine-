const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.serialize(() => {
    db.run("DELETE FROM TourPackages WHERE title LIKE '%Amarnath%'", (err) => {
        if (err) console.error(err);
        else console.log("Amarnath packages deleted from database.");
        db.close();
    });
});
