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

// Disable unlock button until password loads
document.querySelectorAll('.unlock-btn').forEach(btn => btn.disabled = true);

// Load password hash
fetch('admin/password.json')
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
    return Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, '0')).join('');
}

// Check password
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

// Logout
function logout(gateId, contentId, inputId, errorId) {
    sessionStorage.removeItem('adminAccess');
    document.getElementById(gateId).style.display = 'block';
    document.getElementById(contentId).style.display = 'none';
    document.getElementById(inputId).value = '';
    document.getElementById(errorId).style.display = 'none';
}

// Auto-check session
window.addEventListener('load', function() {
    // Apply configurable text
    document.querySelector('#passwordGate h1').textContent = PASSWORD_PAGE_TEXT.title;
    document.querySelector('#passwordGate p').textContent = PASSWORD_PAGE_TEXT.prompt;
    document.querySelector('#unlockBtn').textContent = PASSWORD_PAGE_TEXT.unlockButton;
    document.querySelector('.logout-btn').textContent = PASSWORD_PAGE_TEXT.logoutButton;
    document.querySelector('#errorMessage').textContent = PASSWORD_PAGE_TEXT.errorMessage;

    if (sessionStorage.getItem('adminAccess') === 'true') {
        document.querySelectorAll('.password-gate').forEach(gate => gate.style.display = 'none');
        document.querySelectorAll('.hidden-content').forEach(content => content.style.display = 'block');
    }
});
