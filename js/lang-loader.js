// Simple language loader - ONE file per language
const LanguageLoader = {
    currentLang: 'es',
    
    init() {
        // Load default language
        this.loadLanguage('es');
        
        // Set up language buttons
        const buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = btn.getAttribute('data-lang');
                
                // Update active button
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Load language
                this.loadLanguage(lang);
            });
        });
    },
    
    async loadLanguage(lang) {
        try {
            // Add cache-busting timestamp
            const url = `lang/${lang}.txt?v=${Date.now()}`;
            const response = await fetch(url);
            const content = await response.text();
            
            // Parse the entire file and update DOM
            this.parseContent(content);
            this.currentLang = lang;
            
        } catch (error) {
            console.error('Error loading language:', error);
        }
    },
    
    parseContent(content) {
        // Get all sections by regex
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
            document.getElementById('header-title').textContent = lines[0].trim();
            document.getElementById('header-subtitle').textContent = lines[1].trim();
        }
    },
    
    updateNav(content) {
        const lines = content.trim().split('\n');
        if (lines.length >= 3) {
            document.getElementById('nav-bio').innerHTML = `<i class="fas fa-user"></i> ${lines[0].trim()}`;
            document.getElementById('nav-academic').innerHTML = `<i class="fas fa-graduation-cap"></i> ${lines[1].trim()}`;
            document.getElementById('nav-writer').innerHTML = `<i class="fas fa-book"></i> ${lines[2].trim()}`;
        }
    },
    
    updateBio(content) {
        // Extract title
        const titleMatch = content.match(/TITLE:(.*)/);
        if (titleMatch) {
            document.getElementById('bio-title').textContent = titleMatch[1].trim();
        }
        
        // Extract content (everything after CONTENT:)
        const contentMatch = content.match(/CONTENT:([\s\S]*)/);
        if (contentMatch) {
            document.getElementById('bio-content').innerHTML = contentMatch[1].trim();
        }
    },
    
    updateAcademic(content) {
        // Extract title
        const titleMatch = content.match(/TITLE:(.*)/);
        if (titleMatch) {
            document.getElementById('academic-title').textContent = titleMatch[1].trim();
        }
        
        // Extract paragraphs
        const p1Match = content.match(/PARAGRAPH1:(.*)/);
        const p2Match = content.match(/PARAGRAPH2:(.*)/);
        
        let html = '';
        if (p1Match) html += `<p class="paragraph-spaced">${p1Match[1].trim()}</p>`;
        if (p2Match) html += `<p class="paragraph-spaced">${p2Match[1].trim()}</p>`;
        document.getElementById('academic-content').innerHTML = html;
        
        // Extract ORCID
        const orcidDescMatch = content.match(/ORCID_DESC:(.*)/);
        const orcidBtnMatch = content.match(/ORCID_BTN:(.*)/);
        if (orcidDescMatch) document.getElementById('orcid-desc').textContent = orcidDescMatch[1].trim();
        if (orcidBtnMatch) document.getElementById('orcid-btn').textContent = orcidBtnMatch[1].trim();
        
        // Extract Scholar
        const scholarDescMatch = content.match(/SCHOLAR_DESC:(.*)/);
        const scholarBtnMatch = content.match(/SCHOLAR_BTN:(.*)/);
        if (scholarDescMatch) document.getElementById('scholar-desc').textContent = scholarDescMatch[1].trim();
        if (scholarBtnMatch) document.getElementById('scholar-btn').textContent = scholarBtnMatch[1].trim();
    },
    
    updateWriter(content) {
        const titleMatch = content.match(/TITLE:(.*)/);
        const bookTitleMatch = content.match(/BOOK_TITLE:(.*)/);
        const descMatch = content.match(/DESCRIPTION:(.*)/);
        const yearMatch = content.match(/YEAR_LABEL:(.*)/);
        const btnMatch = content.match(/BOOK_BTN:(.*)/);
        
        if (titleMatch) document.getElementById('writer-title').textContent = titleMatch[1].trim();
        if (bookTitleMatch) document.getElementById('book-title').textContent = bookTitleMatch[1].trim();
        if (descMatch) document.getElementById('book-description').textContent = descMatch[1].trim();
        if (yearMatch) document.getElementById('year-label').textContent = yearMatch[1].trim();
        if (btnMatch) document.getElementById('book-btn').textContent = btnMatch[1].trim();
    },
    
    updateFooter(content) {
        const nameMatch = content.match(/NAME:(.*)/);
        const deptMatch = content.match(/DEPT:(.*)/);
        const uniMatch = content.match(/UNI:(.*)/);
        
        if (nameMatch) document.getElementById('footer-name').textContent = nameMatch[1].trim();
        if (deptMatch) document.getElementById('footer-dept').textContent = deptMatch[1].trim();
        if (uniMatch) document.getElementById('footer-uni').textContent = uniMatch[1].trim();
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    LanguageLoader.init();
});