function showHomeScreen() {
    // Close search if it's active (safety check)
    if (isSearchActive) {
        closeHeaderSearch();
    }

    // If we are navigating back from a detail screen, push a 'home' entry only when coming from non-home
    if (!__suppressHistory) {
        const wasOtherScreen =
            (contentScreen && contentScreen.style.display === 'block') ||
            (bookmarksScreen && bookmarksScreen.style.display === 'block') ||
            (aboutAppScreen && aboutAppScreen.style.display === 'block') ||
            (aboutBookScreen && aboutBookScreen.style.display === 'block') ||
            (contactUsScreen && contactUsScreen.style.display === 'block');
        if (wasOtherScreen) {
            try { history.pushState({ screen: 'home' }, '', '#home'); } catch {}
        }
    }

    hideAllScreens();
    currentContentId = null;

    homeScreen.style.display = 'block';

    // Since we already closed search above, just restore normal view
    restoreNormalView();

    setTabsVisible(true); // show tabs on home
    setSearchVisible(true); // show search on Home
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
const prevContentBtn = document.getElementById('prevContentBtn');
const nextContentBtn = document.getElementById('nextContentBtn');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

// Header search elements
const searchBtn = document.getElementById('searchBtn');
const searchCloseBtn = document.getElementById('searchCloseBtn');
const appTitle = document.getElementById('appTitle');
const searchInputContainer = document.getElementById('searchInputContainer');
const headerSearchInput = document.getElementById('headerSearchInput');
const header = document.querySelector('.header');
const mainContent = document.getElementById('mainContent');     // added
const tabNavigation = document.getElementById('tabNavigation'); // already present
const hidayahTab = document.getElementById('hidayahTab');
const quranTab = document.getElementById('quranTab');

// Active dataset pointers
let activeSection = 'hidayah';
let currentIndexData = [];
let currentContentData = {};

// NEW: last-read storage key (per-section map)
const LAST_READ_KEY = 'lastReadMap';

// Add safe refs for optional elements (modal + old search overlay)
const languageModal = document.getElementById('languageModal');
const languageCloseBtn = document.getElementById('languageCloseBtn');
const languageOptions = document.querySelectorAll('.language-option');
const searchOverlay = document.getElementById('searchOverlay');

// Additional buttons
const rateAppBtn = document.getElementById('rateAppBtn');
const ourAppsBtn = document.getElementById('ourAppsBtn');
const contactUsBtn = document.getElementById('contactUsBtn');
const homeBtn = document.getElementById('homeBtn');

// Default language (first run) -> Roman Urdu
const SELECTED_LANGUAGE_KEY = 'selectedLanguage';
if (!localStorage.getItem(SELECTED_LANGUAGE_KEY)) {
    localStorage.setItem(SELECTED_LANGUAGE_KEY, 'roman_ur');
}

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

// Language selection (sidebar)
languageOptionSidebarEls.forEach(option => {
    option.addEventListener('click', () => {
        const lang = option.dataset.lang;
        if (!lang) return;

        // Persist selection and visually update
        localStorage.setItem(SELECTED_LANGUAGE_KEY, lang);
        updateSidebarLanguageSelection();

        // Reload to mount the correct language datasets cleanly
        // (avoids const re-declaration conflicts across language packs)
        window.location.reload();
    });
});

// On load, highlight selected language in sidebar
function updateSidebarLanguageSelection() {
    const selected = localStorage.getItem(SELECTED_LANGUAGE_KEY) || 'roman_ur';
    document.querySelectorAll('.language-option-sidebar').forEach(el => {
        const isSelected = el.dataset.lang === selected;
        const tick = el.querySelector('.language-tick');
        if (tick) tick.style.display = isSelected ? 'inline-flex' : 'none';
        el.classList.toggle('selected', isSelected);
    });
}
document.addEventListener('DOMContentLoaded', updateSidebarLanguageSelection);

// State
let currentContentId = null;
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
let isSearchActive = false;

// SPA history helpers
let __suppressHistory = false;   // prevent pushState during popstate-driven nav
let __historySetupDone = false;  // ensure router only sets up once
// NEW: sidebar history flag
let __sidebarStateActive = false;

// Event Listeners
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openSidebar);
}
if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
}
if (overlay) {
    overlay.addEventListener('click', closeSidebar);
}
if (themeToggle) {
    themeToggle.addEventListener('change', toggleTheme);
}
if (shareBtn) {
    shareBtn.addEventListener('click', shareApp);
}
if (aboutAppBtn) {
    aboutAppBtn.addEventListener('click', showAboutApp); // Update this
}
if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', showBookmarksFromSidebar);
}
if (backBtn) {
    // history-aware back
    backBtn.addEventListener('click', () => history.back());
}
if (bookmarksBackBtn) {
    // history-aware back
    bookmarksBackBtn.addEventListener('click', () => history.back());
}
if (aboutAppBackBtn) {
    // history-aware back
    aboutAppBackBtn.addEventListener('click', () => history.back());
}
if (bookmarkIconBtn) {
    bookmarkIconBtn.addEventListener('click', toggleBookmark);
}
if (prevContentBtn) {
    prevContentBtn.addEventListener('click', goToPrevContent);
}
if (nextContentBtn) {
    nextContentBtn.addEventListener('click', goToNextContent);
}
if (contactUsBtn) {
    contactUsBtn.addEventListener('click', () => {
        showContactUs();
        closeSidebar();
    });
}
if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        // Close search first if active
        if (isSearchActive) {
            closeHeaderSearch();
        }
        showHomeScreen();
        closeSidebar();
    });
}

if (contactUsBackBtn) {
    // history-aware back
    contactUsBackBtn.addEventListener('click', () => history.back());
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
    closeSidebar(true);
    window.open('https://play.google.com/store/apps/details?id=com.yourapp.hidayateamaal', '_blank');
});
// Our Apps button
ourAppsBtn.addEventListener('click', () => {
    closeSidebar(true);
    window.open('https://yourwebsite.com/apps', '_blank');
});
// Contact Us button
contactUsBtn.addEventListener('click', () => {
    closeSidebar(true);
    showContactUs();
});
// Home button
if (homeBtn) {
    homeBtn.addEventListener('click', () => {
        if (isSearchActive) closeHeaderSearch();
        closeSidebar(true);
        showHomeScreen();
    });
}

// Functions
function openSidebar() {
    // Prevent duplicate pushes
    if (sidebar.classList.contains('open')) return;

    // NEW: push a transient history state so back closes sidebar first
    if (!__suppressHistory && !__sidebarStateActive) {
        try { history.pushState({ screen: 'sidebar' }, '', '#sidebar'); } catch {}
        __sidebarStateActive = true;
    }

    sidebar.classList.add('open');
    overlay.classList.add('active');
    lockScroll();
    disableBackgroundInteractions();
    collapseLanguageDropdown();
}

function closeSidebarUI() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    unlockScroll();
    enableBackgroundInteractions();
    collapseLanguageDropdown();
}

// Update closeSidebar to cooperate with history/back button
function closeSidebar(fromPopstate = false) {
    if (fromPopstate) {
        // We arrived here due to a pop; just close UI and clear flag
        closeSidebarUI();
        __sidebarStateActive = false;
        return;
    }
    if (__sidebarStateActive) {
        // Pop the transient sidebar state; UI will close in popstate handler
        try { history.back(); } catch {}
        return;
    }
    // Fallback: no history state to pop, just close UI
    closeSidebarUI();
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
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert(t('share_copied'));
        });
    }
    // Replace history-based close with UI-only close so we don't pop newly pushed states
    closeSidebar(true);
}

function showAboutApp() {
    // push history for About App
    if (!__suppressHistory) {
        try { history.pushState({ screen: 'aboutApp' }, '', '#about'); } catch {}
    }

    closeHeaderSearch();
    hideAllScreens();
    aboutAppScreen.style.display = 'block';
    setTabsVisible(false);
    setSearchVisible(false); // hide search off-Home
    // Only close sidebar UI, don't touch history here
    closeSidebar(true);
    window.scrollTo(0, 0);
}

