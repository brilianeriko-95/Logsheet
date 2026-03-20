/**
 * Turbine Log PWA - Main Application
 * Version: 1.6.1 (with Photo Feature from v1.7.1)
 * Description: Logsheet dengan fitur foto validasi parameter
 */

// ============================================
// 1. CONFIGURATION & CONSTANTS
// ============================================

const APP_VERSION = '1.6.2';
const APP_NAME = 'Turbine Log';
const GAS_URL = 'https://script.google.com/macros/s/AKfycby3cp1kW1LoS4xX0zbbLpxiR5W4lRk_cT0x2q1p1QpI/dev';

const DRAFT_KEYS = {
    LOGSHEET: 'turbine_logsheet_draft',
    LOGSHEET_OFFLINE: 'turbine_logsheet_offline',
    TPM: 'turbine_tpm_draft',
    TPM_OFFLINE: 'turbine_tpm_offline',
    TPM_HISTORY: 'turbine_tpm_history',
    BALANCING: 'turbine_balancing_draft',
    BALANCING_OFFLINE: 'turbine_balancing_offline',
    BALANCING_HISTORY: 'turbine_balancing_history'
};

const DRAFT_KEYS_CT = {
    LOGSHEET: 'ct_logsheet_draft',
    OFFLINE: 'ct_logsheet_offline'
};

// PHOTO DRAFT KEYS - NEW from v1.7.1
const PHOTO_DRAFT_KEYS = {
    LOGSHEET_PHOTOS: 'turbine_logsheet_photos',
    CT_LOGSHEET_PHOTOS: 'ct_logsheet_photos'
};

const AUTH_CONFIG = {
    SESSION_KEY: 'turbine_auth_session',
    SESSION_DURATION: 12 * 60 * 60 * 1000,
    USERS_CACHE_KEY: 'turbine_users_cache',
    CACHE_DURATION: 24 * 60 * 60 * 1000
};

const AREAS = {
    'STEAM TURBINE': [
        'Load (MW)', 'Ekspor/Impor (MW)', 'PLN (MW)', 'UBB (MW)', 'PIE (MW)',
        'TG-65 (MW)', 'TG-66 (MW)', 'GTG (MW)', 'SS-6500 (MW)',
        'SS-2000 Active Power (MW)', 'SS-2000 Reactive Power (MVAR)',
        'SS-2000 Current S (A)', 'SS-2000 Voltage (V)', 'SS-2000 HVS65 L02 (MW)',
        'SS-2000 HVS65 L02 Current (A)', 'Total 3B (MW)'
    ],
    'STEAM FLOW': [
        'Produksi Steam SA (t/h)', 'STG Steam (t/h)', 'PA2 Steam (t/h)',
        'Puri2 Steam (t/h)', 'Melter SA2 (t/h)', 'Ejector (t/h)',
        'Gland Seal (t/h)', 'Deaerator (t/h)', 'Dump Condenser (t/h)',
        'PCV-6105 (t/h)', 'Total Konsumsi Steam (t/h)', 'LPS Balance (t/h)'
    ],
    'STEAM PRESSURE': [
        'Steam Extraction PI-6122 (kg/cm2)', 'Steam Extraction TI-6112 (C)',
        'Temp. Cooling Air Inlet TI-6146 (C)', 'Temp. Cooling Air Inlet TI-6147 (C)',
        'Temp. Lube Oil TI-6126 (C)', 'Axial Displacement (mm)',
        'Vibrasi VI-6102 (Î¼m)', 'Temp. Journal Bearing TE-6134 (C)'
    ],
    'COOLING TOWER SU': [
        'CT SU Fan 1', 'CT SU Fan 2', 'CT SU Fan 3', 'CT SU Fan 4',
        'CT SU Pompa 1', 'CT SU Pompa 2', 'CT SU Pompa 3', 'CT SU Pompa 4'
    ],
    'COOLING TOWER SA': [
        'CT SA Fan 1', 'CT SA Fan 2', 'CT SA Fan 3', 'CT SA Fan 4',
        'CT SA Pompa 1', 'CT SA Pompa 2', 'CT SA Pompa 3', 'CT SA Pompa 4'
    ]
};

const AREAS_CT = {
    'CT UNIT 1': [
        'Fan 1 Status (A/M)', 'Fan 1 Running/Stop',
        'Fan 2 Status (A/M)', 'Fan 2 Running/Stop',
        'Pompa 1 Status (A/M)', 'Pompa 1 Running/Stop',
        'Pompa 2 Status (A/M)', 'Pompa 2 Running/Stop',
        'Inlet Temperature (C)', 'Outlet Temperature (C)',
        'Pressure (kg/cm2)', 'Flow Rate (m3/h)'
    ],
    'CT UNIT 2': [
        'Fan 1 Status (A/M)', 'Fan 1 Running/Stop',
        'Fan 2 Status (A/M)', 'Fan 2 Running/Stop',
        'Pompa 1 Status (A/M)', 'Pompa 1 Running/Stop',
        'Pompa 2 Status (A/M)', 'Pompa 2 Running/Stop',
        'Inlet Temperature (C)', 'Outlet Temperature (C)',
        'Pressure (kg/cm2)', 'Flow Rate (m3/h)'
    ],
    'CT UNIT 3': [
        'Fan 1 Status (A/M)', 'Fan 1 Running/Stop',
        'Fan 2 Status (A/M)', 'Fan 2 Running/Stop',
        'Pompa 1 Status (A/M)', 'Pompa 1 Running/Stop',
        'Pompa 2 Status (A/M)', 'Pompa 2 Running/Stop',
        'Inlet Temperature (C)', 'Outlet Temperature (C)',
        'Pressure (kg/cm2)', 'Flow Rate (m3/h)'
    ],
    'CT UNIT 4': [
        'Fan 1 Status (A/M)', 'Fan 1 Running/Stop',
        'Fan 2 Status (A/M)', 'Fan 2 Running/Stop',
        'Pompa 1 Status (A/M)', 'Pompa 1 Running/Stop',
        'Pompa 2 Status (A/M)', 'Pompa 2 Running/Stop',
        'Inlet Temperature (C)', 'Outlet Temperature (C)',
        'Pressure (kg/cm2)', 'Flow Rate (m3/h)'
    ]
};

const TPM_AREAS = [
    'Steam Turbine Area',
    'Generator Area',
    'Lube Oil System',
    'Control Room',
    'Cooling Tower Area',
    'Switchgear Area'
];

const INPUT_TYPES = {
    'STATUS': {
        patterns: ['Status (A/M)', 'Running/Stop', 'ON/OFF'],
        options: {
            'Status (A/M)': ['Auto', 'Manual'],
            'Running/Stop': ['Running', 'Stop', 'Standby'],
            'ON/OFF': ['ON', 'OFF']
        }
    }
};

const BALANCING_FIELDS = [
    'balancingDate', 'balancingTime', 'loadMW', 'eksporMW',
    'plnMW', 'ubbMW', 'pieMW', 'tg65MW', 'tg66MW', 'gtgMW',
    'ss6500MW', 'ss2000Via', 'activePowerMW', 'reactivePowerMVAR',
    'currentS', 'voltageV', 'hvs65l02MW', 'hvs65l02Current', 'total3BMW',
    'fq1105', 'stgSteam', 'pa2Steam', 'puri2Steam', 'melterSA2',
    'ejectorSteam', 'glandSealSteam', 'deaeratorSteam', 'dumpCondenser', 'pcv6105',
    'pi6122', 'ti6112', 'ti6146', 'ti6126', 'axialDisplacement',
    'vi6102', 'te6134', 'ctSuFan', 'ctSuPompa', 'ctSaFan', 'ctSaPompa',
    'kegiatanShift'
];

// ============================================
// 2. STATE MANAGEMENT
// ============================================

let currentUser = null;
let usersCache = null;
let currentInput = {};
let currentInputCT = {};
let lastData = {};
let lastDataCT = {};
let activeArea = '';
let activeIdx = 0;
let activeAreaCT = '';
let activeIdxCT = 0;
let currentInputType = 'text';
let currentInputTypeCT = 'text';
let currentShift = 1;
let uploadProgressInterval = null;
let currentUploadController = null;
let balancingAutoSaveInterval = null;
let deferredPrompt = null;
let installBannerShown = false;

// Photo state variables - NEW from v1.7.1
let currentParamPhoto = null;
let paramPhotos = {};
let currentCTParamPhoto = null;
let ctParamPhotos = {};

// TPM State
let activeTPMArea = '';
let currentTPMPhoto = null;
let currentTPMStatus = '';

// ============================================
// 3. INITIALIZATION
// ============================================

function initState() {
    try {
        const savedDraft = localStorage.getItem(DRAFT_KEYS.LOGSHEET);
        if (savedDraft) {
            try {
                currentInput = JSON.parse(savedDraft);
            } catch (e) {
                currentInput = {};
            }
        }
        
        const savedCTDraft = localStorage.getItem(DRAFT_KEYS_CT.LOGSHEET);
        if (savedCTDraft) {
            try {
                currentInputCT = JSON.parse(savedCTDraft);
            } catch (e) {
                currentInputCT = {};
            }
        }
        
        // Load photo drafts - NEW from v1.7.1
        loadParamPhotosFromDraft();
        loadCTParamPhotosFromDraft();
    } catch (e) {
        console.error('Error in initState:', e);
        currentInput = {};
        currentInputCT = {};
        paramPhotos = {};
        ctParamPhotos = {};
    }
}

// ============================================
// 4. AUTHENTICATION
// ============================================

function initAuth() {
    try {
        const session = getSession();
        if (session && session.user) {
            const now = Date.now();
            if (now < session.expiresAt) {
                currentUser = session.user;
                showMainApp();
                return;
            } else {
                clearSession();
            }
        }
        showLoginScreen();
    } catch (e) {
        console.error('Error in initAuth:', e);
        showLoginScreen();
    }
}

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_CONFIG.SESSION_KEY));
    } catch (e) {
        return null;
    }
}

function saveSession(user) {
    const session = {
        user: user,
        createdAt: Date.now(),
        expiresAt: Date.now() + AUTH_CONFIG.SESSION_DURATION
    };
    localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
    localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
}

function showLoginScreen() {
    navigateTo('loginScreen');
}

function showMainApp() {
    navigateTo('homeScreen');
    updateUserInfo();
    fetchLastData();
    fetchLastDataCT();
}

function updateUserInfo() {
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const headerUserName = document.getElementById('headerUserName');
    
    if (currentUser) {
        if (userName) userName.textContent = currentUser.name || currentUser.username;
        if (userRole) userRole.textContent = currentUser.role === 'admin' ? 'Administrator' : 'Operator';
        if (headerUserName) headerUserName.textContent = currentUser.name || currentUser.username;
    }
}

function requireAuth() {
    if (!currentUser) {
        showCustomAlert('Silakan login terlebih dahulu', 'error');
        showLoginScreen();
        return false;
    }
    return true;
}

function logoutOperator() {
    clearSession();
    currentUser = null;
    showLoginScreen();
    showCustomAlert('Berhasil logout', 'success');
}

// ============================================
// 5. NAVIGATION
// ============================================

function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    if (screenId === 'logsheetScreen') {
        renderMenu();
    } else if (screenId === 'ctLogsheetScreen') {
        renderCTMenu();
    } else if (screenId === 'tpmScreen') {
        renderTPMAreas();
    } else if (screenId === 'balancingScreen') {
        initBalancingScreen();
    }
}

function goBackToHome() {
    navigateTo('homeScreen');
}

// ============================================
// 6. UI COMPONENTS
// ============================================

function showCustomAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert ${type}`;
    alertDiv.innerHTML = `
        <div class="alert-content">
            <span class="alert-icon">${type === 'success' ? 'âœ“' : type === 'error' ? 'âœ—' : type === 'warning' ? 'âš ' : 'â„¹'}</span>
            <span class="alert-message">${message}</span>
        </div>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function hideLoginError() {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// ============================================
// 7. LOGIN FUNCTION
// ============================================

async function loginOperator() {
    const username = document.getElementById('operatorUsername')?.value.trim().toLowerCase();
    const password = document.getElementById('operatorPassword')?.value;
    
    if (!username || !password) {
        showLoginError('Username dan password wajib diisi');
        return;
    }
    
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.textContent = 'â³ Memverifikasi...';
        loginBtn.disabled = true;
    }
    
    try {
        const result = await verifyCredentials(username, password);
        
        if (result.success) {
            currentUser = result.user;
            saveSession(currentUser);
            hideLoginError();
            showMainApp();
            showCustomAlert(`Selamat datang, ${currentUser.name || currentUser.username}!`, 'success');
            
            if (currentUser.role === 'admin') {
                syncUsersForOffline();
            }
        } else {
            showLoginError(result.error || 'Username atau password salah');
        }
    } catch (error) {
        console.error('Login error:', error);
        showLoginError('Terjadi kesalahan. Coba lagi.');
    } finally {
        if (loginBtn) {
            loginBtn.textContent = 'Login';
            loginBtn.disabled = false;
        }
    }
}

async function verifyCredentials(username, password) {
    const cachedUser = checkUsersCache(username, password);
    if (cachedUser) {
        return { success: true, user: cachedUser };
    }
    
    if (!navigator.onLine) {
        return { success: false, error: 'Mode offline. Gunakan akun yang pernah login.' };
    }
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(GAS_URL, {
            method: 'POST',
            signal: controller.signal,
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'AUTH',
                username: username,
                password: password
            })
        });
        
        clearTimeout(timeoutId);
        
        return new Promise((resolve) => {
            const callbackName = 'authCallback_' + Date.now();
            
            window[callbackName] = (response) => {
                cleanupJSONP(callbackName);
                if (response.success) {
                    updateUserCache(response.user.username, password, response.user);
                    resolve({ success: true, user: response.user });
                } else {
                    resolve({ success: false, error: response.error || 'Login gagal' });
                }
            };
            
            const script = document.createElement('script');
            script.src = `${GAS_URL}?action=auth&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&callback=${callbackName}`;
            
            script.onerror = () => {
                cleanupJSONP(callbackName);
                resolve({ success: false, error: 'Network error' });
            };
            
            document.body.appendChild(script);
            
            setTimeout(() => {
                cleanupJSONP(callbackName);
                resolve({ success: false, error: 'Timeout' });
            }, 10000);
        });
        
    } catch (error) {
        return { success: false, error: 'Network error: ' + error.message };
    }
}

function checkUsersCache(username, password) {
    try {
        const cache = JSON.parse(localStorage.getItem(AUTH_CONFIG.USERS_CACHE_KEY) || '{}');
        const user = cache[username.toLowerCase()];
        
        if (user && user.password === password && user.status === 'ACTIVE') {
            return user;
        }
        return null;
    } catch (e) {
        return null;
    }
}

