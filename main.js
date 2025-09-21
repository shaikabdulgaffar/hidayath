function showHomeScreen() {
    hideAllScreens();
    currentContentId = null;

    homeScreen.style.display = 'block';

    if (isSearchActive) {
        if (headerSearchInput.value.trim()) {
            performLiveHeaderSearch(headerSearchInput.value.trim());
        } else {
            showSearchPlaceholder();
        }
    } else {
        restoreNormalView();
    }

    setTabsVisible(true); // show tabs on home
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// DOM Elements
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('overlay');
const themeToggle = document.getElementById('themeToggle');
const shareBtn = document.getElementById('shareBtn');
const aboutAppBtn = document.getElementById('aboutAppBtn');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const homeScreen = document.getElementById('homeScreen');
const contentScreen = document.getElementById('contentScreen');
const bookmarksScreen = document.getElementById('bookmarksScreen');
const aboutAppScreen = document.getElementById('aboutAppScreen'); // Add this
const aboutBookScreen = document.getElementById('aboutBookScreen'); // Add this
const backBtn = document.getElementById('backBtn');
const bookmarksBackBtn = document.getElementById('bookmarksBackBtn');
const aboutAppBackBtn = document.getElementById('aboutAppBackBtn'); // Add this
const contentDisplay = document.getElementById('contentDisplay');
const indexItems = document.getElementById('indexItems');
const bookmarkIconBtn = document.getElementById('bookmarkIconBtn');
const bookmarksModal = document.getElementById('bookmarksModal');
const bookmarksList = document.getElementById('bookmarksList');
const bookmarksInlineList = document.getElementById('bookmarksInlineList');
const contactUsScreen = document.getElementById('contactUsScreen');
const contactUsBackBtn = document.getElementById('contactUsBackBtn');
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

// Header search elements
const searchBtn = document.getElementById('searchBtn');
const searchCloseBtn = document.getElementById('searchCloseBtn');
const appTitle = document.getElementById('appTitle');
const searchInputContainer = document.getElementById('searchInputContainer');
const headerSearchInput = document.getElementById('headerSearchInput');
const contentsHeading = document.getElementById('contentsHeading');
const header = document.querySelector('.header');
const mainContent = document.getElementById('mainContent');     // added
const tabNavigation = document.getElementById('tabNavigation'); // already present

// Add safe refs for optional elements (modal + old search overlay)
const languageModal = document.getElementById('languageModal');
const languageCloseBtn = document.getElementById('languageCloseBtn');
const languageOptions = document.querySelectorAll('.language-option');
const searchOverlay = document.getElementById('searchOverlay');

// Additional buttons
const rateAppBtn = document.getElementById('rateAppBtn');
const ourAppsBtn = document.getElementById('ourAppsBtn');
const contactUsBtn = document.getElementById('contactUsBtn');

// Sidebar Language Expand/Collapse
const languageBtn = document.getElementById('languageBtn');
const languageOptionsSidebar = document.getElementById('languageOptionsSidebar');
const chevronIcon = languageBtn.querySelector('.chevron-icon');
const languageOptionSidebarEls = languageOptionsSidebar.querySelectorAll('.language-option-sidebar');

// Toggle expand/collapse
languageBtn.addEventListener('click', () => {
    const expanded = languageOptionsSidebar.style.display === 'block';
    languageOptionsSidebar.style.display = expanded ? 'none' : 'block';
    chevronIcon.classList.toggle('expanded', !expanded);
    languageBtn.setAttribute('aria-expanded', String(!expanded)); // update aria
});

// Language selection
languageOptionSidebarEls.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent parent click
        const langCode = option.dataset.lang;
        localStorage.setItem('selectedLanguage', langCode);

        // Highlight selected
        languageOptionSidebarEls.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        // Show message
        showLanguageChangeMessage(langCode);

        // Collapse after selection
        languageOptionsSidebar.style.display = 'none';
        chevronIcon.classList.remove('expanded');
        closeSidebar();
    });
});

