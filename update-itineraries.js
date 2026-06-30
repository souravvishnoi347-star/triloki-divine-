const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

const itineraries = [
    {
        title: 'Do Dham by Helicopter',
        itinerary: `Day 1: Arrival in Dehradun & Briefing\nWelcome to Dehradun. Our representative will receive you at the airport/railway station and transfer you to a premium hotel. Evening briefing about the yatra.\nDay 2: Fly to Kedarnath\nEarly morning departure from Sahastradhara Helipad to Guptkashi/Phata, then shuttle to Kedarnath. Enjoy VIP Darshan at the sacred Kedarnath temple. Overnight stay in Kedarnath/Guptkashi.\nDay 3: Fly to Badrinath\nMorning flight to Badrinath. VIP Darshan at Badrinath temple followed by a visit to Mana Village, the last village on the Indian border. Overnight stay in Badrinath.\nDay 4: Return to Dehradun\nMorning departure from Badrinath to Dehradun. The spiritual journey concludes with beautiful memories.`
    },
    {
        title: 'Do Dham Same Day (Express)',
        itinerary: `Day 1: Kedarnath & Badrinath Darshan\n06:00 AM: Departure from Sahastradhara Helipad, Dehradun.\n07:00 AM: Arrival at Sersi/Phata, board shuttle to Kedarnath.\n08:00 AM: VIP Darshan at Shri Kedarnath Ji.\n11:00 AM: Fly to Badrinath Helipad.\n12:00 PM: VIP Darshan at Shri Badrinath Ji.\n02:30 PM: Departure for Dehradun.\n04:00 PM: Arrival in Dehradun. Tour concludes.`
    },
    {
        title: 'Complete Char Dham Yatra',
        itinerary: `Day 1: Dehradun to Yamunotri\nFly from Dehradun to Kharsali helipad. Trek/palki to Yamunotri temple for Darshan. Overnight stay in Kharsali.\nDay 2: Kharsali to Gangotri\nFly to Harsil helipad. Drive to Gangotri temple for VIP Darshan. Enjoy the scenic beauty of Harsil valley. Overnight stay in Harsil.\nDay 3: Harsil to Kedarnath\nFly from Harsil to Phata/Sersi, then shuttle to Kedarnath. VIP Darshan of Lord Shiva. Overnight stay in Kedarnath or Guptkashi.\nDay 4: Kedarnath to Badrinath\nMorning flight to Badrinath. VIP Darshan at the temple. Evening visit to Mana village. Overnight stay in Badrinath.\nDay 5: Local Sightseeing & Rest\nExplore Badrinath surroundings, participate in morning Aarti. Relax and acclimatize.\nDay 6: Return to Dehradun\nFly back to Sahastradhara Helipad in Dehradun. Yatra concludes with divine blessings.`
    },
    {
        title: 'Char Dham Yatra (Deluxe)',
        itinerary: `Day 1: Haridwar to Barkot\nDrive from Haridwar to Barkot via Mussoorie. En-route visit Kempty Fall. Overnight stay in Barkot.\nDay 2: Barkot - Yamunotri - Barkot\nDrive to Janki Chatti, trek to Yamunotri. Darshan and return to Barkot for overnight stay.\nDay 3: Barkot to Uttarkashi\nDrive to Uttarkashi. Visit Kashi Vishwanath Temple. Overnight stay in Uttarkashi.\nDay 4: Uttarkashi - Gangotri - Uttarkashi\nEarly morning drive to Gangotri. Darshan and pooja, then return to Uttarkashi.\nDay 5: Uttarkashi to Guptkashi\nLong scenic drive to Guptkashi. En-route view of river Mandakini. Overnight stay.\nDay 6: Guptkashi to Kedarnath\nTrek to Kedarnath from Gaurikund. Evening Darshan of Kedarnath Ji. Overnight stay.\nDay 7: Kedarnath to Guptkashi\nMorning Darshan, trek down to Gaurikund, drive back to Guptkashi.\nDay 8: Guptkashi to Badrinath\nDrive to Badrinath via Joshimath. Evening Darshan at Badrinath temple.\nDay 9: Badrinath to Rudraprayag\nMorning Aarti, visit Mana village, then drive to Rudraprayag for overnight stay.\nDay 10: Rudraprayag to Haridwar\nDrive back to Haridwar via Rishikesh. Tour concludes.`
    },
    {
        title: 'Char Dham Luxury',
        itinerary: `Day 1: Arrival in Haridwar & Transfer to Barkot\nLuxury AC transport to Barkot. Welcome drink and premium dinner at the hotel.\nDay 2: Yamunotri Darshan\nHelicopter or Palki arranged for Yamunotri Darshan. Return to luxury resort.\nDay 3: Barkot to Uttarkashi\nComfortable drive to Uttarkashi. Premium stay and local sightseeing.\nDay 4: Gangotri Darshan\nVIP Darshan at Gangotri temple. Return to Uttarkashi.\nDay 5: Uttarkashi to Guptkashi\nScenic drive to Guptkashi. Check-in to a luxury camp/resort.\nDay 6: Kedarnath by Helicopter\nFly from Phata/Guptkashi to Kedarnath. VIP Darshan. Return same day to Guptkashi.\nDay 7: Guptkashi to Badrinath\nDrive to Badrinath. Premium hotel check-in. Evening Darshan.\nDay 8: Badrinath Sightseeing\nVisit Mana village, Vyas Gufa. Drive down to Srinagar/Rudraprayag.\nDay 9: Return to Haridwar\nDrop off at Haridwar railway station/hotel. Yatra concludes.`
    },
    {
        title: 'Amarnath Yatra',
        itinerary: `Day 1: Arrival in Srinagar/Jammu\nReceive upon arrival, transfer to hotel/houseboat. Briefing on the Yatra.\nDay 2: Helicopter to Panchtarni & Darshan\nDrive to Baltal/Pahalgam helipad. Fly to Panchtarni. 6km trek/palki to Amarnath Cave. VIP Darshan of the holy Ice Lingam. Return to base camp and drive back to hotel.\nDay 3: Departure\nMorning sightseeing (if time permits). Transfer to airport/railway station.`
    }
];

db.serialize(() => {
    let completed = 0;
    itineraries.forEach(pkg => {
        db.run("UPDATE TourPackages SET itinerary_details = ? WHERE title = ?", [pkg.itinerary, pkg.title], (err) => {
            if (err) console.error("Error updating " + pkg.title, err);
            else console.log("Updated itinerary for " + pkg.title);
            
            completed++;
            if (completed === itineraries.length) {
                db.close();
                console.log("All done.");
            }
        });
    });
});