function updateUserCache(username, password, userData) {
    try {
        const cache = JSON.parse(localStorage.getItem(AUTH_CONFIG.USERS_CACHE_KEY) || '{}');
        cache[username.toLowerCase()] = {
            ...userData,
            password: password,
            lastSync: new Date().toISOString()
        };
        localStorage.setItem(AUTH_CONFIG.USERS_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.error('Error updating user cache:', e);
    }
}

function updatePasswordInCache(username, newPassword) {
    try {
        const cache = JSON.parse(localStorage.getItem(AUTH_CONFIG.USERS_CACHE_KEY) || '{}');
        if (cache[username.toLowerCase()]) {
            cache[username.toLowerCase()].password = newPassword;
            cache[username.toLowerCase()].lastSync = new Date().toISOString();
            localStorage.setItem(AUTH_CONFIG.USERS_CACHE_KEY, JSON.stringify(cache));
        }
    } catch (e) {
        console.error('Error updating password in cache:', e);
    }
}

// ============================================
// 8. USER MANAGEMENT (Admin Only)
// ============================================

function showUserManagement() {
    if (!currentUser || currentUser.role !== 'admin') {
        showCustomAlert('Hanya admin yang dapat mengakses fitur ini', 'error');
        return;
    }
    
    const modal = document.getElementById('userManagementModal');
    if (modal) {
        loadUserList();
        modal.classList.remove('hidden');
    }
}

function closeUserManagement() {
    const modal = document.getElementById('userManagementModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

async function loadUserList() {
    const container = document.getElementById('userListContainer');
    if (!container) return;
    
    container.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="spinner"></div><p>Memuat data user...</p></div>';
    
    try {
        const users = await fetchUsersFromServer();
        renderUserList(users);
    } catch (error) {
        const cache = loadUsersCache();
        if (cache) {
            const users = Object.values(cache);
            renderUserList(users);
            showCustomAlert('Menggunakan data cache (mode offline)', 'warning');
        } else {
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #ef4444;">Gagal memuat data user</div>';
        }
    }
}

function loadUsersCache() {
    try {
        return JSON.parse(localStorage.getItem(AUTH_CONFIG.USERS_CACHE_KEY) || '{}');
    } catch (e) {
        return null;
    }
}

async function fetchUsersFromServer() {
    return new Promise((resolve, reject) => {
        const callbackName = 'usersCallback_' + Date.now();
        
        const timeout = setTimeout(() => {
            cleanupJSONP(callbackName);
            reject(new Error('Timeout'));
        }, 10000);
        
        window[callbackName] = (response) => {
            clearTimeout(timeout);
            cleanupJSONP(callbackName);
            resolve(response);
        };
        
        const script = document.createElement('script');
        script.src = `${GAS_URL}?action=getUsers&adminUser=${encodeURIComponent(currentUser.username)}&adminPass=admin123&callback=${callbackName}`;
        
        script.onerror = () => {
            clearTimeout(timeout);
            cleanupJSONP(callbackName);
            reject(new Error('Network error'));
        };
        
        document.body.appendChild(script);
    });
}

function renderUserList(users) {
    const container = document.getElementById('userListContainer');
    if (!container) return;
    
    const validUsers = users.filter(user => user && user.username && typeof user.username === 'string');
    
    if (validUsers.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                âŒ Tidak ada data user valid<br>
                <small style="color: #64748b;">Pastikan sheet USERS memiliki kolom yang benar</small>
            </div>
        `;
        return;
    }
    
    let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
    
    validUsers.forEach(user => {
        const isCurrentUser = user.username.toLowerCase() === (currentUser?.username || '').toLowerCase();
        const isActive = user.status === 'ACTIVE';
        const isAdmin = user.role === 'admin';
        
        html += `
            <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid ${isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}; border-radius: 12px; padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                    <div>
                        <div style="font-weight: 600; font-size: 1rem; color: ${isActive ? '#f8fafc' : '#64748b'};">
                            ${user.name || user.username}
                            ${isCurrentUser ? '<span style="font-size: 0.7rem; background: rgba(14, 165, 233, 0.2); color: #38bdf8; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">Anda</span>' : ''}
                        </div>
                        <div style="font-size: 0.875rem; color: #94a3b8; margin-top: 2px;">
                            @${user.username} â€¢ ${user.department || 'Unit Utilitas 3B'}
                        </div>
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <span style="padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; background: ${isAdmin ? 'rgba(245, 158, 11, 0.2)' : 'rgba(100, 116, 139, 0.2)'}; color: ${isAdmin ? '#f59e0b' : '#94a3b8'};">
                            ${user.role || 'operator'}
                        </span>
                        <span style="padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; background: ${isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; color: ${isActive ? '#10b981' : '#ef4444'};">
                            ${user.status || 'ACTIVE'}
                        </span>
                    </div>
                </div>
                
                <div style="background: rgba(239, 68, 68, 0.05); border: 1px dashed rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                    <div style="font-size: 0.75rem; color: #ef4444; margin-bottom: 4px; font-weight: 600;">ðŸ”“ Password:</div>
                    <div style="font-family: monospace; font-size: 0.875rem; color: #f87171; letter-spacing: 1px;">${user.password || 'N/A'}</div>
                </div>
                
                <div style="display: flex; gap: 8px;">
                    ${!isCurrentUser ? `
                        <button onclick="toggleUserStatus('${user.username}')" style="flex: 1; padding: 10px; background: ${isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; color: ${isActive ? '#ef4444' : '#10b981'}; border: 1px solid ${isActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}; border-radius: 8px; font-size: 0.875rem; cursor: pointer;">
                            ${isActive ? 'ðŸ”’ Nonaktifkan' : 'ðŸ”“ Aktifkan'}
                        </button>
                        <button onclick="deleteUser('${user.username}')" style="padding: 10px 16px; background: rgba(100, 116, 139, 0.1); color: #64748b; border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 8px; font-size: 0.875rem; cursor: pointer;">
                            ðŸ—‘ï¸
                        </button>
                    ` : '<div style="flex: 1; text-align: center; color: #64748b; font-size: 0.875rem; padding: 10px;">Tidak dapat mengedit diri sendiri</div>'}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function updateUsersCache(usersArray) {
    try {
        let cache = loadUsersCache() || {};
        
        usersArray.forEach(user => {
            if (user && user.username) {
                cache[user.username.toLowerCase()] = {
                    username: user.username,
                    password: user.password || '',
                    role: user.role || 'operator',
                    name: user.name || user.username,
                    department: user.department || 'Unit Utilitas 3B',
                    status: user.status || 'ACTIVE',
                    lastSync: new Date().toISOString()
                };
            }
        });
        
        localStorage.setItem(AUTH_CONFIG.USERS_CACHE_KEY, JSON.stringify(cache));
        usersCache = cache;
    } catch (e) {
        console.error('Error updating users cache:', e);
    }
}

function showAddUserForm() {
    const modal = document.getElementById('userManagementModal');
    if (!modal) return;
    
    modal.setAttribute('data-old-content', modal.innerHTML);
    
    modal.innerHTML = `
        <div style="max-width: 480px; margin: 0 auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 16px; background: rgba(30, 41, 59, 0.8); border-radius: 12px; border: 1px solid rgba(148, 163, 184, 0.2);">
                <h2 style="margin: 0; font-size: 1.25rem;">âž• Tambah User Baru</h2>
                <button onclick="restoreUserManagement()" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 8px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <form id="addUserForm" style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                    <label style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 6px;">Username *</label>
                    <input type="text" id="newUsername" required style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.6); border: 2px solid rgba(148, 163, 184, 0.2); border-radius: 8px; color: white; font-size: 1rem;">
                </div>
                
                <div>
                    <label style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 6px;">Password (Plaintext) *</label>
                    <input type="text" id="newPassword" required style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.6); border: 2px solid rgba(148, 163, 184, 0.2); border-radius: 8px; color: white; font-size: 1rem;">
                    <small style="color: #64748b; font-size: 0.75rem;">âš ï¸ Password akan disimpan dalam bentuk plaintext</small>
                </div>
                
                <div>
                    <label style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 6px;">Nama Lengkap *</label>
                    <input type="text" id="newName" required style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.6); border: 2px solid rgba(148, 163, 184, 0.2); border-radius: 8px; color: white; font-size: 1rem;">
                </div>
                
                <div>
                    <label style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 6px;">Role *</label>
                    <select id="newRole" required style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.6); border: 2px solid rgba(148, 163, 184, 0.2); border-radius: 8px; color: white; font-size: 1rem;">
                        <option value="operator">Operator</option>
                        <option value="admin">Administrator</option>
                    </select>
                </div>
                
                <div>
                    <label style="display: block; font-size: 0.875rem; color: #94a3b8; margin-bottom: 6px;">Department</label>
                    <input type="text" id="newDepartment" value="Unit Utilitas 3B" style="width: 100%; padding: 12px; background: rgba(15, 23, 42, 0.6); border: 2px solid rgba(148, 163, 184, 0.2); border-radius: 8px; color: white; font-size: 1rem;">
                </div>
                
                <button type="submit" style="width: 100%; padding: 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; margin-top: 8px;">
                    Simpan User Baru
                </button>
            </form>
        </div>
    `;
    
    setTimeout(() => {
        const form = document.getElementById('addUserForm');
        if (form) form.addEventListener('submit', handleAddUser);
    }, 100);
}

function restoreUserManagement() {
    const modal = document.getElementById('userManagementModal');
    if (modal && modal.getAttribute('data-old-content')) {
        modal.innerHTML = modal.getAttribute('data-old-content');
        loadUserList();
    }
}

async function handleAddUser(e) {
    e.preventDefault();
    
    const formData = {
        username: document.getElementById('newUsername').value.trim().toLowerCase(),
        password: document.getElementById('newPassword').value,
        name: document.getElementById('newName').value.trim(),
        role: document.getElementById('newRole').value,
        department: document.getElementById('newDepartment').value.trim()
    };
    
    if (!formData.username || !formData.password || !formData.name) {
        showCustomAlert('Semua field wajib diisi!', 'error');
        return;
    }
    
    if (formData.username.length < 3) {
        showCustomAlert('Username minimal 3 karakter!', 'error');
        return;
    }
    
    if (formData.password.length < 4) {
        showCustomAlert('Password minimal 4 karakter!', 'error');
        return;
    }
    
    try {
        const result = await addUserToServer(formData);
        
        if (result.success) {
            showCustomAlert('User berhasil ditambahkan!', 'success');
            restoreUserManagement();
            updateUserCache(formData.username, formData.password, formData);
        } else {
            showCustomAlert(result.error || 'Gagal menambahkan user', 'error');
        }
    } catch (error) {
        updateUserCache(formData.username, formData.password, {
            ...formData,
            status: 'ACTIVE'
        });
        showCustomAlert('User disimpan secara lokal (mode offline)', 'warning');
        restoreUserManagement();
    }
}

function addUserToServer(userData) {
    return new Promise((resolve, reject) => {
        const payload = {
            type: 'USER_MANAGEMENT',
            action: 'add',
            adminUser: currentUser.username,
            adminPass: 'admin123',
            userData: userData
        };
        
        fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => resolve({ success: true }))
        .catch(reject);
    });
}

async function toggleUserStatus(username) {
    if (!confirm(`Yakin ingin mengubah status user @${username}?`)) return;
    
    try {
        const payload = {
            type: 'USER_MANAGEMENT',
            action: 'toggle',
            adminUser: currentUser.username,
            adminPass: 'admin123',
            targetUsername: username
        };
        
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        showCustomAlert('Status user diubah', 'success');
        loadUserList();
    } catch (error) {
        const cache = loadUsersCache();
        if (cache && cache[username.toLowerCase()]) {
            const currentStatus = cache[username.toLowerCase()].status || 'ACTIVE';
            cache[username.toLowerCase()].status = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            localStorage.setItem(AUTH_CONFIG.USERS_CACHE_KEY, JSON.stringify(cache));
        }
        loadUserList();
        showCustomAlert('Status diubah secara lokal (mode offline)', 'warning');
    }
}

async function deleteUser(username) {
    if (!confirm(`Yakin ingin menghapus user @${username}?`)) return;
    
    if (username.toLowerCase() === currentUser.username.toLowerCase()) {
        showCustomAlert('Tidak bisa menghapus diri sendiri!', 'error');
        return;
    }
    
    try {
        const payload = {
            type: 'USER_MANAGEMENT',
            action: 'delete',
            adminUser: currentUser.username,
            adminPass: 'admin123',
            targetUsername: username
        };
        
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        showCustomAlert('User berhasil dihapus', 'success');
        loadUserList();
    } catch (error) {
        const cache = loadUsersCache();
        if (cache && cache[username.toLowerCase()]) {
            delete cache[username.toLowerCase()];
            localStorage.setItem(AUTH_CONFIG.USERS_CACHE_KEY, JSON.stringify(cache));
        }
        loadUserList();
        showCustomAlert('User dihapus secara lokal (mode offline)', 'warning');
    }
}

// ============================================
// 9. SYNC & OFFLINE SUPPORT
// ============================================

async function syncUsersForOffline() {
    if (!navigator.onLine) {
        console.log('Sync skipped: Device is offline');
        return;
    }
    
    if (!currentUser) {
        console.log('Sync skipped: No authenticated user');
        return;
    }
    
    if (currentUser.role !== 'admin') {
        console.log('Sync skipped: User is not admin');
        return;
    }
    
    console.log('[SYNC] Starting offline users sync for admin...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
        const callbackName = 'syncUsersCallback_' + Date.now();
        
        const result = await new Promise((resolve, reject) => {
            const cleanup = () => {
                clearTimeout(timeoutId);
                if (window[callbackName]) delete window[callbackName];
            };
            
            window[callbackName] = (response) => {
                cleanup();
                if (response && response.success && Array.isArray(response.users)) {
                    resolve(response);
                } else {
                    reject(new Error(response?.error || 'Invalid response format'));
                }
            };
            
            const script = document.createElement('script');
            script.src = `${GAS_URL}?action=getUsers&adminUser=${encodeURIComponent(currentUser.username)}&adminPass=admin123&callback=${callbackName}`;
            
            script.onerror = () => {
                cleanup();
                reject(new Error('Failed to load script'));
            };
            
            controller.signal.addEventListener('abort', () => {
                cleanup();
                reject(new Error('Sync aborted'));
            });
            
            document.body.appendChild(script);
            
            script.onload = () => {
                setTimeout(() => {
                    if (script.parentNode) script.remove();
                }, 2000);
            };
        });
        
        if (result.users.length > 0) {
            updateUsersCache(result.users);
            console.log(`[SYNC] Success: ${result.users.length} users cached for offline mode`);
        } else {
            console.log('[SYNC] No users returned from server');
        }
        
    } catch (error) {
        console.error('[SYNC] Failed:', error.message);
    } finally {
        clearTimeout(timeoutId);
    }
}

function cleanupJSONP(callbackName) {
    if (window[callbackName]) {
        try {
            delete window[callbackName];
        } catch (e) {
            window[callbackName] = undefined;
        }
    }
    
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        if (script.src && script.src.includes('callback=' + callbackName)) {
            if (script.parentNode) script.remove();
        }
    });
}

// ============================================
// 10. CHANGE PASSWORD FUNCTIONS
// ============================================

function showChangePasswordModal() {
    if (!currentUser) {
        showCustomAlert('Silakan login terlebih dahulu', 'error');
        return;
    }
    
    const modal = document.getElementById('changePasswordModal');
    const usernameSpan = document.getElementById('cpUsername');
    const oldPasswordGroup = document.getElementById('oldPasswordGroup');
    const form = document.getElementById('changePasswordForm');
    
    if (usernameSpan) usernameSpan.textContent = currentUser.username;
    
    if (currentUser.role === 'admin') {
        if (oldPasswordGroup) oldPasswordGroup.style.display = 'none';
        const oldPassInput = document.getElementById('cpOldPassword');
        if(oldPassInput) oldPassInput.removeAttribute('required');
    } else {
        if (oldPasswordGroup) oldPasswordGroup.style.display = 'block';
        const oldPassInput = document.getElementById('cpOldPassword');
        if(oldPassInput) oldPassInput.setAttribute('required', 'true');
    }
    
    if(form) form.reset();
    hideCPError();
    
    if (modal) modal.classList.remove('hidden');
    
    setTimeout(() => {
        if (currentUser.role === 'admin') {
            document.getElementById('cpNewPassword')?.focus();
        } else {
            document.getElementById('cpOldPassword')?.focus();
        }
    }, 100);
    
    if(form) form.onsubmit = handleChangePasswordSubmit;
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.classList.add('hidden');
}

function toggleCPVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input || !btn) return;
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'ðŸ™ˆ';
    } else {
        input.type = 'password';
        btn.textContent = 'ðŸ‘ï¸';
    }
}

