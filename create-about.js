const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, 'views', 'index.ejs'), 'utf8');

// The header ends right before <!-- Modern Rounded Hero Section -->
const headerPart = indexHtml.split('<!-- Modern Rounded Hero Section -->')[0];
// The footer starts exactly at <footer>
const footerPart = '<footer' + indexHtml.split('<footer')[1];

const aboutContent = `
    <!-- About Hero -->
    <div class="package-hero" style="background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://placehold.co/1920x600/1a237e/FFFFFF?text=About+Triloki+Divine+Journey'); padding-top: 150px; text-align: center; color: white;">
        <div class="container">
            <h1 style="font-size: 3rem; margin-bottom: 20px;">Our Story</h1>
            <p style="font-size: 1.2rem; max-width: 800px; margin: 0 auto; line-height: 1.6;">A deeply personal commitment to crafting the most divine and seamless spiritual journeys across Uttarakhand.</p>
        </div>
    </div>

    <!-- About Section -->
    <section class="premium-packages-section" style="background: white; padding: 80px 0;">
        <div class="container" style="max-width: 1000px; margin: 0 auto;">
            <div class="section-header">
                <h2>Led by Devotion, Managed with Care</h2>
                <div class="divider"></div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-top: 40px;">
                <div>
                    <img src="https://placehold.co/600x600/e0e0e0/555555?text=Founders+Image" alt="Our Founders" style="width: 100%; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                </div>
                <div>
                    <h3 style="font-size: 1.8rem; color: var(--text-main); margin-bottom: 20px;">A Boutique Pilgrimage Experience</h3>
                    <p style="color: var(--text-muted); line-height: 1.8; margin-bottom: 15px; font-size: 1.05rem;">At Triloki Divine Journey, we believe that a pilgrimage is an intimate spiritual calling, not just a travel itinerary. That is why our agency is distinctly different—it is entirely led and managed by our founders.</p>
                    <p style="color: var(--text-muted); line-height: 1.8; font-size: 1.05rem;">We do not rely on a massive corporate chain of command. From your very first inquiry to the moment you return home with the blessings of the Almighty, you are interacting directly with the visionaries of our agency. We personally oversee every helicopter booking, every VIP darshan, and every road transport to ensure your journey is flawless.</p>
                </div>
            </div>

            <div style="text-align: center; margin-top: 80px;">
                <h3 style="font-size: 1.8rem; color: var(--text-main); margin-bottom: 30px;">Our Philosophy</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                    <div style="padding: 40px; background: var(--bg-light); border-radius: 20px; border: 1px solid var(--border);">
                        <i class="fa-solid fa-hand-holding-heart" style="font-size: 3rem; color: var(--primary); margin-bottom: 20px;"></i>
                        <h4 style="font-size: 1.3rem; margin-bottom: 15px;">Personalized Attention</h4>
                        <p style="color: var(--text-muted); line-height: 1.6;">Because we manage everything directly, we guarantee a level of personal care and rapid response that large agencies simply cannot match.</p>
                    </div>
                    <div style="padding: 40px; background: var(--bg-light); border-radius: 20px; border: 1px solid var(--border);">
                        <i class="fa-solid fa-crown" style="font-size: 3rem; color: var(--gold); margin-bottom: 20px;"></i>
                        <h4 style="font-size: 1.3rem; margin-bottom: 15px;">Premium Standards</h4>
                        <p style="color: var(--text-muted); line-height: 1.6;">We have personally vetted every helicopter service, hotel, and guide to ensure your spiritual journey meets our strict luxury standards.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
`;

const finalHtml = headerPart + aboutContent + footerPart;
fs.writeFileSync(path.join(__dirname, 'views', 'about.ejs'), finalHtml);
console.log('about.ejs created successfully.');
