const fs = require('fs');
const path = 'views/testimonials.ejs';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/controls style=/g, 'controls preload="none" style=');
fs.writeFileSync(path, content);
console.log('Updated testimonials.ejs');