function showCPError(message) {
    const errorDiv = document.getElementById('cpError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function hideCPError() {
    const errorDiv = document.getElementById('cpError');
    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    }
}

async function handleChangePasswordSubmit(e) {
    e.preventDefault();
    hideCPError();
    
    if (!currentUser || !currentUser.username) {
        showCPError('Session tidak valid. Silakan login ulang.');
        return;
    }
    
    const oldPassword = document.getElementById('cpOldPassword')?.value || '';
    const newPassword = document.getElementById('cpNewPassword')?.value || '';
    const confirmPassword = document.getElementById('cpConfirmPassword')?.value || '';
    
    if (newPassword.length < 4) {
        showCPError('Password baru minimal 4 karakter');
        return;
    }
    if (newPassword !== confirmPassword) {
        showCPError('Password baru dan konfirmasi tidak cocok');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Simpan';
    if(submitBtn) {
        submitBtn.textContent = 'â³ Menyimpan...';
        submitBtn.disabled = true;
    }
    
    try {
        const result = await changePasswordJSONP(
            currentUser.username,
            currentUser.role === 'admin' ? '' : oldPassword,
            newPassword
        );
        
        if (result.success) {
            updatePasswordInCache(currentUser.username, newPassword);
            
            showCustomAlert('âœ“ Password berhasil diubah! Silakan login ulang.', 'success');
            closeChangePasswordModal();
            
            setTimeout(() => {
                logoutOperator();
            }, 2000);
        } else {
            showCPError(result.error || 'Gagal mengubah password');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showCPError('Gagal mengubah password. Periksa koneksi internet.');
    } finally {
        if(submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
}

function changePasswordJSONP(username, oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
        const callbackName = 'cpCallback_' + Date.now();
        const timeout = setTimeout(() => {
            cleanupJSONP(callbackName);
            reject(new Error('Timeout'));
        }, 10000);
        
        window[callbackName] = (response) => {
            clearTimeout(timeout);
            cleanupJSONP(callbackName);
            resolve(response);
        };
        
        const script = document.createElement('script');
        script.src = `${GAS_URL}?action=changePassword&username=${encodeURIComponent(username)}&oldPassword=${encodeURIComponent(oldPassword)}&newPassword=${encodeURIComponent(newPassword)}&callback=${callbackName}`;
        
        script.onerror = () => {
            clearTimeout(timeout);
            cleanupJSONP(callbackName);
            reject(new Error('Network error'));
        };
        
        document.body.appendChild(script);
    });
}


// ============================================
// 11. UPLOAD PROGRESS MANAGER
// ============================================

function showUploadProgress(title = 'Mengupload Data...') {
    const overlay = document.getElementById('uploadProgressOverlay');
    const percentage = document.getElementById('progressPercentage');
    const ringFill = document.getElementById('progressRingFill');
    const turbine = document.getElementById('uploadTurbine');
    const statusText = document.getElementById('uploadStatusText');
    
    overlay?.classList.remove('hidden', 'success', 'error');
    if(percentage) percentage.textContent = '0%';
    if(ringFill) ringFill.style.strokeDashoffset = 339.292;
    if(turbine) turbine.classList.add('spinning');
    if(statusText) statusText.textContent = title;
    
    document.querySelectorAll('.step').forEach((step, idx) => {
        step.classList.remove('active', 'completed');
        if (idx === 0) step.classList.add('active');
    });
    document.querySelectorAll('.step-line').forEach(line => line.classList.remove('active'));
    
    let progress = 0;
    let currentStep = 1;
    
    uploadProgressInterval = setInterval(() => {
        if (progress < 30) {
            progress += Math.random() * 3;
        } else if (progress < 70) {
            progress += Math.random() * 2;
            if (currentStep === 1 && progress > 35) {
                setUploadStep(2);
                currentStep = 2;
            }
        } else if (progress < 95) {
            progress += Math.random() * 1;
            if (currentStep === 2 && progress > 75) {
                setUploadStep(3);
                currentStep = 3;
            }
        } else {
            progress += 0.5;
        }
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(uploadProgressInterval);
        }
        
        updateProgressRing(progress);
    }, 100);
    
    return {
        complete: () => completeUploadProgress(),
        error: () => errorUploadProgress(),
        updateText: (text) => { if(statusText) statusText.textContent = text; }
    };
}

function updateProgressRing(percentage) {
    const ringFill = document.getElementById('progressRingFill');
    const percentageText = document.getElementById('progressPercentage');
    const circumference = 339.292;
    const offset = circumference - (percentage / 100) * circumference;
    
    if (ringFill) ringFill.style.strokeDashoffset = offset;
    if (percentageText) percentageText.textContent = Math.round(percentage) + '%';
}

function setUploadStep(stepNum) {
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`step${i}`);
        const line = document.getElementById(`stepLine${i}`);
        
        if (step) {
            if (i < stepNum) {
                step.classList.remove('active');
                step.classList.add('completed');
                const icon = step.querySelector('.step-icon');
                if (icon) icon.innerHTML = 'âœ“';
            } else if (i === stepNum) {
                step.classList.add('active');
                step.classList.remove('completed');
            }
        }
        
        if (line && i < stepNum) {
            line.classList.add('active');
        }
    }
}

function completeUploadProgress() {
    clearInterval(uploadProgressInterval);
    updateProgressRing(100);
    setUploadStep(4);
    
    const overlay = document.getElementById('uploadProgressOverlay');
    const turbine = document.getElementById('uploadTurbine');
    const statusText = document.getElementById('uploadStatusText');
    
    overlay?.classList.add('success');
    if(turbine) turbine.classList.remove('spinning');
    if(statusText) statusText.textContent = 'âœ“ Berhasil!';
    
    setTimeout(() => hideUploadProgress(), 800);
}

function errorUploadProgress() {
    clearInterval(uploadProgressInterval);
    
    const overlay = document.getElementById('uploadProgressOverlay');
    const turbine = document.getElementById('uploadTurbine');
    const statusText = document.getElementById('uploadStatusText');
    const percentage = document.getElementById('progressPercentage');
    
    overlay?.classList.add('error');
    if(turbine) turbine.classList.remove('spinning');
    if(statusText) statusText.textContent = 'âœ— Gagal Mengirim';
    if(percentage) percentage.textContent = 'Error';
    
    setTimeout(() => hideUploadProgress(), 1500);
}

function hideUploadProgress() {
    const overlay = document.getElementById('uploadProgressOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('success', 'error');
    }
    clearInterval(uploadProgressInterval);
}

function cancelUpload() {
    if (currentUploadController) {
        currentUploadController.abort();
    }
    hideUploadProgress();
    showCustomAlert('Upload dibatalkan', 'warning');
}

// ============================================
// 12. PHOTO FUNCTIONS FOR PARAMETER LOGSHEET
// ============================================
// NEW from v1.7.1 - Photo validation for parameters

function handleParamPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showCustomAlert('Ukuran foto terlalu besar. Maksimal 5MB.', 'error');
        event.target.value = '';
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        showCustomAlert('File harus berupa gambar.', 'error');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentParamPhoto = e.target.result;
        updateParamPhotoPreview();
        saveParamPhotosToDraft();
        showCustomAlert('Foto berhasil diambil!', 'success');
    };
    reader.readAsDataURL(file);
}

function updateParamPhotoPreview() {
    const preview = document.getElementById('paramPhotoPreview');
    const photoSection = document.getElementById('paramPhotoSection');
    
    if (preview) {
        if (currentParamPhoto) {
            preview.innerHTML = `<img src="${currentParamPhoto}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" alt="Parameter Photo">`;
            if (photoSection) photoSection.classList.add('has-photo');
        } else {
            preview.innerHTML = `
                <div class="photo-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <span>Ambil Foto</span>
                </div>
            `;
            if (photoSection) photoSection.classList.remove('has-photo');
        }
    }
}

function loadParamPhotoForCurrentStep() {
    const fullLabel = AREAS[activeArea][activeIdx];
    const photoKey = `${activeArea}_${fullLabel}`;
    
    if (paramPhotos && paramPhotos[photoKey]) {
        currentParamPhoto = paramPhotos[photoKey];
    } else {
        currentParamPhoto = null;
    }
    updateParamPhotoPreview();
}

function saveParamPhotosToDraft() {
    if (!activeArea || activeIdx === undefined) return;
    
    const fullLabel = AREAS[activeArea][activeIdx];
    const photoKey = `${activeArea}_${fullLabel}`;
    
    if (currentParamPhoto) {
        paramPhotos[photoKey] = currentParamPhoto;
    } else {
        delete paramPhotos[photoKey];
    }
    
    localStorage.setItem(PHOTO_DRAFT_KEYS.LOGSHEET_PHOTOS, JSON.stringify(paramPhotos));
}

function loadParamPhotosFromDraft() {
    try {
        const saved = localStorage.getItem(PHOTO_DRAFT_KEYS.LOGSHEET_PHOTOS);
        if (saved) {
            paramPhotos = JSON.parse(saved);
        } else {
            paramPhotos = {};
        }
    } catch (e) {
        paramPhotos = {};
    }
}

function clearParamPhoto() {
    currentParamPhoto = null;
    updateParamPhotoPreview();
    saveParamPhotosToDraft();
}

// ============================================
// 13. PHOTO FUNCTIONS FOR CT PARAMETER LOGSHEET
// ============================================
// NEW from v1.7.1 - Photo validation for CT parameters

function handleCTParamPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showCustomAlert('Ukuran foto terlalu besar. Maksimal 5MB.', 'error');
        event.target.value = '';
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        showCustomAlert('File harus berupa gambar.', 'error');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentCTParamPhoto = e.target.result;
        updateCTParamPhotoPreview();
        saveCTParamPhotosToDraft();
        showCustomAlert('Foto berhasil diambil!', 'success');
    };
    reader.readAsDataURL(file);
}

function updateCTParamPhotoPreview() {
    const preview = document.getElementById('ctParamPhotoPreview');
    const photoSection = document.getElementById('ctParamPhotoSection');
    
    if (preview) {
        if (currentCTParamPhoto) {
            preview.innerHTML = `<img src="${currentCTParamPhoto}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" alt="CT Parameter Photo">`;
            if (photoSection) photoSection.classList.add('has-photo');
        } else {
            preview.innerHTML = `
                <div class="photo-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <span>Ambil Foto</span>
                </div>
            `;
            if (photoSection) photoSection.classList.remove('has-photo');
        }
    }
}

function loadCTParamPhotoForCurrentStep() {
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    const photoKey = `${activeAreaCT}_${fullLabel}`;
    
    if (ctParamPhotos && ctParamPhotos[photoKey]) {
        currentCTParamPhoto = ctParamPhotos[photoKey];
    } else {
        currentCTParamPhoto = null;
    }
    updateCTParamPhotoPreview();
}

function saveCTParamPhotosToDraft() {
    if (!activeAreaCT || activeIdxCT === undefined) return;
    
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    const photoKey = `${activeAreaCT}_${fullLabel}`;
    
    if (currentCTParamPhoto) {
        ctParamPhotos[photoKey] = currentCTParamPhoto;
    } else {
        delete ctParamPhotos[photoKey];
    }
    
    localStorage.setItem(PHOTO_DRAFT_KEYS.CT_LOGSHEET_PHOTOS, JSON.stringify(ctParamPhotos));
}

function loadCTParamPhotosFromDraft() {
    try {
        const saved = localStorage.getItem(PHOTO_DRAFT_KEYS.CT_LOGSHEET_PHOTOS);
        if (saved) {
            ctParamPhotos = JSON.parse(saved);
        } else {
            ctParamPhotos = {};
        }
    } catch (e) {
        ctParamPhotos = {};
    }
}

function clearCTParamPhoto() {
    currentCTParamPhoto = null;
    updateCTParamPhotoPreview();
    saveCTParamPhotosToDraft();
}

// ============================================
// 14. LOGSHEET FUNCTIONS (TURBINE)
// ============================================

function fetchLastData() {
    updateStatusIndicator(false);
    const timeout = setTimeout(() => renderMenu(), 8000);
    const callbackName = 'jsonp_' + Date.now();
    
    window[callbackName] = (data) => {
        clearTimeout(timeout);
        lastData = data;
        updateStatusIndicator(true);
        cleanupJSONP(callbackName);
        renderMenu();
    };
    
    const script = document.createElement('script');
    script.src = `${GAS_URL}?callback=${callbackName}`;
    script.onerror = () => {
        clearTimeout(timeout);
        cleanupJSONP(callbackName);
        renderMenu();
    };
    document.body.appendChild(script);
}

function updateStatusIndicator(isOnline) {
    console.log('System Status:', isOnline ? 'Online' : 'Offline');
}

