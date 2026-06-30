const fs = require('fs');
const html = fs.readFileSync('views/index.ejs', 'utf8');
const lines = html.split('\n');
lines.forEach((line, i) => {
    if (line.includes('id="about"')) console.log(`Line ${i + 1}: ${line}`);
});
