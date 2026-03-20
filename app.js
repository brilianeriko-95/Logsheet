// ============================================
// TURBINE LOGSHEET PRO - FULL APPLICATION
// Version: 1.6.1 (Photo Validation Feature)
// ============================================

// ============================================
// 1. KONFIGURASI & KONSTANTA
// ============================================
const APP_VERSION = '1.6.1';
const APP_NAME = 'Turbine Logsheet Pro';

const AUTH_CONFIG = {
    SESSION_KEY: 'turbine_session',
    USER_KEY: 'turbine_user',
    USERS_CACHE_KEY: 'turbine_users_cache',
    SESSION_DURATION: 8 * 60 * 60 * 1000,        // 8 jam
    REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000  // 30 hari
};

const DRAFT_KEYS = {
    LOGSHEET: 'draft_turbine',
    LOGSHEET_BACKUP: 'draft_turbine_backup',
    BALANCING: 'balancing_draft',
    TPM_OFFLINE: 'tpm_offline',
    LOGSHEET_OFFLINE: 'offline_logsheets',
    BALANCING_OFFLINE: 'balancing_offline',
    TPM_HISTORY: 'tpm_history',
    BALANCING_HISTORY: 'balancing_history'
};

const DRAFT_KEYS_CT = {
    LOGSHEET: 'draft_ct_logsheet',
    OFFLINE: 'offline_ct_logsheets'
};

// ============================================
// PHOTO VALIDATION KEYS - NEW v1.6.1
// ============================================
const PHOTO_KEYS = {
    TURBINE: 'turbine_logsheet_photos',
    CT: 'ct_logsheet_photos',
    CURRENT_TURBINE: 'current_turbine_photo',
    CURRENT_CT: 'current_ct_photo'
};

// URL Google Apps Script Backend
const GAS_URL = "https://script.google.com/macros/s/AKfycbzFDztUKfkZr2wR-XnTMOHScU6kSfJqihCi7umKnhnSAy1bl3jN7lPDzJAEFFN2qFHXog/exec";

// Fallback users untuk mode offline (legacy support)
const OFFLINE_USERS = {
    'admin': { password: 'admin123', role: 'admin', name: 'Administrator', department: 'Unit Utilitas 3B' },
    'operator': { password: 'operator123', role: 'operator', name: 'Operator Shift', department: 'Unit Utilitas 3B' },
    'utilitas3b': { password: 'pgresik2024', role: 'operator', name: 'Unit Utilitas 3B', department: 'Unit Utilitas 3B' }
};

// Field configuration untuk Balancing
const BALANCING_FIELDS = [
    'balancingDate', 'balancingTime',
    'loadMW', 'eksporMW',
    'plnMW', 'ubbMW', 'pieMW', 'tg65MW', 'tg66MW', 'gtgMW',
    'ss6500MW', 'ss2000Via', 'activePowerMW', 'reactivePowerMVAR', 
    'currentS', 'voltageV', 'hvs65l02MW', 'hvs65l02Current', 'total3BMW',
    'fq1105',
    'stgSteam', 'pa2Steam', 'puri2Steam', 'melterSA2', 
    'ejectorSteam', 'glandSealSteam', 'deaeratorSteam', 
    'dumpCondenser', 'pcv6105',
    'pi6122', 'ti6112', 'ti6146', 'ti6126', 
    'axialDisplacement', 'vi6102', 'te6134',
    'ctSuFan', 'ctSuPompa', 'ctSaFan', 'ctSaPompa',
    'kegiatanShift'
];

// ============================================
// 2. DATA STRUKTUR AREA
// ============================================

// Struktur Area Turbine Logsheet
const AREAS = {
    "Steam Inlet Turbine": [
        "MPS Inlet 30-TP-6101 PI-6114 (kg/cm2)", 
        "MPS Inlet 30-TP-6101 TI-6153 (°C)", 
        "MPS Inlet 30-TP-6101 PI-6116 (kg/cm2)", 
        "LPS Extrac 30-TP-6101 PI-6123 (kg/cm2)", 
        "Gland Steam TI-6156 (°C)", 
        "MPS Inlet 30-TP-6101 PI-6108 (Kg/cm2)", 
        "Exhaust Steam PI-6111 (kg/cm2)", 
        "Gland Steam PI-6118 (Kg/cm2)"
    ],
    "Low Pressure Steam": [
        "LPS from U-6101 PI-6104 (kg/cm2)", 
        "LPS from U-6101 TI-6102 (°C)", 
        "LPS Header PI-6106 (Kg/cm2)", 
        "LPS Header TI-6107 (°C)"
    ],
    "Lube Oil": [
        "Lube Oil 30-TK-6102 LI-6104 (%)", 
        "Lube Oil 30-TK-6102 TI-6125 (°C)", 
        "Lube Oil 30-C-6101 (On/Off)", 
        "Lube Oil 30-EH-6102 (On/Off)", 
        "Lube Oil Cartridge FI-6143 (%)", 
        "Lube Oil Cartridge PI-6148 (mmH2O)", 
        "Lube Oil Cartridge PI-6149 (mmH2O)", 
        "Lube Oil PI-6145 (kg/cm2)", 
        "Lube Oil E-6104 (A/B)", 
        "Lube Oil TI-6127 (°C)", 
        "Lube Oil FIL-6101 (A/B)", 
        "Lube Oil PDI-6146 (Kg/cm2)", 
        "Lube Oil PI-6143 (Kg/cm2)", 
        "Lube Oil TI-6144 (°C)", 
        "Lube Oil TI-6146 (°C)", 
        "Lube Oil 30-E-6103 (A/B)"
    ],
    "Control Oil": [
        "Control Oil TI-6147 (°C)", 
        "Control Oil PI-6147 (kg/cm2)", 
        "Control Oil 30-E-6101 (A/B)"
    ],
    "Steam Turbine": [
        "Turbine Speed SI-6101 (rpm)", 
        "Turbine Axial Displacement ZT-6101 (mm)", 
        "Turbine Vibration VI-6102 (mm)", 
        "Turbine Vibration VI-6103 (mm)", 
        "Turbine Vibration VI-6104 (mm)"
    ],
    "Generator": [
        "Generator MW FI-6101 (MW)", 
        "Generator MVAR FI-6102 (MVAR)", 
        "Generator Current IA (A)", 
        "Generator Voltage V (V)", 
        "Generator Frequency (Hz)", 
        "Generator Power Factor (pf)"
    ],
    "Vacuum & Condensate": [
        "Condenser Vacuum PI-6103 (mmHg)", 
        "Condenser Vacuum PI-6113 (mmHg)", 
        "Condensate Pump 30-P-6101 (A/B)", 
        "Condensate Pump 30-P-6102 (A/B)", 
        "Condensate Pump 30-P-6103 (A/B)", 
        "Condensate Tank 30-TK-6101 LI-6102 (%)", 
        "Condensate Tank 30-TK-6101 LI-6103 (%)", 
        "Condensate Tank 30-TK-6101 TI-6101 (°C)"
    ],
    "Cooling Water": [
        "CW Inlet TI-6103 (°C)", 
        "CW Outlet TI-6104 (°C)", 
        "CW Pump 30-P-6104 (A/B)", 
        "CW Pump 30-P-6105 (A/B)", 
        "CW Pump 30-P-6106 (A/B)"
    ],
    "Circulating Water": [
        "Circulating Water Pump 30-P-6107 (A/B)", 
        "Circulating Water Pump 30-P-6108 (A/B)", 
        "Circulating Water Pump 30-P-6109 (A/B)", 
        "Circulating Water Temperature TI-6105 (°C)"
    ],
    "Steam Extraction": [
        "Extraction Steam PI-6109 (kg/cm2)", 
        "Extraction Steam TI-6106 (°C)", 
        "Extraction Steam PI-6110 (kg/cm2)"
    ]
};