function renderMenu() {
    const list = document.getElementById('areaList');
    if (!list) return;
    
    const totalAreas = Object.keys(AREAS).length;
    let completedAreas = 0;
    let html = '';
    
    Object.entries(AREAS).forEach(([areaName, params]) => {
        const areaData = currentInput[areaName] || {};
        const filled = Object.keys(areaData).length;
        const total = params.length;
        const percent = Math.round((filled / total) * 100);
        const isCompleted = filled === total && total > 0;
        
        const hasAbnormal = params.some(paramName => {
            const val = areaData[paramName] || '';
            const firstLine = val.split('\n')[0];
            return ['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine);
        });
        
        if (isCompleted) completedAreas++;
        
        const circumference = 2 * Math.PI * 18;
        const strokeDashoffset = circumference - (percent / 100) * circumference;
        
        html += `
            <div class="area-item ${isCompleted ? 'completed' : ''} ${hasAbnormal ? 'has-warning' : ''}" onclick="openArea('${areaName}')">
                <div class="area-progress-ring">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>
                        <circle cx="20" cy="20" r="18" fill="none" stroke="${isCompleted ? '#10b981' : 'var(--primary')}" 
                                stroke-width="3" stroke-linecap="round" stroke-dasharray="${circumference}" 
                                stroke-dashoffset="${strokeDashoffset}" transform="rotate(-90 20 20)"/>
                        <text x="20" y="24" text-anchor="middle" font-size="10" font-weight="bold" fill="${isCompleted ? '#10b981' : 'var(--text-primary)'}">${filled}</text>
                    </svg>
                </div>
                <div class="area-info">
                    <div class="area-name">${areaName}</div>
                    <div class="area-meta ${hasAbnormal ? 'warning' : ''}">
                        ${hasAbnormal ? 'âš ï¸ Ada parameter bermasalah â€¢ ' : ''}${filled} dari ${total} parameter
                    </div>
                </div>
                <div class="area-status">
                    ${hasAbnormal ? '<span style="color: #ef4444; margin-right: 4px;">!</span>' : ''}
                    ${isCompleted ? 'âœ“' : 'â¯'}
                </div>
            </div>
        `;
    });
    
    list.innerHTML = html;
    
    const hasData = Object.keys(currentInput).length > 0;
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.style.display = hasData ? 'flex' : 'none';
    
    updateOverallProgressUI(completedAreas, totalAreas);
}

function updateOverallProgress() {
    const totalAreas = Object.keys(AREAS).length;
    let completedAreas = 0;
    Object.entries(AREAS).forEach(([areaName, params]) => {
        const filled = currentInput[areaName] ? Object.keys(currentInput[areaName]).length : 0;
        if (filled === params.length && filled > 0) completedAreas++;
    });
    updateOverallProgressUI(completedAreas, totalAreas);
}

function updateOverallProgressUI(completedAreas, totalAreas) {
    const percent = Math.round((completedAreas / totalAreas) * 100);
    const progressText = document.getElementById('progressText');
    const overallPercent = document.getElementById('overallPercent');
    const overallProgressBar = document.getElementById('overallProgressBar');
    
    if (progressText) progressText.textContent = `${percent}% Complete`;
    if (overallPercent) overallPercent.textContent = `${percent}%`;
    if (overallProgressBar) overallProgressBar.style.width = `${percent}%`;
}

function openArea(areaName) {
    if (!requireAuth()) return;
    
    activeArea = areaName;
    activeIdx = 0;
    navigateTo('paramScreen');
    const currentAreaName = document.getElementById('currentAreaName');
    if (currentAreaName) currentAreaName.textContent = areaName;
    renderProgressDots();
    showStep();
}

function renderProgressDots() {
    const container = document.getElementById('progressDots');
    if (!container) return;
    const total = AREAS[activeArea].length;
    let html = '';
    
    for (let i = 0; i < total; i++) {
        const fullLabel = AREAS[activeArea][i];
        const savedValue = currentInput[activeArea]?.[fullLabel] || '';
        const lines = savedValue.split('\n');
        const firstLine = lines[0];
        
        const isFilled = savedValue !== '';
        const hasIssue = ['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine);
        const isActive = i === activeIdx;
        
        let className = '';
        if (isActive) className = 'active';
        else if (hasIssue) className = 'has-issue';
        else if (isFilled) className = 'filled';
        
        html += `<div class="progress-dot ${className}" onclick="jumpToStep(${i})" title="${hasIssue ? firstLine : ''}"></div>`;
    }
    container.innerHTML = html;
}

function jumpToStep(index) {
    saveCurrentStep();
    activeIdx = index;
    showStep();
    renderProgressDots();
}

function detectInputType(label) {
    for (const [type, config] of Object.entries(INPUT_TYPES)) {
        for (const pattern of config.patterns) {
            if (label.includes(pattern)) {
                return {
                    type: 'select',
                    options: config.options[pattern],
                    pattern: pattern
                };
            }
        }
    }
    return { type: 'text', options: null, pattern: null };
}

function getUnit(label) {
    const match = label.match(/\(([^)]+)\)/);
    return match ? match[1] : "";
}

function getParamName(label) {
    return label.split(' (')[0];
}

function showStep() {
    const fullLabel = AREAS[activeArea][activeIdx];
    const total = AREAS[activeArea].length;
    const inputType = detectInputType(fullLabel);
    currentInputType = inputType.type;
    
    const stepInfo = document.getElementById('stepInfo');
    const areaProgress = document.getElementById('areaProgress');
    const labelInput = document.getElementById('labelInput');
    const lastTimeLabel = document.getElementById('lastTimeLabel');
    const prevValDisplay = document.getElementById('prevValDisplay');
    const inputFieldContainer = document.getElementById('inputFieldContainer');
    const unitDisplay = document.getElementById('unitDisplay');
    const mainInputWrapper = document.getElementById('mainInputWrapper');
    
    if (stepInfo) stepInfo.textContent = `Step ${activeIdx + 1}/${total}`;
    if (areaProgress) areaProgress.textContent = `${activeIdx + 1}/${total}`;
    if (labelInput) labelInput.textContent = getParamName(fullLabel);
    if (lastTimeLabel) lastTimeLabel.textContent = lastData._lastTime || '--:--';
    
    let prevVal = lastData[fullLabel] || '--';
    if (prevVal !== '--') {
        const lines = prevVal.toString().split('\n');
        const firstLine = lines[0];
        if (['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine)) {
            prevVal = firstLine + (lines[1] ? ' - ' + lines[1] : '');
        }
    }
    if (prevValDisplay) prevValDisplay.textContent = prevVal;
    
    if (inputType.type === 'select') {
        let currentValue = (currentInput[activeArea] && currentInput[activeArea][fullLabel]) || '';
        if (currentValue) {
            const lines = currentValue.split('\n');
            const firstLine = lines[0];
            if (!['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine)) {
                currentValue = firstLine;
            } else {
                currentValue = '';
            }
        }
        
        let optionsHtml = `<option value="" disabled ${!currentValue ? 'selected' : ''}>Pilih Status...</option>`;
        inputType.options.forEach(opt => {
            const selected = currentValue === opt ? 'selected' : '';
            optionsHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
        });
        
        if (inputFieldContainer) {
            inputFieldContainer.innerHTML = `
                <div class="select-wrapper">
                    <select id="valInput" class="status-select">${optionsHtml}</select>
                    <div class="select-arrow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                </div>
            `;
        }
        if (unitDisplay) unitDisplay.style.display = 'none';
        if (mainInputWrapper) mainInputWrapper.classList.add('has-select');
    } else {
        let currentValue = (currentInput[activeArea] && currentInput[activeArea][fullLabel]) || '';
        
        if (currentValue) {
            const lines = currentValue.split('\n');
            const firstLine = lines[0];
            if (!['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine)) {
                currentValue = firstLine;
            } else {
                currentValue = '';
            }
        }
        
        if (inputFieldContainer) {
            inputFieldContainer.innerHTML = `<input type="text" id="valInput" inputmode="decimal" placeholder="0.00" value="${currentValue}" autocomplete="off">`;
        }
        if (unitDisplay) {
            unitDisplay.textContent = getUnit(fullLabel) || '--';
            unitDisplay.style.display = 'flex';
        }
        if (mainInputWrapper) mainInputWrapper.classList.remove('has-select');
    }
    
    loadAbnormalStatus(fullLabel);
    renderProgressDots();
    
    // Load photo for current step - NEW from v1.7.1
    loadParamPhotoForCurrentStep();
    
    setTimeout(() => {
        const input = document.getElementById('valInput');
        if (input && inputType.type === 'text' && !input.disabled) {
            input.focus();
            input.select();
        }
    }, 100);
}

function handleStatusChange(checkbox) {
    const chip = checkbox.closest('.status-chip');
    const noteContainer = document.getElementById('statusNoteContainer');
    const valInput = document.getElementById('valInput');
    
    document.querySelectorAll('input[name="paramStatus"]').forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = false;
            cb.closest('.status-chip').classList.remove('active');
        }
    });
    
    if (checkbox.checked) {
        chip.classList.add('active');
        if (noteContainer) noteContainer.style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('statusNote')?.focus();
        }, 100);
        
        if (checkbox.value === 'NOT_INSTALLED') {
            if (valInput) {
                valInput.value = '-';
                valInput.disabled = true;
                valInput.style.opacity = '0.5';
                valInput.style.background = 'rgba(100, 116, 139, 0.2)';
            }
        }
    } else {
        chip.classList.remove('active');
        if (noteContainer) noteContainer.style.display = 'none';
        const noteInput = document.getElementById('statusNote');
        if (noteInput) noteInput.value = '';
        
        if (valInput) {
            valInput.value = '';
            valInput.disabled = false;
            valInput.style.opacity = '1';
            valInput.style.background = '';
            valInput.focus();
        }
    }
    
    saveCurrentStatusToDraft();
}

function saveCurrentStatusToDraft() {
    const fullLabel = AREAS[activeArea][activeIdx];
    const input = document.getElementById('valInput');
    const checkedStatus = document.querySelector('input[name="paramStatus"]:checked');
    const note = document.getElementById('statusNote')?.value || '';
    
    if (!currentInput[activeArea]) currentInput[activeArea] = {};
    
    let valueToSave = '';
    if (input && input.value.trim()) {
        valueToSave = input.value.trim();
    }
    
    if (checkedStatus) {
        if (note) {
            valueToSave = `${checkedStatus.value}\n${note}`;
        } else {
            valueToSave = checkedStatus.value;
        }
    }
    
    if (valueToSave) {
        currentInput[activeArea][fullLabel] = valueToSave;
    } else {
        delete currentInput[activeArea][fullLabel];
    }
    
    localStorage.setItem(DRAFT_KEYS.LOGSHEET, JSON.stringify(currentInput));
    renderProgressDots();
}

function loadAbnormalStatus(fullLabel) {
    document.querySelectorAll('input[name="paramStatus"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.status-chip').classList.remove('active');
    });
    
    const noteContainer = document.getElementById('statusNoteContainer');
    const noteInput = document.getElementById('statusNote');
    const valInput = document.getElementById('valInput');
    
    if (noteContainer) noteContainer.style.display = 'none';
    if (noteInput) noteInput.value = '';
    
    if (valInput) {
        valInput.disabled = false;
        valInput.style.opacity = '1';
        valInput.style.background = '';
        valInput.value = '';
    }
    
    if (currentInput[activeArea] && currentInput[activeArea][fullLabel]) {
        const savedValue = currentInput[activeArea][fullLabel];
        const lines = savedValue.split('\n');
        const firstLine = lines[0];
        const secondLine = lines[1] || '';
        
        const isStatus = ['ERROR', 'UPPER', 'NOT_INSTALLED'].includes(firstLine);
        
        if (isStatus) {
            const checkbox = document.querySelector(`input[value="${firstLine}"]`);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.closest('.status-chip').classList.add('active');
                if (noteContainer) noteContainer.style.display = 'block';
                if (noteInput) noteInput.value = secondLine;
                
                if (firstLine === 'NOT_INSTALLED' && valInput) {
                    valInput.value = '-';
                    valInput.disabled = true;
                    valInput.style.opacity = '0.5';
                    valInput.style.background = 'rgba(100, 116, 139, 0.2)';
                }
            }
        } else {
            if (valInput) valInput.value = savedValue;
        }
    }
}

function saveCurrentStep() {
    const input = document.getElementById('valInput');
    const fullLabel = AREAS[activeArea][activeIdx];
    
    if (!currentInput[activeArea]) currentInput[activeArea] = {};
    
    let valueToSave = '';
    if (input && input.value.trim()) {
        valueToSave = input.value.trim();
    }
    
    const checkedStatus = document.querySelector('input[name="paramStatus"]:checked');
    const note = document.getElementById('statusNote')?.value || '';
    
    if (checkedStatus) {
        if (checkedStatus.value === 'NOT_INSTALLED') {
            valueToSave = 'NOT_INSTALLED';
            if (note) valueToSave += '\n' + note;
        } else {
            if (note) {
                valueToSave = `${checkedStatus.value}\n${note}`;
            } else {
                valueToSave = checkedStatus.value;
            }
        }
    }
    
    if (valueToSave) {
        currentInput[activeArea][fullLabel] = valueToSave;
    } else {
        delete currentInput[activeArea][fullLabel];
    }
    
    localStorage.setItem(DRAFT_KEYS.LOGSHEET, JSON.stringify(currentInput));
    
    // Save photo for current step - NEW from v1.7.1
    saveParamPhotosToDraft();
}

function saveStep() {
    saveCurrentStep();
    
    if (activeIdx < AREAS[activeArea].length - 1) {
        activeIdx++;
        showStep();
    } else {
        showCustomAlert(`Area ${activeArea} selesai diisi!`, 'success');
        setTimeout(() => navigateTo('areaListScreen'), 1500);
    }
}

function goBack() {
    saveCurrentStep();
    
    if (activeIdx > 0) {
        activeIdx--;
        showStep();
    } else {
        navigateTo('areaListScreen');
    }
}

async function sendToSheet() {
    if (!requireAuth()) return;
    
    const progress = showUploadProgress('Mengirim Logsheet...');
    currentUploadController = new AbortController();
    
    let allParameters = {};
    Object.entries(currentInput).forEach(([areaName, params]) => {
        Object.entries(params).forEach(([paramName, value]) => {
            allParameters[paramName] = value;
        });
    });
    
    // Include photos in the data - NEW from v1.7.1
    const finalData = {
        type: 'LOGSHEET',
        Operator: currentUser ? currentUser.name : 'Unknown',
        OperatorId: currentUser ? currentUser.id : 'Unknown',
        Photos: paramPhotos, // Include photos
        ...allParameters
    };
    
    console.log('Sending Logsheet Data:', finalData);
    
    try {
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData),
            signal: currentUploadController.signal
        });
        
        progress.complete();
        showCustomAlert('âœ“ Data berhasil dikirim ke sistem!', 'success');
        
        currentInput = {};
        paramPhotos = {}; // Clear photos - NEW from v1.7.1
        localStorage.removeItem(DRAFT_KEYS.LOGSHEET);
        localStorage.removeItem(PHOTO_DRAFT_KEYS.LOGSHEET_PHOTOS); // Clear photo draft - NEW from v1.7.1
        
        setTimeout(() => navigateTo('homeScreen'), 1500);
        
    } catch (error) {
        console.error('Error sending data:', error);
        progress.error();
        
        let offlineData = JSON.parse(localStorage.getItem(DRAFT_KEYS.LOGSHEET_OFFLINE) || '[]');
        offlineData.push(finalData);
        localStorage.setItem(DRAFT_KEYS.LOGSHEET_OFFLINE, JSON.stringify(offlineData));
        
        setTimeout(() => {
            showCustomAlert('Gagal mengirim. Data disimpan lokal.', 'error');
        }, 500);
    }
}


