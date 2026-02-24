// --- header.js: Load shared header ---
document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    fetch('/common/header.html')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(html => {
            placeholder.innerHTML = html;
        })
        .catch(err => {
            console.error('Failed to load header:', err);
        });
});
