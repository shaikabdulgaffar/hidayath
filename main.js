// Index data for navigation
const indexData = [
    { id: 1, title: "Aqeeda (Hamare Islami Aqeeday)" },
    { id: 2, title: "Iman-e-Mujmal aur Iman-e-Mufassal" },
    { id: 3, title: "Islam ki buniyaad 5 sutuno par hai" },
    { id: 4, title: "Islaam ke Maheene" },
    { id: 5, title: "Islaam ke Khusoosi Din aur Raate" },
    { id: 6, title: "4 Muqarrab aur Mashhoor Farishte" },
    { id: 7, title: "Islami Istilahaat aur Taarufaat(Terms & Definitions)" },
    { id: 8, title: "Faraz, Waajib, Sunnat Aur Nafil Kise Kahete Hai?" },
    { id: 9, title: "Islaam ke 5 Kalime" },
    { id: 10, title: "Mashhoor Aasmaani Kitaabon ke Naam aur Wo Kin Par Naazil Huvi" },
    { id: 11, title: "Huzoor ﷺ Ka Naam, Nasab Aur Khaandaan" },
    { id: 12, title: "Gusul ke Faraaiz, Waajibaat, Sunnatein, Mustahabbaat, Makroohaat aur Masaail" },
    { id: 13, title: "Wazu ke Faraaiz, Sunnatein, Mustahabbaat, Makroohaat aur Duaayein" },
    { id: 14, title: "Wazu ko Todne Waali 8 Cheezein, Wazu ke Masaail aur Wazu kab Farz, Waajib, Sunnat, Mustahab hota hai" },
    { id: 15, title: "Tayammum: Kab Jaayiz, Kis Par, Faraaiz, Tootne Wali Cheezein aur Masaail" },
    { id: 16, title: "Miswaak ke Fazaail, Tariqa, Dua aur Adaab" },
    { id: 17, title: "Namaazo ki Tedaad aur Rakaate" },
    { id: 18, title: "Namaaz ke Faraaiz, Waajibaat, Sunnate, Mustahabbaat, Makroohaat, Mufsidaat aur Masaail" },
    { id: 19, title: "Namaaz Padhne ka Tariqa" },
    { id: 20, title: "Sajda-e-Sahu ka Bayaan aur Waajib Hone ke Usool" },
    { id: 21, title: "Ramzanul Mubaarak ki Makhsoos Duaaye" },
    { id: 59, title: "Duaaye Qubool Hone ki Shakle" },
    { id: 65, title: "Qasar Namaaz Ka Tariqa, Masaafate Safar aur Masaail" },
    { id: 68, title: "Qaza Namaaz Ko Adaa Karne Ka Tariqa" },
    { id: 69, title: "Juma Ke Din Ke Ahekaam" },
    { id: 70, title: "Jumma Ka Khutba: Khutbaaye Awwal aur Saaniya" },
    { id: 71, title: "Namaaze Eidain ka Tariqa" },
    { id: 72, title: "Salaatut Tasbih Namaaz ka Tariqa" },
    { id: 73, title: "Namaaze Istekharah ka Tariqa" },
    { id: 74, title: "Nafil Namaazo ke Auqat aur Fazaail" },
    { id: 75, title: "Janaaze ki Namaaz ka Tariqa" },
    { id: 76, title: "Tableeg ke Alfaaz ke Maani" },
    { id: 77, title: "Ameer ki Itaat" },
    { id: 78, title: "Mashure ka Maqsad" },
    { id: 81, title: "Taleem ke Adaab" },
    { id: 82, title: "Rawaangi ke Adaab" },
    { id: 83, title: "Taarufi Baat" },
    { id: 84, title: "Faza-ile Zikar" },
    { id: 85, title: "Gashth ke Adaab" },
    { id: 86, title: "Che (6) Sifaat" },
    { id: 87, title: "Muqaami 5 Kaam" },
    { id: 88, title: "Allaah ke Raaste me Nikal Kar 16 Baato ke Daayire Me Chale" },
    { id: 89, title: "Allaah ke Raaste ke Ijtemaayi Aamaal 8 hai" },
    { id: 90, title: "Khaana Khaane ke Adaab" },
    { id: 91, title: "Khaana Khaane Me Bhi 6 Sifaath Hai" },
    { id: 92, title: "Sone ke Adaab" },
    { id: 93, title: "Nafs Ko Qaabu Me Rakhne ke Liye Allaah ke Raaste Me Mujaahida" },
    { id: 94, title: "Daayi ke Sifaath" },
    { id: 95, title: "Daayi 24 Ghante Waali Zindagi Kis Tarah Guzaare" },
    { id: 96, title: "Daawath Waale Kaam Ke Behetareen Usool" },
    { id: 97, title: "Taalibe Ilm Kis Tarah Rahe?" },
    { id: 98, title: "Allaah Ko Bando Ki 3 Cheeze Pasand Hai" },
    { id: 99, title: "Qiyaamat Ke Din Allaah Ke Arsh Ke Saaye Me Rahene Waale 7 Qisam Ke Log" },
    { id: 100, title: "Allaah Ta-aala Ko 5 Qisam Ke Aadmi Se Nafrat Hai" },
    { id: 101, title: "Qiyaamat Ke Din 3 Shakhso Ko Rahemat Ki Nigaah Se Na Dekhenge" },
    { id: 102, title: "Allaah Ta-aala 3 Shakhso Par Laanat Bhejte Hai" },
    { id: 103, title: "Jis Shakhs Me 3 Baate Ho Allaah Ta-aala Uska Hisaab Aasaan Karege" },
    { id: 104, title: "Imaan Ke Darje" },
    { id: 105, title: "Imaan Ki Halaawat 3 Cheezo Se Hai" },
    { id: 106, title: "Huzoor Swallellaahu-alaihi Wasallam Ki Nasihate" },
    { id: 107, title: "Huzoor Swallel-laahu-alaihi Wasallam Ka Irshaad: Rozaana Aasmaan Se 5 Farishte Elaan Karte Hai" },
    { id: 108, title: "Hazrat Umar (Raziyallaahu anhu) Ki 6 Nasihate" },
    { id: 109, title: "3 Cheeze 3 Cheezo Par Gaalib Ho Jaati Hai" },
    { id: 110, title: "Jis Shaks Ko 4 Cheeze Mil Jaaye Usko Deen Wa Duniya Ki Bhalaayi Mil Jaati Hai" },
     { id: 111, title: "Duniya Se Us Waqth Tak Mehefooz Nahi Rahe-Sakte Jab Tak Tum Me 4 Cheeze Na Ho" },
    { id: 112, title: "Qiyaamat Ke Din 3 Adaalate" },
    { id: 113, title: "Badd Bakhti Ki 4 Alaamate" },
    { id: 114, title: "4 Cheeze Aadmi Ke Dil Ko Barbaad Kar Deti Hai" },
    { id: 115, title: "Sahaabah (Raziyallaahu anhum) Ka 4 Cheezo Se Bahut Ehtiyaat Aur 5 Cheezo Par Mashgooli" },
    { id: 116, title: "Hikmat Ko Paane Ke Liye 4 Cheeze" },
    { id: 117, title: "Sone Ki Ek Takhti Thi Jis Me 7 Satre Likhi Huvi Thi" },
    { id: 118, title: "Shek Abdul Qaadar Jilaani Mahabube Subahaani (Rahematullaahi Alaih) Ka Farmaan" },
    { id: 119, title: "Hazrat Sufiyaan Sauri (Rahematullaahi Alaih) Ka Farmaan: 10 Aadmi Zaalim Kahelaayenge" },
    { id: 120, title: "Hazrat Shekh Shah Makki (Rahematullaahi Alaih) Ka Farmaan: Insaan Ko 5 Tarah Se Loot Lete Hai" },
    { id: 121, title: "5 Cheezo Ko Ganimat Samjho 5 Cheeze Aane Se Pahele" },
    { id: 122, title: "Hazrat Hasan (Raziyallaahu anhu) Ki Nasihate" },
    { id: 123, title: "Andhere 5 Aur Uske Chiraag 5" },
    { id: 124, title: "Rona 7 Waje Se Aata Hai" },
    { id: 125, title: "Hazrat Maulana Ilyaas Saahab (Rahematullahi Alaih) Ka Farmaan" },
    { id: 126, title: "Hazrat Maulana Yusuf Saahab (Rahematullahi Alaih) Ka Farmaan: Allaah Ta'aala 5 Cheezo Ko 5 Jage Chupa Kar Rakhkha Hai" },
    { id: 127, title: "Hazrat Maulana Saab Saahad Kandhalwi Ka Farmaan" },
    { id: 128, title: "Hazrat Maulana Umar Paalanpoori (Rahematullahi Alaih) Ka Farmaan: 4 Shaks Aakhirat Me Hilaak Hojaayenge" },
    { id: 129, title: "Hazrat Maulana Inaamul Hasan Saahab (Rahematullahi Alaih) Ka Farmaan" },
    { id: 130, title: "Hazrat Maulana Sayeed Ahmad Khaan Saahab (Rahematullahi Alaih) Ka Farmaan: Isteqaamat Ke 17 Asbaab" },
    { id: 131, title: "Hazrat Ahmad Laat Saahab Ka Farmaan: Neheze Nabuwwat Ka Kaam Karne Ke Liye 5 Sifaat" },
    { id: 132, title: "Hazrat Maulana Farooq Saahab Ka Farmaan: 5 Baate Jisse Dil Jud Jaate Hai" },
    { id: 133, title: "Hazrat Abdul Wahhaab Saahab Ka Farmaan: 5 Baate Jin Se Kabhi Bhi Toda Paida Nahi Hoga" },
    { id: 134, title: "Hira Aur Uska Chor" },
    { id: 135, title: "Chand Cheeze, Chand Cheezo Ko Barbaad Kar Deti Hai" },
    { id: 136, title: "Khaas Karke Be-Deeni Ki Taraf Maail Karne Waali 2 Cheeze" },
    { id: 137, title: "Asbaab Ek Zariya Hai — Allaah Ke Hukum Se Sab Kuch Hota Hai" },
    { id: 138, title: "Halaal Jaanwaro Me 7 Cheeze Haraam Hai" },
    { id: 139, title: "Maa Baap Ka Darja" },
    { id: 140, title: "Nikaah Karne Ka Tariqa" },
    { id: 141, title: "Mobile Phone Ke Masaa'il" },
    { id: 142, title: "Huzoor Swallellaahu-alaihi Wasallam Ki Chand Sunnate" },
    { id: 143, title: "Shohar Par Biwi Ke 5 Huqooq" },
    { id: 144, title: "Aurato Ki Namaaz Ka Tariqa" },
    { id: 145, title: "Aurat Ke Liye Shareeat Me Parde Ke 3 Darje" },
    { id: 146, title: "Masturaat Ke 24 Ghante Ke Mukhtasar Kaam" },
    { id: 147, title: "Ashra aur Chille Me Jaaane Waale Masturaat Jamaat Ke Har Jode Ke Liye Zaroori Cheeze" },
    { id: 148, title: "Masturaat Ke Liye Mashure Ka Parcha (Example)" },
    { id: 149, title: "Hadeese Paak aur Haq Waale Akaabir ki Roshni me Aurato ki Khidmat aur Unki Fazilate" },
    { id: 150, title: "Gutka Khaawo Ek Se Badkar Ek Inaam Paawo" }
];

