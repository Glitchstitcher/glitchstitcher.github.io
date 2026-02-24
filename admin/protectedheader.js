const headerPlaceholder = document.getElementById('header-placeholder');

if (headerPlaceholder) {
    headerPlaceholder.innerHTML = `
    <div class="site-header">
        <a href="/index.html" class="logo-link">
            <img src="/images/icons/logo2Second.png" alt="Logo" class="header-logo">
        </a>
        <nav><!-- nav links --></nav>
        <div class="header-search">
            <input type="text" id="searchBox" class="search-box" placeholder="Search for .fcstd files...">
            <div id="searchResultsPopup" class="search-results-popup"></div>
        </div>
    </div>
    `;
}

// --- Search Logic ---
const searchBox = document.getElementById('searchBox');
const resultsPopup = document.getElementById('searchResultsPopup');

// Example files array
const fcstdFiles = [
    "Freecad Templates Master Collection.fcstd",
    "Sheet Template.fcstd",
    "Uncategorized/Tattoo Stencil.fcstd",
    "Production/Manufacturing/Wood Briquette Press.fcstd"
];

function displayResults(query) {
    resultsPopup.innerHTML = '';

    if (!query.trim()) {
        resultsPopup.style.display = 'none';
        return;
    }

    const filtered = fcstdFiles.filter(file => file.toLowerCase().includes(query.toLowerCase()));

    if (filtered.length === 0) {
        resultsPopup.innerHTML = `<div class="no-results">No files found.</div>`;
    } else {
        filtered.forEach(file => {
            const fileName = file.split('/').pop();
            const filePath = file.substring(0, file.lastIndexOf('/') + 1) || '';
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `<a href="${file}" download title="Download ${fileName}">${fileName}</a>
                             <div class="result-path">📁 ${filePath}</div>`;
            resultsPopup.appendChild(div);
        });
    }

    resultsPopup.style.display = 'block';
}

// Hide popup when clicking outside
document.addEventListener('click', e => {
    if (!headerPlaceholder.contains(e.target)) {
        resultsPopup.style.display = 'none';
    }
});

if (searchBox) {
    searchBox.addEventListener('input', e => displayResults(e.target.value));
    searchBox.addEventListener('focus', e => {
        if (searchBox.value.trim()) displayResults(searchBox.value);
    });
}