// Struktur Area Cooling Tower Logsheet
const AREAS_CT = {
    "Basin SA": [
        "Basin SA Level LI-6201 (%)",
        "Basin SA Temp TI-6201 (°C)",
        "Basin SA Conductivity CI-6201 (µS/cm)",
        "Basin SA pH AI-6201",
        "Basin SA Turbidity TI-6201 (NTU)"
    ],
    "Basin SU": [
        "Basin SU Level LI-6301 (%)",
        "Basin SU Temp TI-6301 (°C)",
        "Basin SU Conductivity CI-6301 (µS/cm)",
        "Basin SU pH AI-6301",
        "Basin SU Turbidity TI-6301 (NTU)"
    ],
    "Pompa SA": [
        "Pompa SA-01 Status (Run/Stop)",
        "Pompa SA-01 Current (A)",
        "Pompa SA-02 Status (Run/Stop)",
        "Pompa SA-02 Current (A)",
        "Pompa SA-03 Status (Run/Stop)",
        "Pompa SA-03 Current (A)"
    ],
    "Pompa SU": [
        "Pompa SU-01 Status (Run/Stop)",
        "Pompa SU-01 Current (A)",
        "Pompa SU-02 Status (Run/Stop)",
        "Pompa SU-02 Current (A)",
        "Pompa SU-03 Status (Run/Stop)",
        "Pompa SU-03 Current (A)"
    ],
    "Fan SA": [
        "Fan SA-01 Status (Run/Stop)",
        "Fan SA-01 Vibration (mm/s)",
        "Fan SA-02 Status (Run/Stop)",
        "Fan SA-02 Vibration (mm/s)",
        "Fan SA-03 Status (Run/Stop)",
        "Fan SA-03 Vibration (mm/s)"
    ],
    "Fan SU": [
        "Fan SU-01 Status (Run/Stop)",
        "Fan SU-01 Vibration (mm/s)",
        "Fan SU-02 Status (Run/Stop)",
        "Fan SU-02 Vibration (mm/s)",
        "Fan SU-03 Status (Run/Stop)",
        "Fan SU-03 Vibration (mm/s)"
    ],
    "Chemical Dosing": [
        "Chlorine Dosing Rate (ppm)",
        "Scale Inhibitor Rate (ppm)",
        "pH Adjuster Rate (ppm)",
        "Biocide Rate (ppm)"
    ],
    "Make Up Water": [
        "Make Up Flow FI-6201 (m3/h)",
        "Make Up Totalizer (m3)",
        "Blow Down Flow FI-6202 (m3/h)",
        "Blow Down Totalizer (m3)"
    ]
};

// ============================================
// 3. STATE VARIABLES
// ============================================
let currentUser = null;
let currentInput = {};
let activeArea = "";
let activeIdx = 0;
let totalParams = 0;
let currentInputType = 'text';

let currentInputCT = {};
let activeAreaCT = "";
let activeIdxCT = 0;
let totalParamsCT = 0;
let currentInputTypeCT = 'text';

// ============================================
// PHOTO VALIDATION STATE - NEW v1.6.1
// ============================================
let currentLogsheetPhoto = null;  // Foto saat ini untuk Turbine
let currentCTLogsheetPhoto = null; // Foto saat ini untuk CT
let logsheetPhotos = {};           // Semua foto Turbine logsheet
let ctLogsheetPhotos = {};         // Semua foto CT logsheet

// ============================================
// 4. INITIALIZATION & SERVICE WORKER
// ============================================

// Inisialisasi data dari localStorage
function initState() {
    try {
        const savedDraft = localStorage.getItem(DRAFT_KEYS.LOGSHEET);
        if (savedDraft) currentInput = JSON.parse(savedDraft);
        
        const savedCTDraft = localStorage.getItem(DRAFT_KEYS_CT.LOGSHEET);
        if (savedCTDraft) currentInputCT = JSON.parse(savedCTDraft);
        
        // Load saved photos - NEW v1.6.1
        const savedPhotos = localStorage.getItem(PHOTO_KEYS.TURBINE);
        if (savedPhotos) logsheetPhotos = JSON.parse(savedPhotos);
        
        const savedCTPhotos = localStorage.getItem(PHOTO_KEYS.CT);
        if (savedCTPhotos) ctLogsheetPhotos = JSON.parse(savedCTPhotos);
        
        totalParams = Object.values(AREAS).reduce((acc, arr) => acc + arr.length, 0);
        totalParamsCT = Object.values(AREAS_CT).reduce((acc, arr) => acc + arr.length, 0);
    } catch (e) {
        console.error('Error loading state:', e);
    }
}

// Register Service Worker untuk PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(`./sw.js?v=${APP_VERSION}`)
            .then(registration => {
                console.log('SW registered:', registration.scope);
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showUpdateAlert();
                        }
                    });
                });
            })
            .catch(err => console.error('SW registration failed:', err));
            
        navigator.serviceWorker.addEventListener('message', event => {
            if (event.data?.type === 'VERSION_CHECK' && event.data.version !== APP_VERSION) {
                showUpdateAlert();
            }
        });
    });
}

// ============================================
// 5. UTILITY FUNCTIONS
// ============================================

function showUpdateAlert() {
    const updateAlert = document.getElementById('updateAlert');
    if (updateAlert) updateAlert.classList.remove('hidden');
}

function applyUpdate() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
}

function showCustomAlert(msg, type = 'success') {
    const customAlert = document.getElementById('customAlert');
    const alertContent = document.getElementById('alertContent');
    const alertTitle = document.getElementById('alertTitle');
    const alertMessage = document.getElementById('alertMessage');
    const alertIconWrapper = document.getElementById('alertIconWrapper');
    
    if (!customAlert || !alertContent || !alertTitle || !alertMessage || !alertIconWrapper) {
        console.error('Alert elements not found');
        alert(msg);
        return;
    }
    
    // Reset classes
    alertContent.className = 'alert-content';
    alertIconWrapper.className = 'alert-icon-wrapper';
    
    // Set content berdasarkan tipe
    if (type === 'success') {
        alertTitle.textContent = 'Berhasil';
        alertContent.classList.add('success');
        alertIconWrapper.innerHTML = `
            <svg viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" stroke="#10b981" stroke-width="3"/>
                <path d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none" stroke="#10b981" stroke-width="3"/>
            </svg>
        `;
    } else if (type === 'error') {
        alertTitle.textContent = 'Error';
        alertContent.classList.add('error');
        alertIconWrapper.innerHTML = `
            <svg viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" stroke="#ef4444" stroke-width="3"/>
                <path d="M16 16l20 20M36 16l-20 20" fill="none" stroke="#ef4444" stroke-width="3"/>
            </svg>
        `;
    } else if (type === 'warning') {
        alertTitle.textContent = 'Peringatan';
        alertContent.classList.add('warning');
        alertIconWrapper.innerHTML = `
            <svg viewBox="0 0 52 52">
                <path d="M26 3L3 49h46L26 3z" fill="none" stroke="#f59e0b" stroke-width="3"/>
                <path d="M26 20v12M26 38v4" fill="none" stroke="#f59e0b" stroke-width="3"/>
            </svg>
        `;
    } else {
        alertTitle.textContent = 'Informasi';
        alertContent.classList.add('info');
        alertIconWrapper.innerHTML = `
            <svg viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" stroke="#3b82f6" stroke-width="3"/>
                <path d="M26 14v6M26 26v12" fill="none" stroke="#3b82f6" stroke-width="3"/>
            </svg>
        `;
    }
    
    alertMessage.textContent = msg;
    customAlert.classList.remove('hidden');
}

function closeAlert() {
    const customAlert = document.getElementById('customAlert');
    if (customAlert) customAlert.classList.add('hidden');
}

function showLoader(show = true) {
    const loader = document.getElementById('loader');
    if (loader) {
        if (show) {
            loader.classList.remove('hidden');
            loader.style.display = 'flex';
        } else {
            loader.classList.add('hidden');
            loader.style.display = 'none';
        }
    }
}

function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function getShiftInfo() {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 15) return { shift: 1, name: 'Shift 1 (07:00-15:00)' };
    if (hour >= 15 && hour < 23) return { shift: 2, name: 'Shift 2 (15:00-23:00)' };
    return { shift: 3, name: 'Shift 3 (23:00-07:00)' };
}

function isOnline() {
    return navigator.onLine;
}

function safeJSONParse(str, defaultVal = {}) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return defaultVal;
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============================================
// 6. AUTHENTICATION FUNCTIONS
// ============================================

