// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    });
});

// Modal Logic
const modal = document.getElementById('inquiryModal');

function openModal() {
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Helicopter Animation Logic
const helicopter = document.getElementById('helicopter');
const routePath = document.querySelector('.route-path');
const routeActive = document.getElementById('routeActive');

if (helicopter && routePath && window.innerWidth > 768) {
    // Shrines are roughly at 10%, 36.6%, 63.3%, 90% of the viewBox width
    // The path is defined from x=100 to x=900
    // Total path length is roughly 850px.
    // Stops will be based on progression [0, 0.33, 0.66, 1] approximately along the path.
    
    let progress = 0;
    let currentStop = 0;
    const stops = [0, 0.33, 0.67, 1]; 
    const pauseDuration = 2000; // ms
    const moveDuration = 3000; // ms between stops
    
    let lastTime = 0;
    let isPaused = false;
    let pauseStartTime = 0;
    let direction = 1; // 1 for forward, -1 for backward

    function animateHelicopter(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = timestamp - lastTime;
        lastTime = timestamp;

        if (isPaused) {
            if (timestamp - pauseStartTime > pauseDuration) {
                isPaused = false;
                
                // If we are at the last stop, instantly snap back to start
                if (currentStop >= stops.length - 1) {
                    progress = stops[0];
                    currentStop = 0;
                }
            }
        } else {
            // Move progress (strictly forward)
            const progressDelta = (dt / moveDuration) * (stops[1] - stops[0]);
            progress += progressDelta;

            // Check if we hit the next stop
            if (progress >= stops[currentStop + 1]) {
                progress = stops[currentStop + 1];
                currentStop++;
                isPaused = true;
                pauseStartTime = timestamp;
            }

            // Keep bounds
            progress = Math.max(0, Math.min(1, progress));

            // Update position along path
            try {
                const pathLength = routePath.getTotalLength();
                const point = routePath.getPointAtLength(progress * pathLength);
                
                // The viewBox is 1000px wide, so x=100 is 10%
                helicopter.style.left = `${(point.x / 1000) * 100}%`;
                
                // Adjusting the top position relative to SVG height (300px viewBox)
                helicopter.style.top = `${(point.y / 300) * 100}%`;
                helicopter.style.transform = `translate(-50%, -50%) rotate(15deg)`;
                
                // Update active trail (always forward)
                routeActive.style.strokeDasharray = `${progress * pathLength}, 2000`;
                
            } catch(e) {
                // SVG getPointAtLength might not be ready immediately
            }
        }

        requestAnimationFrame(animateHelicopter);
    }

    // Start animation when path is ready
    setTimeout(() => {
        requestAnimationFrame(animateHelicopter);
    }, 500);
}

// Search Bar Logic
document.addEventListener('DOMContentLoaded', () => {
    
    // Testimonial Carousel Logic
    const revCarousel = document.getElementById('reviewCarousel');
    const revPrevBtn = document.getElementById('revPrevBtn');
    const revNextBtn = document.getElementById('revNextBtn');
    
    if (revCarousel && revPrevBtn && revNextBtn) {
        revPrevBtn.addEventListener('click', () => {
            revCarousel.scrollBy({ left: -300, behavior: 'smooth' });
        });
        
        revNextBtn.addEventListener('click', () => {
            revCarousel.scrollBy({ left: 300, behavior: 'smooth' });
        });
        
        // Video Hover to Play logic
        const videoCards = document.querySelectorAll('.review-card.video-card');
        videoCards.forEach(card => {
            const video = card.querySelector('video');
            if (video) {
                card.addEventListener('mouseenter', () => {
                    video.play().catch(e => console.log('Auto-play prevented by browser', e));
                });
                card.addEventListener('mouseleave', () => {
                    video.pause();
                });
            }
        });
    }
});