function closeHeaderSearch() {
    // Don't use history.back() when closing search - just close it directly
    isSearchActive = false;
    header.classList.remove('search-mode');
    document.body.classList.remove('search-mode');
    searchInputContainer.classList.remove('active');
    searchBtn.style.display = 'flex';
    searchCloseBtn.style.display = 'none';
    headerSearchInput.value = '';
    
    if (homeScreen.style.display !== 'none') {
        restoreNormalView();
        setTabsVisible(true);
    }
}

function setActiveSection(section) {
    activeSection = section;
    localStorage.setItem('activeSection', section);

    if (hidayahTab && quranTab) {
        hidayahTab.classList.toggle('active', section === 'hidayah');
        quranTab.classList.toggle('active', section === 'quran');
    }

    if (section === 'quran' && typeof quranIndexData !== 'undefined' && typeof quranContentData !== 'undefined') {
        currentIndexData = quranIndexData;
        currentContentData = quranContentData;
    } else {
        currentIndexData = typeof indexData !== 'undefined' ? indexData : [];
        currentContentData = typeof contentData !== 'undefined' ? contentData : {};
    }

    showHomeScreen();
}

function showContent(id) {
    // push/replace history for Content
    if (!__suppressHistory) {
        const isAlreadyOnContent = contentScreen && contentScreen.style.display === 'block';
        try {
            const state = { screen: 'content', id };
            const url = `#content-${id}`;
            if (isAlreadyOnContent) {
                // When moving via Next/Prev, replace instead of pushing a new entry
                history.replaceState(state, '', url);
            } else {
                // First time opening content from Home/Search
                history.pushState(state, '', url);
            }
        } catch {}
    }

    const content = currentContentData[id];
    if (!content) return;
    closeHeaderSearch();

    currentContentId = id;

    // save last-read
    saveLastRead({ section: activeSection, id, title: content.title });

    contentDisplay.innerHTML = `
        <h2>${content.title}</h2>
        ${content.content}
    `;

    hideAllScreens();
    contentScreen.style.display = 'block';
    bookmarkIconBtn.style.display = 'block';
    updateBookmarkIcon();
    updatePrevNextButtons();
    setTabsVisible(false);
    setSearchVisible(false);
    window.scrollTo(0, 0);
}

function showHomeScreen() {
    // Close search if it's active (safety check)
    if (isSearchActive) {
        closeHeaderSearch();
    }

    // If we are navigating back from a detail screen, push a 'home' entry only when coming from non-home
    if (!__suppressHistory) {
        const wasOtherScreen =
            (contentScreen && contentScreen.style.display === 'block') ||
            (bookmarksScreen && bookmarksScreen.style.display === 'block') ||
            (aboutAppScreen && aboutAppScreen.style.display === 'block') ||
            (aboutBookScreen && aboutBookScreen.style.display === 'block') ||
            (contactUsScreen && contactUsScreen.style.display === 'block');
        if (wasOtherScreen) {
            try { history.pushState({ screen: 'home' }, '', '#home'); } catch {}
        }
    }

    hideAllScreens();
    currentContentId = null;

    homeScreen.style.display = 'block';

    // Since we already closed search above, just restore normal view
    restoreNormalView();

    setTabsVisible(true); // show tabs on home
    setSearchVisible(true); // show search on Home
    window.scrollTo(0, 0);
}

function showBookmarks() {
    // push history for Bookmarks
    if (!__suppressHistory) {
        try { history.pushState({ screen: 'bookmarks' }, '', '#bookmarks'); } catch {}
    }

    closeHeaderSearch();

    if (bookmarks.length === 0) {
        bookmarksInlineList.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">${t('bookmarks_empty')}</p>`;
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
    setTabsVisible(false);
    setSearchVisible(false);
    // Only close sidebar UI, don't pop history
    closeSidebar(true);
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
    const content = currentContentData[id];
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
        bookmarkIconBtn.title = t('bookmark_removeTitle');
    } else {
        bookmarkIconBtn.classList.remove('bookmarked');
        bookmarkIconBtn.title = t('bookmark_addTitle');
    }
}

