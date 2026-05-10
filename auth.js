// Auth State Management
let currentUser = null;

// Ensure DOM is fully loaded before attaching listeners to UI elements we inject
document.addEventListener('DOMContentLoaded', () => {
    setupAuthUI();

    window.firebaseOnAuthStateChanged(window.firebaseAuth, (user) => {
        const authOverlay = document.getElementById('auth-overlay');
        const appContent = document.getElementById('app-content');
        
        if (user) {
            currentUser = user;
            if(authOverlay) authOverlay.classList.add('hidden');
            if(appContent) appContent.classList.remove('hidden');
            window.loadMemoriesFromFirebase(); // Trigger data load
        } else {
            currentUser = null;
            if(authOverlay) authOverlay.classList.remove('hidden');
            if(appContent) appContent.classList.add('hidden');
            // clear local memories
            window.memories = [];
            window.renderAll();
        }
    });
});

function setupAuthUI() {
    // Inject Auth Overlay
    const overlayHtml = `
    <div id="auth-overlay" class="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative border border-slate-100">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-extrabold text-slate-800">Sanjh<span class="text-indigo-600">Diaries</span></h2>
                <p class="text-slate-500 mt-2 text-sm">Sign in to sync your memories to the cloud.</p>
            </div>
            
            <div id="auth-error" class="hidden mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100"></div>

            <div class="space-y-4">
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
                    <input type="email" id="auth-email" placeholder="you@example.com" class="w-full bg-slate-50 rounded-xl p-4 mt-1 border-none focus:ring-2 focus:ring-indigo-500">
                </div>
                <div>
                    <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Password</label>
                    <input type="password" id="auth-password" placeholder="••••••••" class="w-full bg-slate-50 rounded-xl p-4 mt-1 border-none focus:ring-2 focus:ring-indigo-500">
                </div>
                
                <button id="auth-login-btn" onclick="handleLogin()" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl transition-all flex justify-center items-center gap-2">
                    Sign In
                </button>
                
                <div class="text-center mt-4 border-t border-slate-100 pt-4">
                    <p class="text-xs text-slate-500 mb-2">First time here? Since it's private, create your single admin account.</p>
                    <button onclick="handleSignup()" class="text-indigo-600 text-sm font-bold hover:underline">Create Account</button>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', overlayHtml);
    
    // Add logout button to header
    const headerDiv = document.querySelector('header > div:last-child');
    if (headerDiv) {
        headerDiv.insertAdjacentHTML('afterend', `
            <button onclick="window.firebaseSignOut(window.firebaseAuth)" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-200 ml-2 transition-all">Sign Out</button>
        `);
    } else {
        const header = document.querySelector('header');
        if(header) {
           header.insertAdjacentHTML('beforeend', `
            <button onclick="window.firebaseSignOut(window.firebaseAuth)" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-200 ml-2 transition-all">Sign Out</button>
        `); 
        }
    }
}

window.handleLogin = async function() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');
    const btn = document.getElementById('auth-login-btn');

    if(!email || !password) {
        errorEl.textContent = "Please enter email and password.";
        errorEl.classList.remove('hidden');
        return;
    }

    try {
        btn.innerHTML = `<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Signing In...`;
        btn.disabled = true;
        await window.firebaseSignInWithEmailAndPassword(window.firebaseAuth, email, password);
        errorEl.classList.add('hidden');
    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    } finally {
        btn.innerHTML = `Sign In`;
        btn.disabled = false;
    }
};

window.handleSignup = async function() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');

    if(!email || !password) {
        errorEl.textContent = "Please enter email and password.";
        errorEl.classList.remove('hidden');
        return;
    }

    try {
        await window.firebaseCreateUserWithEmailAndPassword(window.firebaseAuth, email, password);
        errorEl.classList.add('hidden');
    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    }
};
