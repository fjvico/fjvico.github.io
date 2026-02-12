// Language loader with dropdown support
const LanguageLoader = {
    currentLang: 'es',
    
    init() {
        // Set up dropdown items
        document.querySelectorAll('.dropdown-content a').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = item.getAttribute('data-lang');
                this.switchLanguage(lang);
                
                // Close dropdown
                document.querySelector('.dropdown-content')?.classList.remove('show');
            });
        });
        
        // Toggle dropdown on button click
        const dropdownBtn = document.getElementById('langDropdownBtn');
        if (dropdownBtn) {
            dropdownBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.querySelector('.dropdown-content')?.classList.toggle('show');
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.querySelector('.dropdown-content');
            const button = document.getElementById('langDropdownBtn');
            
            if (button && dropdown && !button.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
        
        // Load default language
        this.loadLanguage(this.currentLang);
        
        // Set initial button text
        const currentLangEl = document.getElementById('current-lang');
        if (currentLangEl) {
            currentLangEl.textContent = this.currentLang.toUpperCase();
        }
    },
    
    async switchLanguage(lang) {
        this.currentLang = lang;
        
        // Update button text
        const currentLangEl = document.getElementById('current-lang');
        if (currentLangEl) {
            currentLangEl.textContent = lang.toUpperCase();
        }
        
        // Load language content
        await this.loadLanguage(lang);
        
        // Update URL hash
        history.pushState({lang: lang}, '', `#${lang}`);
    },
    
    async loadLanguage(lang) {
        try {
            // IMPORTANT: Remove cache-busting for GitHub Pages
            const url = `lang/${lang}.txt`;
            console.log('Loading language file:', url); // For debugging
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            console.log('Language file loaded, length:', content.length); // For debugging
            
            // Parse the entire file and update DOM
            this.parseContent(content);
            
        } catch (error) {
            console.error('Error loading language:', error);
            // Fallback to embedded content if available
            this.loadFallbackContent(lang);
        }
    },
    
    // Fallback content in case files don't load
    loadFallbackContent(lang) {
        console.log('Loading fallback content for:', lang);
        
        if (lang === 'es') {
            // Spanish fallback
            document.getElementById('header-title').textContent = 'Francisco J. Vico';
            document.getElementById('header-subtitle').textContent = '«intento cosas»';
            
            document.getElementById('nav-bio').innerHTML = '<i class="fas fa-user"></i> Biografía';
            document.getElementById('nav-academic').innerHTML = '<i class="fas fa-graduation-cap"></i> Académico';
            document.getElementById('nav-writer').innerHTML = '<i class="fas fa-book"></i> Escritor';
            
            document.getElementById('bio-title').textContent = 'Biografía';
            document.getElementById('bio-content').innerHTML = '<p>Soy profesor y científico, Catedrático de Universidad en el área de Ciencias de la Computación e Inteligencia Artificial. Mi trabajo se ha centrado en el modelado biológico, con resultados en IA bioinspirada y Creatividad Artificial.</p><p>Entre mis proyectos destaca por impacto <a href="https://en.wikipedia.org/wiki/Melomics" target="_blank">Melomics</a>, que en 2012 diseñó un ordenador compositor, cuyas obras fueron interpretadas por la Orquesta Sinfónica de Londres.</p><p>En una línea más hacktivista, he contribuido a tomar conciencia sobre la necesidad de alfabetizar digitalmente en edades tempranas con el proyecto Toolbox (ahora <a href="https://codeok.academy/es/" target="_blank">CodeOK</a>).</p><p>Entretanto, dedico parte de mi tiempo a divulgar sobre las oportunidades y los riesgos de la IA, con las <a href="https://fjvico.github.io/cartasdealias/" target="_blank">Cartas de Alias</a>.</p>';
            
            document.getElementById('academic-title').textContent = 'Académico';
            document.getElementById('academic-content').innerHTML = '<p class="paragraph-spaced">Como <b>docente</b>, desde mi incorporación al departamento de Lenguajes y Ciencias de la Computación en 1996, he impartido <i>Teoría de autómatas y lenguajes formales</i>. Dividida en Teoría de lenguajes formales y Teoría de la Calculabilidad, recorre los principales conceptos de la Infomática Teórica, desde la gramática generativa propuesta por Noam Chomsky, hasta modelos matemáticos para representar funciones. Estos formalismos se utilizan para extraer conclusiones sobre la estructura y propiedades de los lenguajes formales, así como del conjunto de las funciones calculables. Es una asignatura clave para entender los fundamentos de los lenguajes de programación, en aspectos sintácticos y semánticos, así como las limitaciones de los ordenadores.</p><p class="paragraph-spaced">Como <b>investigador</b>, desde que inicié la tesis doctoral en 1992, he desarrollado líneas científicas en Inteligecia Artificial y Creatividad Artificial. Siempre desde un enfoque bioinspirado, incorporando conocimiento de sistemas biológicos (cerebro, evolución, desarrollo embriológico o comportamiento colectivo). Los resultados en <i>investigación básica</i> se han recogido en nueve tesis doctorales. En <i>investigación aplicada</i> también he realizado transferencia de resultados al sector empresarial, en más de 40 proyectos como investigador principal, con financiación pública y privada.</p>';
            
            document.getElementById('orcid-desc').textContent = 'Publicaciones y patentes';
            document.getElementById('orcid-btn').textContent = 'Acceder a ORCID';
            document.getElementById('scholar-desc').textContent = 'Métricas de impacto';
            document.getElementById('scholar-btn').textContent = 'Ver métricas';
            
            document.getElementById('writer-title').textContent = 'Escritor';
            document.getElementById('book-title').textContent = 'Cartas de Alias';
            document.getElementById('book-description').textContent = 'Alias, una IA con cargo de conciencia, escribe cartas a la humanidad.';
            document.getElementById('year-label').textContent = 'Año de publicación:';
            document.getElementById('book-btn').textContent = 'Visitar página del libro';
            
            document.getElementById('footer-name').textContent = 'Francisco Vico';
            document.getElementById('footer-dept').textContent = 'Dpto. Lenguajes y Ciencias de la Computación';
            document.getElementById('footer-uni').textContent = 'Universidad de Málaga';
        }
        // Add more fallbacks for other languages if needed
    },
    
    parseContent(content) {
        if (!content || content.length === 0) {
            console.error('Empty content received');
            return;
        }
        
        // Get all sections by regex - more robust parsing
        const headerMatch = content.match(/=== HEADER\n([\s\S]*?)(?=\n=== |$)/);
        const navMatch = content.match(/=== NAV\n([\s\S]*?)(?=\n=== |$)/);
        const bioMatch = content.match(/=== BIOGRAPHY\n([\s\S]*?)(?=\n=== |$)/);
        const academicMatch = content.match(/=== ACADEMIC\n([\s\S]*?)(?=\n=== |$)/);
        const writerMatch = content.match(/=== WRITER\n([\s\S]*?)(?=\n=== |$)/);
        const footerMatch = content.match(/=== FOOTER\n([\s\S]*?)(?=\n=== |$)/);
        
        if (headerMatch) this.updateHeader(headerMatch[1]);
        if (navMatch) this.updateNav(navMatch[1]);
        if (bioMatch) this.updateBio(bioMatch[1]);
        if (academicMatch) this.updateAcademic(academicMatch[1]);
        if (writerMatch) this.updateWriter(writerMatch[1]);
        if (footerMatch) this.updateFooter(footerMatch[1]);
    },
    
    updateHeader(content) {
        const lines = content.trim().split('\n');
        if (lines.length >= 2) {
            const headerTitle = document.getElementById('header-title');
            const headerSubtitle = document.getElementById('header-subtitle');
            if (headerTitle) headerTitle.textContent = lines[0].trim();
            if (headerSubtitle) headerSubtitle.textContent = lines[1].trim();
        }
    },
    
    updateNav(content) {
        const lines = content.trim().split('\n');
        if (lines.length >= 3) {
            const navBio = document.getElementById('nav-bio');
            const navAcademic = document.getElementById('nav-academic');
            const navWriter = document.getElementById('nav-writer');
            
            if (navBio) navBio.innerHTML = `<i class="fas fa-user"></i> ${lines[0].trim()}`;
            if (navAcademic) navAcademic.innerHTML = `<i class="fas fa-graduation-cap"></i> ${lines[1].trim()}`;
            if (navWriter) navWriter.innerHTML = `<i class="fas fa-book"></i> ${lines[2].trim()}`;
        }
    },
    
    updateBio(content) {
        // Extract title
        const titleMatch = content.match(/TITLE:(.*)/);
        if (titleMatch) {
            const bioTitle = document.getElementById('bio-title');
            if (bioTitle) bioTitle.textContent = titleMatch[1].trim();
        }
        
        // Extract content (everything after CONTENT:)
        const contentMatch = content.match(/CONTENT:([\s\S]*)/);
        if (contentMatch) {
            const bioContent = document.getElementById('bio-content');
            if (bioContent) bioContent.innerHTML = contentMatch[1].trim();
        }
    },
    
    updateAcademic(content) {
        // Extract title
        const titleMatch = content.match(/TITLE:(.*)/);
        if (titleMatch) {
            const academicTitle = document.getElementById('academic-title');
            if (academicTitle) academicTitle.textContent = titleMatch[1].trim();
        }
        
        // Extract paragraphs
        const p1Match = content.match(/PARAGRAPH1:(.*)/);
        const p2Match = content.match(/PARAGRAPH2:(.*)/);
        
        let html = '';
        if (p1Match) html += `<p class="paragraph-spaced">${p1Match[1].trim()}</p>`;
        if (p2Match) html += `<p class="paragraph-spaced">${p2Match[1].trim()}</p>`;
        
        const academicContent = document.getElementById('academic-content');
        if (academicContent) academicContent.innerHTML = html;
        
        // Extract ORCID
        const orcidDescMatch = content.match(/ORCID_DESC:(.*)/);
        const orcidBtnMatch = content.match(/ORCID_BTN:(.*)/);
        if (orcidDescMatch) {
            const orcidDesc = document.getElementById('orcid-desc');
            if (orcidDesc) orcidDesc.textContent = orcidDescMatch[1].trim();
        }
        if (orcidBtnMatch) {
            const orcidBtn = document.getElementById('orcid-btn');
            if (orcidBtn) orcidBtn.textContent = orcidBtnMatch[1].trim();
        }
        
        // Extract Scholar
        const scholarDescMatch = content.match(/SCHOLAR_DESC:(.*)/);
        const scholarBtnMatch = content.match(/SCHOLAR_BTN:(.*)/);
        if (scholarDescMatch) {
            const scholarDesc = document.getElementById('scholar-desc');
            if (scholarDesc) scholarDesc.textContent = scholarDescMatch[1].trim();
        }
        if (scholarBtnMatch) {
            const scholarBtn = document.getElementById('scholar-btn');
            if (scholarBtn) scholarBtn.textContent = scholarBtnMatch[1].trim();
        }
    },
    
    updateWriter(content) {
        const titleMatch = content.match(/TITLE:(.*)/);
        const bookTitleMatch = content.match(/BOOK_TITLE:(.*)/);
        const descMatch = content.match(/DESCRIPTION:(.*)/);
        const yearMatch = content.match(/YEAR_LABEL:(.*)/);
        const btnMatch = content.match(/BOOK_BTN:(.*)/);
        
        if (titleMatch) {
            const writerTitle = document.getElementById('writer-title');
            if (writerTitle) writerTitle.textContent = titleMatch[1].trim();
        }
        if (bookTitleMatch) {
            const bookTitle = document.getElementById('book-title');
            if (bookTitle) bookTitle.textContent = bookTitleMatch[1].trim();
        }
        if (descMatch) {
            const bookDesc = document.getElementById('book-description');
            if (bookDesc) bookDesc.textContent = descMatch[1].trim();
        }
        if (yearMatch) {
            const yearLabel = document.getElementById('year-label');
            if (yearLabel) yearLabel.textContent = yearMatch[1].trim();
        }
        if (btnMatch) {
            const bookBtn = document.getElementById('book-btn');
            if (bookBtn) bookBtn.textContent = btnMatch[1].trim();
        }
    },
    
    updateFooter(content) {
        const nameMatch = content.match(/NAME:(.*)/);
        const deptMatch = content.match(/DEPT:(.*)/);
        const uniMatch = content.match(/UNI:(.*)/);
        
        if (nameMatch) {
            const footerName = document.getElementById('footer-name');
            if (footerName) footerName.textContent = nameMatch[1].trim();
        }
        if (deptMatch) {
            const footerDept = document.getElementById('footer-dept');
            if (footerDept) footerDept.textContent = deptMatch[1].trim();
        }
        if (uniMatch) {
            const footerUni = document.getElementById('footer-uni');
            if (footerUni) footerUni.textContent = uniMatch[1].trim();
        }
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    LanguageLoader.init();
});