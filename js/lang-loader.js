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
                
                // Close dropdown on mobile
                const dropdown = document.querySelector('.dropdown-content');
                dropdown.classList.remove('show');
            });
        });
        
        // Toggle dropdown on button click (for mobile)
        const dropdownBtn = document.getElementById('langDropdownBtn');
        if (dropdownBtn) {
            dropdownBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = document.querySelector('.dropdown-content');
                dropdown.classList.toggle('show');
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
            // Add cache-busting timestamp
            const url = `lang/${lang}.txt?v=${Date.now()}`;
            const response = await fetch(url);
            const content = await response.text();
            
            // Parse the entire file and update DOM
            this.parseContent(content);
            
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