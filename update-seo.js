const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
['about.ejs', 'package-detail.ejs'].forEach(file => {
    const filePath = path.join(viewsDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        let title = '';
        let desc = '';
        if (file === 'about.ejs') {
            title = 'About Triloki Divine Journey | Premium Char Dham Operators';
            desc = 'Learn about Triloki Divine Journey, the premium boutique operators for Kedarnath Helicopter and Char Dham Yatra in Uttarakhand. Led by devotion, managed with care.';
        } else {
            // For package-detail, it should ideally be dynamic, but we can update the base
            title = 'Premium Tour Package | Triloki Divine Journey';
            desc = 'Book your exclusive spiritual journey package with Triloki Divine Journey. Premium helicopters, VIP darshan, and luxury stays.';
        }

        // Replace the old SEO tags block
        const newTags = `    <!-- SEO Tags -->
    <title>${title}</title>
    <link rel="icon" type="image/png" href="/assets/logo.png">
    <meta name="description" content="${desc}">
    <meta name="keywords" content="Char Dham Yatra 2026, Kedarnath Helicopter Booking, Premium Helicopter Tours Uttarakhand, Do Dham Package, Badrinath VIP Darshan, Triloki Divine Journey">
    <meta name="author" content="Triloki Divine Journey">
    <link rel="canonical" href="https://trilokigroup.in/">
    
    <!-- Open Graph for Social Sharing -->
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="https://trilokigroup.in/assets/logo.png">
    <meta property="og:url" content="https://trilokigroup.in/">
    <meta property="og:type" content="website">`;

        // The old block to replace
        const oldStart = '<!-- SEO Tags -->';
        const oldEnd = '<meta property="og:type" content="website">';
        
        if (content.includes(oldStart) && content.includes(oldEnd)) {
            const startIdx = content.indexOf(oldStart);
            const endIdx = content.indexOf(oldEnd) + oldEnd.length;
            content = content.substring(0, startIdx) + newTags + content.substring(endIdx);
            
            // Also update Schema
            const schemaStart = '<script type="application/ld+json">';
            const schemaEnd = '</script>';
            if (content.includes(schemaStart)) {
                const sStart = content.indexOf(schemaStart);
                const sEnd = content.indexOf(schemaEnd, sStart) + schemaEnd.length;
                
                const newSchema = `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Triloki Divine Journey",
      "image": "https://trilokigroup.in/assets/logo.png",
      "@id": "https://trilokigroup.in",
      "url": "https://trilokigroup.in",
      "telephone": "<%= settings.phone %>",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dehradun, Uttarakhand",
        "addressRegion": "UK",
        "addressCountry": "IN"
      },
      "description": "${desc}",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "342"
      }
    }
    </script>`;
                content = content.substring(0, sStart) + newSchema + content.substring(sEnd);
            }
            
            fs.writeFileSync(filePath, content);
            console.log('Updated SEO in ' + file);
        }
    }
});