// ============================================
// 15. TPM FUNCTIONS
// ============================================

function renderTPMAreas() {
    const list = document.getElementById('tpmAreaList');
    if (!list) return;
    
    let html = '';
    TPM_AREAS.forEach(area => {
        html += `
            <div class="area-item" onclick="openTPMArea('${area}')">
                <div class="area-info">
                    <div class="area-name">${area}</div>
                </div>
                <div class="area-status">â¯</div>
            </div>
        `;
    });
    list.innerHTML = html;
}

function updateTPMUserInfo() {
    const tpmHeaderUser = document.getElementById('tpmHeaderUser');
    const tpmInputUser = document.getElementById('tpmInputUser');
    
    if (tpmHeaderUser) tpmHeaderUser.textContent = currentUser?.name || 'Operator';
    if (tpmInputUser) tpmInputUser.textContent = currentUser?.name || 'Operator';
}

function openTPMArea(areaName) {
    if (!requireAuth()) return;
    
    activeTPMArea = areaName;
    currentTPMPhoto = null;
    currentTPMStatus = '';
    
    resetTPMForm();
    
    const title = document.getElementById('tpmInputTitle');
    if (title) title.textContent = areaName;
    
    updateTPMUserInfo();
    navigateTo('tpmInputScreen');
}

function resetTPMForm() {
    const preview = document.getElementById('tpmPhotoPreview');
    const photoSection = document.getElementById('tpmPhotoSection');
    
    if (preview) {
        preview.innerHTML = `
            <div class="photo-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Ambil Foto</span>
            </div>
        `;
    }
    
    if (photoSection) photoSection.classList.remove('has-photo');
    
    const notes = document.getElementById('tpmNotes');
    const action = document.getElementById('tpmAction');
    if (notes) notes.value = '';
    if (action) action.value = '';
    
    resetTPMStatusButtons();
}

function resetTPMStatusButtons() {
    ['btnNormal', 'btnAbnormal', 'btnOff'].forEach((id) => {
        const btn = document.getElementById(id);
        if (btn) btn.className = 'status-btn';
    });
}

function handleTPMPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showCustomAlert('Ukuran foto terlalu besar. Maksimal 5MB.', 'error');
        event.target.value = '';
        return;
    }
    
    if (!file.type.startsWith('image/')) {
        showCustomAlert('File harus berupa gambar.', 'error');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentTPMPhoto = e.target.result;
        const preview = document.getElementById('tpmPhotoPreview');
        const photoSection = document.getElementById('tpmPhotoSection');
        
        if (preview) {
            preview.innerHTML = `<img src="${currentTPMPhoto}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" alt="TPM Photo">`;
        }
        if (photoSection) photoSection.classList.add('has-photo');
        showCustomAlert('Foto berhasil diambil!', 'success');
    };
    reader.readAsDataURL(file);
}

function selectTPMStatus(status) {
    currentTPMStatus = status;
    resetTPMStatusButtons();
    
    const buttonMap = {
        'normal': { id: 'btnNormal', class: 'active-normal' },
        'abnormal': { id: 'btnAbnormal', class: 'active-abnormal' },
        'off': { id: 'btnOff', class: 'active-off' }
    };
    
    const selected = buttonMap[status];
    if (selected) {
        const btn = document.getElementById(selected.id);
        if (btn) btn.classList.add(selected.class);
    }
    
    if ((status === 'abnormal' || status === 'off') && !currentTPMPhoto) {
        setTimeout(() => {
            showCustomAlert('âš ï¸ Kondisi abnormal/off wajib didokumentasikan dengan foto!', 'warning');
        }, 100);
    }
}

async function submitTPMData() {
    if (!requireAuth()) return;
    
    const notes = document.getElementById('tpmNotes')?.value.trim() || '';
    const action = document.getElementById('tpmAction')?.value || '';
    
    if (!currentTPMStatus) {
        showCustomAlert('Pilih status kondisi terlebih dahulu!', 'error');
        return;
    }
    
    if (!currentTPMPhoto) {
        showCustomAlert('Ambil foto dokumentasi terlebih dahulu!', 'error');
        return;
    }
    
    if (!action) {
        showCustomAlert('Pilih tindakan yang dilakukan!', 'error');
        return;
    }
    
    const progress = showUploadProgress('Mengupload TPM & Foto...');
    progress.updateText('Mengompresi foto...');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    progress.updateText('Mengirim data...');
    
    const tpmData = {
        type: 'TPM',
        area: activeTPMArea,
        status: currentTPMStatus,
        action: action,
        notes: notes,
        photo: currentTPMPhoto,
        user: currentUser ? currentUser.name : 'Unknown',
        timestamp: new Date().toISOString()
    };
    
    try {
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tpmData)
        });
        
        progress.complete();
        
        let tpmHistory = JSON.parse(localStorage.getItem(DRAFT_KEYS.TPM_HISTORY) || '[]');
        tpmHistory.push({...tpmData, photo: '[UPLOADED]'});
        localStorage.setItem(DRAFT_KEYS.TPM_HISTORY, JSON.stringify(tpmHistory));
        
        showCustomAlert(`âœ“ Data TPM ${activeTPMArea} berhasil disimpan!`, 'success');
        currentTPMPhoto = null;
        currentTPMStatus = '';
        
        setTimeout(() => navigateTo('tpmScreen'), 1500);
        
    } catch (error) {
        progress.error();
        
        let offlineTPM = JSON.parse(localStorage.getItem(DRAFT_KEYS.TPM_OFFLINE) || '[]');
        offlineTPM.push(tpmData);
        localStorage.setItem(DRAFT_KEYS.TPM_OFFLINE, JSON.stringify(offlineTPM));
        
        setTimeout(() => {
            showCustomAlert('Gagal mengupload. Data disimpan lokal.', 'error');
        }, 500);
    }
}

// ============================================
// 16. BALANCING FUNCTIONS
// ============================================

function initBalancingScreen() {
    if (!requireAuth()) return;
    
    const balancingUser = document.getElementById('balancingUser');
    if (balancingUser && currentUser) balancingUser.textContent = currentUser.name;
    
    detectShift();
    
    const draftData = JSON.parse(localStorage.getItem(DRAFT_KEYS.BALANCING));
    const hasDraft = draftData !== null;
    
    if (hasDraft) {
        loadBalancingDraft();
    } else {
        loadLastBalancingData();
    }
    
    calculateLPBalance();
    setupBalancingAutoSave();
    setTimeout(updateDraftStatusIndicator, 100);
}

function detectShift() {
    const hour = new Date().getHours();
    let shift = 3;
    let shiftText = "Shift 3 (23:00 - 07:00)";
    
    if (hour >= 7 && hour < 15) {
        shift = 1;
        shiftText = "Shift 1 (07:00 - 15:00)";
    } else if (hour >= 15 && hour < 23) {
        shift = 2;
        shiftText = "Shift 2 (15:00 - 23:00)";
    }
    
    currentShift = shift;
    
    const badge = document.getElementById('currentShiftBadge');
    const info = document.getElementById('balancingShiftInfo');
    const kegiatanNum = document.getElementById('kegiatanShiftNum');
    
    if (badge) badge.textContent = `SHIFT ${shift}`;
    if (info) info.textContent = `${shiftText} â€¢ Auto Save Aktif`;
    if (kegiatanNum) kegiatanNum.textContent = shift;
    
    if (badge) {
        const colors = [
            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        ];
        badge.style.background = colors[shift - 1];
    }
    
    setDefaultDateTime();
}

function setDefaultDateTime() {
    const now = new Date();
    const dateInput = document.getElementById('balancingDate');
    const timeInput = document.getElementById('balancingTime');
    
    if (dateInput && !dateInput.value) dateInput.value = now.toISOString().split('T')[0];
    if (timeInput && !timeInput.value) timeInput.value = now.toTimeString().slice(0, 5);
}

function saveBalancingDraft() {
    try {
        const draftData = {};
        
        BALANCING_FIELDS.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                draftData[fieldId] = element.value;
            }
        });
        
        draftData._shift = currentShift;
        draftData._savedAt = new Date().toISOString();
        draftData._user = currentUser ? currentUser.name : 'Unknown';
        draftData._userId = currentUser ? currentUser.id : 'unknown';
        
        localStorage.setItem(DRAFT_KEYS.BALANCING, JSON.stringify(draftData));
        updateDraftStatusIndicator();
    } catch (e) {
        console.error('Error saving balancing draft:', e);
    }
}

function loadBalancingDraft() {
    try {
        const draftData = JSON.parse(localStorage.getItem(DRAFT_KEYS.BALANCING));
        if (!draftData) return false;
        
        let loadedCount = 0;
        BALANCING_FIELDS.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element && draftData[fieldId] !== undefined && draftData[fieldId] !== '') {
                element.value = draftData[fieldId];
                loadedCount++;
            }
        });
        
        const eksporEl = document.getElementById('eksporMW');
        if (eksporEl && eksporEl.value) {
            handleEksporInput(eksporEl);
        }
        
        calculateLPBalance();
        return loadedCount > 0;
    } catch (e) {
        console.error('Error loading balancing draft:', e);
        return false;
    }
}

function clearBalancingDraft() {
    try {
        localStorage.removeItem(DRAFT_KEYS.BALANCING);
        updateDraftStatusIndicator();
    } catch (e) {
        console.error('Error clearing balancing draft:', e);
    }
}

function setupBalancingAutoSave() {
    if (balancingAutoSaveInterval) {
        clearInterval(balancingAutoSaveInterval);
    }
    
    let lastData = '';
    balancingAutoSaveInterval = setInterval(() => {
        const currentData = JSON.stringify(getCurrentBalancingData());
        if (currentData !== lastData && hasBalancingData()) {
            saveBalancingDraft();
            lastData = currentData;
        }
    }, 10000);
    
    window.addEventListener('beforeunload', () => {
        if (hasBalancingData()) saveBalancingDraft();
    });
    
    const formContainer = document.getElementById('balancingScreen');
    if (formContainer) {
        let timeout;
        formContainer.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                clearTimeout(timeout);
                timeout = setTimeout(() => saveBalancingDraft(), 1000);
            }
        });
    }
}

function getCurrentBalancingData() {
    const data = {};
    BALANCING_FIELDS.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) data[fieldId] = element.value;
    });
    return data;
}

function hasBalancingData() {
    const data = getCurrentBalancingData();
    return Object.values(data).some(val => val !== '' && val !== null && val !== undefined);
}

function updateDraftStatusIndicator() {
    const indicator = document.getElementById('draftStatusIndicator');
    if (indicator) {
        const hasDraft = localStorage.getItem(DRAFT_KEYS.BALANCING) !== null;
        indicator.style.display = hasDraft ? 'flex' : 'none';
    }
}

async function loadLastBalancingData(fromSpreadsheet = true) {
    const loader = document.getElementById('loader');
    const loaderText = document.querySelector('.loader-text h3');
    
    if (loader) loader.style.display = 'flex';
    if (loaderText) loaderText.textContent = 'Mengambil data terakhir...';
    
    try {
        let lastData = null;
        let source = 'local';
        
        if (fromSpreadsheet && navigator.onLine) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await fetch(`${GAS_URL}?action=getLastBalancing&t=${Date.now()}`, {
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                const result = await response.json();
                
                if (result.success && result.data) {
                    lastData = result.data;
                    source = 'spreadsheet';
                }
            } catch (fetchError) {
                console.warn('Gagal fetch dari spreadsheet:', fetchError);
            }
        }
        
        if (!lastData) {
            const history = JSON.parse(localStorage.getItem(DRAFT_KEYS.BALANCING_HISTORY) || '[]');
            if (history.length > 0) {
                lastData = history[history.length - 1];
                source = 'local';
            }
        }
        
        if (!lastData) {
            setDefaultDateTime();
            return;
        }
        
        const fieldMapping = {
            'loadMW': lastData['Load_MW'],
            'eksporMW': lastData['Ekspor_Impor_MW'],
            'plnMW': lastData['PLN_MW'],
            'ubbMW': lastData['UBB_MW'],
            'pieMW': lastData['PIE_MW'],
            'tg65MW': lastData['TG65_MW'],
            'tg66MW': lastData['TG66_MW'],
            'gtgMW': lastData['GTG_MW'],
            'ss6500MW': lastData['SS6500_MW'],
            'ss2000Via': lastData['SS2000_Via'],
            'activePowerMW': lastData['Active_Power_MW'],
            'reactivePowerMVAR': lastData['Reactive_Power_MVAR'],
            'currentS': lastData['Current_S_A'],
            'voltageV': lastData['Voltage_V'],
            'hvs65l02MW': lastData['HVS65_L02_MW'],
            'hvs65l02Current': lastData['HVS65_L02_Current_A'],
            'total3BMW': lastData['Total_3B_MW'],
            'fq1105': lastData['Produksi_Steam_SA_t/h'],
            'stgSteam': lastData['STG_Steam_t/h'],
            'pa2Steam': lastData['PA2_Steam_t/h'],
            'puri2Steam': lastData['Puri2_Steam_t/h'],
            'melterSA2': lastData['Melter_SA2_t/h'],
            'ejectorSteam': lastData['Ejector_t/h'],
            'glandSealSteam': lastData['Gland_Seal_t/h'],
            'deaeratorSteam': lastData['Deaerator_t/h'],
            'dumpCondenser': lastData['Dump_Condenser_t/h'],
            'pcv6105': lastData['PCV6105_t/h'],
            'pi6122': lastData['PI6122_kg/cm2'],
            'ti6112': lastData['TI6112_C'],
            'ti6146': lastData['TI6146_C'],
            'ti6126': lastData['TI6126_C'],
            'axialDisplacement': lastData['Axial_Displacement_mm'],
            'vi6102': lastData['VI6102_Î¼m'],
            'te6134': lastData['TE6134_C'],
            'ctSuFan': lastData['CT_SU_Fan'],
            'ctSuPompa': lastData['CT_SU_Pompa'],
            'ctSaFan': lastData['CT_SA_Fan'],
            'ctSaPompa': lastData['CT_SA_Pompa'],
            'kegiatanShift': lastData['Kegiatan_Shift']
        };
        
        Object.entries(fieldMapping).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el && value !== undefined && value !== null && value !== '') {
                el.value = value;
            }
        });
        
        const eksporEl = document.getElementById('eksporMW');
        if (eksporEl && eksporEl.value) {
            handleEksporInput(eksporEl);
        }
        
        calculateLPBalance();
        saveBalancingDraft();
        
        const msg = source === 'spreadsheet' 
            ? `âœ“ Data terakhir dari server dimuat.`
            : `âœ“ Data terakhir dari penyimpanan lokal dimuat.`;
        
        showCustomAlert(msg, 'success');
        
    } catch (e) {
        console.error('Error loading last data:', e);
        setDefaultDateTime();
    } finally {
        if (loader) loader.style.display = 'none';
    }
}

