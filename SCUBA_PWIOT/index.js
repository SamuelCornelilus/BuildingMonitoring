// iPhone 16 Optimized JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const contentCards = document.querySelectorAll('.content-card');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Only enable cursor follower on desktop
    if (!isMobile && cursorFollower) {
        // Enable cursor follower for desktop only
        document.addEventListener('mousemove', function(e) {
            cursorFollower.style.opacity = '1';
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        });
    }
    
    // Add touch feedback to elements
    const touchElements = document.querySelectorAll('.nav-link, .gauge');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
            
            // Add haptic feedback if available
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(5); // Subtle vibration
            }
        });
        
        element.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
    
    // Animate content cards on scroll with improved performance
    let scrollTimeout;
    function animateOnScroll() {
        // Use requestAnimationFrame for better performance
        cancelAnimationFrame(scrollTimeout);
        
        scrollTimeout = requestAnimationFrame(() => {
            contentCards.forEach((card, index) => {
                const cardTop = card.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                // Add custom delay based on index
                card.style.setProperty('--delay', index);
                
                if (cardTop < windowHeight * 0.9) {
                    card.classList.add('fade-in');
                }
            });
        });
    }
    
    // Initial check for visible elements
    animateOnScroll();
    
    // Optimize scroll event with throttling
    let lastScrollTime = 0;
    window.addEventListener('scroll', function() {
        const now = Date.now();
        if (now - lastScrollTime > 100) { // Only check every 100ms
            lastScrollTime = now;
            animateOnScroll();
        }
    });
    
    // Simulate real-time data updates with reduced frequency for mobile
    function updateSensorData() {
        const tempGauge = document.querySelector('.gauge:nth-child(1) .gauge-value');
        const pressureGauge = document.querySelector('.gauge:nth-child(2) .gauge-value');
        const lastUpdate = document.querySelector('.status-value.timestamp');
        
        if (!tempGauge || !pressureGauge) return;
        
        // Random temperature between 25-32°C
        const newTemp = (25 + Math.random() * 7).toFixed(1);
        // Random pressure between 1.0-1.5 bar
        const newPressure = (1 + Math.random() * 0.5).toFixed(1);
        
        // Update with subtle animation
        tempGauge.style.transform = 'scale(1.1)';
        pressureGauge.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            tempGauge.textContent = `${newTemp}°C`;
            pressureGauge.textContent = `${newPressure} bar`;
            
            tempGauge.style.transform = 'scale(1)';
            pressureGauge.style.transform = 'scale(1)';
        }, 200);
        
        // Update timestamp with shorter format for mobile
        const now = new Date();
        const formattedDate = `${now.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()]}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        if (lastUpdate) {
            lastUpdate.textContent = formattedDate;
        }
    }
    
    // Update data less frequently on mobile to save battery
    const updateInterval = isMobile ? 10000 : 5000; // 10 seconds on mobile, 5 on desktop
    setInterval(updateSensorData, updateInterval);
    updateSensorData(); // Initial update
    
    // Smooth scrolling for iOS with improved performance
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (!targetSection) return;
            
            // Smoother scrolling that works better on iOS
            const headerOffset = 10;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Add Apple-specific touch functionality
    document.addEventListener('touchstart', function() {
        // This empty handler enables :active states on iOS
    }, false);
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        // Force redraw to prevent visual glitches
        document.body.style.display = 'none';
        setTimeout(() => {
            document.body.style.display = '';
        }, 0);
    });

    // Handle notch area for iPhone X and newer
    function updateSafeAreaInsets() {
        document.documentElement.style.setProperty(
            '--safe-area-inset-top', 
            `${Math.max(window.screen.height - window.innerHeight, 0)}px`
        );
    }
    
    // Update safe area on load and orientation change
    updateSafeAreaInsets();
    window.addEventListener('orientationchange', updateSafeAreaInsets);
});