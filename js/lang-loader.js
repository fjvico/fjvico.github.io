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
        const currentLangEl = document.getElementById('current-lang');
        if (currentLangEl) currentLangEl.textContent = this.currentLang.toUpperCase();
    },
    
    async switchLanguage(lang) {
        this.currentLang = lang;
        const currentLangEl = document.getElementById('current-lang');
        if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();
        await this.loadLanguage(lang);
        history.pushState({lang: lang}, '', `#${lang}`);
    },
    
    async loadLanguage(lang) {
        try {
            const url = `lang/${lang}.txt?v=${Date.now()}`;
            const response = await fetch(url);
            const content = await response.text();
            this.parseContent(content);
        } catch (error) {
            console.error('Error loading language:', error);
        }
    },
    
    parseContent(content) {
        const sections = {
            header: content.match(/=== HEADER\n([\s\S]*?)(?=\n=== |$)/),
            nav: content.match(/=== NAV\n([\s\S]*?)(?=\n=== |$)/),
            bio: content.match(/=== BIOGRAPHY\n([\s\S]*?)(?=\n=== |$)/),
            academic: content.match(/=== ACADEMIC\n([\s\S]*?)(?=\n=== |$)/),
            writer: content.match(/=== WRITER\n([\s\S]*?)(?=\n=== |$)/),
            footer: content.match(/=== FOOTER\n([\s\S]*?)(?=\n=== |$)/)
        };
        
        if (sections.header) this.updateHeader(sections.header[1]);
        if (sections.nav) this.updateNav(sections.nav[1]);
        if (sections.bio) this.updateBio(sections.bio[1]);
        if (sections.academic) this.updateAcademic(sections.academic[1]);
        if (sections.writer) this.updateWriter(sections.writer[1]);
        if (sections.footer) this.updateFooter(sections.footer[1]);
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
        const titleMatch = content.match(/TITLE:(.*)/);
        if (titleMatch) {
            document.getElementById('bio-title').textContent = titleMatch[1].trim();
        }
        
        const contentMatch = content.match(/CONTENT:([\s\S]*)/);
        if (contentMatch) {
            document.getElementById('bio-content').innerHTML = contentMatch[1].trim();
        }
    },
    
    updateAcademic(content) {
        const titleMatch = content.match(/TITLE:(.*)/);
        if (titleMatch) {
            document.getElementById('academic-title').textContent = titleMatch[1].trim();
        }
        
        const p1Match = content.match(/PARAGRAPH1:(.*)/);
        const p2Match = content.match(/PARAGRAPH2:(.*)/);
        
        let html = '';
        if (p1Match) html += `<p class="paragraph-spaced">${p1Match[1].trim()}</p>`;
        if (p2Match) html += `<p class="paragraph-spaced">${p2Match[1].trim()}</p>`;
        document.getElementById('academic-content').innerHTML = html;
        
        const orcidDescMatch = content.match(/ORCID_DESC:(.*)/);
        const orcidBtnMatch = content.match(/ORCID_BTN:(.*)/);
        if (orcidDescMatch) document.getElementById('orcid-desc').textContent = orcidDescMatch[1].trim();
        if (orcidBtnMatch) document.getElementById('orcid-btn').textContent = orcidBtnMatch[1].trim();
        
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
        
        if (nameMatch) document.getElementById('footer-name').textContent