// On load, highlight selected language
function updateSidebarLanguageSelection() {
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
    languageOptionSidebarEls.forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.lang === selectedLang);
    });
}
document.addEventListener('DOMContentLoaded', updateSidebarLanguageSelection);

// State
let currentContentId = null;
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
let isSearchActive = false;

// Event Listeners
hamburgerBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);
themeToggle.addEventListener('change', toggleTheme);
shareBtn.addEventListener('click', shareApp);
aboutAppBtn.addEventListener('click', showAboutApp); // Update this
bookmarkBtn.addEventListener('click', showBookmarksFromSidebar);
backBtn.addEventListener('click', showHomeScreen);
bookmarksBackBtn.addEventListener('click', showHomeScreen);
aboutAppBackBtn.addEventListener('click', showHomeScreen); // Add this
bookmarkIconBtn.addEventListener('click', toggleBookmark);
contactUsBtn.addEventListener('click', () => {
    showContactUs();
    closeSidebar();
});

if (contactUsBackBtn) {
    contactUsBackBtn.addEventListener('click', showHomeScreen);
}

// Language Event Listeners
// Only wire modal handlers if modal exists (your UI uses sidebar list)
if (languageModal) {
    languageBtn.addEventListener('click', openLanguageModal);
}
if (languageCloseBtn) {
    languageCloseBtn.addEventListener('click', closeLanguageModal);
}
if (languageModal) {
    languageModal.addEventListener('click', (e) => {
        if (e.target === languageModal) {
            closeLanguageModal();
        }
    });
}

// Language option selection (modal version) - guard if options exist
if (languageOptions && languageOptions.length) {
    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.dataset.lang;
            selectLanguage(selectedLang);
            if (languageModal) closeLanguageModal();
            closeSidebar();
        });
    });
}

// Header search event listeners
searchBtn.addEventListener('click', openHeaderSearch);
searchCloseBtn.addEventListener('click', closeHeaderSearch);
headerSearchInput.addEventListener('input', handleHeaderSearchInput);

// Close search overlay when clicking outside (only if overlay exists)
if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            closeSearch();
        }
    });
}

// Rate App button
rateAppBtn.addEventListener('click', () => {
    window.open('https://play.google.com/store/apps/details?id=com.yourapp.hidayateamaal', '_blank');
    closeSidebar();
});

// Our Apps button
ourAppsBtn.addEventListener('click', () => {
    window.open('https://yourwebsite.com/apps', '_blank');
    closeSidebar();
});

// Contact Us button
contactUsBtn.addEventListener('click', () => {
    showContactUs();
    closeSidebar();
});

// Functions
function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    lockScroll();
    disableBackgroundInteractions();
    collapseLanguageDropdown(); // ensure language starts closed every time
}

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    unlockScroll();
    enableBackgroundInteractions();

    // Also collapse any open language section
    collapseLanguageDropdown();
}

function toggleTheme() {
    if (themeToggle.checked) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
}

function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'Hidayate Amaal',
            text: 'Islamic guidance and teachings',
            url: window.location.href
        });
    } else {
        // Fallback for browsers that don't support native sharing
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('App link copied to clipboard!');
        });
    }
    closeSidebar();
}

function showAboutApp() {
    closeHeaderSearch();
    hideAllScreens();
    aboutAppScreen.style.display = 'block';
    setTabsVisible(false); // hide tabs on non-home
    closeSidebar();
    window.scrollTo(0, 0);
}

function closeHeaderSearch() {
    isSearchActive = false;
    header.classList.remove('search-mode');
    document.body.classList.remove('search-mode'); // Add this line
    searchInputContainer.classList.remove('active');
    searchBtn.style.display = 'flex';
    searchCloseBtn.style.display = 'none';
    headerSearchInput.value = '';
    
    // Only restore normal view if we're on home screen
    if (homeScreen.style.display !== 'none') {
        restoreNormalView();
    }
}