const motivationalHadiths = [
    {
        text: "طلب العلم فريضة على كل مسلم",
        translation: "Seeking knowledge is an obligation upon every Muslim.",
        ref: "Ibn Majah"
    },
    {
        text: "من سلك طريقًا يلتمس فيه علمًا سهل الله له به طريقًا إلى الجنة",
        translation: "Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise.",
        ref: "Muslim"
    },
    {
        text: "الدين النصيحة",
        translation: "Religion is sincere advice.",
        ref: "Muslim"
    },
    {
        text: "أفضل الأعمال أن تدخل السرور على قلب مسلم",
        translation: "The best of deeds is to bring happiness to the heart of a Muslim.",
        ref: "Tabarani"
    },
    {
        text: "الإيمان بضع وسبعون شعبة، أعلاها قول لا إله إلا الله، وأدناها إماطة الأذى عن الطريق",
        translation: "Faith has over seventy branches, the highest is saying 'La ilaha illallah', and the lowest is removing harm from the road.",
        ref: "Bukhari & Muslim"
    }
];

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
    currentContentId = null;
    showMotivationalHadith();
    window.scrollTo(0, 0);
}

// ...existing code...
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
const backBtn = document.getElementById('backBtn');
const bookmarksBackBtn = document.getElementById('bookmarksBackBtn');
const contentDisplay = document.getElementById('contentDisplay');
const indexItems = document.getElementById('indexItems');
const bookmarkIconBtn = document.getElementById('bookmarkIconBtn');
const bookmarksModal = document.getElementById('bookmarksModal');
const bookmarksList = document.getElementById('bookmarksList');
const bookmarksInlineList = document.getElementById('bookmarksInlineList');