async function loginOperator() {
    const usernameInput = document.getElementById('operatorUsername');
    const passwordInput = document.getElementById('operatorPassword');
    const errorEl = document.getElementById('loginError');
    
    if (!usernameInput || !passwordInput) {
        console.error('Login inputs not found');
        return;
    }
    
    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    
    if (!username || !password) {
        if (errorEl) {
            errorEl.textContent = 'Username dan password wajib diisi';
            errorEl.style.display = 'block';
        }
        return;
    }
    
    // Cek offline users terlebih dahulu
    if (OFFLINE_USERS[username] && OFFLINE_USERS[username].password === password) {
        currentUser = { 
            username, 
            ...OFFLINE_USERS[username],
            loginTime: Date.now()
        };
        saveSession();
        showHomeScreen();
        return;
    }
    
    // Coba login via GAS jika online
    if (isOnline()) {
        try {
            showLoader(true);
            const response = await fetch(`${GAS_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
            const result = await response.json();
            
            if (result.success) {
                currentUser = {
                    username,
                    ...result.user,
                    loginTime: Date.now()
                };
                saveSession();
                showHomeScreen();
            } else {
                if (errorEl) {
                    errorEl.textContent = result.message || 'Username atau password salah';
                    errorEl.style.display = 'block';
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            if (errorEl) {
                errorEl.textContent = 'Gagal terhubung ke server. Coba lagi.';
                errorEl.style.display = 'block';
            }
        } finally {
            showLoader(false);
        }
    } else {
        if (errorEl) {
            errorEl.textContent = 'Mode offline - gunakan akun default';
            errorEl.style.display = 'block';
        }
    }
}

function saveSession() {
    if (currentUser) {
        localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(currentUser));
        localStorage.setItem(AUTH_CONFIG.SESSION_KEY, Date.now().toString());
    }
}

function loadSession() {
    const sessionTime = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
    const userData = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    
    if (sessionTime && userData) {
        const elapsed = Date.now() - parseInt(sessionTime);
        if (elapsed < AUTH_CONFIG.SESSION_DURATION) {
            currentUser = safeJSONParse(userData);
            return true;
        }
    }
    return false;
}

function logoutOperator() {
    currentUser = null;
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
    localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    showLoginScreen();
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('operatorPassword');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput && eyeIcon) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            `;
        } else {
            passwordInput.type = 'password';
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            `;
        }
    }
}

// ============================================
// 7. NAVIGATION FUNCTIONS
// ============================================

function navigateTo(screenId) {
    // Update user info di logsheetSelectScreen jika diperlukan
    if (screenId === 'logsheetSelectScreen' && currentUser) {
        const userEl = document.getElementById('logsheetSelectUser');
        if (userEl) userEl.textContent = currentUser.name || currentUser.username;
    }
    
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        window.scrollTo(0, 0);
    }
    
    // Screen-specific initialization
    if (screenId === 'homeScreen') {
        updateHomeScreen();
    } else if (screenId === 'areaListScreen') {
        renderAreaList();
    } else if (screenId === 'ctAreaListScreen') {
        renderCTAreaList();
    } else if (screenId === 'balancingScreen') {
        initBalancingScreen();
    }
}

function showLoginScreen() {
    navigateTo('loginScreen');
    const versionDisplay = document.getElementById('versionDisplay');
    if (versionDisplay) versionDisplay.textContent = APP_VERSION;
}

function showHomeScreen() {
    navigateTo('homeScreen');
}

function updateHomeScreen() {
    const displayName = document.getElementById('displayUserName');
    if (displayName && currentUser) {
        displayName.textContent = currentUser.name || currentUser.username;
    }
}

// ============================================
// 8. TURBINE LOGSHEET FUNCTIONS
// ============================================

function renderAreaList() {
    const areaList = document.getElementById('areaList');
    const areaListUser = document.getElementById('areaListUser');
    const progressText = document.getElementById('progressText');
    const overallPercent = document.getElementById('overallPercent');
    const overallProgressBar = document.getElementById('overallProgressBar');
    
    if (areaListUser && currentUser) {
        areaListUser.textContent = currentUser.name || currentUser.username;
    }
    
    if (!areaList) return;
    
    areaList.innerHTML = '';
    let completedCount = 0;
    
    Object.entries(AREAS).forEach(([areaName, params]) => {
        const areaCompleted = params.filter(p => currentInput[p] !== undefined).length;
        const areaPercent = Math.round((areaCompleted / params.length) * 100);
        completedCount += areaCompleted;
        
        // Cek apakah ada foto untuk area ini
        const hasPhotos = params.some(p => logsheetPhotos[p]);
        const photoIndicator = hasPhotos ? '<span class="photo-indicator" title="Ada foto"></span>' : '';
        
        const areaItem = document.createElement('div');
        areaItem.className = 'area-item';
        areaItem.onclick = () => openArea(areaName);
        areaItem.innerHTML = `
            <div class="area-info">
                <div class="area-name">${areaName} ${photoIndicator}</div>
                <div class="area-progress">${areaCompleted}/${params.length} parameter</div>
            </div>
            <div class="area-percent">${areaPercent}%</div>
            <div class="area-bar">
                <div class="area-bar-fill" style="width: ${areaPercent}%"></div>
            </div>
        `;
        areaList.appendChild(areaItem);
    });
    
    const totalPercent = Math.round((completedCount / totalParams) * 100);
    if (progressText) progressText.textContent = `${totalPercent}% Complete`;
    if (overallPercent) overallPercent.textContent = `${totalPercent}%`;
    if (overallProgressBar) overallProgressBar.style.width = `${totalPercent}%`;
    
    // Show/hide submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.style.display = completedCount > 0 ? 'flex' : 'none';
    }
}

function openArea(areaName) {
    activeArea = areaName;
    activeIdx = 0;
    navigateTo('paramScreen');
    renderParamInput();
}

function renderParamInput() {
    const params = AREAS[activeArea];
    const paramName = params[activeIdx];
    const currentValue = currentInput[paramName];
    
    // Update header info
    const currentAreaName = document.getElementById('currentAreaName');
    const labelInput = document.getElementById('labelInput');
    const stepInfo = document.getElementById('stepInfo');
    const areaProgress = document.getElementById('areaProgress');
    const paramUser = document.getElementById('paramUser');
    const unitDisplay = document.getElementById('unitDisplay');
    const valInput = document.getElementById('valInput');
    const prevValDisplay = document.getElementById('prevValDisplay');
    const lastTimeLabel = document.getElementById('lastTimeLabel');
    
    if (currentAreaName) currentAreaName.textContent = activeArea;
    if (labelInput) labelInput.textContent = paramName;
    if (stepInfo) stepInfo.textContent = `${activeIdx + 1}/${params.length}`;
    if (areaProgress) areaProgress.textContent = `${activeIdx + 1}/${params.length}`;
    if (paramUser && currentUser) paramUser.textContent = currentUser.name || currentUser.username;
    
    // Extract unit from parameter name
    const unitMatch = paramName.match(/\(([^)]+)\)$/);
    if (unitDisplay) unitDisplay.textContent = unitMatch ? unitMatch[1] : '--';
    
    // Set input value
    if (valInput) {
        valInput.value = currentValue !== undefined ? currentValue : '';
        valInput.focus();
    }
    
    // Show previous value if exists
    if (prevValDisplay) {
        prevValDisplay.textContent = currentValue !== undefined ? currentValue : '--';
    }
    
    // Update time label
    if (lastTimeLabel) {
        lastTimeLabel.textContent = formatTime(new Date());
    }
    
    // Render progress dots
    renderProgressDots();
    
    // ============================================
    // PHOTO VALIDATION - NEW v1.6.1
    // ============================================
    loadLogsheetPhoto(paramName);
}

function renderProgressDots() {
    const dotsContainer = document.getElementById('progressDots');
    if (!dotsContainer) return;
    
    const params = AREAS[activeArea];
    dotsContainer.innerHTML = '';
    
    params.forEach((param, idx) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        
        // Add has-photo class if photo exists
        if (logsheetPhotos[param]) {
            dot.classList.add('has-photo');
        }
        
        // Add has-issue class if status is abnormal
        const status = currentInput[`${param}_status`];
        if (status && status !== 'NORMAL') {
            dot.classList.add('has-issue');
        }
        
        if (idx === activeIdx) dot.classList.add('active');
        if (currentInput[param] !== undefined) dot.classList.add('filled');
        
        dot.onclick = () => {
            activeIdx = idx;
            renderParamInput();
        };
        
        dotsContainer.appendChild(dot);
    });
}

// ============================================
// PHOTO VALIDATION FUNCTIONS - NEW v1.6.1
// ============================================

function handleLogsheetPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentLogsheetPhoto = e.target.result;
        updateLogsheetPhotoUI(true);
    };
    reader.readAsDataURL(file);
}

function updateLogsheetPhotoUI(hasPhoto) {
    const photoPreview = document.getElementById('photoPreview');
    const btnTakePhoto = document.getElementById('btnTakePhoto');
    const btnTakePhotoText = document.getElementById('btnTakePhotoText');
    const btnRetakePhoto = document.getElementById('btnRetakePhoto');
    const photoBadge = document.getElementById('photoBadge');
    const photoBadgeText = document.getElementById('photoBadgeText');
    
    if (hasPhoto && currentLogsheetPhoto) {
        // Update preview
        if (photoPreview) {
            photoPreview.innerHTML = `<img src="${currentLogsheetPhoto}" alt="Parameter Photo">`;
            photoPreview.classList.add('has-photo');
        }
        
        // Update button
        if (btnTakePhoto) {
            btnTakePhoto.classList.add('has-photo');
        }
        if (btnTakePhotoText) {
            btnTakePhotoText.textContent = 'Foto Tersimpan';
        }
        
        // Show retake button
        if (btnRetakePhoto) {
            btnRetakePhoto.style.display = 'flex';
        }
        
        // Update badge
        if (photoBadge) {
            photoBadge.classList.remove('no-photo');
            photoBadge.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Foto tersimpan</span>
            `;
        }
    } else {
        // Reset preview
        if (photoPreview) {
            photoPreview.innerHTML = `
                <div class="photo-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <span>Ambil foto parameter</span>
                </div>
            `;
            photoPreview.classList.remove('has-photo');
        }
        
        // Reset button
        if (btnTakePhoto) {
            btnTakePhoto.classList.remove('has-photo');
        }
        if (btnTakePhotoText) {
            btnTakePhotoText.textContent = 'Ambil Foto';
        }
        
        // Hide retake button
        if (btnRetakePhoto) {
            btnRetakePhoto.style.display = 'none';
        }
        
        // Reset badge
        if (photoBadge) {
            photoBadge.classList.add('no-photo');
            photoBadge.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Belum ada foto</span>
            `;
        }
    }
}

function retakeLogsheetPhoto() {
    currentLogsheetPhoto = null;
    updateLogsheetPhotoUI(false);
    document.getElementById('logsheetCamera').click();
}

function loadLogsheetPhoto(paramName) {
    // Load existing photo for this parameter
    currentLogsheetPhoto = logsheetPhotos[paramName] || null;
    updateLogsheetPhotoUI(!!currentLogsheetPhoto);
}

function saveLogsheetPhoto() {
    const params = AREAS[activeArea];
    const paramName = params[activeIdx];
    
    if (currentLogsheetPhoto) {
        logsheetPhotos[paramName] = currentLogsheetPhoto;
        localStorage.setItem(PHOTO_KEYS.TURBINE, JSON.stringify(logsheetPhotos));
    }
}

// ============================================
// STATUS ABNORMAL FUNCTIONS
// ============================================

function handleStatusChange(checkbox) {
    const statusNoteContainer = document.getElementById('statusNoteContainer');
    const statusChips = document.querySelectorAll('.status-chip input[name="paramStatus"]');
    
    // Uncheck other checkboxes
    statusChips.forEach(chip => {
        if (chip !== checkbox) {
            chip.checked = false;
            chip.closest('.status-chip').classList.remove('selected');
        }
    });
    
    // Toggle selected class
    if (checkbox.checked) {
        checkbox.closest('.status-chip').classList.add('selected');
        if (statusNoteContainer) {
            statusNoteContainer.style.display = 'block';
        }
    } else {
        checkbox.closest('.status-chip').classList.remove('selected');
        if (statusNoteContainer) {
            statusNoteContainer.style.display = 'none';
        }
    }
}

// ============================================
// SAVE & NAVIGATION FUNCTIONS
// ============================================

function saveStep() {
    const params = AREAS[activeArea];
    const paramName = params[activeIdx];
    const valInput = document.getElementById('valInput');
    
    if (valInput) {
        const value = valInput.value.trim();
        if (value) {
            currentInput[paramName] = value;
            
            // Save status if any
            const statusChips = document.querySelectorAll('.status-chip input[name="paramStatus"]:checked');
            if (statusChips.length > 0) {
                currentInput[`${paramName}_status`] = statusChips[0].value;
                const statusNote = document.getElementById('statusNote');
                if (statusNote && statusNote.value.trim()) {
                    currentInput[`${paramName}_note`] = statusNote.value.trim();
                }
            } else {
                currentInput[`${paramName}_status`] = 'NORMAL';
            }
            
            // Save photo - NEW v1.6.1
            saveLogsheetPhoto();
            
            // Save to localStorage
            localStorage.setItem(DRAFT_KEYS.LOGSHEET, JSON.stringify(currentInput));
        }
    }
    
    // Move to next parameter
    if (activeIdx < params.length - 1) {
        activeIdx++;
        renderParamInput();
    } else {
        // Area complete, go back to area list
        navigateTo('areaListScreen');
    }
}

function goBack() {
    if (activeIdx > 0) {
        activeIdx--;
        renderParamInput();
    } else {
        navigateTo('areaListScreen');
    }
}

// ============================================
// 9. CT LOGSHEET FUNCTIONS
// ============================================

function renderCTAreaList() {
    const ctAreaList = document.getElementById('ctAreaList');
    const ctAreaListUser = document.getElementById('ctAreaListUser');
    const ctProgressText = document.getElementById('ctProgressText');
    const ctOverallPercent = document.getElementById('ctOverallPercent');
    const ctOverallProgressBar = document.getElementById('ctOverallProgressBar');
    
    if (ctAreaListUser && currentUser) {
        ctAreaListUser.textContent = currentUser.name || currentUser.username;
    }
    
    if (!ctAreaList) return;
    
    ctAreaList.innerHTML = '';
    let completedCount = 0;
    
    Object.entries(AREAS_CT).forEach(([areaName, params]) => {
        const areaCompleted = params.filter(p => currentInputCT[p] !== undefined).length;
        const areaPercent = Math.round((areaCompleted / params.length) * 100);
        completedCount += areaCompleted;
        
        // Cek apakah ada foto untuk area ini
        const hasPhotos = params.some(p => ctLogsheetPhotos[p]);
        const photoIndicator = hasPhotos ? '<span class="photo-indicator" title="Ada foto"></span>' : '';
        
        const areaItem = document.createElement('div');
        areaItem.className = 'area-item ct-area';
        areaItem.onclick = () => openCTArea(areaName);
        areaItem.innerHTML = `
            <div class="area-info">
                <div class="area-name">${areaName} ${photoIndicator}</div>
                <div class="area-progress">${areaCompleted}/${params.length} parameter</div>
            </div>
            <div class="area-percent">${areaPercent}%</div>
            <div class="area-bar">
                <div class="area-bar-fill" style="width: ${areaPercent}%; background: linear-gradient(90deg, #3b82f6, #60a5fa);"></div>
            </div>
        `;
        ctAreaList.appendChild(areaItem);
    });
    
    const totalPercent = Math.round((completedCount / totalParamsCT) * 100);
    if (ctProgressText) ctProgressText.textContent = `${totalPercent}% Complete`;
    if (ctOverallPercent) ctOverallPercent.textContent = `${totalPercent}%`;
    if (ctOverallProgressBar) ctOverallProgressBar.style.width = `${totalPercent}%`;
    
    // Show/hide submit button
    const ctSubmitBtn = document.getElementById('ctSubmitBtn');
    if (ctSubmitBtn) {
        ctSubmitBtn.style.display = completedCount > 0 ? 'flex' : 'none';
    }
}

function openCTArea(areaName) {
    activeAreaCT = areaName;
    activeIdxCT = 0;
    navigateTo('ctParamScreen');
    renderCTParamInput();
}

function renderCTParamInput() {
    const params = AREAS_CT[activeAreaCT];
    const paramName = params[activeIdxCT];
    const currentValue = currentInputCT[paramName];
    
    // Update header info
    const ctCurrentAreaName = document.getElementById('ctCurrentAreaName');
    const ctLabelInput = document.getElementById('ctLabelInput');
    const ctStepInfo = document.getElementById('ctStepInfo');
    const ctAreaProgress = document.getElementById('ctAreaProgress');
    const ctParamUser = document.getElementById('ctParamUser');
    const ctUnitDisplay = document.getElementById('ctUnitDisplay');
    const ctValInput = document.getElementById('ctValInput');
    const ctPrevValDisplay = document.getElementById('ctPrevValDisplay');
    const ctLastTimeLabel = document.getElementById('ctLastTimeLabel');
    
    if (ctCurrentAreaName) ctCurrentAreaName.textContent = activeAreaCT;
    if (ctLabelInput) ctLabelInput.textContent = paramName;
    if (ctStepInfo) ctStepInfo.textContent = `${activeIdxCT + 1}/${params.length}`;
    if (ctAreaProgress) ctAreaProgress.textContent = `${activeIdxCT + 1}/${params.length}`;
    if (ctParamUser && currentUser) ctParamUser.textContent = currentUser.name || currentUser.username;
    
    // Extract unit from parameter name
    const unitMatch = paramName.match(/\(([^)]+)\)$/);
    if (ctUnitDisplay) ctUnitDisplay.textContent = unitMatch ? unitMatch[1] : '--';
    
    // Set input value
    if (ctValInput) {
        ctValInput.value = currentValue !== undefined ? currentValue : '';
        ctValInput.focus();
    }
    
    // Show previous value if exists
    if (ctPrevValDisplay) {
        ctPrevValDisplay.textContent = currentValue !== undefined ? currentValue : '--';
    }
    
    // Update time label
    if (ctLastTimeLabel) {
        ctLastTimeLabel.textContent = formatTime(new Date());
    }
    
    // Render progress dots
    renderCTProgressDots();
    
    // ============================================
    // PHOTO VALIDATION FOR CT - NEW v1.6.1
    // ============================================
    loadCTLogsheetPhoto(paramName);
}

function renderCTProgressDots() {
    const dotsContainer = document.getElementById('ctProgressDots');
    if (!dotsContainer) return;
    
    const params = AREAS_CT[activeAreaCT];
    dotsContainer.innerHTML = '';
    
    params.forEach((param, idx) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot ct-dot';
        
        // Add has-photo class if photo exists
        if (ctLogsheetPhotos[param]) {
            dot.classList.add('has-photo');
        }
        
        // Add has-issue class if status is abnormal
        const status = currentInputCT[`${param}_status`];
        if (status && status !== 'NORMAL') {
            dot.classList.add('has-issue');
        }
        
        if (idx === activeIdxCT) dot.classList.add('active');
        if (currentInputCT[param] !== undefined) dot.classList.add('filled');
        
        dot.onclick = () => {
            activeIdxCT = idx;
            renderCTParamInput();
        };
        
        dotsContainer.appendChild(dot);
    });
}

// ============================================
// CT PHOTO VALIDATION FUNCTIONS - NEW v1.6.1
// ============================================

function handleCTLogsheetPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentCTLogsheetPhoto = e.target.result;
        updateCTLogsheetPhotoUI(true);
    };
    reader.readAsDataURL(file);
}

function updateCTLogsheetPhotoUI(hasPhoto) {
    const photoPreview = document.getElementById('ctPhotoPreview');
    const btnTakePhoto = document.getElementById('ctBtnTakePhoto');
    const btnTakePhotoText = document.getElementById('ctBtnTakePhotoText');
    const btnRetakePhoto = document.getElementById('ctBtnRetakePhoto');
    const photoBadge = document.getElementById('ctPhotoBadge');
    
    if (hasPhoto && currentCTLogsheetPhoto) {
        // Update preview
        if (photoPreview) {
            photoPreview.innerHTML = `<img src="${currentCTLogsheetPhoto}" alt="Parameter Photo">`;
            photoPreview.classList.add('has-photo');
        }
        
        // Update button
        if (btnTakePhoto) {
            btnTakePhoto.classList.add('has-photo');
        }
        if (btnTakePhotoText) {
            btnTakePhotoText.textContent = 'Foto Tersimpan';
        }
        
        // Show retake button
        if (btnRetakePhoto) {
            btnRetakePhoto.style.display = 'flex';
        }
        
        // Update badge
        if (photoBadge) {
            photoBadge.classList.remove('no-photo');
            photoBadge.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Foto tersimpan</span>
            `;
        }
    } else {
        // Reset preview
        if (photoPreview) {
            photoPreview.innerHTML = `
                <div class="photo-placeholder">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <span>Ambil foto parameter</span>
                </div>
            `;
            photoPreview.classList.remove('has-photo');
        }
        
        // Reset button
        if (btnTakePhoto) {
            btnTakePhoto.classList.remove('has-photo');
        }
        if (btnTakePhotoText) {
            btnTakePhotoText.textContent = 'Ambil Foto';
        }
        
        // Hide retake button
        if (btnRetakePhoto) {
            btnRetakePhoto.style.display = 'none';
        }
        
        // Reset badge
        if (photoBadge) {
            photoBadge.classList.add('no-photo');
            photoBadge.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                </svg>
                <span>Belum ada foto</span>
            `;
        }
    }
}

function retakeCTLogsheetPhoto() {
    currentCTLogsheetPhoto = null;
    updateCTLogsheetPhotoUI(false);
    document.getElementById('ctLogsheetCamera').click();
}

function loadCTLogsheetPhoto(paramName) {
    // Load existing photo for this parameter
    currentCTLogsheetPhoto = ctLogsheetPhotos[paramName] || null;
    updateCTLogsheetPhotoUI(!!currentCTLogsheetPhoto);
}

function saveCTLogsheetPhoto() {
    const params = AREAS_CT[activeAreaCT];
    const paramName = params[activeIdxCT];
    
    if (currentCTLogsheetPhoto) {
        ctLogsheetPhotos[paramName] = currentCTLogsheetPhoto;
        localStorage.setItem(PHOTO_KEYS.CT, JSON.stringify(ctLogsheetPhotos));
    }
}

// ============================================
// CT STATUS FUNCTIONS
// ============================================

function handleCTStatusChange(checkbox) {
    const statusNoteContainer = document.getElementById('ctStatusNoteContainer');
    const statusChips = document.querySelectorAll('.status-chip input[name="ctParamStatus"]');
    
    // Uncheck other checkboxes
    statusChips.forEach(chip => {
        if (chip !== checkbox) {
            chip.checked = false;
            chip.closest('.status-chip').classList.remove('selected');
        }
    });
    
    // Toggle selected class
    if (checkbox.checked) {
        checkbox.closest('.status-chip').classList.add('selected');
        if (statusNoteContainer) {
            statusNoteContainer.style.display = 'block';
        }
    } else {
        checkbox.closest('.status-chip').classList.remove('selected');
        if (statusNoteContainer) {
            statusNoteContainer.style.display = 'none';
        }
    }
}

// ============================================
// CT SAVE & NAVIGATION FUNCTIONS
// ============================================

function saveCTStep() {
    const params = AREAS_CT[activeAreaCT];
    const paramName = params[activeIdxCT];
    const ctValInput = document.getElementById('ctValInput');
    
    if (ctValInput) {
        const value = ctValInput.value.trim();
        if (value) {
            currentInputCT[paramName] = value;
            
            // Save status if any
            const statusChips = document.querySelectorAll('.status-chip input[name="ctParamStatus"]:checked');
            if (statusChips.length > 0) {
                currentInputCT[`${paramName}_status`] = statusChips[0].value;
                const ctStatusNote = document.getElementById('ctStatusNote');
                if (ctStatusNote && ctStatusNote.value.trim()) {
                    currentInputCT[`${paramName}_note`] = ctStatusNote.value.trim();
                }
            } else {
                currentInputCT[`${paramName}_status`] = 'NORMAL';
            }
            
            // Save photo - NEW v1.6.1
            saveCTLogsheetPhoto();
            
            // Save to localStorage
            localStorage.setItem(DRAFT_KEYS_CT.LOGSHEET, JSON.stringify(currentInputCT));
        }
    }
    
    // Move to next parameter
    if (activeIdxCT < params.length - 1) {
        activeIdxCT++;
        renderCTParamInput();
    } else {
        // Area complete, go back to area list
        navigateTo('ctAreaListScreen');
    }
}

function goBackCT() {
    if (activeIdxCT > 0) {
        activeIdxCT--;
        renderCTParamInput();
    } else {
        navigateTo('ctAreaListScreen');
    }
}

// ============================================
// 10. SUBMIT FUNCTIONS (with Photos) - v1.6.1
// ============================================

async function sendToSheet() {
    if (!currentUser) {
        showCustomAlert('Silakan login terlebih dahulu', 'error');
        return;
    }
    
    const completedParams = Object.keys(currentInput).filter(k => !k.endsWith('_status') && !k.endsWith('_note'));
    if (completedParams.length === 0) {
        showCustomAlert('Belum ada data yang diisi', 'warning');
        return;
    }
    
    // Prepare data with photos
    const data = {
        action: 'submitLogsheet',
        username: currentUser.username,
        name: currentUser.name,
        timestamp: new Date().toISOString(),
        shift: getShiftInfo().shift,
        values: currentInput,
        photos: logsheetPhotos // Include photos - NEW v1.6.1
    };
    
    showLoader(true);
    
    try {
        if (isOnline()) {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            if (result.success) {
                // Clear data after successful submission
                currentInput = {};
                logsheetPhotos = {};
                localStorage.removeItem(DRAFT_KEYS.LOGSHEET);
                localStorage.removeItem(PHOTO_KEYS.TURBINE);
                
                showCustomAlert('Data logsheet berhasil dikirim!', 'success');
                navigateTo('homeScreen');
            } else {
                showCustomAlert(result.message || 'Gagal mengirim data', 'error');
            }
        } else {
            // Save to offline queue
            saveOfflineLogsheet(data);
            showCustomAlert('Data disimpan offline. Akan dikirim saat online.', 'warning');
        }
    } catch (error) {
        console.error('Submit error:', error);
        // Save to offline queue
        saveOfflineLogsheet(data);
        showCustomAlert('Gagal mengirim. Data disimpan offline.', 'warning');
    } finally {
        showLoader(false);
    }
}

async function sendCTToSheet() {
    if (!currentUser) {
        showCustomAlert('Silakan login terlebih dahulu', 'error');
        return;
    }
    
    const completedParams = Object.keys(currentInputCT).filter(k => !k.endsWith('_status') && !k.endsWith('_note'));
    if (completedParams.length === 0) {
        showCustomAlert('Belum ada data yang diisi', 'warning');
        return;
    }
    
    // Prepare data with photos
    const data = {
        action: 'submitCTLogsheet',
        username: currentUser.username,
        name: currentUser.name,
        timestamp: new Date().toISOString(),
        shift: getShiftInfo().shift,
        values: currentInputCT,
        photos: ctLogsheetPhotos // Include photos - NEW v1.6.1
    };
    
    showLoader(true);
    
    try {
        if (isOnline()) {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            if (result.success) {
                // Clear data after successful submission
                currentInputCT = {};
                ctLogsheetPhotos = {};
                localStorage.removeItem(DRAFT_KEYS_CT.LOGSHEET);
                localStorage.removeItem(PHOTO_KEYS.CT);
                
                showCustomAlert('Data logsheet CT berhasil dikirim!', 'success');
                navigateTo('homeScreen');
            } else {
                showCustomAlert(result.message || 'Gagal mengirim data', 'error');
            }
        } else {
            // Save to offline queue
            saveOfflineCTLogsheet(data);
            showCustomAlert('Data disimpan offline. Akan dikirim saat online.', 'warning');
        }
    } catch (error) {
        console.error('Submit error:', error);
        // Save to offline queue
        saveOfflineCTLogsheet(data);
        showCustomAlert('Gagal mengirim. Data disimpan offline.', 'warning');
    } finally {
        showLoader(false);
    }
}

function saveOfflineLogsheet(data) {
    const offlineData = safeJSONParse(localStorage.getItem(DRAFT_KEYS.LOGSHEET_OFFLINE), []);
    offlineData.push({
        ...data,
        id: generateId(),
        savedAt: new Date().toISOString()
    });
    localStorage.setItem(DRAFT_KEYS.LOGSHEET_OFFLINE, JSON.stringify(offlineData));
}

function saveOfflineCTLogsheet(data) {
    const offlineData = safeJSONParse(localStorage.getItem(DRAFT_KEYS_CT.OFFLINE), []);
    offlineData.push({
        ...data,
        id: generateId(),
        savedAt: new Date().toISOString()
    });
    localStorage.setItem(DRAFT_KEYS_CT.OFFLINE, JSON.stringify(offlineData));
}

// ============================================
// 11. TPM FUNCTIONS
// ============================================

let currentTPMArea = '';
let currentTPMPhoto = null;
let currentTPMStatus = '';

function openTPMArea(areaName) {
    currentTPMArea = areaName;
    currentTPMPhoto = null;
    currentTPMStatus = '';
    
    const tpmInputTitle = document.getElementById('tpmInputTitle');
    const tpmInputUser = document.getElementById('tpmInputUser');
    
    if (tpmInputTitle) tpmInputTitle.textContent = areaName;
    if (tpmInputUser && currentUser) tpmInputUser.textContent = currentUser.name || currentUser.username;
    
    // Reset form
    resetTPMForm();
    
    navigateTo('tpmInputScreen');
}

function resetTPMForm() {
    currentTPMPhoto = null;
    currentTPMStatus = '';
    
    // Reset photo preview
    const tpmPhotoPreview = document.getElementById('tpmPhotoPreview');
    if (tpmPhotoPreview) {
        tpmPhotoPreview.innerHTML = `
            <div class="photo-placeholder" style="text-align: center; color: #64748b;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 8px;">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                </svg>
                <div>Ambil Foto</div>
            </div>
        `;
    }
    
    // Reset status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset inputs
    const tpmNotes = document.getElementById('tpmNotes');
    const tpmAction = document.getElementById('tpmAction');
    if (tpmNotes) tpmNotes.value = '';
    if (tpmAction) tpmAction.value = '';
}

function handleTPMPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        currentTPMPhoto = e.target.result;
        
        const tpmPhotoPreview = document.getElementById('tpmPhotoPreview');
        if (tpmPhotoPreview) {
            tpmPhotoPreview.innerHTML = `<img src="${currentTPMPhoto}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">`;
        }
    };
    reader.readAsDataURL(file);
}

function selectTPMStatus(status) {
    currentTPMStatus = status;
    
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.borderColor = '#334155';
    });
    
    const selectedBtn = document.getElementById(`btn${status.charAt(0).toUpperCase() + status.slice(1)}`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
        
        // Set border color based on status
        const colors = {
            'normal': '#10b981',
            'abnormal': '#f59e0b',
            'off': '#ef4444'
        };
        selectedBtn.style.borderColor = colors[status] || '#334155';
    }
}

async function submitTPMData() {
    if (!currentUser) {
        showCustomAlert('Silakan login terlebih dahulu', 'error');
        return;
    }
    
    if (!currentTPMStatus) {
        showCustomAlert('Pilih status kondisi terlebih dahulu', 'warning');
        return;
    }
    
    const tpmNotes = document.getElementById('tpmNotes');
    const tpmAction = document.getElementById('tpmAction');
    
    const data = {
        action: 'submitTPM',
        username: currentUser.username,
        name: currentUser.name,
        area: currentTPMArea,
        status: currentTPMStatus,
        notes: tpmNotes ? tpmNotes.value : '',
        action: tpmAction ? tpmAction.value : '',
        photo: currentTPMPhoto,
        timestamp: new Date().toISOString(),
        shift: getShiftInfo().shift
    };
    
    showLoader(true);
    
    try {
        if (isOnline()) {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            if (result.success) {
                showCustomAlert('Data TPM berhasil disimpan!', 'success');
                navigateTo('tpmScreen');
            } else {
                showCustomAlert(result.message || 'Gagal menyimpan data', 'error');
            }
        } else {
            // Save to offline queue
            saveOfflineTPM(data);
            showCustomAlert('Data disimpan offline. Akan dikirim saat online.', 'warning');
            navigateTo('tpmScreen');
        }
    } catch (error) {
        console.error('TPM submit error:', error);
        saveOfflineTPM(data);
        showCustomAlert('Gagal mengirim. Data disimpan offline.', 'warning');
        navigateTo('tpmScreen');
    } finally {
        showLoader(false);
    }
}

function saveOfflineTPM(data) {
    const offlineData = safeJSONParse(localStorage.getItem(DRAFT_KEYS.TPM_OFFLINE), []);
    offlineData.push({
        ...data,
        id: generateId(),
        savedAt: new Date().toISOString()
    });
    localStorage.setItem(DRAFT_KEYS.TPM_OFFLINE, JSON.stringify(offlineData));
}

// ============================================
// 12. BALANCING FUNCTIONS
// ============================================

function initBalancingScreen() {
    const balancingUser = document.getElementById('balancingUser');
    const balancingDate = document.getElementById('balancingDate');
    const balancingTime = document.getElementById('balancingTime');
    const currentShiftBadge = document.getElementById('currentShiftBadge');
    const kegiatanShiftNum = document.getElementById('kegiatanShiftNum');
    const balancingShiftInfo = document.getElementById('balancingShiftInfo');
    
    if (balancingUser && currentUser) {
        balancingUser.textContent = currentUser.name || currentUser.username;
    }
    
    const now = new Date();
    const shiftInfo = getShiftInfo();
    
    if (balancingDate) balancingDate.value = now.toISOString().split('T')[0];
    if (balancingTime) balancingTime.value = now.toTimeString().slice(0, 5);
    if (currentShiftBadge) currentShiftBadge.textContent = `SHIFT ${shiftInfo.shift}`;
    if (kegiatanShiftNum) kegiatanShiftNum.textContent = shiftInfo.shift;
    if (balancingShiftInfo) balancingShiftInfo.textContent = `${shiftInfo.name} - Auto Update`;
    
    // Load draft if exists
    loadBalancingDraft();
}

function toggleSS2000Detail() {
    const ss2000Via = document.getElementById('ss2000Via');
    const ss2000Detail = document.getElementById('ss2000Detail');
    
    if (ss2000Via && ss2000Detail) {
        ss2000Detail.style.display = ss2000Via.value ? 'block' : 'none';
    }
}

function calculateLPBalance() {
    const fq1105 = parseFloat(document.getElementById('fq1105')?.value) || 0;
    const stgSteam = parseFloat(document.getElementById('stgSteam')?.value) || 0;
    const pa2Steam = parseFloat(document.getElementById('pa2Steam')?.value) || 0;
    const melterSA2 = parseFloat(document.getElementById('melterSA2')?.value) || 0;
    const ejectorSteam = parseFloat(document.getElementById('ejectorSteam')?.value) || 0;
    const glandSealSteam = parseFloat(document.getElementById('glandSealSteam')?.value) || 0;
    const puri2Steam = parseFloat(document.getElementById('puri2Steam')?.value) || 0;
    const deaeratorSteam = parseFloat(document.getElementById('deaeratorSteam')?.value) || 0;
    const dumpCondenser = parseFloat(document.getElementById('dumpCondenser')?.value) || 0;
    const pcv6105 = parseFloat(document.getElementById('pcv6105')?.value) || 0;
    
    const totalKonsumsi = stgSteam + pa2Steam + melterSA2 + ejectorSteam + glandSealSteam + 
                         puri2Steam + deaeratorSteam + dumpCondenser + pcv6105;
    
    const totalKonsumsiEl = document.getElementById('totalKonsumsiSteam');
    if (totalKonsumsiEl) {
        totalKonsumsiEl.textContent = totalKonsumsi.toFixed(1) + ' t/h';
    }
    
    const lpBalance = fq1105 - totalKonsumsi;
    const lpBalanceValue = document.getElementById('lpBalanceValue');
    const lpBalanceLabel = document.getElementById('lpBalanceLabel');
    const lpBalanceStatus = document.getElementById('lpBalanceStatus');
    const lpBalanceField = document.getElementById('lpBalanceField');
    
    if (lpBalanceValue) {
        lpBalanceValue.value = Math.abs(lpBalance).toFixed(1);
    }
    
    if (lpBalance >= 0) {
        if (lpBalanceLabel) lpBalanceLabel.textContent = 'LPS Ekspor ke SU 3A (t/h)';
        if (lpBalanceStatus) {
            lpBalanceStatus.textContent = 'Posisi: Ekspor ke 3A';
            lpBalanceStatus.style.color = '#10b981';
        }
        if (lpBalanceField) {
            lpBalanceField.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            lpBalanceField.style.background = 'rgba(16, 185, 129, 0.05)';
        }
        if (lpBalanceValue) {
            lpBalanceValue.style.borderColor = '#10b981';
            lpBalanceValue.style.color = '#10b981';
            lpBalanceValue.style.background = 'rgba(16, 185, 129, 0.1)';
        }
    } else {
        if (lpBalanceLabel) lpBalanceLabel.textContent = 'LPS Impor dari SU 3A (t/h)';
        if (lpBalanceStatus) {
            lpBalanceStatus.textContent = 'Posisi: Impor dari 3A';
            lpBalanceStatus.style.color = '#f59e0b';
        }
        if (lpBalanceField) {
            lpBalanceField.style.borderColor = 'rgba(245, 158, 11, 0.2)';
            lpBalanceField.style.background = 'rgba(245, 158, 11, 0.05)';
        }
        if (lpBalanceValue) {
            lpBalanceValue.style.borderColor = '#f59e0b';
            lpBalanceValue.style.color = '#f59e0b';
            lpBalanceValue.style.background = 'rgba(245, 158, 11, 0.1)';
        }
    }
}

function handleEksporInput(input) {
    const value = parseFloat(input.value) || 0;
    const eksporLabel = document.getElementById('eksporLabel');
    const eksporHint = document.getElementById('eksporHint');
    
    if (eksporLabel) {
        if (value < 0) {
            eksporLabel.textContent = 'Ekspor (MW)';
            eksporLabel.style.color = '#10b981';
            input.setAttribute('data-state', 'ekspor');
        } else if (value > 0) {
            eksporLabel.textContent = 'Impor (MW)';
            eksporLabel.style.color = '#f59e0b';
            input.setAttribute('data-state', 'impor');
        } else {
            eksporLabel.textContent = 'Ekspor (MW)';
            eksporLabel.style.color = '#94a3b8';
            input.removeAttribute('data-state');
        }
    }
}

function loadBalancingDraft() {
    const draft = localStorage.getItem(DRAFT_KEYS.BALANCING);
    if (!draft) return;
    
    try {
        const data = JSON.parse(draft);
        BALANCING_FIELDS.forEach(field => {
            const el = document.getElementById(field);
            if (el && data[field] !== undefined) {
                el.value = data[field];
            }
        });
        
        // Recalculate LP balance
        calculateLPBalance();
        
        // Update ekspor label
        const eksporMW = document.getElementById('eksporMW');
        if (eksporMW) handleEksporInput(eksporMW);
    } catch (e) {
        console.error('Error loading balancing draft:', e);
    }
}

function saveBalancingDraft() {
    const data = {};
    BALANCING_FIELDS.forEach(field => {
        const el = document.getElementById(field);
        if (el) {
            data[field] = el.value;
        }
    });
    localStorage.setItem(DRAFT_KEYS.BALANCING, JSON.stringify(data));
}

function loadLastBalancingData() {
    const history = safeJSONParse(localStorage.getItem(DRAFT_KEYS.BALANCING_HISTORY), []);
    if (history.length === 0) {
        showCustomAlert('Belum ada data balancing sebelumnya', 'warning');
        return;
    }
    
    const lastData = history[history.length - 1];
    BALANCING_FIELDS.forEach(field => {
        const el = document.getElementById(field);
        if (el && lastData[field] !== undefined) {
            el.value = lastData[field];
        }
    });
    
    calculateLPBalance();
    showCustomAlert('Data terakhir berhasil dimuat', 'success');
}

function resetBalancingForm() {
    if (!confirm('Yakin ingin mereset form? Data yang belum tersimpan akan hilang.')) {
        return;
    }
    
    BALANCING_FIELDS.forEach(field => {
        const el = document.getElementById(field);
        if (el) {
            el.value = '';
        }
    });
    
    // Reset defaults
    const melterSA2 = document.getElementById('melterSA2');
    const ejectorSteam = document.getElementById('ejectorSteam');
    const glandSealSteam = document.getElementById('glandSealSteam');
    const puri2Steam = document.getElementById('puri2Steam');
    const deaeratorSteam = document.getElementById('deaeratorSteam');
    const dumpCondenser = document.getElementById('dumpCondenser');
    const ctSuFan = document.getElementById('ctSuFan');
    const ctSuPompa = document.getElementById('ctSuPompa');
    const ctSaFan = document.getElementById('ctSaFan');
    const ctSaPompa = document.getElementById('ctSaPompa');
    
    if (melterSA2) melterSA2.value = '7.5';
    if (ejectorSteam) ejectorSteam.value = '2.5';
    if (glandSealSteam) glandSealSteam.value = '1';
    if (puri2Steam) puri2Steam.value = '1.4';
    if (deaeratorSteam) deaeratorSteam.value = '2.5';
    if (dumpCondenser) dumpCondenser.value = '5.0';
    if (ctSuFan) ctSuFan.value = '4';
    if (ctSuPompa) ctSuPompa.value = '2';
    if (ctSaFan) ctSaFan.value = '3';
    if (ctSaPompa) ctSaPompa.value = '2';
    
    calculateLPBalance();
    localStorage.removeItem(DRAFT_KEYS.BALANCING);
    
    showCustomAlert('Form berhasil direset', 'success');
}

async function submitBalancingData() {
    if (!currentUser) {
        showCustomAlert('Silakan login terlebih dahulu', 'error');
        return;
    }
    
    // Collect data
    const data = {
        action: 'submitBalancing',
        username: currentUser.username,
        name: currentUser.name,
        timestamp: new Date().toISOString(),
        shift: getShiftInfo().shift
    };
    
    BALANCING_FIELDS.forEach(field => {
        const el = document.getElementById(field);
        if (el) {
            data[field] = el.value;
        }
    });
    
    showLoader(true);
    
    try {
        if (isOnline()) {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            const result = await response.json();
            
            if (result.success) {
                // Save to history
                const history = safeJSONParse(localStorage.getItem(DRAFT_KEYS.BALANCING_HISTORY), []);
                history.push(data);
                localStorage.setItem(DRAFT_KEYS.BALANCING_HISTORY, JSON.stringify(history));
                
                // Clear draft
                localStorage.removeItem(DRAFT_KEYS.BALANCING);
                
                showCustomAlert('Data balancing berhasil disimpan!', 'success');
                navigateTo('homeScreen');
            } else {
                showCustomAlert(result.message || 'Gagal menyimpan data', 'error');
            }
        } else {
            // Save to offline queue
            saveOfflineBalancing(data);
            showCustomAlert('Data disimpan offline. Akan dikirim saat online.', 'warning');
        }
    } catch (error) {
        console.error('Balancing submit error:', error);
        saveOfflineBalancing(data);
        showCustomAlert('Gagal mengirim. Data disimpan offline.', 'warning');
    } finally {
        showLoader(false);
    }
}

function saveOfflineBalancing(data) {
    const offlineData = safeJSONParse(localStorage.getItem(DRAFT_KEYS.BALANCING_OFFLINE), []);
    offlineData.push({
        ...data,
        id: generateId(),
        savedAt: new Date().toISOString()
    });
    localStorage.setItem(DRAFT_KEYS.BALANCING_OFFLINE, JSON.stringify(offlineData));
}

// ============================================
// 13. CHANGE PASSWORD FUNCTIONS
// ============================================

function showChangePasswordModal() {
    if (!currentUser) {
        showCustomAlert('Silakan login terlebih dahulu', 'error');
        return;
    }
    
    const modal = document.getElementById('changePasswordModal');
    const cpUsername = document.getElementById('cpUsername');
    const cpOldPassword = document.getElementById('cpOldPassword');
    const cpNewPassword = document.getElementById('cpNewPassword');
    const cpConfirmPassword = document.getElementById('cpConfirmPassword');
    const cpError = document.getElementById('cpError');
    
    if (cpUsername) cpUsername.textContent = currentUser.username;
    if (cpOldPassword) cpOldPassword.value = '';
    if (cpNewPassword) cpNewPassword.value = '';
    if (cpConfirmPassword) cpConfirmPassword.value = '';
    if (cpError) {
        cpError.style.display = 'none';
        cpError.textContent = '';
    }
    
    if (modal) modal.classList.remove('hidden');
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) modal.classList.add('hidden');
}

function toggleCPVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
        `;
    } else {
        input.type = 'password';
        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;
    }
}

async function changePassword(event) {
    event.preventDefault();
    
    const cpOldPassword = document.getElementById('cpOldPassword');
    const cpNewPassword = document.getElementById('cpNewPassword');
    const cpConfirmPassword = document.getElementById('cpConfirmPassword');
    const cpError = document.getElementById('cpError');
    
    const oldPassword = cpOldPassword ? cpOldPassword.value : '';
    const newPassword = cpNewPassword ? cpNewPassword.value : '';
    const confirmPassword = cpConfirmPassword ? cpConfirmPassword.value : '';
    
    if (newPassword !== confirmPassword) {
        if (cpError) {
            cpError.textContent = 'Password baru dan konfirmasi tidak cocok';
            cpError.style.display = 'block';
        }
        return;
    }
    
    if (newPassword.length < 4) {
        if (cpError) {
            cpError.textContent = 'Password minimal 4 karakter';
            cpError.style.display = 'block';
        }
        return;
    }
    
    showLoader(true);
    
    try {
        if (isOnline()) {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'changePassword',
                    username: currentUser.username,
                    oldPassword: oldPassword,
                    newPassword: newPassword
                })
            });
            const result = await response.json();
            
            if (result.success) {
                closeChangePasswordModal();
                showCustomAlert('Password berhasil diubah!', 'success');
            } else {
                if (cpError) {
                    cpError.textContent = result.message || 'Gagal mengubah password';
                    cpError.style.display = 'block';
                }
            }
        } else {
            showCustomAlert('Mode offline - tidak dapat mengubah password', 'warning');
        }
    } catch (error) {
        console.error('Change password error:', error);
        if (cpError) {
            cpError.textContent = 'Gagal mengubah password. Coba lagi.';
            cpError.style.display = 'block';
        }
    } finally {
        showLoader(false);
    }
}