// i18n: UI translations
const I18N_KEY = 'selectedLanguage';
function getLang() {
    return localStorage.getItem(I18N_KEY) || 'roman_ur';
}
function isRTL(lang) {
    // Keep layout LTR for all languages (Urdu text will still render correctly)
    return false;
}
const i18n = {
    en: {
        appTitle: 'Hidayate Aamaal',
        tab_hidayah: 'Basics of Islam',
        tab_quran: 'Quran',
        search_placeholder: 'Search content...',
        contents_title: 'Contents',
        search_results: 'Search Results',
        search_startTyping: 'Start typing to search through the content...',
        search_noResults: 'No results found',
        search_noResultsFor: (q) => `No results found for "${q}"`,
        sidebar_home: 'Home',
        sidebar_darkMode: 'Dark Mode',
        sidebar_language: 'Language',
        sidebar_bookmarks: 'Bookmarks',
        sidebar_share: 'Share App',
        sidebar_about: 'About App',
        sidebar_rateApp: 'Rate this App',
        sidebar_ourApps: 'Our Apps',
        sidebar_contact: 'Contact Us',
        btn_back: 'Back',
        btn_prev: 'Previous',
        btn_next: 'Next',
        bookmarks_title: 'Bookmarks',
        bookmarks_empty: 'No bookmarks added yet.',
        bookmark_addTitle: 'Bookmark this content',
        bookmark_removeTitle: 'Remove bookmark',
        contact_title: 'Contact Us',
        contact_desc: 'We value your feedback and suggestions! If you have any questions, comments, or ideas to improve Hidayate Amaal, please fill out the form below. Your feedback helps us make this app better for everyone.',
        contact_subject: 'Subject:',
        contact_feedback: 'Feedback:',
        contact_submit: 'Submit',
        contact_success: 'Thank you for your feedback!',
        share_copied: 'App link copied to clipboard!',
        // NEW
        continue_reading: 'Continue reading',
        // Tour UI
        tour_next: 'Next',
        tour_skip: 'Skip',
        tour_done: 'Done',
        tour_welcome: 'Welcome to Hidayate Amaal! Let’s take a quick tour.',
        tour_menu: 'Tap here or swipe right to open the menu with bookmarks, language, and more.',
        tour_tabs: 'Switch between Home and Quran using these tabs.',
        tour_search: 'Use search to quickly find any topic.',
        tour_list: 'Browse the list and tap an item to start reading.',
        tour_bookmarks: 'Your saved items (bookmarks) are available here.',
        tour_swipe: 'Tip: On Home, swipe left/right to switch tabs. Right-swipe to open the menu on Tab 1.',
    },
    ur: {
        appTitle: 'ہدایۃ اعمال',
        tab_hidayah: 'اسلام کی بنیاد',
        tab_quran: 'قرآن و دعا',
        search_placeholder: 'مواد تلاش کریں...',
        contents_title: 'فہرست',
        search_results: 'تلاش کے نتائج',
        search_startTyping: 'تلاش شروع کرنے کے لیے لکھنا شروع کریں...',
        search_noResults: 'کوئی نتیجہ نہیں ملا',
        search_noResultsFor: (q) => `’’${q}‘‘ کے لیے کوئی نتیجہ نہیں ملا`,
        sidebar_home: 'ہوم',
        sidebar_darkMode: 'ڈارک موڈ',
        sidebar_language: 'زبان',
        sidebar_bookmarks: 'بک مارکس',
        sidebar_share: 'ایپ شیئر کریں',
        sidebar_about: 'ایپ کے بارے میں',
        sidebar_rateApp: 'ایپ کو درجہ دیں',
        sidebar_ourApps: 'ہماری ایپس',
        sidebar_contact: 'ہم سے رابطہ',
        btn_back: 'واپس',
        btn_prev: 'پچھلا',
        btn_next: 'اگلا',
        bookmarks_title: 'بک مارکس',
        bookmarks_empty: 'ابھی تک کوئی بک مارک نہیں۔',
        bookmark_addTitle: 'اس مواد کو بک مارک کریں',
        bookmark_removeTitle: 'بک مارک ہٹائیں',
        contact_title: 'ہم سے رابطہ',
        contact_desc: 'ہم آپ کی رائے اور تجاویز کی قدر کرتے ہیں! اگر آپ کے پاس کوئی سوالات، تبصرے، یا ایپ کو بہتر بنانے کے لیے کوئی تجاویز ہیں تو براہ کرم فارم بھر دیں۔',
        contact_subject: 'موضوع:',
        contact_feedback: 'رائے:',
        contact_submit: 'جمع کریں',
        contact_success: 'آپ کی رائے کا شکریہ!',
        share_copied: 'ایپ لنک کلپ بورڈ میں کاپی ہو گیا!',
        continue_reading: 'پڑھنا جاری رکھیں',
    },
    roman_ur: {
        appTitle: 'Hidayate Aamaal',
        tab_hidayah: 'Islam ke Buniyaad',
        tab_quran: 'Quran',
        search_placeholder: 'Content talash karein...',
        contents_title: 'Fehrist',
        search_results: 'Search Results',
        search_startTyping: 'Talash ke liye likhna shuru karein...',
        search_noResults: 'Koi nateeja nahin mila',
        search_noResultsFor: (q) => `"${q}" ke liye koi nateeja nahin mila`,
        sidebar_home: 'Home',
        sidebar_darkMode: 'Dark Mode',
        sidebar_language: 'Language',
        sidebar_bookmarks: 'Bookmarks',
        sidebar_share: 'Share App',
        sidebar_about: 'About App',
        sidebar_rateApp: 'Rate this App',
        sidebar_ourApps: 'Our Apps',
        sidebar_contact: 'Contact Us',
        btn_back: 'Back',
        btn_prev: 'Previous',
        btn_next: 'Next',
        bookmarks_title: 'Bookmarks',
        bookmarks_empty: 'Abhi tak koi bookmark nahin.',
        bookmark_addTitle: 'Is content ko bookmark karein',
        bookmark_removeTitle: 'Bookmark hataayein',
        contact_title: 'Contact Us',
        contact_desc: 'Aap ki raye hamare liye ahem hai. Barah-e-karam form bhar kar feedback dein.',
        contact_subject: 'Subject:',
        contact_feedback: 'Feedback:',
        contact_submit: 'Submit',
        contact_success: 'Shukriya, aap ka feedback mil gaya!',
        share_copied: 'App link clipboard par copy ho gaya!',
        continue_reading: 'Continue reading',
    },
    hi: {
        appTitle: 'हिदायते आमाल',
        tab_hidayah: 'इस्लाम की बुनियाद',
        tab_quran: 'क़ुरआन',
        search_placeholder: 'विषय खोजें...',
        contents_title: 'विषय-सूची',
        search_results: 'खोज परिणाम',
        search_startTyping: 'खोजने के लिए टाइप करना शुरू करें...',
        search_noResults: 'कोई परिणाम नहीं मिला',
        search_noResultsFor: (q) => `"${q}" के लिए कोई परिणाम नहीं मिला`,
        sidebar_home: 'होम',
        sidebar_darkMode: 'डार्क मोड',
        sidebar_language: 'भाषा',
        sidebar_bookmarks: 'बुकमार्क',
        sidebar_share: 'ऐप शेयर करें',
        sidebar_about: 'ऐप के बारे में',
        sidebar_rateApp: 'ऐप को रेट करें',
        sidebar_ourApps: 'हमारे ऐप्स',
        sidebar_contact: 'संपर्क करें',
        btn_back: 'वापस',
        btn_prev: 'पिछला',
        btn_next: 'अगला',
        bookmarks_title: 'बुकमार्क',
        bookmarks_empty: 'अभी तक कोई बुकमार्क नहीं जोड़ा गया है।',
        bookmark_addTitle: 'इसे बुकमार्क करें',
        bookmark_removeTitle: 'बुकमार्क हटाएं',
        contact_title: 'संपर्क करें',
        contact_desc: 'हम आपकी प्रतिक्रिया का स्वागत करते हैं। कृपया नीचे दी गई जानकारी भरें।',
        contact_subject: 'विषय:',
        contact_feedback: 'प्रतिक्रिया:',
        contact_submit: 'सबमिट',
        contact_success: 'धन्यवाद! आपकी प्रतिक्रिया प्राप्त हुई।',
        share_copied: 'ऐप लिंक क्लिपबोर्ड पर कॉपी हो गया!',
        continue_reading: 'पढ़ना जारी रखें',
    },
    te: {
        appTitle: 'హిదాయతే ఆమాల్',
        tab_hidayah: 'ఇస్లాం యొక్క పునాదులు',
        tab_quran: 'ఖుర్‌ఆన్',
        search_placeholder: 'కంటెంట్ వెతకండి...',
        contents_title: 'విషయ సూచిక',
        search_results: 'శోధ ఫలితాలు',
        search_startTyping: 'వెతకడానికి టైపింగ్ ప్రారంభించండి...',
        search_noResults: 'ఫలితాలు లభించలేదు',
        search_noResultsFor: (q) => `"${q}" కి ఫలితాలు లభించలేదు`,
        sidebar_home: 'హోమ్',
        sidebar_darkMode: 'డార్క్ మోడ్',
        sidebar_language: 'భాష',
        sidebar_bookmarks: 'బుక్‌మార్కులు',
        sidebar_share: 'యాప్‌ను షేర్ చేయండి',
        sidebar_about: 'యాప్ గురించి',
        sidebar_rateApp: 'యాప్‌కు రేటింగ్ ఇవ్వండి',
        sidebar_ourApps: 'మా యాప్స్',
        sidebar_contact: 'మమ్మల్ని సంప్రదించండి',
        btn_back: 'వెనుకకు',
        btn_prev: 'మునుపటి',
        btn_next: 'తర్వాతి',
        bookmarks_title: 'బుక్‌మార్కులు',
        bookmarks_empty: 'ఇంకా బుక్‌మార్కులు లేవు.',
        bookmark_addTitle: 'దీన్ని బుక్‌మార్క్ చేయండి',
        bookmark_removeTitle: 'బుక్‌మార్క్ తొలగించండి',
        contact_title: 'మమ్మల్ని సంప్రదించండి',
        contact_desc: 'మీ అభిప్రాయం మాకు విలువైనది. దయచేసి ఫారం నింపండి.',
        contact_subject: 'విషయం:',
        contact_feedback: 'అభిప్రాయం:',
        contact_submit: 'సబ్మిట్',
        contact_success: 'ధన్యవాదాలు! మీ అభిప్రాయం అందింది.',
        share_copied: 'యాప్ లింక్ క్లిప్‌బోర్డ్‌లో కాపీ అయింది!',
        continue_reading: 'చదవడం కొనసాగించు',
    },
    te_ur: {
        appTitle: 'హిదాయతే ఆమాల్',
        tab_hidayah: 'ఇస్లాం యొక్క పునాదులు',
        tab_quran: 'ఖుర్‌ఆన్',
        search_placeholder: 'కంటెంట్ వెతకండి...',
        contents_title: 'విషయ సూచిక',
        search_results: 'శోధ ఫలితాలు',
        search_startTyping: 'వెతకడానికి టైపింగ్ ప్రారంభించండి...',
        search_noResults: 'ఫలితాలు లభించలేదు',
        search_noResultsFor: (q) => `"${q}" కి ఫలితాలు లభించలేదు`,
        sidebar_home: 'హోమ్',
        sidebar_darkMode: 'డార్క్ మోడ్',
        sidebar_language: 'భాష',
        sidebar_bookmarks: 'బుక్‌మార్కులు',
        sidebar_share: 'యాప్‌ను షేర్ చేయండి',
        sidebar_about: 'యాప్ గురించి',
        sidebar_rateApp: 'యాప్‌కు రేటింగ్ ఇవ్వండి',
        sidebar_ourApps: 'మా యాప్స్',
        sidebar_contact: 'మమ్మల్ని సంప్రదించండి',
        btn_back: 'వెనుకకు',
        btn_prev: 'మునుపటి',
        btn_next: 'తర్వాతి',
        bookmarks_title: 'బుక్‌మార్కులు',
        bookmarks_empty: 'ఇంకా బుక్‌మార్కులు లేవు.',
        bookmark_addTitle: 'దీన్ని బుక్‌మార్క్ చేయండి',
        bookmark_removeTitle: 'బుక్‌మార్క్ తొలగించండి',
        contact_title: 'మమ్మల్ని సంప్రదించండి',
        contact_desc: 'మీ అభిప్రాయం మాకు విలువైనది. దయచేసి ఫారం నింపండి.',
        contact_subject: 'విషయం:',
        contact_feedback: 'అభిప్రాయం:',
        contact_submit: 'సబ్మిట్',
        contact_success: 'ధన్యవాదాలు! మీ అభిప్రాయం అందింది.',
        share_copied: 'యాప్ లింక్ క్లిప్‌బోర్డ్‌లో కాపీ అయింది!',
        continue_reading: 'చదవడం కొనసాగించు',
    }
};
function t(key, ...args) {
    const lang = getLang();
    const pack = i18n[lang] || i18n.en;
    const val = pack[key] ?? i18n.en[key] ?? key;
    return typeof val === 'function' ? val(...args) : val;
}

