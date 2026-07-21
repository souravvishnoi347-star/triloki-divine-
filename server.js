const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

// Setup Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '')));

app.use(session({
    secret: 'triloki_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Auth Middleware
function isAuthenticated(req, res, next) {
    if (req.session.adminId) {
        return next();
    }
    res.redirect('/admin/login');
}

// -----------------------------------------
// PUBLIC ROUTES
// -----------------------------------------

app.get('/', (req, res) => {
    db.get('SELECT * FROM Settings WHERE id = 1', (err, settings) => {
        db.all('SELECT * FROM TourPackages', (err, packages) => {
            const fs = require('fs');
            let reviews = { videos: [], images: [] };
            try {
                const files = fs.readdirSync(path.join(__dirname, 'assets'));
                reviews.videos = files.filter(f => f.startsWith('review_vid_')).sort();
                reviews.images = files.filter(f => f.startsWith('review_img_')).sort();
            } catch(e) {
                console.error('Error reading assets for reviews', e);
            }
            res.render('index', { settings, packages, reviews });
        });
    });
});



app.post('/api/inquiry', (req, res) => {
    const { name, phone, email, package: pkgInterest } = req.body;
    db.run('INSERT INTO Inquiries (name, phone, email, package_interest) VALUES (?, ?, ?, ?)',
        [name, phone, email, pkgInterest],
        async function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            // Send email notification using Formsubmit API with ALREADY ACTIVATED domain
            try {
                await fetch("https://formsubmit.co/ajax/hospitality.triloki@gmail.com", {
                    method: "POST",
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Origin': 'https://trilokidivinejourney.com',
                        'Referer': 'https://trilokidivinejourney.com/'
                    },
                    body: JSON.stringify({
                        _subject: "New Website Inquiry: " + name,
                        Name: name,
                        Phone: phone,
                        Email: email || 'Not Provided',
                        Package: pkgInterest || 'Not Selected'
                    })
                });
            } catch (e) {
                console.error("Email notification failed", e);
            }

            res.json({ success: true, message: 'Inquiry saved successfully!' });
        }
    );
});

app.get('/charter-services', (req, res) => {
    db.get('SELECT * FROM Settings WHERE id = 1', (err, settings) => {
        res.render('charter', { settings });
    });
});

app.get('/chardham', (req, res) => {
    db.get('SELECT * FROM Settings WHERE id = 1', (err, settings) => {
        db.all('SELECT * FROM TourPackages', (err, packages) => {
            res.render('chardham', { settings, packages });
        });
    });
});

app.get('/testimonials', (req, res) => {
    db.get('SELECT * FROM Settings WHERE id = 1', (err, settings) => {
        const fs = require('fs');
        let reviews = { videos: [], images: [] };
        try {
            const files = fs.readdirSync(path.join(__dirname, 'assets'));
            reviews.videos = files.filter(f => f.startsWith('review_vid_')).sort();
            reviews.images = files.filter(f => f.startsWith('review_img_')).sort();
        } catch(e) {
            console.error('Error reading assets for reviews', e);
        }
        db.all('SELECT * FROM TourPackages', (err, packages) => {
                res.render('testimonials', { settings, reviews, packages });
            });
    });
});

app.get('/about', (req, res) => {
    db.get('SELECT * FROM Settings WHERE id = 1', (err, settings) => {
        db.all('SELECT * FROM TourPackages', (err, packages) => {
            res.render('about', { settings, packages });
        });
    });
});

app.get('/package/:id', (req, res) => {
    const pkgId = req.params.id;
    db.get('SELECT * FROM Settings WHERE id = 1', (err, settings) => {
        db.get('SELECT * FROM TourPackages WHERE id = ?', [pkgId], (err, pkg) => {
            if (!pkg) return res.status(404).send('Package not found');
            db.all('SELECT * FROM TourPackages', (err, packages) => {
                res.render('package-detail', { settings, pkg, packages });
            });
        });
    });
});

app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nSitemap: https://trilokigroup.in/sitemap.xml`);
});

app.get('/sitemap.xml', (req, res) => {
    db.all('SELECT id FROM TourPackages', (err, packages) => {
        let urls = `<url><loc>https://trilokigroup.in/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`;
        if (packages) {
            packages.forEach(pkg => {
                urls += `<url><loc>https://trilokigroup.in/package/${pkg.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`;
            });
        }
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
    });
});

