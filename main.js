function showMotivationalHadith() {
    const hadith = motivationalHadiths[Math.floor(Math.random() * motivationalHadiths.length)];
    const hadithSection = document.getElementById('motivationalHadith');
    hadithSection.innerHTML = `
        <div class="motivational-arabic">${hadith.text}</div>
        <div class="motivational-translation">"${hadith.translation}"</div>
        <div class="motivational-ref">— ${hadith.ref}</div>
    `;
}

// Call on home screen load
function showHomeScreen() {
    homeScreen.style.display = 'block';
    contentScreen.style.display = 'none';
    bookmarksScreen.style.display = 'none';
    aboutAppScreen.style.display = 'none'; // Add this
    aboutBookScreen.style.display = 'none'; // Add this
    currentContentId = null;
    showMotivationalHadith();
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    showMotivationalHadith();
});

// DOM Elements
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('overlay');
const themeToggle = document.getElementById('themeToggle');
const shareBtn = document.getElementById('shareBtn');
const aboutAppBtn = document.getElementById('aboutAppBtn');
const aboutBookBtn = document.getElementById('aboutBookBtn');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const homeScreen = document.getElementById('homeScreen');
const contentScreen = document.getElementById('contentScreen');
const bookmarksScreen = document.getElementById('bookmarksScreen');
const aboutAppScreen = document.getElementById('aboutAppScreen'); // Add this
const aboutBookScreen = document.getElementById('aboutBookScreen'); // Add this
const backBtn = document.getElementById('backBtn');
const bookmarksBackBtn = document.getElementById('bookmarksBackBtn');
const aboutAppBackBtn = document.getElementById('aboutAppBackBtn'); // Add this
const aboutBookBackBtn = document.getElementById('aboutBookBackBtn'); // Add this
const contentDisplay = document.getElementById('contentDisplay');
const indexItems = document.getElementById('indexItems');
const bookmarkIconBtn = document.getElementById('bookmarkIconBtn');
const bookmarksModal = document.getElementById('bookmarksModal');
const bookmarksList = document.getElementById('bookmarksList');
const bookmarksInlineList = document.getElementById('bookmarksInlineList');

// Header search elements
const searchBtn = document.getElementById('searchBtn');
const searchCloseBtn = document.getElementById('searchCloseBtn');
const appTitle = document.getElementById('appTitle');
const searchInputContainer = document.getElementById('searchInputContainer');
const headerSearchInput = document.getElementById('headerSearchInput');
const contentsHeading = document.getElementById('contentsHeading');
const header = document.querySelector('.header');

// Additional buttons
const rateAppBtn = document.getElementById('rateAppBtn');
const ourAppsBtn = document.getElementById('ourAppsBtn');
const contactUsBtn = document.getElementById('contactUsBtn');

// Language DOM Elements
const languageBtn = document.getElementById('languageBtn');
const languageModal = document.getElementById('languageModal');
const languageCloseBtn = document.getElementById('languageCloseBtn');
const languageOptions = document.querySelectorAll('.language-option');

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
aboutBookBtn.addEventListener('click', showAboutBook); // Update this
bookmarkBtn.addEventListener('click', showBookmarksFromSidebar);
backBtn.addEventListener('click', showHomeScreen);
bookmarksBackBtn.addEventListener('click', showHomeScreen);
aboutAppBackBtn.addEventListener('click', showHomeScreen); // Add this
aboutBookBackBtn.addEventListener('click', showHomeScreen); // Add this
bookmarkIconBtn.addEventListener('click', toggleBookmark);

// Language Event Listeners
languageBtn.addEventListener('click', openLanguageModal);
languageCloseBtn.addEventListener('click', closeLanguageModal);
languageModal.addEventListener('click', (e) => {
    if (e.target === languageModal) {
        closeLanguageModal();
    }
});

// Language option selection
languageOptions.forEach(option => {
    option.addEventListener('click', () => {
        const selectedLang = option.dataset.lang;
        selectLanguage(selectedLang);
        closeLanguageModal();
        closeSidebar();
    });
});