function resetBalancingForm() {
    if (!confirm('Yakin reset form? Semua data akan dikosongkan dan draft akan dihapus.')) {
        return;
    }
    
    clearBalancingDraft();
    setDefaultDateTime();
    
    BALANCING_FIELDS.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) element.value = '';
    });
    
    const selects = ['ss2000Via', 'melterSA2', 'ejectorSteam', 'glandSealSteam'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.selectedIndex = 0;
    });
    
    const eksporEl = document.getElementById('eksporMW');
    const eksporLabel = document.getElementById('eksporLabel');
    const eksporHint = document.getElementById('eksporHint');
    
    if (eksporEl) {
        eksporEl.setAttribute('data-state', '');
        eksporEl.style.borderColor = 'rgba(148, 163, 184, 0.2)';
        eksporEl.style.background = 'rgba(15, 23, 42, 0.6)';
    }
    if (eksporLabel) {
        eksporLabel.textContent = 'Ekspor/Impor (MW)';
        eksporLabel.style.color = '#94a3b8';
    }
    if (eksporHint) {
        eksporHint.innerHTML = 'ðŸ’¡ <strong>Minus (-) = Ekspor</strong> | <strong>Plus (+) = Impor</strong>';
        eksporHint.style.color = '#94a3b8';
    }
    
    calculateLPBalance();
    showCustomAlert('Form berhasil direset! Semua field dikosongkan.', 'success');
}

function handleEksporInput(input) {
    const label = document.getElementById('eksporLabel');
    const hint = document.getElementById('eksporHint');
    let value = parseFloat(input.value);
    
    if (isNaN(value) || input.value === '') {
        if (label) {
            label.textContent = 'Ekspor/Impor (MW)';
            label.style.color = '#94a3b8';
        }
        if (hint) {
            hint.innerHTML = 'ðŸ’¡ <strong>Minus (-) = Ekspor</strong> | <strong>Plus (+) = Impor</strong>';
            hint.style.color = '#94a3b8';
        }
        input.style.borderColor = 'rgba(148, 163, 184, 0.2)';
        input.style.background = 'rgba(15, 23, 42, 0.6)';
        input.setAttribute('data-state', '');
        return;
    }
    
    if (value < 0) {
        if (label) {
            label.textContent = 'Ekspor (MW)';
            label.style.color = '#10b981';
        }
        if (hint) {
            hint.innerHTML = 'âœ“ Posisi: <strong>Ekspor ke Grid</strong> (Nilai negatif)';
            hint.style.color = '#10b981';
        }
        input.style.borderColor = '#10b981';
        input.style.background = 'rgba(16, 185, 129, 0.05)';
        input.setAttribute('data-state', 'ekspor');
        
    } else if (value > 0) {
        if (label) {
            label.textContent = 'Impor (MW)';
            label.style.color = '#f59e0b';
        }
        if (hint) {
            hint.innerHTML = 'âœ“ Posisi: <strong>Impor dari Grid</strong> (Nilai positif)';
            hint.style.color = '#f59e0b';
        }
        input.style.borderColor = '#f59e0b';
        input.style.background = 'rgba(245, 158, 11, 0.05)';
        input.setAttribute('data-state', 'impor');
        
    } else {
        if (label) {
            label.textContent = 'Ekspor/Impor (MW)';
            label.style.color = '#94a3b8';
        }
        if (hint) {
            hint.innerHTML = 'âšª Posisi: <strong>Netral</strong> (Nilai 0)';
            hint.style.color = '#64748b';
        }
        input.style.borderColor = 'rgba(148, 163, 184, 0.2)';
        input.style.background = 'rgba(15, 23, 42, 0.6)';
        input.setAttribute('data-state', '');
    }
}

function getEksporImporValue() {
    const input = document.getElementById('eksporMW');
    if (!input || !input.value) return 0;
    const value = parseFloat(input.value);
    return isNaN(value) ? 0 : value;
}

function calculateLPBalance() {
    const produksi = parseFloat(document.getElementById('fq1105')?.value) || 0;
    
    const konsumsiItems = [
        'stgSteam', 'pa2Steam', 'puri2Steam', 'deaeratorSteam',
        'dumpCondenser', 'pcv6105', 'melterSA2', 'ejectorSteam', 'glandSealSteam'
    ];
    
    let totalKonsumsi = 0;
    konsumsiItems.forEach(id => {
        totalKonsumsi += parseFloat(document.getElementById(id)?.value) || 0;
    });
    
    const totalDisplay = document.getElementById('totalKonsumsiSteam');
    if (totalDisplay) {
        totalDisplay.textContent = totalKonsumsi.toFixed(1) + ' t/h';
    }
    
    const balance = produksi - totalKonsumsi;
    
    const balanceField = document.getElementById('lpBalanceField');
    const balanceLabel = document.getElementById('lpBalanceLabel');
    const balanceInput = document.getElementById('lpBalanceValue');
    const balanceStatus = document.getElementById('lpBalanceStatus');
    
    if (balanceInput) balanceInput.value = Math.abs(balance).toFixed(1);
    
    if (balance < 0) {
        if (balanceLabel) balanceLabel.textContent = 'LPS Impor dari SU 3A (t/h)';
        if (balanceStatus) {
            balanceStatus.textContent = 'Posisi: Impor dari 3A (Produksi < Konsumsi)';
            balanceStatus.style.color = '#f59e0b';
        }
        if (balanceInput) {
            balanceInput.style.borderColor = '#f59e0b';
            balanceInput.style.color = '#f59e0b';
            balanceInput.style.background = 'rgba(245, 158, 11, 0.1)';
        }
        if (balanceField) {
            balanceField.style.borderColor = 'rgba(245, 158, 11, 0.3)';
            balanceField.style.background = 'rgba(245, 158, 11, 0.05)';
        }
    } else {
        if (balanceLabel) balanceLabel.textContent = 'LPS Ekspor ke SU 3A (t/h)';
        if (balanceStatus) {
            balanceStatus.textContent = 'Posisi: Ekspor ke 3A (Produksi > Konsumsi)';
            balanceStatus.style.color = '#10b981';
        }
        if (balanceInput) {
            balanceInput.style.borderColor = '#10b981';
            balanceInput.style.color = '#10b981';
            balanceInput.style.background = 'rgba(16, 185, 129, 0.1)';
        }
        if (balanceField) {
            balanceField.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            balanceField.style.background = 'rgba(16, 185, 129, 0.05)';
        }
    }
    
    return balance;
}

function formatWhatsAppMessage(data) {
    const formatNum = (num, maxDecimals = 2) => {
        if (num === undefined || num === null || num === '' || isNaN(num)) return '-';
        const parsed = parseFloat(num);
        if (parsed === 0) return '0';
        return parsed.toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: maxDecimals
        });
    };
    
    const formatInt = (num) => {
        if (num === undefined || num === null || num === '' || isNaN(num)) return '-';
        return parseInt(num).toLocaleString('id-ID');
    };
    
    const tglParts = data.Tanggal.split('-');
    const bulanIndo = {
        '01': 'Januari', '02': 'Februari', '03': 'Maret', '04': 'April',
        '05': 'Mei', '06': 'Juni', '07': 'Juli', '08': 'Agustus',
        '09': 'September', '10': 'Oktober', '11': 'November', '12': 'Desember'
    };
    const tglIndo = `${tglParts[2]} ${bulanIndo[tglParts[1]]} ${tglParts[0]}`;
    
    let message = `*Update STG 17,5 MW*\n`;
    message += `Tgl ${tglIndo}\n`;
    message += `Jam ${data.Jam}\n\n`;
    
    message += `*Output Power STG 17,5*\n`;
    message += `â ‚ Load = ${formatNum(data.Load_MW)} MW\n`;
    message += `â ‚ ${data.Ekspor_Impor_Status} = ${formatNum(Math.abs(data.Ekspor_Impor_MW), 3)} MW\n\n`;
    
    message += `*Balance Power SCADA*\n`;
    message += `â ‚ PLN = ${formatNum(data.PLN_MW)}MW\n`;
    message += `â ‚ UBB = ${formatNum(data.UBB_MW)}MW\n`;
    message += `â ‚ PIE = ${formatNum(data.PIE_MW)} MW\n`;
    message += `â ‚ TG-65 = ${formatNum(data.TG65_MW)} MW\n`;
    message += `â ‚ TG-66 = ${formatNum(data.TG66_MW)} MW\n`;
    message += `â ‚ GTG = ${formatNum(data.GTG_MW)} MW\n\n`;
    
    message += `*Konsumsi Power 3B*\n`;
    message += `â— SS-6500 (TR-Main 01) = ${formatNum(data.SS6500_MW, 3)} MW\n`;
    message += `â— SS-2000 *Via ${data.SS2000_Via}*\n`;
    message += `  â ‚ Active power = ${formatNum(data.Active_Power_MW, 3)} MW\n`;
    message += `  â ‚ Reactive power = ${formatNum(data.Reactive_Power_MVAR, 3)} MVAR\n`;
    message += `  â ‚ Current S = ${formatNum(data.Current_S_A, 1)} A\n`;
    message += `  â ‚ Voltage = ${formatInt(data.Voltage_V)} V\n`;
    message += `  â ‚ (HVS65 L02) = ${formatNum(data.HVS65_L02_MW, 3)} MW (${formatInt(data.HVS65_L02_Current_A)} A)\n`;
    message += `â— Total 3B = ${formatNum(data.Total_3B_MW, 3)}MW\n\n`;
    
    message += `*Produksi Steam SA*\n`;
    message += `â ‚ FQ-1105 = ${formatNum(data['Produksi_Steam_SA_t/h'], 1)} t/h\n\n`;
    
    message += `*Konsumsi Steam 3B*\n`;
    message += `â ‚ STG 17,5 = ${formatNum(data['STG_Steam_t/h'], 1)} t/h\n`;
    message += `â ‚ PA2 = ${formatNum(data['PA2_Steam_t/h'], 1)} t/h\n`;
    message += `â ‚ Puri2 = ${formatNum(data['Puri2_Steam_t/h'], 1)} t/h\n`;
    message += `â ‚ Melter SA2 = ${formatNum(data['Melter_SA2_t/h'], 1)} t/h\n`;
    message += `â ‚ Ejector = ${formatNum(data['Ejector_t/h'], 1)} t/h\n`;
    message += `â ‚ Gland Seal = ${formatNum(data['Gland_Seal_t/h'], 1)} t/h\n`;
    message += `â ‚ Deaerator = ${formatNum(data['Deaerator_t/h'], 1)} t/h\n`;
    message += `â ‚ Dump Condenser = ${formatNum(data['Dump_Condenser_t/h'], 1)} t/h\n`;
    message += `â ‚ PCV-6105 = ${formatNum(data['PCV6105_t/h'], 1)} t/h\n`;
    message += `*â ‚ Total Konsumsi* = ${formatNum(data['Total_Konsumsi_Steam_t/h'], 1)} t/h\n\n`;
    
    message += `*${data.LPS_Balance_Status}* = ${formatNum(data['LPS_Balance_t/h'], 1)} t/h\n\n`;
    
    message += `*Monitoring*\n`;
    message += `â ‚ Steam Extraction PI-6122 = ${formatNum(data['PI6122_kg/cm2'], 2)} kg/cmÂ² & TI-6112 = ${formatNum(data['TI6112_C'], 1)} Â°C\n`;
    message += `â ‚ Temp. Cooling Air Inlet (TI-6146/47) = ${formatNum(data['TI6146_C'], 2)} Â°C\n`;
    message += `â ‚ Temp. Lube Oil (TI-6126) = ${formatNum(data['TI6126_C'], 2)} Â°C\n`;
    message += `â ‚ Axial Displacement = ${formatNum(data['Axial_Displacement_mm'], 2)} mm (High : 0,6 mm)\n`;
    message += `â ‚ Vibrasi VI-6102 = ${formatNum(data['VI6102_Î¼m'], 2)} Î¼m (High : 85 Î¼m)\n`;
    message += `â ‚ Temp. Journal Bearing TE-6134 = ${formatNum(data['TE6134_C'], 1)} Â°C (High : 115 Â°C)\n`;
    message += `â ‚ CT SU = Fan : ${formatInt(data['CT_SU_Fan'])} & Pompa : ${formatInt(data['CT_SU_Pompa'])}\n`;
    message += `â ‚ CT SA = Fan : ${formatInt(data['CT_SA_Fan'])} & Pompa : ${formatInt(data['CT_SA_Pompa'])}\n\n`;
    
    message += `*Kegiatan Shift ${data.Shift}*\n`;
    message += data.Kegiatan_Shift || '-';
    
    return message;
}