// ============================================
// 14. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize state
    initState();
    
    // Check session
    if (loadSession()) {
        showHomeScreen();
    } else {
        showLoginScreen();
    }
    
    // Update version display
    const versionDisplay = document.getElementById('versionDisplay');
    if (versionDisplay) {
        versionDisplay.textContent = APP_VERSION;
    }
    
    // Add change password form handler
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', changePassword);
    }
    
    // Add enter key handler for login
    const operatorPassword = document.getElementById('operatorPassword');
    if (operatorPassword) {
        operatorPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loginOperator();
            }
        });
    }
    
    // Add auto-save for balancing
    BALANCING_FIELDS.forEach(field => {
        const el = document.getElementById(field);
        if (el) {
            el.addEventListener('change', saveBalancingDraft);
        }
    });
    
    // Simulate loader progress
    const loaderProgress = document.getElementById('loaderProgress');
    if (loaderProgress) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    const loader = document.getElementById('loader');
                    if (loader) {
                        loader.style.opacity = '0';
                        setTimeout(() => {
                            loader.style.display = 'none';
                        }, 300);
                    }
                }, 200);
            }
            loaderProgress.style.width = progress + '%';
        }, 100);
    }
});

// Handle online/offline events
window.addEventListener('online', () => {
    console.log('App is online');
    syncOfflineData();
});