// Header search event listeners
searchBtn.addEventListener('click', openHeaderSearch);
searchCloseBtn.addEventListener('click', closeHeaderSearch);
headerSearchInput.addEventListener('input', handleHeaderSearchInput);

// Close search overlay when clicking outside
searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
        closeSearch();
    }
});

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
    window.open('mailto:your@email.com?subject=Hidayate%20Amaal%20App%20Feedback', '_blank');
    closeSidebar();
});

// Functions
function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
}

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
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
    
    homeScreen.style.display = 'none';
    contentScreen.style.display = 'none';
    bookmarksScreen.style.display = 'none';
    aboutAppScreen.style.display = 'block';
    aboutBookScreen.style.display = 'none';
    closeSidebar();
    window.scrollTo(0, 0);
}

function showAboutBook() {
    closeHeaderSearch();
    
    homeScreen.style.display = 'none';
    contentScreen.style.display = 'none';
    bookmarksScreen.style.display = 'none';
    aboutAppScreen.style.display = 'none';
    aboutBookScreen.style.display = 'block';
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

    // Close search when opening content
    closeHeaderSearch();

    // Find serial number from indexData
    const serialIndex = indexData.findIndex(item => item.id === id);
    const serialNumber = serialIndex !== -1 ? (serialIndex + 1) : '';

    currentContentId = id;
    contentDisplay.innerHTML = `
        <h2>${serialNumber}) ${content.title}</h2>
        ${content.content}
    `;

    homeScreen.style.display = 'none';
    bookmarksScreen.style.display = 'none';
    aboutAppScreen.style.display = 'none'; // Add this
    aboutBookScreen.style.display = 'none'; // Add this
    contentScreen.style.display = 'block';
    bookmarkIconBtn.style.display = 'block';
    
    updateBookmarkIcon();
    window.scrollTo(0, 0);
}

function showHomeScreen() {
    homeScreen.style.display = 'block';
    contentScreen.style.display = 'none';
    bookmarksScreen.style.display = 'none';
    aboutAppScreen.style.display = 'none'; // Add this
    aboutBookScreen.style.display = 'none'; // Add this
    currentContentId = null;
    
    // If search is active, show search placeholder, otherwise show normal view
    if (isSearchActive) {
        if (headerSearchInput.value.trim()) {
            performLiveHeaderSearch(headerSearchInput.value.trim());
        } else {
            showSearchPlaceholder();
        }
    } else {
        restoreNormalView();
    }
    
    showMotivationalHadith();
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

    homeScreen.style.display = 'none';
    contentScreen.style.display = 'none';
    bookmarksScreen.style.display = 'block';
    aboutAppScreen.style.display = 'none'; // Add this
    aboutBookScreen.style.display = 'none'; // Add this
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
    updateLanguageSelection();

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
    isSearchActive = true;
    header.classList.add('search-mode');
    document.body.classList.add('search-mode'); // Add this line
    searchInputContainer.classList.add('active');
    searchBtn.style.display = 'none';
    searchCloseBtn.style.display = 'flex';
    headerSearchInput.focus();
    
    // Only show search if we're on home screen
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
    const query = e.target.value.trim();
    
    // Only search if we're on home screen
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
    homeScreen.style.display = 'block';
    contentScreen.style.display = 'none';
    bookmarksScreen.style.display = 'none';
    aboutAppScreen.style.display = 'none'; // Add this
    aboutBookScreen.style.display = 'none'; // Add this
    currentContentId = null;
    
    // If search is active, show search placeholder, otherwise show normal view
    if (isSearchActive) {
        if (headerSearchInput.value.trim()) {
            performLiveHeaderSearch(headerSearchInput.value.trim());
        } else {
            showSearchPlaceholder();
        }
    } else {
        restoreNormalView();
    }
    
    showMotivationalHadith();
    window.scrollTo(0, 0);
}

// Update the bookmarkBtn click handler to differentiate from search
function showBookmarksFromSidebar() {
    showBookmarks();
    closeSidebar();
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
    
    // Ctrl/Cmd + K to open search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
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