async function submitBalancingData() {
    if (!requireAuth()) return;
    
    const requiredFields = ['loadMW', 'fq1105', 'stgSteam'];
    for (let id of requiredFields) {
        const el = document.getElementById(id);
        if (!el || !el.value) {
            showCustomAlert(`Field ${id} wajib diisi!`, 'error');
            if (el) el.focus();
            return;
        }
    }
    
    const progress = showUploadProgress('Mengirim Data Balancing...');
    currentUploadController = new AbortController();
    
    const eksporValue = getEksporImporValue();
    const lpBalance = calculateLPBalance();
    
    const balancingData = {
        type: 'BALANCING',
        Operator: currentUser ? currentUser.name : 'Unknown',
        Timestamp: new Date().toISOString(),
        
        Tanggal: document.getElementById('balancingDate')?.value || '',
        Jam: document.getElementById('balancingTime')?.value || '',
        Shift: currentShift,
        
        'Load_MW': parseFloat(document.getElementById('loadMW')?.value) || 0,
        'Ekspor_Impor_MW': eksporValue,
        'Ekspor_Impor_Status': eksporValue > 0 ? 'Impor' : (eksporValue < 0 ? 'Ekspor' : 'Netral'),
        
        'PLN_MW': parseFloat(document.getElementById('plnMW')?.value) || 0,
        'UBB_MW': parseFloat(document.getElementById('ubbMW')?.value) || 0,
        'PIE_MW': parseFloat(document.getElementById('pieMW')?.value) || 0,
        'TG65_MW': parseFloat(document.getElementById('tg65MW')?.value) || 0,
        'TG66_MW': parseFloat(document.getElementById('tg66MW')?.value) || 0,
        'GTG_MW': parseFloat(document.getElementById('gtgMW')?.value) || 0,
        
        'SS6500_MW': parseFloat(document.getElementById('ss6500MW')?.value) || 0,
        'SS2000_Via': document.getElementById('ss2000Via')?.value || 'TR-Main01',
        'Active_Power_MW': parseFloat(document.getElementById('activePowerMW')?.value) || 0,
        'Reactive_Power_MVAR': parseFloat(document.getElementById('reactivePowerMVAR')?.value) || 0,
        'Current_S_A': parseFloat(document.getElementById('currentS')?.value) || 0,
        'Voltage_V': parseFloat(document.getElementById('voltageV')?.value) || 0,
        'HVS65_L02_MW': parseFloat(document.getElementById('hvs65l02MW')?.value) || 0,
        'HVS65_L02_Current_A': parseFloat(document.getElementById('hvs65l02Current')?.value) || 0,
        'Total_3B_MW': parseFloat(document.getElementById('total3BMW')?.value) || 0,
        
        'Produksi_Steam_SA_t/h': parseFloat(document.getElementById('fq1105')?.value) || 0,
        'STG_Steam_t/h': parseFloat(document.getElementById('stgSteam')?.value) || 0,
        'PA2_Steam_t/h': parseFloat(document.getElementById('pa2Steam')?.value) || 0,
        'Puri2_Steam_t/h': parseFloat(document.getElementById('puri2Steam')?.value) || 0,
        'Melter_SA2_t/h': parseFloat(document.getElementById('melterSA2')?.value) || 0,
        'Ejector_t/h': parseFloat(document.getElementById('ejectorSteam')?.value) || 0,
        'Gland_Seal_t/h': parseFloat(document.getElementById('glandSealSteam')?.value) || 0,
        'Deaerator_t/h': parseFloat(document.getElementById('deaeratorSteam')?.value) || 0,
        'Dump_Condenser_t/h': parseFloat(document.getElementById('dumpCondenser')?.value) || 0,
        'PCV6105_t/h': parseFloat(document.getElementById('pcv6105')?.value) || 0,
        'Total_Konsumsi_Steam_t/h': parseFloat(document.getElementById('totalKonsumsiSteam')?.textContent) || 0,
        'LPS_Balance_t/h': Math.abs(lpBalance),
        'LPS_Balance_Status': lpBalance < 0 ? 'Impor dari 3A' : 'Ekspor ke 3A',
        
        'PI6122_kg/cm2': parseFloat(document.getElementById('pi6122')?.value) || 0,
        'TI6112_C': parseFloat(document.getElementById('ti6112')?.value) || 0,
        'TI6146_C': parseFloat(document.getElementById('ti6146')?.value) || 0,
        'TI6126_C': parseFloat(document.getElementById('ti6126')?.value) || 0,
        'Axial_Displacement_mm': parseFloat(document.getElementById('axialDisplacement')?.value) || 0,
        'VI6102_Î¼m': parseFloat(document.getElementById('vi6102')?.value) || 0,
        'TE6134_C': parseFloat(document.getElementById('te6134')?.value) || 0,
        'CT_SU_Fan': parseInt(document.getElementById('ctSuFan')?.value) || 0,
        'CT_SU_Pompa': parseInt(document.getElementById('ctSuPompa')?.value) || 0,
        'CT_SA_Fan': parseInt(document.getElementById('ctSaFan')?.value) || 0,
        'CT_SA_Pompa': parseInt(document.getElementById('ctSaPompa')?.value) || 0,
        
        'Kegiatan_Shift': document.getElementById('kegiatanShift')?.value || ''
    };
    
    try {
        progress.updateText('Menghitung ulang balance...');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        progress.updateText('Mengirim ke server...');
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(balancingData),
            signal: currentUploadController.signal
        });
        
        progress.complete();
        showCustomAlert('âœ“ Data Balancing berhasil dikirim!', 'success');
        
        let balancingHistory = JSON.parse(localStorage.getItem(DRAFT_KEYS.BALANCING_HISTORY) || '[]');
        balancingHistory.push({
            ...balancingData,
            submittedAt: new Date().toISOString()
        });
        localStorage.setItem(DRAFT_KEYS.BALANCING_HISTORY, JSON.stringify(balancingHistory));
        
        setTimeout(() => {
            const waMessage = encodeURIComponent(formatWhatsAppMessage(balancingData));
            const waNumber = '6281382160345';
            window.open(`https://wa.me/${waNumber}?text=${waMessage}`, '_blank');
            navigateTo('homeScreen');
        }, 1000);
        
    } catch (error) {
        console.error('Balancing Error:', error);
        progress.error();
        
        let offlineBalancing = JSON.parse(localStorage.getItem(DRAFT_KEYS.BALANCING_OFFLINE) || '[]');
        offlineBalancing.push(balancingData);
        localStorage.setItem(DRAFT_KEYS.BALANCING_OFFLINE, JSON.stringify(offlineBalancing));
        
        setTimeout(() => {
            showCustomAlert('Gagal mengirim. Data disimpan lokal.', 'error');
        }, 500);
    }
}

function toggleSS2000Detail() {
    const select = document.getElementById('ss2000Via');
    const detail = document.getElementById('ss2000Detail');
    if (select && detail) {
        detail.style.display = select.value ? 'block' : 'none';
    }
}


// ============================================
// 17. CT LOGSHEET FUNCTIONS
// ============================================

function fetchLastDataCT() {
    updateStatusIndicator(false);
    const timeout = setTimeout(() => renderCTMenu(), 8000);
    const callbackName = 'jsonp_ct_' + Date.now();
    
    window[callbackName] = (data) => {
        clearTimeout(timeout);
        lastDataCT = data;
        updateStatusIndicator(true);
        cleanupJSONP(callbackName);
        renderCTMenu();
    };
    
    const script = document.createElement('script');
    script.src = `${GAS_URL}?action=getLastCT&callback=${callbackName}`;
    script.onerror = () => {
        clearTimeout(timeout);
        cleanupJSONP(callbackName);
        renderCTMenu();
    };
    document.body.appendChild(script);
}

function renderCTMenu() {
    const list = document.getElementById('ctAreaList');
    if (!list) return;
    
    const totalAreas = Object.keys(AREAS_CT).length;
    let completedAreas = 0;
    let html = '';
    
    Object.entries(AREAS_CT).forEach(([areaName, params]) => {
        const areaData = currentInputCT[areaName] || {};
        const filled = Object.keys(areaData).length;
        const total = params.length;
        const percent = Math.round((filled / total) * 100);
        const isCompleted = filled === total && total > 0;
        
        const hasAbnormal = params.some(paramName => {
            const val = areaData[paramName] || '';
            const firstLine = val.split('\n')[0];
            return ['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine);
        });
        
        if (isCompleted) completedAreas++;
        
        const circumference = 2 * Math.PI * 18;
        const strokeDashoffset = circumference - (percent / 100) * circumference;
        
        html += `
            <div class="area-item ${isCompleted ? 'completed' : ''} ${hasAbnormal ? 'has-warning' : ''}" onclick="openCTArea('${areaName}')">
                <div class="area-progress-ring">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>
                        <circle cx="20" cy="20" r="18" fill="none" stroke="${isCompleted ? '#10b981' : '#3b82f6'}" 
                                stroke-width="3" stroke-linecap="round" stroke-dasharray="${circumference}" 
                                stroke-dashoffset="${strokeDashoffset}" transform="rotate(-90 20 20)"/>
                        <text x="20" y="24" text-anchor="middle" font-size="10" font-weight="bold" fill="${isCompleted ? '#10b981' : '#f8fafc'}">${filled}</text>
                    </svg>
                </div>
                <div class="area-info">
                    <div class="area-name">${areaName}</div>
                    <div class="area-meta ${hasAbnormal ? 'warning' : ''}">
                        ${hasAbnormal ? 'âš ï¸ Ada parameter bermasalah â€¢ ' : ''}${filled} dari ${total} parameter
                    </div>
                </div>
                <div class="area-status">
                    ${hasAbnormal ? '<span style="color: #ef4444; margin-right: 4px;">!</span>' : ''}
                    ${isCompleted ? 'âœ“' : 'â¯'}
                </div>
            </div>
        `;
    });
    
    list.innerHTML = html;
    
    const hasData = Object.keys(currentInputCT).length > 0;
    const submitBtn = document.getElementById('ctSubmitBtn');
    if (submitBtn) submitBtn.style.display = hasData ? 'flex' : 'none';
    
    updateCTOverallProgressUI(completedAreas, totalAreas);
}

function updateCTOverallProgress() {
    const totalAreas = Object.keys(AREAS_CT).length;
    let completedAreas = 0;
    Object.entries(AREAS_CT).forEach(([areaName, params]) => {
        const filled = currentInputCT[areaName] ? Object.keys(currentInputCT[areaName]).length : 0;
        if (filled === params.length && filled > 0) completedAreas++;
    });
    updateCTOverallProgressUI(completedAreas, totalAreas);
}

function updateCTOverallProgressUI(completedAreas, totalAreas) {
    const percent = Math.round((completedAreas / totalAreas) * 100);
    const progressText = document.getElementById('ctProgressText');
    const overallPercent = document.getElementById('ctOverallPercent');
    const overallProgressBar = document.getElementById('ctOverallProgressBar');
    
    if (progressText) progressText.textContent = `${percent}% Complete`;
    if (overallPercent) overallPercent.textContent = `${percent}%`;
    if (overallProgressBar) overallProgressBar.style.width = `${percent}%`;
}

function openCTArea(areaName) {
    if (!requireAuth()) return;
    
    activeAreaCT = areaName;
    activeIdxCT = 0;
    navigateTo('ctParamScreen');
    const currentAreaName = document.getElementById('ctCurrentAreaName');
    if (currentAreaName) currentAreaName.textContent = areaName;
    renderCTProgressDots();
    showCTStep();
}

function renderCTProgressDots() {
    const container = document.getElementById('ctProgressDots');
    if (!container) return;
    const total = AREAS_CT[activeAreaCT].length;
    let html = '';
    
    for (let i = 0; i < total; i++) {
        const fullLabel = AREAS_CT[activeAreaCT][i];
        const savedValue = currentInputCT[activeAreaCT]?.[fullLabel] || '';
        const lines = savedValue.split('\n');
        const firstLine = lines[0];
        
        const isFilled = savedValue !== '';
        const hasIssue = ['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine);
        const isActive = i === activeIdxCT;
        
        let className = '';
        if (isActive) className = 'active';
        else if (hasIssue) className = 'has-issue';
        else if (isFilled) className = 'filled';
        
        html += `<div class="progress-dot ${className}" onclick="jumpToCTStep(${i})" title="${hasIssue ? firstLine : ''}"></div>`;
    }
    container.innerHTML = html;
}

function jumpToCTStep(index) {
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    const input = document.getElementById('ctValInput');
    
    if (input && input.value.trim()) {
        if (!currentInputCT[activeAreaCT]) currentInputCT[activeAreaCT] = {};
        
        const checkedStatus = document.querySelector('input[name="ctParamStatus"]:checked');
        const note = document.getElementById('ctStatusNote')?.value || '';
        let valueToSave = input.value.trim();
        
        if (checkedStatus) {
            if (note) {
                valueToSave = `${checkedStatus.value}\n${note}`;
            } else {
                valueToSave = checkedStatus.value;
            }
        }
        
        currentInputCT[activeAreaCT][fullLabel] = valueToSave;
        localStorage.setItem(DRAFT_KEYS_CT.LOGSHEET, JSON.stringify(currentInputCT));
    }
    
    activeIdxCT = index;
    showCTStep();
    renderCTProgressDots();
}

function detectCTInputType(label) {
    if (label.includes('(A/M)') || label.includes('(A/B)')) {
        return {
            type: 'select',
            options: label.includes('(A/M)') ? ['Auto', 'Manual'] : ['A', 'B', 'AB'],
            pattern: label.includes('(A/M)') ? '(A/M)' : '(A/B)'
        };
    }
    if (label.includes('STATUS') || label.includes('Running') || label.includes('ON/OFF')) {
        return {
            type: 'select',
            options: ['Running', 'Stop', 'Standby'],
            pattern: 'STATUS'
        };
    }
    return { type: 'text', options: null, pattern: null };
}

function getCTUnit(label) {
    const match = label.match(/\(([^)]+)\)/);
    return match ? match[1] : "";
}

function getCTParamName(label) {
    return label.split(' (')[0];
}

function handleCTStatusChange(checkbox) {
    const chip = checkbox.closest('.status-chip');
    const noteContainer = document.getElementById('ctStatusNoteContainer');
    const valInput = document.getElementById('ctValInput');
    
    document.querySelectorAll('input[name="ctParamStatus"]').forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = false;
            cb.closest('.status-chip').classList.remove('active');
        }
    });
    
    if (checkbox.checked) {
        chip.classList.add('active');
        if (noteContainer) noteContainer.style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('ctStatusNote')?.focus();
        }, 100);
        
        if (checkbox.value === 'NOT_INSTALLED' && valInput) {
            valInput.value = '-';
            valInput.disabled = true;
            valInput.style.opacity = '0.5';
            valInput.style.background = 'rgba(100, 116, 139, 0.2)';
        }
    } else {
        chip.classList.remove('active');
        if (noteContainer) noteContainer.style.display = 'none';
        const noteInput = document.getElementById('ctStatusNote');
        if (noteInput) noteInput.value = '';
        
        if (valInput) {
            valInput.value = '';
            valInput.disabled = false;
            valInput.style.opacity = '1';
            valInput.style.background = '';
            valInput.focus();
        }
    }
    
    saveCurrentCTStatusToDraft();
}

function saveCurrentCTStatusToDraft() {
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    const input = document.getElementById('ctValInput');
    const checkedStatus = document.querySelector('input[name="ctParamStatus"]:checked');
    const note = document.getElementById('ctStatusNote')?.value || '';
    
    if (!currentInputCT[activeAreaCT]) currentInputCT[activeAreaCT] = {};
    
    let valueToSave = '';
    if (input && input.value.trim()) {
        valueToSave = input.value.trim();
    }
    
    if (checkedStatus) {
        if (note) {
            valueToSave = `${checkedStatus.value}\n${note}`;
        } else {
            valueToSave = checkedStatus.value;
        }
    }
    
    if (valueToSave) {
        currentInputCT[activeAreaCT][fullLabel] = valueToSave;
    } else {
        delete currentInputCT[activeAreaCT][fullLabel];
    }
    
    localStorage.setItem(DRAFT_KEYS_CT.LOGSHEET, JSON.stringify(currentInputCT));
    renderCTProgressDots();
}

function loadCTAbnormalStatus(fullLabel) {
    document.querySelectorAll('input[name="ctParamStatus"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.status-chip').classList.remove('active');
    });
    
    const noteContainer = document.getElementById('ctStatusNoteContainer');
    const noteInput = document.getElementById('ctStatusNote');
    const valInput = document.getElementById('ctValInput');
    
    if (noteContainer) noteContainer.style.display = 'none';
    if (noteInput) noteInput.value = '';
    
    if (valInput) {
        valInput.disabled = false;
        valInput.style.opacity = '1';
        valInput.style.background = '';
        valInput.value = '';
    }
    
    if (currentInputCT[activeAreaCT] && currentInputCT[activeAreaCT][fullLabel]) {
        const savedValue = currentInputCT[activeAreaCT][fullLabel];
        const lines = savedValue.split('\n');
        const firstLine = lines[0];
        const secondLine = lines[1] || '';
        
        const isStatus = ['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine);
        
        if (isStatus) {
            const checkbox = document.querySelector(`input[value="${firstLine}"]`);
            if (checkbox) {
                checkbox.checked = true;
                checkbox.closest('.status-chip').classList.add('active');
                if (noteContainer) noteContainer.style.display = 'block';
                if (noteInput) noteInput.value = secondLine;
                
                if (firstLine === 'NOT_INSTALLED' && valInput) {
                    valInput.value = '-';
                    valInput.disabled = true;
                    valInput.style.opacity = '0.5';
                    valInput.style.background = 'rgba(100, 116, 139, 0.2)';
                }
            }
        } else {
            if (valInput) valInput.value = savedValue;
        }
    }
}