// -----------------------------------------
// ADMIN AUTH ROUTES
// -----------------------------------------

app.get('/admin/login', (req, res) => {
    if (req.session.adminId) return res.redirect('/admin');
    res.render('admin-login', { error: null });
});

app.post('/admin/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM Admins WHERE email = ?', [email], (err, admin) => {
        if (!admin) return res.render('admin-login', { error: 'Invalid email or password' });
        
        if (bcrypt.compareSync(password, admin.password_hash)) {
            req.session.adminId = admin.id;
            res.redirect('/admin');
        } else {
            res.render('admin-login', { error: 'Invalid email or password' });
        }
    });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// -----------------------------------------
// ADMIN DASHBOARD ROUTES
// -----------------------------------------

app.get('/admin', isAuthenticated, (req, res) => {
    db.all('SELECT * FROM TourPackages', (err, packages) => {
        db.all('SELECT * FROM Inquiries ORDER BY created_at DESC', (err, inquiries) => {
            res.render('admin-dashboard', { packages, inquiries: inquiries || [] });
        });
    });
});

// ADD PACKAGE
app.get('/admin/package/new', isAuthenticated, (req, res) => {
    res.render('admin-form', { pkg: null });
});

app.post('/admin/package/new', isAuthenticated, upload.single('cover_image'), (req, res) => {
    const { title, transport_badge, duration, route, price, inclusions, itinerary_details, category, exclusions, important_notes } = req.body;
    const cover_image = req.file ? req.file.filename : 'hero.png';

    db.run(`INSERT INTO TourPackages (title, cover_image, transport_badge, duration, route, price, inclusions, itinerary_details, category, exclusions, important_notes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, cover_image, transport_badge, duration, route, price, inclusions, itinerary_details, category, exclusions, important_notes],
        function(err) {
            res.redirect('/admin');
        });
});

// EDIT PACKAGE
app.get('/admin/package/edit/:id', isAuthenticated, (req, res) => {
    db.get('SELECT * FROM TourPackages WHERE id = ?', [req.params.id], (err, pkg) => {
        if (!pkg) return res.redirect('/admin');
        res.render('admin-form', { pkg });
    });
});

app.post('/admin/package/edit/:id', isAuthenticated, upload.single('cover_image'), (req, res) => {
    const { title, transport_badge, duration, route, price, inclusions, itinerary_details, category, exclusions, important_notes } = req.body;
    let query, params;

    if (req.file) {
        query = `UPDATE TourPackages SET title=?, cover_image=?, transport_badge=?, duration=?, route=?, price=?, inclusions=?, itinerary_details=?, category=?, exclusions=?, important_notes=? WHERE id=?`;
        params = [title, req.file.filename, transport_badge, duration, route, price, inclusions, itinerary_details, category, exclusions, important_notes, req.params.id];
    } else {
        query = `UPDATE TourPackages SET title=?, transport_badge=?, duration=?, route=?, price=?, inclusions=?, itinerary_details=?, category=?, exclusions=?, important_notes=? WHERE id=?`;
        params = [title, transport_badge, duration, route, price, inclusions, itinerary_details, category, exclusions, important_notes, req.params.id];
    }

    db.run(query, params, function(err) {
        res.redirect('/admin');
    });
});

// DELETE PACKAGE
app.get('/admin/package/delete/:id', isAuthenticated, (req, res) => {
    db.run('DELETE FROM TourPackages WHERE id = ?', [req.params.id], function(err) {
        res.redirect('/admin');
    });
});

// SETTINGS
app.get('/admin/settings', isAuthenticated, (req, res) => {
    db.get('SELECT * FROM Settings WHERE id = 1', (err, settings) => {
        res.render('admin-settings', { settings });
    });
});

app.post('/admin/settings', isAuthenticated, (req, res) => {
    const { hero_heading, phone, email, location } = req.body;
    db.run('UPDATE Settings SET hero_heading=?, phone=?, email=?, location=? WHERE id=1',
        [hero_heading, phone, email, location],
        function(err) {
            res.redirect('/admin/settings');
        });
});

// Start Server (local dev only)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`CMS Server is running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;

