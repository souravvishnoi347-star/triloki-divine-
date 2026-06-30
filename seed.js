const db = require('./db');

const initialPackages = [
    {
        title: 'Do Dham by Helicopter',
        cover_image: 'pkg_dodham.png',
        transport_badge: 'Helicopter',
        duration: '3 Nights / 4 Days',
        route: 'Dehradun to Dehradun',
        price: '1,35,000',
        inclusions: '4-Star Hotels|VIP Darshan|Meals Included|Premium Facilities',
        itinerary_details: 'Day 1: Arrival in Dehradun\\nDay 2: Fly to Kedarnath\\nDay 3: Fly to Badrinath\\nDay 4: Return to Dehradun',
        category: 'Premium Heli'
    },
    {
        title: 'Do Dham Same Day (Express)',
        cover_image: 'pkg_express.png',
        transport_badge: 'Helicopter',
        duration: 'Same Day Return',
        route: 'Dehradun to Dehradun',
        price: '1,25,000',
        inclusions: 'Priority Helipad Access|VIP Darshan|Meals Included|Premium Facilities',
        itinerary_details: 'Morning departure to Kedarnath, VIP Darshan, then flight to Badrinath. Return to Dehradun by evening.',
        category: 'Premium Heli'
    },
    {
        title: 'Complete Char Dham Yatra',
        cover_image: 'pkg_chardham.png',
        transport_badge: 'Helicopter',
        duration: '5 Nights / 6 Days',
        route: 'Dehradun to Dehradun',
        price: '2,35,000',
        inclusions: '4-Star Hotels|VIP Darshan|VIP Transfers|Premium Facilities',
        itinerary_details: 'Day 1: Dehradun to Yamunotri\\nDay 2: Gangotri\\nDay 3: Kedarnath\\nDay 4: Badrinath\\nDay 5: Local sightseeing\\nDay 6: Return',
        category: 'Premium Heli'
    },
    {
        title: 'Char Dham Yatra (Deluxe)',
        cover_image: 'badrinath.png',
        transport_badge: 'Road',
        duration: '9 Nights / 10 Days',
        route: 'Haridwar to Haridwar',
        price: '35,500',
        inclusions: 'Comfortable Stays|1-Time Meal per day|Dedicated Road Transport',
        itinerary_details: 'Classic 10 day journey visiting all four shrines by road starting from Haridwar.',
        category: 'Mixed'
    },
    {
        title: 'Char Dham Luxury',
        cover_image: 'kedarnath.png',
        transport_badge: 'Road+Heli',
        duration: '8 Nights / 9 Days',
        route: 'Haridwar to Haridwar',
        price: '75,000',
        inclusions: 'Premium Stays & All Meals|All Dhams by Road|Kedarnath Heli Round-Trip',
        itinerary_details: 'Luxury road trip with a convenient helicopter ride for the Kedarnath trek.',
        category: 'Mixed'
    },
    {
        title: 'Amarnath Yatra',
        cover_image: 'hero.png',
        transport_badge: 'Helicopter',
        duration: '2 Nights / 3 Days',
        route: 'Jammu to Jammu',
        price: '35,500',
        inclusions: 'Helicopter Tickets (Baltal/Pahalgam)|Quality Stays Included|VIP Darshan Assistance',
        itinerary_details: 'Short and sweet VIP journey to the holy Amarnath cave via helicopter.',
        category: 'Mixed'
    }
];

db.serialize(() => {
    db.get("SELECT COUNT(*) AS count FROM TourPackages", (err, row) => {
        if (row && row.count === 0) {
            const stmt = db.prepare(`INSERT INTO TourPackages (title, cover_image, transport_badge, duration, route, price, inclusions, itinerary_details, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
            
            initialPackages.forEach(pkg => {
                stmt.run([pkg.title, pkg.cover_image, pkg.transport_badge, pkg.duration, pkg.route, pkg.price, pkg.inclusions, pkg.itinerary_details, pkg.category]);
            });
            stmt.finalize();
            console.log('Database seeded with initial packages.');
        } else {
            console.log('Database already has packages. Skipping seed.');
        }
    });
});