function showCTStep() {
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    const total = AREAS_CT[activeAreaCT].length;
    const inputType = detectCTInputType(fullLabel);
    currentInputTypeCT = inputType.type;
    
    const stepInfo = document.getElementById('ctStepInfo');
    const areaProgress = document.getElementById('ctAreaProgress');
    const labelInput = document.getElementById('ctLabelInput');
    const lastTimeLabel = document.getElementById('ctLastTimeLabel');
    const prevValDisplay = document.getElementById('ctPrevValDisplay');
    const inputFieldContainer = document.getElementById('ctInputFieldContainer');
    const unitDisplay = document.getElementById('ctUnitDisplay');
    const mainInputWrapper = document.getElementById('ctMainInputWrapper');
    
    if (stepInfo) stepInfo.textContent = `Step ${activeIdxCT + 1}/${total}`;
    if (areaProgress) areaProgress.textContent = `${activeIdxCT + 1}/${total}`;
    if (labelInput) labelInput.textContent = getCTParamName(fullLabel);
    if (lastTimeLabel) lastTimeLabel.textContent = lastDataCT._lastTime || '--:--';
    
    let prevVal = lastDataCT[fullLabel] || '--';
    if (prevVal !== '--') {
        const lines = prevVal.toString().split('\n');
        const firstLine = lines[0];
        if (['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine)) {
            prevVal = firstLine + (lines[1] ? ' - ' + lines[1] : '');
        }
    }
    if (prevValDisplay) prevValDisplay.textContent = prevVal;
    
    if (inputType.type === 'select') {
        let currentValue = (currentInputCT[activeAreaCT] && currentInputCT[activeAreaCT][fullLabel]) || '';
        if (currentValue) {
            const lines = currentValue.split('\n');
            const firstLine = lines[0];
            if (!['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine)) {
                currentValue = firstLine;
            } else {
                currentValue = '';
            }
        }
        
        let optionsHtml = `<option value="" disabled ${!currentValue ? 'selected' : ''}>Pilih Status...</option>`;
        inputType.options.forEach(opt => {
            const selected = currentValue === opt ? 'selected' : '';
            optionsHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
        });
        
        if (inputFieldContainer) {
            inputFieldContainer.innerHTML = `
                <div class="select-wrapper">
                    <select id="ctValInput" class="status-select">${optionsHtml}</select>
                    <div class="select-arrow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9l6 6 6-6"/>
                        </svg>
                    </div>
                </div>
            `;
        }
        if (unitDisplay) unitDisplay.style.display = 'none';
        if (mainInputWrapper) mainInputWrapper.classList.add('has-select');
    } else {
        let currentValue = (currentInputCT[activeAreaCT] && currentInputCT[activeAreaCT][fullLabel]) || '';
        
        if (currentValue) {
            const lines = currentValue.split('\n');
            const firstLine = lines[0];
            if (!['ERROR', 'MAINTENANCE', 'NOT_INSTALLED'].includes(firstLine)) {
                currentValue = firstLine;
            } else {
                currentValue = '';
            }
        }
        
        if (inputFieldContainer) {
            inputFieldContainer.innerHTML = `<input type="text" id="ctValInput" inputmode="decimal" placeholder="0.00" value="${currentValue}" autocomplete="off">`;
        }
        if (unitDisplay) {
            unitDisplay.textContent = getCTUnit(fullLabel) || '--';
            unitDisplay.style.display = 'flex';
        }
        if (mainInputWrapper) mainInputWrapper.classList.remove('has-select');
    }
    
    loadCTAbnormalStatus(fullLabel);
    renderCTProgressDots();
    
    // Load photo for current CT step - NEW from v1.7.1
    loadCTParamPhotoForCurrentStep();
    
    setTimeout(() => {
        const input = document.getElementById('ctValInput');
        if (input && inputType.type === 'text' && !input.disabled) {
            input.focus();
            input.select();
        }
    }, 100);
}

function saveCTStep() {
    const input = document.getElementById('ctValInput');
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    
    if (!currentInputCT[activeAreaCT]) currentInputCT[activeAreaCT] = {};
    
    let valueToSave = '';
    if (input && input.value.trim()) {
        valueToSave = input.value.trim();
    }
    
    const checkedStatus = document.querySelector('input[name="ctParamStatus"]:checked');
    const note = document.getElementById('ctStatusNote')?.value || '';
    
    if (checkedStatus) {
        if (checkedStatus.value === 'NOT_INSTALLED') {
            valueToSave = 'NOT_INSTALLED';
            if (note) valueToSave += '\n' + note;
        } else {
            if (note) {
                valueToSave = `${checkedStatus.value}\n${note}`;
            } else {
                valueToSave = checkedStatus.value;
            }
        }
    }
    
    if (valueToSave) {
        currentInputCT[activeAreaCT][fullLabel] = valueToSave;
    } else {
        delete currentInputCT[activeAreaCT][fullLabel];
    }
    
    localStorage.setItem(DRAFT_KEYS_CT.LOGSHEET, JSON.stringify(currentInputCT));
    
    // Save CT photo for current step - NEW from v1.7.1
    saveCTParamPhotosToDraft();
    
    if (activeIdxCT < AREAS_CT[activeAreaCT].length - 1) {
        activeIdxCT++;
        showCTStep();
    } else {
        showCustomAlert(`Area ${activeAreaCT} selesai diisi!`, 'success');
        setTimeout(() => navigateTo('ctAreaListScreen'), 1500);
    }
}

function goBackCT() {
    const input = document.getElementById('ctValInput');
    const fullLabel = AREAS_CT[activeAreaCT][activeIdxCT];
    
    if (!currentInputCT[activeAreaCT]) currentInputCT[activeAreaCT] = {};
    
    let valueToSave = '';
    if (input && input.value.trim()) {
        valueToSave = input.value.trim();
    }
    
    const checkedStatus = document.querySelector('input[name="ctParamStatus"]:checked');
    const note = document.getElementById('ctStatusNote')?.value || '';
    
    if (checkedStatus) {
        if (checkedStatus.value === 'NOT_INSTALLED') {
            valueToSave = 'NOT_INSTALLED';
            if (note) valueToSave += '\n' + note;
        } else {
            if (note) {
                valueToSave = `${checkedStatus.value}\n${note}`;
            } else {
                valueToSave = checkedStatus.value;
            }
        }
    }
    
    if (valueToSave) {
        currentInputCT[activeAreaCT][fullLabel] = valueToSave;
    } else {
        delete currentInputCT[activeAreaCT][fullLabel];
    }
    
    localStorage.setItem(DRAFT_KEYS_CT.LOGSHEET, JSON.stringify(currentInputCT));
    
    // Save CT photo for current step - NEW from v1.7.1
    saveCTParamPhotosToDraft();
    
    if (activeIdxCT > 0) {
        activeIdxCT--;
        showCTStep();
    } else {
        navigateTo('ctAreaListScreen');
    }
}

async function sendCTToSheet() {
    if (!requireAuth()) return;
    
    const progress = showUploadProgress('Mengirim Logsheet CT...');
    currentUploadController = new AbortController();
    
    let allParameters = {};
    Object.entries(currentInputCT).forEach(([areaName, params]) => {
        Object.entries(params).forEach(([paramName, value]) => {
            allParameters[paramName] = value;
        });
    });
    
    // Include CT photos in the data - NEW from v1.7.1
    const finalData = {
        type: 'LOGSHEET_CT',
        Operator: currentUser ? currentUser.name : 'Unknown',
        OperatorId: currentUser ? currentUser.id : 'Unknown',
        Photos: ctParamPhotos, // Include CT photos
        ...allParameters
    };
    
    console.log('Sending CT Logsheet Data:', finalData);
    
    try {
        await fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalData),
            signal: currentUploadController.signal
        });
        
        progress.complete();
        showCustomAlert('âœ“ Data CT berhasil dikirim ke sistem!', 'success');
        
        currentInputCT = {};
        ctParamPhotos = {}; // Clear CT photos - NEW from v1.7.1
        localStorage.removeItem(DRAFT_KEYS_CT.LOGSHEET);
        localStorage.removeItem(PHOTO_DRAFT_KEYS.CT_LOGSHEET_PHOTOS); // Clear CT photo draft - NEW from v1.7.1
        
        setTimeout(() => navigateTo('homeScreen'), 1500);
        
    } catch (error) {
        console.error('Error sending CT data:', error);
        progress.error();
        
        let offlineData = JSON.parse(localStorage.getItem(DRAFT_KEYS_CT.OFFLINE) || '[]');
        offlineData.push(finalData);
        localStorage.setItem(DRAFT_KEYS_CT.OFFLINE, JSON.stringify(offlineData));
        
        setTimeout(() => {
            showCustomAlert('Gagal mengirim. Data disimpan lokal.', 'error');
        }, 500);
    }
}

// ============================================
// 18. UI & EVENT LISTENERS
// ============================================

function setupLoginListeners() {
    const usernameInput = document.getElementById('operatorUsername');
    const passwordInput = document.getElementById('operatorPassword');
    
    if (usernameInput) {
        usernameInput.addEventListener('input', hideLoginError);
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') passwordInput?.focus();
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', hideLoginError);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginOperator();
        });
    }
}

function setupTPMListeners() {
    const tpmCamera = document.getElementById('tpmCamera');
    if (tpmCamera) {
        tpmCamera.addEventListener('change', handleTPMPhoto);
    }
}

function setupParamPhotoListeners() {
    // NEW from v1.7.1 - Setup listeners for parameter photo
    const paramCamera = document.getElementById('paramCamera');
    if (paramCamera) {
        paramCamera.addEventListener('change', handleParamPhoto);
    }
    
    const ctParamCamera = document.getElementById('ctParamCamera');
    if (ctParamCamera) {
        ctParamCamera.addEventListener('change', handleCTParamPhoto);
    }
}

function simulateLoading() {
    let progress = 0;
    const loaderProgress = document.getElementById('loaderProgress');
    const loader = document.getElementById('loader');
    
    // Safety timeout - always hide loader after max 4 seconds
    const safetyTimeout = setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 4000);
    
    const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            clearTimeout(safetyTimeout);
            
            if (loaderProgress) loaderProgress.style.width = '100%';
            
            setTimeout(() => {
                if (loader) {
                    loader.style.opacity = '0';
                    loader.style.transition = 'opacity 0.5s ease';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }
            }, 300);
        } else {
            if (loaderProgress) loaderProgress.style.width = progress + '%';
        }
    }, 200);
}

function loadUserStats() {
    const totalAreas = Object.keys(AREAS).length;
    let completedAreas = 0;
    
    Object.entries(AREAS).forEach(([areaName, params]) => {
        const filled = currentInput[areaName] ? Object.keys(currentInput[areaName]).length : 0;
        if (filled === params.length && filled > 0) completedAreas++;
    });
    
    const statProgress = document.getElementById('statProgress');
    const statAreas = document.getElementById('statAreas');
    
    if (statProgress) {
        const percent = Math.round((completedAreas / totalAreas) * 100);
        statProgress.textContent = `${percent}%`;
    }
    
    if (statAreas) {
        statAreas.textContent = `${completedAreas}/${totalAreas}`;
    }
}

// ============================================
// 19. PWA INSTALL HANDLER
// ============================================

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    if (!isAppInstalled() && !installBannerShown) {
        setTimeout(() => showCustomInstallBanner(), 3000);
    }
});

window.addEventListener('appinstalled', () => {
    hideCustomInstallBanner();
    deferredPrompt = null;
    installBannerShown = true;
    showToast('âœ“ Aplikasi berhasil diinstall!', 'success');
});

function showCustomInstallBanner() {
    if (document.getElementById('customInstallBanner')) return;
    
    const banner = document.createElement('div');
    banner.id = 'customInstallBanner';
    banner.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 20px;
            padding: 32px 24px;
            width: 90%;
            max-width: 340px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            z-index: 10002;
            text-align: center;
            animation: scaleIn 0.3s ease;
        ">
            <div style="
                width: 80px;
                height: 80px;
                margin: 0 auto 20px;
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
            ">
                âš¡
            </div>
            
            <h3 style="color: #f8fafc; font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">
                Install Aplikasi
            </h3>
            
            <p style="color: #94a3b8; font-size: 0.875rem; margin-bottom: 24px; line-height: 1.5;">
                Tambahkan Turbine Log ke layar utama untuk akses lebih cepat.
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="installPWA()" style="
                    width: 100%;
                    padding: 14px 24px;
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    Install Sekarang
                </button>
                
                <button onclick="hideCustomInstallBanner()" style="
                    width: 100%;
                    padding: 12px 24px;
                    background: transparent;
                    color: #64748b;
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 12px;
                    font-size: 0.9375rem;
                    cursor: pointer;
                ">
                    Nanti Saja
                </button>
            </div>
        </div>
        
        <div style="
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: 10001;
        " onclick="hideCustomInstallBanner()"></div>
    `;
    
    document.body.appendChild(banner);
    installBannerShown = true;
}

function hideCustomInstallBanner() {
    const banner = document.getElementById('customInstallBanner');
    if (banner) {
        banner.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => banner.remove(), 200);
    }
}

async function installPWA() {
    if (!deferredPrompt) {
        showToast('Aplikasi sudah terinstall atau browser tidak mendukung', 'info');
        return;
    }
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        hideCustomInstallBanner();
        showToast('âœ“ Menginstall aplikasi...', 'success');
    } else {
        hideCustomInstallBanner();
    }
    
    deferredPrompt = null;
}

function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
}

function showToast(msg, type) {
    console.log(`[${type}] ${msg}`);
}

// ============================================
// 20. KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    const paramScreen = document.getElementById('paramScreen');
    const ctParamScreen = document.getElementById('ctParamScreen');
    
    if (paramScreen && paramScreen.classList.contains('active')) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentInputType !== 'select') saveStep();
        } else if (e.key === 'Escape') {
            goBack();
        }
    }
    
    if (ctParamScreen && ctParamScreen.classList.contains('active')) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentInputTypeCT !== 'select') saveCTStep();
        } else if (e.key === 'Escape') {
            goBackCT();
        }
    }
});

// ============================================
// 21. DOM READY INITIALIZATION
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    try {
        initState();
        
        const versionDisplay = document.getElementById('versionDisplay');
        if (versionDisplay) versionDisplay.textContent = APP_VERSION;
        
        initAuth();
        setupLoginListeners();
        setupTPMListeners();
        setupParamPhotoListeners(); // NEW from v1.7.1
        
        simulateLoading();
        
        console.log(`${APP_NAME} v${APP_VERSION} initialized successfully`);
    } catch (e) {
        console.error('Error during initialization:', e);
        // Ensure loader is hidden even if there's an error
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }
});
