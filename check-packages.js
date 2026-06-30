const db = require('./db');

db.all('SELECT id, title, cover_image FROM TourPackages', (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.log(rows);
    }
});
