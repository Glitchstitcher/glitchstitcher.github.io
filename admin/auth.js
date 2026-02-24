// --- Configurable Text ---
const PASSWORD_PAGE_TEXT = {
    title: "🔐 Password",
    // prompt: "Enter the password",
    unlockButton: "Submit",
    logoutButton: "Logout",
    errorMessage: "Incorrect password. Please try again."
};

// --- Settings ---
const ACCESS_DURATION_DAYS = 60;
const ACCESS_KEY = "adminAccessExpires";
let PASSWORD_HASH = null;

// --- Load Password Hash ---
async function loadPassword() {
    try {
        const response = await fetch('/admin/password.json');
        if (!response.ok) throw new Error('Failed to load password.json');

        const data = await response.json();
        PASSWORD_HASH = data.password;

        document.querySelectorAll('.unlock-btn')
            .forEach(btn => btn.disabled = false);

    } catch (error) {
        console.error("Password load error:", error);
    }
}

// Disable buttons until password loads
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.unlock-btn')
        .forEach(btn => btn.disabled = true);
    loadPassword();
});

// --- SHA-256 Hash Function ---
async function sha256(str) {
    const buffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(str)
    );

    return Array.from(new Uint8Array(buffer))
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
}

// --- Check Password ---
async function checkPassword(inputId, gateId, contentId, errorId) {
    if (!PASSWORD_HASH) return;

    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    const password = input.value;

    const hash = await sha256(password);

    if (hash === PASSWORD_HASH) {
        const expires =
            Date.now() + (ACCESS_DURATION_DAYS * 24 * 60 * 60 * 1000);

        localStorage.setItem(ACCESS_KEY, expires);

        document.getElementById(gateId).style.display = 'none';
        document.getElementById(contentId).style.display = 'block';
    } else {
        errorDiv.style.display = 'block';
        input.value = '';
    }
}

// --- Logout ---
function logout(gateId, contentId, inputId, errorId) {
    localStorage.removeItem(ACCESS_KEY);

    document.getElementById(gateId).style.display = 'block';
    document.getElementById(contentId).style.display = 'none';
    document.getElementById(inputId).value = '';
    document.getElementById(errorId).style.display = 'none';
}

// --- Apply UI + Expiration Check ---
window.addEventListener('load', () => {

    const gate = document.getElementById('passwordGate');

    if (gate) {
        gate.querySelector('h1').textContent = PASSWORD_PAGE_TEXT.title;
        gate.querySelector('p').textContent = PASSWORD_PAGE_TEXT.prompt;

        const unlockBtn = gate.querySelector('.unlock-btn');
        if (unlockBtn)
            unlockBtn.textContent = PASSWORD_PAGE_TEXT.unlockButton;

        const errorDiv = gate.querySelector('#errorMessage');
        if (errorDiv)
            errorDiv.textContent = PASSWORD_PAGE_TEXT.errorMessage;
    }

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn)
        logoutBtn.textContent = PASSWORD_PAGE_TEXT.logoutButton;

    const expires = localStorage.getItem(ACCESS_KEY);

    if (expires && Date.now() < parseInt(expires)) {
        document.querySelectorAll('.password-gate')
            .forEach(g => g.style.display = 'none');

        document.querySelectorAll('.hidden-content')
            .forEach(c => c.style.display = 'block');
    } else {
        localStorage.removeItem(ACCESS_KEY);
    }
});
