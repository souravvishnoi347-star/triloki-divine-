const fs = require('fs');
const path = require('path');

const newDir = path.join(__dirname, 'assets', 'new');
const assetsDir = path.join(__dirname, 'assets');

const files = fs.readdirSync(newDir);

let imgCount = 1;

files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    const oldPath = path.join(newDir, file);
    
    if (ext === '.mp4') {
        fs.renameSync(oldPath, path.join(assetsDir, 'hero-video.mp4'));
    } else if (ext === '.jpg' || ext === '.png' || ext === '.jpeg') {
        fs.renameSync(oldPath, path.join(assetsDir, `chardham_${imgCount}${ext}`));
        imgCount++;
    }
});

console.log("Files moved and renamed successfully.");
