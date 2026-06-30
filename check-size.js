const sizeOf = require('image-size');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets', 'new');
fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
        const dimensions = sizeOf(path.join(dir, file));
        console.log(`${file}: ${dimensions.width}x${dimensions.height}, ratio: ${(dimensions.width/dimensions.height).toFixed(2)}`);
    }
});
