const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
['index.ejs', 'about.ejs', 'package-detail.ejs'].forEach(file => {
    const filePath = path.join(viewsDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace href="#about" with href="/about"
        content = content.replace(/href="#about"/g, 'href="/about"');
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + file);
    }
});
