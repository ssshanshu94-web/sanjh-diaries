// Auth State Management
let currentUser = null;

// Fake auth object to make db.js happy
window.firebaseAuth = {
    get currentUser() {
        return currentUser ? { uid: 'shanshu_admin' } : null;
    }
};

// Ensure DOM is fully loaded before attaching listeners
document.addEventListener('DOMContentLoaded', () => {
    setupAuthUI();
    checkLoginState();
});

function checkLoginState() {
    const isLoggedIn = localStorage.getItem('sanjh_logged_in') === 'true';
    const authOverlay = document.getElementById('auth-overlay');
    const appContent = document.getElementById('app-content');
    
    if (isLoggedIn) {
        currentUser = { uid: 'shanshu_admin' };
        if(authOverlay) authOverlay.classList.add('hidden');
        if(appContent) appContent.classList.remove('hidden');
        window.loadMemoriesFromFirebase(); // Trigger data load
    } else {
        currentUser = null;
        if(authOverlay) authOverlay.classList.remove('hidden');
        if(appContent) appContent.classList.add('hidden');
        window.memories = [];
        if (window.renderAll) window.renderAll();
    }
}

function setupAuthUI() {
    // Inject Auth Overlay
    const overlayHtml = `
    <div id="auth-overlay" class="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-slate-100">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-extrabold text-slate-800">Sanjh<span class="text-indigo-600">Diaries</span></h2>
                <p class="text-slate-500 mt-2 text-sm">Enter password to view your memories.</p>
            </div>
            
            <div id="auth-error" class="hidden mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100"></div>

            <div class="space-y-4">
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
                    <input type="password" id="auth-password" placeholder="••••••••" class="w-full bg-slate-50 rounded-xl p-4 mt-1 border-none focus:ring-2 focus:ring-indigo-500">
                </div>
                
                <button id="auth-login-btn" onclick="handleLogin()" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl transition-all flex justify-center items-center gap-2">
                    Enter
                </button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', overlayHtml);
    
    // Add logout button to header
    const headerDiv = document.querySelector('header > div:last-child');
    if (headerDiv) {
        headerDiv.insertAdjacentHTML('afterend', `
            <button onclick="handleLogout()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-200 ml-2 transition-all">Log Out</button>
        `);
    } else {
        const header = document.querySelector('header');
        if(header) {
           header.insertAdjacentHTML('beforeend', `
            <button onclick="handleLogout()" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-200 ml-2 transition-all">Log Out</button>
        `); 
        }
    }
}

window.handleLogin = function() {
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');

    if(password === "shanshu") {
        localStorage.setItem('sanjh_logged_in', 'true');
        errorEl.classList.add('hidden');
        checkLoginState();
    } else {
        errorEl.textContent = "Incorrect password. Please try again.";
        errorEl.classList.remove('hidden');
    }
};

window.handleLogout = function() {
    localStorage.removeItem('sanjh_logged_in');
    checkLoginState();
};