// NEW: last-read helpers
function saveLastRead({ section, id, title }) {
    try {
        const map = readLastReadMap();
        map[section] = { id, title, ts: Date.now() };
        localStorage.setItem(LAST_READ_KEY, JSON.stringify(map));
    } catch {}
}

function getLastReadFor(section) {
    const map = readLastReadMap();
    return map[section] || null;
}

// UPDATED: render Continue card only for activeSection and use localized title
function renderContinueCard() {
    const container = document.getElementById('continueContainer');
    if (!container) return;

    const last = getLastReadFor(activeSection);
    if (!last || !last.id) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    // Look up the title from the current language dataset
    let localizedTitle = '';
    try {
        const dataset = currentContentData || {};
        if (dataset && dataset[last.id] && dataset[last.id].title) {
            localizedTitle = dataset[last.id].title; // localized title for current language
        } else if (last.title) {
            // Fallback to stored title if not found in current dataset
            localizedTitle = last.title;
        }
    } catch {
        // ignore lookup errors
    }

    if (!localizedTitle) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div class="continue-card" id="continueCardBtn" role="button" aria-label="${t('continue_reading')}">
            <div class="continue-icon"><i class="fas fa-book-open"></i></div>
            <div class="continue-text">
                <div class="continue-label">${t('continue_reading')}</div>
                <div class="continue-title">${localizedTitle}</div>
            </div>
            <div class="continue-chevron"><i class="fas fa-chevron-right"></i></div>
        </div>
    `;
    container.style.display = 'block';

    const btn = document.getElementById('continueCardBtn');
    if (btn) {
        btn.onclick = () => showContent(last.id);
    }
}

// Apply translations to static UI
function applyI18n() {
    const lang = getLang();
    // Force LTR layout always
    document.documentElement.setAttribute('dir', 'ltr');

    // Header + title + search
    const appTitleEl = document.getElementById('appTitle');
    if (appTitleEl) appTitleEl.textContent = t('appTitle');

    if (headerSearchInput) headerSearchInput.placeholder = t('search_placeholder');

    // Tabs
    const hidayahTabSpan = document.querySelector('#hidayahTab span');
    const quranTabSpan = document.querySelector('#quranTab span');
    if (hidayahTabSpan) hidayahTabSpan.textContent = t('tab_hidayah');
    if (quranTabSpan) quranTabSpan.textContent = t('tab_quran');

    // Remove the contents heading update - it's commented out now

    // Sidebar labels
    const map = [
        ['homeBtn', 'sidebar_home'],
        ['darkModeToggle', 'sidebar_darkMode'],
        ['languageBtn', 'sidebar_language'],
        ['bookmarkBtn', 'sidebar_bookmarks'],
        ['shareBtn', 'sidebar_share'],
        ['aboutAppBtn', 'sidebar_about'],
        ['rateAppBtn', 'sidebar_rateApp'],
        ['ourAppsBtn', 'sidebar_ourApps'],
        ['contactUsBtn', 'sidebar_contact']
    ];
    map.forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const label = el.querySelector('span');
        if (label) label.textContent = t(key);
    });

    // Back + prev/next + bookmark button titles
    const backBtnEl = document.getElementById('backBtn');
    if (backBtnEl) backBtnEl.innerHTML = `<i class="fas fa-arrow-left"></i> ${t('btn_back')}`;
    if (prevContentBtn) prevContentBtn.title = t('btn_prev');
    if (nextContentBtn) nextContentBtn.title = t('btn_next');

    // Bookmarks screen title
    const bmTitle = document.querySelector('#bookmarksScreen h2');
    if (bmTitle) bmTitle.textContent = t('bookmarks_title');

    // Contact Us screen
    const contactTitle = document.querySelector('#contactUsScreen h2');
    if (contactTitle) contactTitle.textContent = t('contact_title');
    const contactDesc = document.querySelector('#contactUsScreen .content-display p');
    if (contactDesc) contactDesc.textContent = t('contact_desc');
    const lblSubject = document.querySelector('label[for="contactSubject"]');
    if (lblSubject) lblSubject.textContent = t('contact_subject');
    const lblMessage = document.querySelector('label[for="contactMessage"]');
    if (lblMessage) lblMessage.textContent = t('contact_feedback');
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    if (submitBtn) submitBtn.textContent = t('contact_submit');
    const contactSuccessMsg = document.getElementById('contactSuccess');
    if (contactSuccessMsg) contactSuccessMsg.textContent = t('contact_success');

    // About App title (keep body text as-is for now)
    const aboutTitle = document.querySelector('#aboutAppScreen h2');
    if (aboutTitle) aboutTitle.textContent = t('sidebar_about');

    // Set initial bookmark icon title according to state
    updateBookmarkIcon();

    // Re-render continue card with localized label for active tab
    renderContinueCard();
}

// Initialize the app
function initializeApp() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.checked = true;
    }

    // Initialize language selection ticks
    updateSidebarLanguageSelection();

    // If datasets are not yet loaded, wait for the bootloader event
    if (!window.__datasetsLoaded) {
        const onReady = () => {
            document.removeEventListener('datasetsReady', onReady);
            const savedSection = localStorage.getItem('activeSection') || 'hidayah';
            setActiveSection(savedSection);
            applyI18n(); // apply UI language after section set
            setupSPAHistory();
        };
        document.addEventListener('datasetsReady', onReady);
        return;
    }

    // Datasets ready: proceed
    const savedSection = localStorage.getItem('activeSection') || 'hidayah';
    setActiveSection(savedSection);
    applyI18n(); // apply UI language
    setupSPAHistory();
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Populate index on load
function populateIndex() {
    indexItems.innerHTML = '';

    if (currentIndexData && currentIndexData.sections) {
        currentIndexData.sections.forEach(section => {
            const sectionTitle = document.createElement('h3');
            sectionTitle.className = 'index-section-title';
            sectionTitle.textContent = section.title;
            indexItems.appendChild(sectionTitle);

            section.items.forEach((item, idx) => {
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
        });
    } else {
        (currentIndexData || []).forEach((item, idx) => {
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
}

// Search functionality
function searchIndex(query) {
    if (!query.trim()) {
        populateIndex();
        return;
    }

    let allItems = [];

    if (currentIndexData && currentIndexData.sections) {
        currentIndexData.sections.forEach(section => {
            allItems = allItems.concat(section.items);
        });
    } else {
        allItems = currentIndexData || [];
    }

    const filteredItems = allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    indexItems.innerHTML = '';

    if (filteredItems.length === 0) {
        indexItems.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">${t('search_noResults')}</p>`;
        return;
    }

    filteredItems.forEach((item, idx) => {
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

// Header Search Functions
function openHeaderSearch() {
    // If already active, just focus
    if (isSearchActive) {
        if (headerSearchInput) headerSearchInput.focus();
        return;
    }

    // Block when sidebar is open or not on Home
    if (sidebar.classList.contains('open') || homeScreen.style.display === 'none') return;

    // Push a 'search' state so hardware back closes search (not the app)
    if (!__suppressHistory) {
        try { history.pushState({ screen: 'search' }, '', '#search'); } catch {}
    }

    isSearchActive = true;
    header.classList.add('search-mode');
    document.body.classList.add('search-mode');
    searchInputContainer.classList.add('active');
    searchBtn.style.display = 'none';
    searchCloseBtn.style.display = 'flex';
    headerSearchInput.focus();

    // Hide tab bar while searching (override any previous inline display)
    setTabsVisible(false);

    if (homeScreen.style.display !== 'none') {
        showSearchPlaceholder();
    }
}

function closeSearch() {
    isSearchActive = false;
    header.classList.remove('search-mode');
    document.body.classList.remove('search-mode');
    searchInputContainer.classList.remove('active');
    searchBtn.style.display = 'flex';
    searchCloseBtn.style.display = 'none';
    headerSearchInput.value = '';
    if (homeScreen.style.display !== 'none') {
        restoreNormalView();
        // Show tab bar again on Home
        setTabsVisible(true);
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
    indexItems.innerHTML = '';
    
    // Add search results heading from the start
    const resultsHeading = document.createElement('h3');
    resultsHeading.className = 'index-section-title';
    resultsHeading.textContent = t('search_results');
    resultsHeading.style.marginTop = '0';
    indexItems.appendChild(resultsHeading);
    
    // Add placeholder message
    const placeholderDiv = document.createElement('div');
    placeholderDiv.className = 'search-results-info';
    placeholderDiv.innerHTML = `
        <i class="fas fa-search"></i>
        <p>${t('search_startTyping')}</p>
    `;
    indexItems.appendChild(placeholderDiv);
}

function restoreNormalView() {
    // NEW: show/update continue card
    renderContinueCard();
    // Don't set contents heading anymore
    populateIndex();
}

function performLiveHeaderSearch(query) {
    let allItems = [];

    if (currentIndexData && currentIndexData.sections) {
        currentIndexData.sections.forEach(section => {
            allItems = allItems.concat(section.items);
        });
    } else {
        allItems = [...(currentIndexData || [])];
    }

    const filteredItems = allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    displayHeaderSearchResults(filteredItems, query);
}

function displayHeaderSearchResults(results, query) {
    indexItems.innerHTML = '';

    const resultsHeading = document.createElement('h3');
    resultsHeading.className = 'index-section-title';
    resultsHeading.textContent = t('search_results');
    resultsHeading.style.marginTop = '0';
    indexItems.appendChild(resultsHeading);

    if (results.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'search-results-info';
        noResultsDiv.innerHTML = `
            <i class="fas fa-search"></i>
            <p>${t('search_noResultsFor', query)}</p>
        `;
        indexItems.appendChild(noResultsDiv);
        return;
    }

    let allItemsWithSerial = [];
    let globalSerial = 1;

    if (currentIndexData && currentIndexData.sections) {
        currentIndexData.sections.forEach(section => {
            section.items.forEach(item => {
                allItemsWithSerial.push({ ...item, serial: globalSerial++ });
            });
        });
    } else {
        (currentIndexData || []).forEach(item => {
            allItemsWithSerial.push({ ...item, serial: globalSerial++ });
        });
    }

    results.forEach(item => {
        const itemWithSerial = allItemsWithSerial.find(i => i.id === item.id);
        const serialNumber = itemWithSerial ? itemWithSerial.serial : '';

        const indexItem = document.createElement('div');
        indexItem.className = 'index-item';
        indexItem.innerHTML = `
            <div class="index-serial">${serialNumber})</div>
            <h4 class="index-title">${highlightSearchTerm(item.title, query)}</h4>
        `;

        indexItem.addEventListener('click', () => {
            showContent(item.id);
            closeHeaderSearch();
        });

        indexItems.appendChild(indexItem);
    });
}

function highlightSearchTerm(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// Update showHomeScreen to handle search and history
function showHomeScreen() {
    // Close search if it's active (safety check)
    if (isSearchActive) {
        closeHeaderSearch();
    }

    // If we are navigating back from a detail screen, push a 'home' entry only when coming from non-home
    if (!__suppressHistory) {
        const wasOtherScreen =
            (contentScreen && contentScreen.style.display === 'block') ||
            (bookmarksScreen && bookmarksScreen.style.display === 'block') ||
            (aboutAppScreen && aboutAppScreen.style.display === 'block') ||
            (aboutBookScreen && aboutBookScreen.style.display === 'block') ||
            (contactUsScreen && contactUsScreen.style.display === 'block');
        if (wasOtherScreen) {
            try { history.pushState({ screen: 'home' }, '', '#home'); } catch {}
        }
    }

    hideAllScreens();
    currentContentId = null;

    homeScreen.style.display = 'block';

    // Since we already closed search above, just restore normal view
    restoreNormalView();

    setTabsVisible(true); // show tabs on home
    setSearchVisible(true); // show search on Home
    window.scrollTo(0, 0);
}

// Update the bookmarkBtn click handler to differentiate from search
function showBookmarksFromSidebar() {
    // Close sidebar UI first, then navigate (prevents popping the new state)
    closeSidebar(true);
    showBookmarks();
}

// Contact Us functions
function showContactUs() {
    // push history for Contact Us
    if (!__suppressHistory) {
        try { history.pushState({ screen: 'contactUs' }, '', '#contact'); } catch {}
    }

    closeHeaderSearch();
    hideAllScreens();
    contactUsScreen.style.display = 'block';
    setTabsVisible(false);
    setSearchVisible(false);
    window.scrollTo(0, 0);
    if (contactSuccess) contactSuccess.style.display = 'none';
    if (contactForm) contactForm.reset();

    // Ensure localized labels visible when entering screen
    applyI18n();
}

// Add a default recipient for feedback emails (change this to your email)
const CONTACT_EMAIL = 'hidayateamaal@gmail.com';

// Handle contact form submit
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const to = CONTACT_EMAIL;
        const subject = (document.getElementById('contactSubject')?.value || '').trim();
        const message = (document.getElementById('contactMessage')?.value || '').trim();

        const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        const gmailWeb = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

        // Try to open mail client / gmail web. Show a transient status then clear it when user returns.
        try {
            // Mobile will usually open the native mail client via mailto
            window.location.href = mailto;
        } catch (err) {
            // ignore
        }

        // Also attempt to open Gmail web in a new tab after a short delay (desktop fallback)
        setTimeout(() => {
            try { window.open(gmailWeb, '_blank'); } catch {}
        }, 500);

        // Show transient status
        if (contactSuccess) {
            contactSuccess.style.display = 'block';
            contactSuccess.textContent = 'Opening Gmail...';
        }

        // Clear function: hide status, reset form & textarea, and remove listeners
        const clearStatus = () => {
            if (contactSuccess) {
                contactSuccess.style.display = 'none';
                contactSuccess.textContent = t('contact_success');
            }

            // Reset form fields so when user returns the form is cleared
            try {
                if (contactForm) {
                    contactForm.reset();
                }
                if (feedbackTextarea) {
                    feedbackTextarea.style.height = '';
                    feedbackTextarea.style.overflowY = 'hidden';
                    requestAnimationFrame(() => autosizeTextarea(feedbackTextarea));
                }
            } catch (e) {
                // ignore reset errors
            }

            // remove listeners and timeout
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisibility);
            clearTimeout(fallbackTimeout);
        };

        const onFocus = () => clearStatus();
        const onVisibility = () => { if (document.visibilityState === 'visible') clearStatus(); };

        // Listen for user returning to the page
        window.addEventListener('focus', onFocus, { once: true });
        document.addEventListener('visibilitychange', onVisibility);

        // safety fallback: hide after 3.5s if focus/visibility didn't fire
        const fallbackTimeout = setTimeout(clearStatus, 3500);
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
    { code: 'te_ur', name: 'Telugu-Urdu', native: 'తెలుగు-ఉర్దూ', flag: '🇮🇳' } // NEW
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
    document.body.classList.toggle('tabs-hidden', !isVisible); // remove tab space when hidden
}

// NEW: control search icon visibility (only on Home)
function setSearchVisible(isVisible) {
    if (!searchBtn) return;
    if (!isVisible) {
        if (isSearchActive) closeHeaderSearch();
        searchBtn.style.display = 'none';
    } else {
        // only show when search is not active
        if (!isSearchActive) searchBtn.style.display = 'flex';
    }
}

// Scroll to Top Button Logic
if (scrollToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Helper: get a flat ordered list of index items across sections
function getLinearIndexItems() {
    if (currentIndexData && currentIndexData.sections) {
        const items = [];
        currentIndexData.sections.forEach(section => {
            if (section && Array.isArray(section.items)) {
                items.push(...section.items);
            }
        });
        return items;
    }
    return Array.isArray(currentIndexData) ? currentIndexData : [];
}

// New: enable/disable and navigate prev/next
function updatePrevNextButtons() {
    if (!prevContentBtn || !nextContentBtn) return;

    const items = getLinearIndexItems();
    const idx = items.findIndex(item => item.id === currentContentId);

    const isFirst = idx <= 0;
    const isLast = idx === -1 || idx >= items.length - 1;

    prevContentBtn.disabled = isFirst;
    nextContentBtn.disabled = isLast;
}

function goToPrevContent() {
    const items = getLinearIndexItems();
    const idx = items.findIndex(item => item.id === currentContentId);
    if (idx > 0) {
        const prevId = items[idx - 1].id;
        showContent(prevId);
    }
}

function goToNextContent() {
    const items = getLinearIndexItems();
    const idx = items.findIndex(item => item.id === currentContentId);
    if (idx !== -1 && idx < items.length - 1) {
        const nextId = items[idx + 1].id;
        showContent(nextId);
    }
}

// After initializeApp on first load, ensure tabs and search visible on home
document.addEventListener('DOMContentLoaded', () => {
    setTabsVisible(true);
    setSearchVisible(true);
    applyI18n(); // ensure UI is localized as soon as DOM ready
});

// Event Listeners
if (hidayahTab) {
    hidayahTab.addEventListener('click', () => {
        if (activeSection !== 'hidayah') {
            if (!__suppressHistory) {
                try { history.pushState({ screen: 'home', tab: 'hidayah' }, '', '#home'); } catch {}
            }
            setActiveSection('hidayah');
        }
    });
}
if (quranTab) {
    quranTab.addEventListener('click', () => {
        if (activeSection !== 'quran') {
            if (!__suppressHistory) {
                try { history.pushState({ screen: 'home', tab: 'quran' }, '', '#home-quran'); } catch {}
            }
            setActiveSection('quran');
        }
    });
}

// SPA History router: map hardware back to in-app navigation
function setupSPAHistory() {
    if (__historySetupDone) return;
    __historySetupDone = true;

    try {
        // Seed history so back from Quran tab returns to Hidayah
        // Base state: Home on Hidayah
        history.replaceState({ screen: 'home', tab: 'hidayah' }, '', '#home');
        // If current section is Quran, push an additional state on top
        if (activeSection === 'quran') {
            history.pushState({ screen: 'home', tab: 'quran' }, '', '#home-quran');
        }
    } catch {}

    window.addEventListener('popstate', (e) => {
        let state = e.state || { screen: 'home' };

        // If we land on the transient 'sidebar' state, just auto-pop it and return
        if (state.screen === 'sidebar') {
            closeSidebar(true);
            try { history.back(); } catch {}
            return;
        }

        // If sidebar is currently open (or we had pushed sidebar), close it due to back
        if (__sidebarStateActive || (sidebar && sidebar.classList.contains('open'))) {
            closeSidebar(true);
        }

        __suppressHistory = true;

        // Close search first if needed
        if (isSearchActive && state.screen === 'home') {
            closeHeaderSearch();
            __suppressHistory = false;
            return;
        }

        switch (state.screen) {
            case 'search':
                openHeaderSearch();
                break;
            case 'content':
                if (typeof state.id !== 'undefined') {
                    showContent(state.id);
                } else {
                    showHomeScreen();
                }
                break;
            case 'bookmarks':
                showBookmarks();
                break;
            case 'aboutApp':
                showAboutApp();
                break;
            case 'contactUs':
                showContactUs();
                break;
            case 'home':
            default:
                // Honor tab if provided; default to Hidayah
                if (state.tab === 'quran') {
                    setActiveSection('quran');
                } else {
                    setActiveSection('hidayah');
                }
                // Ensure we are on the home UI
                showHomeScreen();
                break;
        }

        __suppressHistory = false;
    });
}

// Populate index with sections (only for Hidayah tab)
function populateIndex() {
    indexItems.innerHTML = '';

    if (currentIndexData && currentIndexData.sections) {
        currentIndexData.sections.forEach(section => {
            const sectionTitle = document.createElement('h3');
            sectionTitle.className = 'index-section-title';
            sectionTitle.textContent = section.title;
            indexItems.appendChild(sectionTitle);

            section.items.forEach((item, idx) => {
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
        });
    } else {
        (currentIndexData || []).forEach((item, idx) => {
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
}

// NEW: read/migrate last-read map
function readLastReadMap() {
    try {
        const raw = localStorage.getItem(LAST_READ_KEY);
        if (raw) {
            const obj = JSON.parse(raw);
            // If already a map with section keys, return as-is
            if (obj && (obj.hidayah || obj.quran)) return obj;
        }

        // Migrate old single-entry format if present
        const oldRaw = localStorage.getItem('lastReadItem');
        if (oldRaw) {
            const old = JSON.parse(oldRaw);
            const map = {};
            if (old && old.section && old.id) {
                map[old.section] = {
                    id: old.id,
                    title: old.title,
                    ts: old.ts || Date.now()
                };
            }
            try {
                localStorage.setItem(LAST_READ_KEY, JSON.stringify(map));
                localStorage.removeItem('lastReadItem');
            } catch {}
            return map;
        }

        return {};
    } catch {
        return {};
    }
}

// Populate index on load
function populateIndex() {
    indexItems.innerHTML = '';

    if (currentIndexData && currentIndexData.sections) {
        currentIndexData.sections.forEach(section => {
            const sectionTitle = document.createElement('h3');
            sectionTitle.className = 'index-section-title';
            sectionTitle.textContent = section.title;
            indexItems.appendChild(sectionTitle);

            section.items.forEach((item, idx) => {
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
        });
    } else {
        (currentIndexData || []).forEach((item, idx) => {
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
}

// Override sidebar menu clicks with capture to prevent older handlers from popping history
function wireSidebarMenuOverrides() {
    const safeBind = (el, fn) => {
        if (!el) return;
        el.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // stop other listeners on same target
            // Close sidebar UI only; do not use history.back() here
            closeSidebar(true);
            fn();
        }, true); // capture so this runs before bubble listeners
    };

    safeBind(bookmarkBtn, () => showBookmarks());
    safeBind(aboutAppBtn, () => showAboutApp());
    safeBind(contactUsBtn, () => showContactUs());
    safeBind(homeBtn, () => {
        if (isSearchActive) closeHeaderSearch();
        showHomeScreen();
    });
    safeBind(shareBtn, () => shareApp());
    safeBind(rateAppBtn, () => window.open('https://play.google.com/store/apps/details?id=com.yourapp.hidayateamaal', '_blank'));
    safeBind(ourAppsBtn, () => window.open('https://yourwebsite.com/apps', '_blank'));
}

// Ensure overrides are wired once DOM is ready
document.addEventListener('DOMContentLoaded', wireSidebarMenuOverrides);

// Global tour flag to pause gestures during tour
let __tourActive = false;

// i18n: add tour strings (fallback to English for other languages)
if (i18n && i18n.en) {
    Object.assign(i18n.en, {
        tour_next: 'Next',
        tour_skip: 'Skip',
        tour_done: 'Done',
        tour_welcome: 'Welcome to Hidayate Amaal! Let’s take a quick tour.',
        tour_menu: 'Tap here or swipe right to open the menu with bookmarks, language, and more.',
        tour_tabs: 'Switch between Home and Quran using these tabs.',
        tour_search: 'Use search to quickly find any topic.',
        tour_list: 'Browse the list and tap an item to start reading.',
        tour_bookmarks: 'Your saved items (bookmarks) are available here.',
        tour_swipe: 'Tip: On Home, swipe left/right to switch tabs. Right-swipe to open the menu on Tab 1.',
    });
} else {
    // Fallback (shouldn’t happen, but safe)
    i18n.en = {
        tour_next: 'Next',
        tour_skip: 'Skip',
        tour_done: 'Done',
        tour_welcome: 'Welcome to Hidayate Amaal! Let’s take a quick tour.',
        tour_menu: 'Tap here or swipe right to open the menu with bookmarks, language, and more.',
        tour_tabs: 'Switch between Home and Quran using these tabs.',
        tour_search: 'Use search to quickly find any topic.',
        tour_list: 'Browse the list and tap an item to start reading.',
        tour_bookmarks: 'Your saved items (bookmarks) are available here.',
        tour_swipe: 'Tip: On Home, swipe left/right to switch tabs. Right-swipe to open the menu on Tab 1.',
    };
}

// --- First-time Tour logic ---
(function setupFirstTimeTour() {
    const TOUR_KEY = 'tourSeenVersion';
    const TOUR_VERSION = 1;

    // Elements
    const tourEl = document.getElementById('appTour');
    const hlEl = document.getElementById('tourHighlight');
    const tipEl = document.getElementById('tourTooltip');
    const textEl = document.getElementById('tourText');
    const nextBtn = document.getElementById('tourNextBtn');
    const skipBtn = document.getElementById('tourSkipBtn');

    if (!tourEl || !hlEl || !tipEl || !textEl || !nextBtn || !skipBtn) return;

    let stepIndex = 0;

    const steps = [
        { id: 'welcome', text: () => t('tour_welcome'), target: null, pos: 'center' },
        { id: 'menu', text: () => t('tour_menu'), target: '#hamburgerBtn', pos: 'below' },
        { id: 'tabs', text: () => t('tour_tabs'), target: '#tabNavigation', pos: 'below' },
        { id: 'search', text: () => t('tour_search'), target: '#searchBtn', pos: 'below-right' },
        { id: 'list', text: () => t('tour_list'), target: '#indexItems', pos: 'above' },
        {
            id: 'bookmarks',
            text: () => t('tour_bookmarks'),
            target: '#bookmarkBtn',
            pos: 'right',
            onEnter: () => { if (!sidebar.classList.contains('open')) openSidebar(); },
            onExit: () => { if (sidebar.classList.contains('open')) closeSidebar(true); }
       
        },
        { id: 'swipe', text: () => t('tour_swipe'), target: null, pos: 'center' }
    ];

    function hasSeenTour() {
        try {
            const v = parseInt(localStorage.getItem(TOUR_KEY) || '0', 10);
            return v >= TOUR_VERSION;
        } catch { return false; }
    }

    function markSeen() {
        try { localStorage.setItem(TOUR_KEY, String(TOUR_VERSION)); } catch {}
    }

    function isVisible(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 &&
               rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
               rect.left < (window.innerWidth || document.documentElement.clientWidth);
    }

    function placeTooltip(rect, pos) {
        const margin = 10;
        const tipRect = tipEl.getBoundingClientRect();

        let top, left;

        if (!rect) {
            // Center
            tipEl.style.left = '50%';
            tipEl.style.transform = 'translate(-50%, -50%)';
            return;
        }

        // Reset any transform first
        tipEl.style.transform = 'none';

        switch (pos) {
            case 'below':
                top = rect.bottom + margin;
                left = Math.min(Math.max(rect.left, 8), window.innerWidth - tipRect.width - 8);
                break;
            case 'below-right':
                top = rect.bottom + margin;
                left = Math.min(rect.left, window.innerWidth - tipRect.width - 8);
                break;
            case 'above':
                top = Math.max(rect.top - tipRect.height - margin, 8);
                left = Math.min(Math.max(rect.left, 8), window.innerWidth - tipRect.width - 8);
                break;
            case 'right':
                top = Math.min(Math.max(rect.top, 8), window.innerHeight - tipRect.height - 8);
                left = Math.min(rect.right + margin, window.innerWidth - tipRect.width - 8);
                break;
            default:
                // Fallback: center
                tipEl.style.top = '50%';
                tipEl.style.left = '50%';
                tipEl.style.transform = 'translate(-50%, -50%)';
                return;
        }

        tipEl.style.top = `${top}px`;
        tipEl.style.left = `${left}px`;
    }

    function highlightRect(rect) {
        if (!rect) {
            hlEl.style.display = 'none';
            return;
        }
        hlEl.style.display = 'block';
        hlEl.style.top = `${rect.top - 6}px`;
        hlEl.style.left = `${rect.left - 6}px`;
        hlEl.style.width = `${rect.width + 12}px`;
        hlEl.style.height = `${rect.height + 12}px`;
    }

    function showStep(i) {
        // Cleanup previous step hooks
        const prev = steps[stepIndex];
        if (prev && typeof prev.onExit === 'function') prev.onExit();

        stepIndex = i;

        // Done?
        if (stepIndex >= steps.length) {
            endTour(true);
            return;
        }

        const step = steps[stepIndex];

        textEl.textContent = step.text();
        nextBtn.textContent = (stepIndex === steps.length - 1) ? t('tour_done') : t('tour_next');

        // Ensure we are on Home + Hidayah for most steps
        if (activeSection !== 'hidayah') setActiveSection('hidayah');
        if (isSearchActive) closeHeaderSearch();

        // Find target
        let rect = null;
        if (step.target) {
            const el = document.querySelector(step.target);
            if (el && isVisible(el)) {
                rect = el.getBoundingClientRect();
            }
        }

        // Possibly enter step hook (e.g., open sidebar)
        if (typeof step.onEnter === 'function') step.onEnter();

        // For steps that need sidebar open, re-query the rect after onEnter
        if (!rect && step.target) {
            const el = document.querySelector(step.target);
            if (el && isVisible(el)) rect = el.getBoundingClientRect();
        }

        // Highlight and place tooltip
        highlightRect(rect);
        placeTooltip(rect, rect ? step.pos : 'center');

        // If rect is near bottom/top off screen, try scroll into view
        if (step.target) {
            const el = document.querySelector(step.target);
            if (el && el.scrollIntoView) {
                el.scrollIntoView({ block: 'center', behavior: 'instant' });
                // Recompute after scroll
                const r2 = el.getBoundingClientRect();
                highlightRect(r2);
                placeTooltip(r2, step.pos);
            }
        }
    }

    function startTour() {
        __tourActive = true;
        document.body.classList.add('tour-active');
        // Make overlay visible
        tourEl.style.display = 'block';

        // Localize buttons
        skipBtn.textContent = t('tour_skip');
        nextBtn.textContent = t('tour_next');

        // Start from step 0
        showStep(0);

        // Reposition on resize/orientation
        window.addEventListener('resize', onReposition);
        window.addEventListener('scroll', onReposition, { passive: true });

        // Close on ESC
        document.addEventListener('keydown', onEsc);
    }

    function onReposition() {
        // Re-apply current step
        showStep(stepIndex);
    }

    function onEsc(e) {
        if (e.key === 'Escape') endTour(true);
    }

    function endTour(save) {
        if (save) markSeen();
        // Cleanup
        __tourActive = false;
        document.body.classList.remove('tour-active');
        tourEl.style.display = 'none';
        window.removeEventListener('resize', onReposition);
        window.removeEventListener('scroll', onReposition);
        document.removeEventListener('keydown', onEsc);

        // Ensure sidebar closed if left open by a step
        if (sidebar.classList.contains('open')) closeSidebar(true);
    }

    // Buttons
    nextBtn.addEventListener('click', () => showStep(stepIndex + 1));
    skipBtn.addEventListener('click', () => endTour(true));

    // Public starter (after app init)
    window.__startAppTourIfFirstTime = function() {
        if (hasSeenTour()) return;
        // Delay slightly to ensure layout is ready
        setTimeout(() => startTour(), 350);
    };
})();

// Home tab swipe navigation (now: global right-swipe opens sidebar)
function setupTabSwipeNavigation() {
    const targets = [mainContent, tabNavigation].filter(Boolean);
    if (!targets.length || !hidayahTab || !quranTab) return;

    const H_THRESHOLD = 60;
    const V_TOLERANCE = 30;
    const ACTIVATE_DELTA = 12;

    const isHomeVisible = () => homeScreen && homeScreen.style.display === 'block';

    const canSwipe = () => (
        !sidebar.classList.contains('open') &&
        !isSearchActive &&
        !__tourActive
    );

    function gotoTab(tab) {
        if (tab === 'quran' && activeSection !== 'quran') {
            if (!__suppressHistory) {
                try { history.pushState({ screen: 'home', tab: 'quran' }, '', '#home-quran'); } catch {}
            }
            setActiveSection('quran');
        } else if (tab === 'hidayah' && activeSection !== 'hidayah') {
            if (!__suppressHistory) {
                try { history.pushState({ screen: 'home', tab: 'hidayah' }, '', '#home'); } catch {}
            }
            setActiveSection('hidayah');
        }
    }

    targets.forEach((area) => {
        let startX = 0, startY = 0, lastX = 0, lastY = 0;
        let tracking = false;
        let lockedDir = null;

        area.addEventListener('touchstart', (e) => {
            if (!canSwipe() || !e.touches || e.touches.length !== 1) { tracking = false; return; }
            const t = e.touches[0];
            startX = lastX = t.clientX;
            startY = lastY = t.clientY;
            tracking = true;
            lockedDir = null;
        }, { passive: true });

        area.addEventListener('touchmove', (e) => {
            if (!tracking || !canSwipe() || !e.touches || e.touches.length !== 1) return;
            const t = e.touches[0];
            lastX = t.clientX;
            lastY = t.clientY;

            const dx = lastX - startX;
            const dy = lastY - startY;

            if (!lockedDir) {
                if (Math.abs(dx) > ACTIVATE_DELTA && Math.abs(dy) < ACTIVATE_DELTA) lockedDir = 'h';
                else if (Math.abs(dy) > ACTIVATE_DELTA) lockedDir = 'v';
            }
            if (lockedDir === 'h') e.preventDefault();
        }, { passive: false });

        area.addEventListener('touchend', (e) => {
            if (!tracking) return;
            tracking = false;
            if (!canSwipe()) return;

            const dx = lastX - startX;
            const dy = lastY - startY;
            if (Math.abs(dy) > V_TOLERANCE) return;

            const onHome = isHomeVisible();
            const onContent = contentScreen && contentScreen.style.display === 'block';

            // While reading content: let content swipe handler take over (do nothing here)
            if (onContent) return;

            // On Home + Quran tab, right-swipe switches to Hidayah first
            if (dx >= H_THRESHOLD && onHome && activeSection === 'quran') {
                gotoTab('hidayah');
                return;
            }

            // Left-swipe on Home + Hidayah switches to Quran
            if (dx <= -H_THRESHOLD && onHome && activeSection === 'hidayah') {
                gotoTab('quran');
                return;
            }

            // Otherwise: right-swipe opens the sidebar (global)
            if (dx >= H_THRESHOLD && !sidebar.classList.contains('open')) {
                openSidebar();
                return;
            }
        });
    });
}

// Swipe to close sidebar when it's open (right-to-left)
function setupSidebarSwipeToClose() {
    const areas = [overlay, sidebar].filter(Boolean);
    if (!areas.length) return;

    const H_THRESHOLD = 60;    // min horizontal movement
    const V_TOLERANCE = 30;    // max vertical drift
    const ACTIVATE_DELTA = 12; // to lock direction

    areas.forEach((area) => {
        let startX = 0, startY = 0;
        let lastX = 0, lastY = 0;
        let tracking = false;
        let lockedDir = null; // 'h' or 'v'

        area.addEventListener('touchstart', (e) => {
            if (!sidebar.classList.contains('open') || !e.touches || e.touches.length !== 1) {
                tracking = false;
                return;
            }
            const t = e.touches[0];
            startX = lastX = t.clientX;
            startY = lastY = t.clientY;
            tracking = true;
            lockedDir = null;
        }, { passive: true });

        area.addEventListener('touchmove', (e) => {
            if (!tracking || !sidebar.classList.contains('open') || !e.touches || e.touches.length !== 1) return;

            const t = e.touches[0];
            lastX = t.clientX;
            lastY = t.clientY;

            const dx = lastX - startX;
            const dy = lastY - startY;

            if (!lockedDir) {
                if (Math.abs(dx) > ACTIVATE_DELTA && Math.abs(dy) < ACTIVATE_DELTA) {
                    lockedDir = 'h';
                } else if (Math.abs(dy) > ACTIVATE_DELTA) {
                    lockedDir = 'v';
                }
            }

            if (lockedDir === 'h') {
                e.preventDefault(); // avoid scroll jitter
            }
        }, { passive: false });

        area.addEventListener('touchend', (e) => {
            if (!tracking) return;
            tracking = false;

            if (!sidebar.classList.contains('open')) return;

            const dx = lastX - startX;
            const dy = lastY - startY;

            if (Math.abs(dy) > V_TOLERANCE) return;

            // Right-to-left swipe closes the sidebar
            if (dx <= -H_THRESHOLD) {
                e.preventDefault();
                e.stopPropagation();
                closeSidebar(); // history-aware close
            }
        }, { passive: false });
    });
}

// NEW: Swipe navigation on Content screen (Prev/Next) and suppress sidebar open here
function setupContentSwipeNavigation() {
    if (!contentScreen) return;

    const H_THRESHOLD = 60;    // keep consistent with other gestures
    const V_TOLERANCE = 30;
    const ACTIVATE_DELTA = 12;

    const isReading = () =>
        contentScreen.style.display === 'block' &&
        !sidebar.classList.contains('open') &&
        !isSearchActive &&
        !__tourActive;

    const targets = [contentScreen, contentDisplay].filter(Boolean);

    targets.forEach((targetEl) => {
        let startX = 0, startY = 0, lastX = 0, lastY = 0;
        let tracking = false;
        let lockedDir = null;

        targetEl.addEventListener('touchstart', (e) => {
            if (!isReading() || !e.touches || e.touches.length !== 1) { tracking = false; return; }
            const t = e.touches[0];
            startX = lastX = t.clientX;
            startY = lastY = t.clientY;
            tracking = true;
            lockedDir = null;
        }, { passive: true });

        targetEl.addEventListener('touchmove', (e) => {
            if (!tracking || !isReading() || !e.touches || e.touches.length !== 1) return;

            const t = e.touches[0];
            lastX = t.clientX;
            lastY = t.clientY;

            const dx = lastX - startX;
            const dy = lastY - startY;

            if (!lockedDir) {
                if (Math.abs(dx) > ACTIVATE_DELTA && Math.abs(dy) < ACTIVATE_DELTA) lockedDir = 'h';
                else if (Math.abs(dy) > ACTIVATE_DELTA) lockedDir = 'v';
            }

            if (lockedDir === 'h') {
                // Prevent vertical scroll jitter and stop bubbling to global handlers
                e.preventDefault();
                e.stopPropagation();
            }
        }, { passive: false });

        targetEl.addEventListener('touchend', (e) => {
            if (!tracking) return;
            tracking = false;

            if (!isReading()) return;

            const dx = lastX - startX;
            const dy = lastY - startY;

            // Only act on predominantly horizontal gestures
            if (Math.abs(dy) > V_TOLERANCE) return;

            // Stop bubbling so global sidebar opener doesn't run
            e.stopPropagation();

            if (dx <= -H_THRESHOLD) {
                // Right->Left: Next
                goToNextContent();
                return;
            }
            if (dx >= H_THRESHOLD) {
                // Left->Right: Prev (and DO NOT open sidebar here)
                goToPrevContent();
                return;
            }
        });
    });
}

// Ensure swipes are wired after DOM is ready
document.addEventListener('DOMContentLoaded', setupTabSwipeNavigation);
document.addEventListener('DOMContentLoaded', setupSidebarSwipeToClose);
document.addEventListener('DOMContentLoaded', setupContentSwipeNavigation);

// Disable browser zoom (pinch, key combos, Ctrl+wheel)
function disableBrowserZoom() {
    // Desktop: block Ctrl/⌘ + (+/-/=) and Ctrl/⌘ + 0
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '_', '0'].includes(e.key)) {
            e.preventDefault();
        }
    });

    // Desktop: block pinch (Ctrl+wheel) zoom
    document.addEventListener('wheel', (e) => {
        if (e.ctrlKey) e.preventDefault();
    }, { passive: false });

    // iOS Safari: block gesture-based pinch events
    window.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
    window.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
    window.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });
}

// Initialize zoom disabling after DOM is ready
document.addEventListener('DOMContentLoaded', disableBrowserZoom);

// After initializeApp completes, start tour if first time
document.addEventListener('DOMContentLoaded', () => {
    // Start only when datasets are ready and home is visible
    const tryStart = () => {
        if (typeof window.__startAppTourIfFirstTime === 'function') {
            window.__startAppTourIfFirstTime();
        }
    };
    if (!window.__datasetsLoaded) {
        document.addEventListener('datasetsReady', tryStart, { once: true });
    } else {
        tryStart();
    }
});