function showContent(id) {
    const content = contentData[id];
    if (!content) return;

    closeHeaderSearch();

    // Find serial number from indexData
    const serialIndex = indexData.findIndex(item => item.id === id);
    const serialNumber = serialIndex !== -1 ? (serialIndex + 1) : '';

    currentContentId = id;
    contentDisplay.innerHTML = `
        <h2>${serialNumber}) ${content.title}</h2>
        ${content.content}
    `;

    hideAllScreens();
    contentScreen.style.display = 'block';
    bookmarkIconBtn.style.display = 'block';
    updateBookmarkIcon();
    setTabsVisible(false); // hide tabs on non-home
    window.scrollTo(0, 0);
}

function showHomeScreen() {
    hideAllScreens();
    currentContentId = null;

    homeScreen.style.display = 'block';

    if (isSearchActive) {
        if (headerSearchInput.value.trim()) {
            performLiveHeaderSearch(headerSearchInput.value.trim());
        } else {
            showSearchPlaceholder();
        }
    } else {
        restoreNormalView();
    }

    setTabsVisible(true); // show tabs on home
    window.scrollTo(0, 0);
}

function showBookmarks() {
    closeHeaderSearch();

    if (bookmarks.length === 0) {
        bookmarksInlineList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No bookmarks added yet.</p>';
    } else {
        bookmarksInlineList.innerHTML = '';
        bookmarks.forEach(bookmark => {
            const bookmarkItem = document.createElement('div');
            bookmarkItem.className = 'bookmark-item';
            bookmarkItem.innerHTML = `
                <div class="bookmark-content">
                    <h4>${bookmark.title}</h4>
                </div>
                <button class="bookmark-delete" onclick="removeBookmark(${bookmark.id})" title="Remove bookmark">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            bookmarkItem.querySelector('.bookmark-content').addEventListener('click', () => {
                showContent(bookmark.id);
            });
            bookmarksInlineList.appendChild(bookmarkItem);
        });
    }

    hideAllScreens();
    bookmarksScreen.style.display = 'block';
    setTabsVisible(false); // hide tabs on non-home
    closeSidebar();
}

function toggleBookmark() {
    if (!currentContentId) return;

    const isBookmarked = bookmarks.some(b => b.id === currentContentId);
    if (isBookmarked) {
        removeBookmark(currentContentId);
    } else {
        addBookmark(currentContentId);
    }
}

function addBookmark(id) {
    const content = contentData[id];
    if (!content) return;

    const bookmark = {
        id: id,
        title: content.title,
        timestamp: new Date().toISOString()
    };

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkIcon();
}

function removeBookmark(id) {
    bookmarks = bookmarks.filter(b => b.id !== id);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkIcon();
    
    // If we're on the bookmarks screen, refresh it
    if (bookmarksScreen.style.display === 'block') {
        showBookmarks();
    }
}

function updateBookmarkIcon() {
    if (!currentContentId) return;

    const isBookmarked = bookmarks.some(b => b.id === currentContentId);
    if (isBookmarked) {
        bookmarkIconBtn.classList.add('bookmarked');
        bookmarkIconBtn.title = 'Remove bookmark';
    } else {
        bookmarkIconBtn.classList.remove('bookmarked');
        bookmarkIconBtn.title = 'Bookmark this content';
    }
}

// Language Functions
function openLanguageModal() {
    languageModal.style.display = 'flex';
    setTimeout(() => {
        languageModal.classList.add('active');
    }, 10);
    
    // Update selected language
    updateLanguageSelection();
}

function closeLanguageModal() {
    languageModal.classList.remove('active');
    setTimeout(() => {
        languageModal.style.display = 'none';
    }, 300);
}

function selectLanguage(langCode) {
    // Save selected language
    localStorage.setItem('selectedLanguage', langCode);
    
    // Update UI
    updateLanguageSelection();
    
    // Show success message
    showLanguageChangeMessage(langCode);
    
    // Here you can add logic to actually change the app language
    // For now, we'll just save the preference
}

function updateLanguageSelection() {
    const selectedLang = localStorage.getItem('selectedLanguage') || 'en';
    
    languageOptions.forEach(option => {
        const langCode = option.dataset.lang;
        const checkElement = option.querySelector('.language-check');
        
        if (langCode === selectedLang) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

function showLanguageChangeMessage(langCode) {
    const languageNames = {
        'en': 'English',
        'ur': 'Urdu',
        'hi': 'Hindi',
        'ar': 'Arabic'
    };
    
    const selectedLanguage = languageNames[langCode];
    
    // Create temporary message
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1004;
        font-weight: 500;
        animation: slideDown 0.3s ease;
    `;
    
    message.textContent = `Language changed to ${selectedLanguage}`;
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        message.style.animation = 'slideUp 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}

// Initialize the app
function initializeApp() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    // Initialize language selection
    updateSidebarLanguageSelection();

    // Populate index
    populateIndex();
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Populate index on load
function populateIndex() {
    indexItems.innerHTML = '';
    indexData.forEach((item, idx) => {
        const serialNumber = idx + 1;
        const indexItem = document.createElement('div');
        indexItem.className = 'index-item';
        indexItem.innerHTML = `
            <div class="index-serial">${serialNumber})</div>
            <h4 class="index-title">${item.title}</h4>
        `;
        indexItem.addEventListener('click', () => showContent(item.id));
        indexItems.appendChild(indexItem);
    });
}

// Search functionality
function searchIndex(query) {
    if (!query.trim()) {
        populateIndex();
        return;
    }

    const filteredItems = indexData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    indexItems.innerHTML = '';

    if (filteredItems.length === 0) {
        indexItems.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No results found</p>';
        return;
    }

    filteredItems.forEach(item => {
        const serialIndex = indexData.findIndex(i => i.id === item.id);
        const serialNumber = serialIndex !== -1 ? (serialIndex + 1) : '';
        const indexItem = document.createElement('div');
        indexItem.className = 'index-item';
        indexItem.innerHTML = `
            <div class="index-serial">${serialNumber})</div>
            <h4 class="index-title">${item.title}</h4>
        `;
        indexItem.addEventListener('click', () => showContent(item.id));
        indexItems.appendChild(indexItem);
    });
}

// Header Search Functions
function openHeaderSearch() {
    if (sidebar.classList.contains('open')) return; // block when sidebar open
    isSearchActive = true;
    header.classList.add('search-mode');
    document.body.classList.add('search-mode');
    searchInputContainer.classList.add('active');
    searchBtn.style.display = 'none';
    searchCloseBtn.style.display = 'flex';
    headerSearchInput.focus();
    if (homeScreen.style.display !== 'none') {
        showSearchPlaceholder();
    }
}

function closeSearch() {
    isSearchActive = false;
    header.classList.remove('search-mode');
    document.body.classList.remove('search-mode'); // Add this line
    searchInputContainer.classList.remove('active');
    searchBtn.style.display = 'flex';
    searchCloseBtn.style.display = 'none';
    headerSearchInput.value = '';
    
    // Only restore normal view if we're on home screen
    if (homeScreen.style.display !== 'none') {
        restoreNormalView();
    }
}

function handleHeaderSearchInput(e) {
    if (sidebar.classList.contains('open')) return; // block when sidebar open
    const query = e.target.value.trim();
    if (homeScreen.style.display === 'none') {
        return;
    }
    if (!query) {
        restoreNormalView();
        return;
    }
    performLiveHeaderSearch(query);
}

function showSearchPlaceholder() {
    contentsHeading.textContent = 'Search Results';
    indexItems.innerHTML = `
        <div class="search-results-info">
            <i class="fas fa-search"></i>
            <p>Start typing to search through the content...</p>
        </div>
    `;
}

function restoreNormalView() {
    contentsHeading.textContent = 'Contents';
    populateIndex();
}

function performLiveHeaderSearch(query) {
    const filteredItems = indexData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );
    
    displayHeaderSearchResults(filteredItems, query);
}

function displayHeaderSearchResults(results, query) {
    contentsHeading.textContent = `Search Results (${results.length})`;
    
    if (results.length === 0) {
        indexItems.innerHTML = `
            <div class="search-results-info">
                <i class="fas fa-search"></i>
                <p>No results found for "${query}"</p>
            </div>
        `;
        return;
    }
    
    indexItems.innerHTML = '';
    
    results.forEach(item => {
        const serialIndex = indexData.findIndex(i => i.id === item.id);
        const serialNumber = serialIndex !== -1 ? (serialIndex + 1) : '';
        
        const indexItem = document.createElement('div');
        indexItem.className = 'index-item';
        indexItem.innerHTML = `
            <div class="index-serial">${serialNumber})</div>
            <h4 class="index-title">${highlightSearchTerm(item.title, query)}</h4>
        `;
        
        indexItem.addEventListener('click', () => {
            showContent(item.id);
            closeHeaderSearch(); // Close search when content is opened
        });
        
        indexItems.appendChild(indexItem);
    });
}

function highlightSearchTerm(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// Update showHomeScreen to handle search
function showHomeScreen() {
    hideAllScreens();
    currentContentId = null;

    homeScreen.style.display = 'block';

    if (isSearchActive) {
        if (headerSearchInput.value.trim()) {
            performLiveHeaderSearch(headerSearchInput.value.trim());
        } else {
            showSearchPlaceholder();
        }
    } else {
        restoreNormalView();
    }

    setTabsVisible(true); // show tabs on home
    window.scrollTo(0, 0);
}

// Update the bookmarkBtn click handler to differentiate from search
function showBookmarksFromSidebar() {
    showBookmarks();
    closeSidebar();
}

// Contact Us functions
function showContactUs() {
    closeHeaderSearch();
    hideAllScreens();
    contactUsScreen.style.display = 'block';
    setTabsVisible(false); // hide tabs on non-home
    window.scrollTo(0, 0);
    if (contactSuccess) contactSuccess.style.display = 'none';
    if (contactForm) contactForm.reset();
}

// Handle contact form submit
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // You can send data to your backend here, or just show success
        contactSuccess.style.display = 'block';
        contactForm.reset();
    });
}

// Auto-resize feedback textarea vertically (no horizontal growth)
const feedbackTextarea = document.getElementById('contactMessage');

function autosizeTextarea(el) {
    if (!el) return;
    const maxPx = Math.floor(window.innerHeight * 0.5); // cap at 50% of viewport height
    el.style.height = 'auto';
    el.style.overflowY = 'hidden';
    const h = el.scrollHeight;
    if (h > maxPx) {
        el.style.height = `${maxPx}px`;
        el.style.overflowY = 'auto'; // scroll vertically after cap
    } else {
        el.style.height = `${h}px`;
    }
}

// Wire up when present
if (feedbackTextarea) {
    const onChange = () => autosizeTextarea(feedbackTextarea);
    feedbackTextarea.addEventListener('input', onChange);
    feedbackTextarea.addEventListener('change', onChange);
    window.addEventListener('resize', onChange);
    // Initialize
    requestAnimationFrame(onChange);
}

// If the form resets, also reset the textarea height
if (contactForm) {
    contactForm.addEventListener('reset', () => {
        if (feedbackTextarea) {
            feedbackTextarea.style.height = '';
            feedbackTextarea.style.overflowY = 'hidden';
            requestAnimationFrame(() => autosizeTextarea(feedbackTextarea));
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // Escape key to close search, sidebar or go back
    if (event.key === 'Escape') {
        if (isSearchActive) {
            closeHeaderSearch();
        } else if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else if (contentScreen.style.display === 'block') {
            showHomeScreen();
        }
    }

    // Ctrl/Cmd + K to open search (disabled when sidebar open)
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        if (sidebar.classList.contains('open')) return; // block when sidebar open
        if (homeScreen.style.display !== 'none') {
            openHeaderSearch();
        }
    }
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Add loading states for better UX
function showLoading(element) {
    const originalContent = element.innerHTML;
    element.innerHTML = '<div class="loading"></div>';
    return originalContent;
}

function hideLoading(element, originalContent) {
    element.innerHTML = originalContent;
}

// Add smooth transitions
function addSmoothTransition(element, property, duration = '0.3s') {
    element.style.transition = `${property} ${duration} ease`;
}

// Initialize smooth scrolling for better mobile experience
function initSmoothScrolling() {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Call initialization functions
initSmoothScrolling();

// Add touch support for better mobile experience
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(event) {
    touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(event) {
    touchEndY = event.changedTouches[0].screenY;
    
    // Detect swipe gestures
    const swipeThreshold = 50;
    const swipeDistance = touchStartY - touchEndY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe up - could implement scroll to top
        } else {
            // Swipe down - could implement refresh
        }
    }
});

// Add viewport meta tag detection and warning
function checkViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        console.warn('Viewport meta tag not found. App may not display correctly on mobile devices.');
    }
}

// Call viewport check
checkViewport();

// Performance optimization: Lazy loading for better performance
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Optimize scroll performance
let ticking = false;

function updateScrollElements() {
    // Update elements based on scroll position
    ticking = false;
}

function requestScrollUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
    }
}

