// Smooth scrolling and active nav highlighting
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    
    // Smooth scroll to sections
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all section cards
    document.querySelectorAll('.section-card').forEach(section => {
        section.classList.add('fade-on-scroll');
        observer.observe(section);
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Set initial active nav
    if (window.location.hash) {
        const activeLink = document.querySelector(`nav a[href="${window.location.hash}"]`);
        if (activeLink) activeLink.classList.add('active');
    } else {
        navLinks[0]?.classList.add('active');
    }
});

// Email obfuscation - protects from bots
document.addEventListener('DOMContentLoaded', function() {
    const emailDisplay = document.getElementById('email-display');
    if (emailDisplay) {
        // Obfuscated email construction
        const user = 'fjvico';
        const domain = 'uma';
        const tld = 'es';
        const email = `${user}@${domain}.${tld}`;
        emailDisplay.textContent = email;
    }
});