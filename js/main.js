// JavaScript para funcionalidades básicas de la página

document.addEventListener('DOMContentLoaded', function() {
    // Suavizar el desplazamiento a las secciones
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Desplazamiento suave
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Actualizar estado activo en navegación
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Efecto de aparición de elementos al hacer scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observar las secciones principales
    const sections = document.querySelectorAll('.section-card');
    sections.forEach(section => {
        section.classList.add('fade-on-scroll');
        observer.observe(section);
    });
    
    // Añadir clase activa a la sección actual durante el desplazamiento
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
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
    
    // Inicializar con la primera sección activa
    if (window.location.hash) {
        const activeLink = document.querySelector(`nav a[href="${window.location.hash}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    } else {
        navLinks[0].classList.add('active');
    }
});

// Script para procesar todos los emails ofuscados
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.obfuscated-email').forEach(function(element) {
        const user = element.getAttribute('data-user');
        const domain = element.getAttribute('data-domain');
        const tld = element.getAttribute('data-tld');
        const email = `${user}@${domain}.${tld}`;
        
        element.innerHTML = `
            <a href="mailto:${email}" class="email-link">
                ${email}
            </a>
        `;
    });
});