// State
let currentContentId = null;
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

// Event Listeners
hamburgerBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);
themeToggle.addEventListener('change', toggleTheme);
shareBtn.addEventListener('click', shareApp);
aboutAppBtn.addEventListener('click', () => openModal('aboutAppModal'));
aboutBookBtn.addEventListener('click', () => openModal('aboutBookModal'));
bookmarkBtn.addEventListener('click', showBookmarks);
backBtn.addEventListener('click', showHomeScreen);
bookmarksBackBtn.addEventListener('click', showHomeScreen);
bookmarkIconBtn.addEventListener('click', toggleBookmark);

// Close modals
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modalId = e.target.getAttribute('data-modal');
        closeModal(modalId);
    });
});

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
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

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    closeSidebar();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showContent(id) {
    const content = contentData[id];
    if (!content) return;

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
    contentScreen.style.display = 'block';
    bookmarkIconBtn.style.display = 'block';
    
    updateBookmarkIcon();
    window.scrollTo(0, 0);
}

function showHomeScreen() {
    homeScreen.style.display = 'block';
    contentScreen.style.display = 'none';
    bookmarksScreen.style.display = 'none';
    currentContentId = null;
    window.scrollTo(0, 0);
}

function showBookmarks() {
    if (bookmarks.length === 0) {
        bookmarksInlineList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No bookmarks added yet.</p>';
    } else {
        bookmarksInlineList.innerHTML = '';
        bookmarks.forEach(bookmark => {
            const bookmarkItem = document.createElement('div');
            bookmarkItem.className = 'bookmark-item';
            bookmarkItem.innerHTML = `
                <h4>${bookmark.title}</h4>
                <button onclick="removeBookmark(${bookmark.id})" style="float: right; background: var(--accent-color); color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            bookmarkItem.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    showContent(bookmark.id);
                }
            });
            bookmarksInlineList.appendChild(bookmarkItem);
        });
    }

    homeScreen.style.display = 'none';
    contentScreen.style.display = 'none';
    bookmarksScreen.style.display = 'block';
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

// Initialize the app
function initializeApp() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

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

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    // Escape key to close sidebar or go back
    if (event.key === 'Escape') {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        } else if (contentScreen.style.display === 'block') {
            showHomeScreen();
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
