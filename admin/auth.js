let PASSWORD_HASH = null;

// Disable all unlock buttons until hash loads
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

// Auto-check session on load
window.addEventListener('load', function() {
    if (sessionStorage.getItem('adminAccess') === 'true') {
        document.querySelectorAll('.password-gate').forEach(gate => gate.style.display = 'none');
        document.querySelectorAll('.hidden-content').forEach(content => content.style.display = 'block');
    }
});
