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

// Script para procesar todos los emails ofuscados - FIXED FOR FIREFOX
document.addEventListener('DOMContentLoaded', function() {
    // Construir email desde los atributos data
    const user = 'fjvico';
    const domain = 'uma';
    const tld = 'es';
    const email = `${user}@${domain}.${tld}`;
    
    // Buscar el elemento email-display y actualizarlo
    const emailDisplay = document.getElementById('email-display');
    if (emailDisplay) {
        emailDisplay.textContent = email;
    }
    
    // También buscar cualquier elemento con clase obfuscated-email como respaldo
    document.querySelectorAll('.obfuscated-email').forEach(function(element) {
        const user = element.getAttribute('data-user') || 'fjvico';
        const domain = element.getAttribute('data-domain') || 'uma';
        const tld = element.getAttribute('data-tld') || 'es';
        const email = `${user}@${domain}.${tld}`;
        
        // Crear un span con el email
        element.innerHTML = `<span class="email-display">${email}</span>`;
    });
});

// En main.js
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar/ocultar clave PGP
    const pgpButton = document.getElementById('show-pgp-key');
    if (pgpButton) {
        pgpButton.addEventListener('click', function() {
            const pgpKey = document.getElementById('pgp-key-full');
            if (pgpKey.classList.contains('hidden')) {
                pgpKey.classList.remove('hidden');
                this.textContent = 'Ocultar clave';
            } else {
                pgpKey.classList.add('hidden');
                this.textContent = 'Mostrar clave completa';
            }
        });
    }
});