window.addEventListener('scroll', requestScrollUpdate);

// Add CSS animations for the message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Add these language options to your language modal rendering function

const languageOptionsData = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
    { code: 'roman_ur', name: 'Roman Urdu', native: 'Roman Urdu', flag: '🇵🇰' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
    { code: 'roman_te', name: 'Roman Telugu', native: 'Roman Telugu', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' }
];

// Example: Render language options in modal
function renderLanguageOptions() {
    const languageOptionsContainer = document.querySelector('.language-options');
    languageOptionsContainer.innerHTML = '';
    languageOptionsData.forEach(option => {
        const div = document.createElement('div');
        div.className = 'language-option';
        div.dataset.langCode = option.code;
        div.innerHTML = `
            <span class="language-flag">${option.flag}</span>
            <span class="language-name">${option.name}</span>
            <span class="language-native">${option.native}</span>
            <span class="language-check" style="display:none;">✔</span>
        `;
        languageOptionsContainer.appendChild(div);
    });
    updateLanguageSelection();
}

// Interactivity lock helpers (background)
function disableBackgroundInteractions() {
    document.body.classList.add('sidebar-open');
    if (header) header.setAttribute('inert', '');
    if (mainContent) mainContent.setAttribute('inert', '');
    if (tabNavigation) tabNavigation.setAttribute('inert', '');
}

function enableBackgroundInteractions() {
    document.body.classList.remove('sidebar-open');
    if (header) header.removeAttribute('inert');
    if (mainContent) mainContent.removeAttribute('inert');
    if (tabNavigation) tabNavigation.removeAttribute('inert');
}

// Collapse language dropdown
function collapseLanguageDropdown() {
    // Hide language options list and reset chevron + aria
    if (typeof languageOptionsSidebar !== 'undefined' && languageOptionsSidebar) {
        languageOptionsSidebar.style.display = 'none';
    }
    if (typeof chevronIcon !== 'undefined' && chevronIcon) {
        chevronIcon.classList.remove('expanded');
    }
    if (typeof languageBtn !== 'undefined' && languageBtn) {
        languageBtn.setAttribute('aria-expanded', 'false');
    }
}

// Scroll lock helpers
let __scrollY = 0;
function lockScroll() {
    __scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');

    // prevent body from scrolling while preserving position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${__scrollY}px`;
    document.body.style.width = '100%';
}

function unlockScroll() {
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');

    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    window.scrollTo(0, __scrollY);
}

// Centralized screen visibility helper
function hideAllScreens() {
    if (homeScreen) homeScreen.style.display = 'none';
    if (contentScreen) contentScreen.style.display = 'none';
    if (bookmarksScreen) bookmarksScreen.style.display = 'none';
    if (aboutAppScreen) aboutAppScreen.style.display = 'none';
    if (aboutBookScreen) aboutBookScreen.style.display = 'none';
    if (contactUsScreen) contactUsScreen.style.display = 'none';
}

// Helper: control tab visibility
function setTabsVisible(isVisible) {
    if (!tabNavigation) return;
    tabNavigation.style.display = isVisible ? 'flex' : 'none';
}

// After initializeApp on first load, ensure tabs visible on home
document.addEventListener('DOMContentLoaded', () => {
    setTabsVisible(true);
});