window.addEventListener('offline', () => {
    console.log('App is offline');
});

// Sync offline data when coming back online
async function syncOfflineData() {
    const tpmOffline = safeJSONParse(localStorage.getItem(DRAFT_KEYS.TPM_OFFLINE), []);
    const logsheetOffline = safeJSONParse(localStorage.getItem(DRAFT_KEYS.LOGSHEET_OFFLINE), []);
    const balancingOffline = safeJSONParse(localStorage.getItem(DRAFT_KEYS.BALANCING_OFFLINE), []);
    const ctOffline = safeJSONParse(localStorage.getItem(DRAFT_KEYS_CT.OFFLINE), []);
    
    const allOffline = [...tpmOffline, ...logsheetOffline, ...balancingOffline, ...ctOffline];
    
    if (allOffline.length === 0) return;
    
    console.log(`Syncing ${allOffline.length} offline items...`);
    
    for (const item of allOffline) {
        try {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                body: JSON.stringify(item)
            });
            const result = await response.json();
            
            if (result.success) {
                // Remove from offline queue
                if (item.action === 'submitTPM') {
                    const updated = tpmOffline.filter(i => i.id !== item.id);
                    localStorage.setItem(DRAFT_KEYS.TPM_OFFLINE, JSON.stringify(updated));
                } else if (item.action === 'submitLogsheet') {
                    const updated = logsheetOffline.filter(i => i.id !== item.id);
                    localStorage.setItem(DRAFT_KEYS.LOGSHEET_OFFLINE, JSON.stringify(updated));
                } else if (item.action === 'submitBalancing') {
                    const updated = balancingOffline.filter(i => i.id !== item.id);
                    localStorage.setItem(DRAFT_KEYS.BALANCING_OFFLINE, JSON.stringify(updated));
                } else if (item.action === 'submitCTLogsheet') {
                    const updated = ctOffline.filter(i => i.id !== item.id);
                    localStorage.setItem(DRAFT_KEYS_CT.OFFLINE, JSON.stringify(updated));
                }
            }
        } catch (error) {
            console.error('Sync error:', error);
        }
    }
    
    console.log('Sync complete');
}
