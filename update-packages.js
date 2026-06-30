const fs = require('fs');
const path = require('path');
const db = require('./db');

const mapping = [
    { id: 1, file: 'dodham-heli.png' },
    { id: 2, file: 'dodham-heli-sameday.png' },
    { id: 3, file: 'chardham-heli.png' },
    { id: 4, file: 'chardham-deluxe.png' },
    { id: 5, file: 'chardham-luxary.png' }
];

mapping.forEach(m => {
    const srcPath = path.join(__dirname, 'assets', 'new', m.file);
    const destPath = path.join(__dirname, 'assets', m.file);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        
        db.run('UPDATE TourPackages SET cover_image = ? WHERE id = ?', [m.file, m.id], function(err) {
            if (err) console.error(err);
            else console.log(`Updated package ${m.id} to use ${m.file}`);
        });
    } else {
        console.log('File not found: ' + srcPath);
    }
});
