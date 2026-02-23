// --- Configurable Text ---
const PASSWORD_PAGE_TEXT = {
    title: "🔐 Password",
    prompt: "Enter the password",
    unlockButton: "Submit",
    logoutButton: "Logout",
    errorMessage: "Incorrect password. Please try again."
};

// --- Password Logic ---
let PASSWORD_HASH = null;

// Disable unlock buttons until password loads
document.querySelectorAll('.unlock-btn').forEach(btn => btn.disabled = true);

// Determine correct path to password.json
let passwordPath = window.location.pathname.includes('/portfolio/')
    ? '../admin/password.json'   // portfolio folder
    : 'password.json';           // admin folder

// Load password hash
fetch(passwordPath)
    .then(response => response.json())
    .then(data => {
        PASSWORD_HASH = data.password;
        document.querySelectorAll('.unlock-btn').forEach(btn => btn.disabled = false);
    })
    .catch(error => {
        console.error('Failed to load password configuration:', error);
        alert('Error loading password configuration. Please try again later.');
    });

// SHA-256 hashing function
async function sha256(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf))
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

// Check password (universal)
async function checkPassword(inputId, gateId, contentId, errorId) {
    if (!PASSWORD_HASH) return;

    const password = document.getElementById(inputId).value;
    const hash = await sha256(password);

    if (hash === PASSWORD_HASH) {
        document.getElementById(gateId).style.display = 'none';
        document.getElementById(contentId).style.display = 'block';
        sessionStorage.setItem('adminAccess', 'true');
    } else {
        document.getElementById(errorId).style.display = 'block';
        document.getElementById(inputId).value = '';
    }
}

// Logout (universal)
function logout(gateId, contentId, inputId, errorId) {
    sessionStorage.removeItem('adminAccess');
    document.getElementById(gateId).style.display = 'block';
    document.getElementById(contentId).style.display = 'none';
    document.getElementById(inputId).value = '';
    document.getElementById(errorId).style.display = 'none';
}

// Auto-check session and apply text
window.addEventListener('load', function() {
    // Apply configurable text if elements exist
    const gate = document.querySelector('#passwordGate');
    if (gate) {
        gate.querySelector('h1').textContent = PASSWORD_PAGE_TEXT.title;
        gate.querySelector('p').textContent = PASSWORD_PAGE_TEXT.prompt;
        const unlockBtn = gate.querySelector('.unlock-btn');
        if (unlockBtn) unlockBtn.textContent = PASSWORD_PAGE_TEXT.unlockButton;
        const errorDiv = gate.querySelector('#errorMessage');
        if (errorDiv) errorDiv.textContent = PASSWORD_PAGE_TEXT.errorMessage;
    }

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) logoutBtn.textContent = PASSWORD_PAGE_TEXT.logoutButton;

    if (sessionStorage.getItem('adminAccess') === 'true') {
        document.querySelectorAll('.password-gate').forEach(gate => gate.style.display = 'none');
        document.querySelectorAll('.hidden-content').forEach(content => content.style.display = 'block');
    }
});
