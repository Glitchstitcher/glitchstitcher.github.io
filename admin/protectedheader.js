// Inject the protected header with search
const headerPlaceholder = document.getElementById('header-placeholder');

if (headerPlaceholder) {
    headerPlaceholder.innerHTML = `
    <div class="site-header">
        <a href="/index.html" class="logo-link">
            <img src="/images/icons/logo2Second.png" alt="Logo" class="header-logo">
        </a>
        <nav>
            <!-- optional nav links -->
        </nav>
        <div class="header-search">
            <input type="text" id="searchBox" class="search-box" placeholder="Search for .fcstd files...">
        </div>
    </div>
    `;
}

// --- Search Logic ---
const searchBox = document.getElementById('searchBox');
let resultsList = document.getElementById('resultsList');
let resultsCount = document.getElementById('resultsCount');

// Dynamically add results container if missing
if (!resultsList) {
    const container = document.createElement('div');
    container.id = 'searchResultsSection';
    container.className = 'page-section';
    container.innerHTML = `
        <div class="results-count" id="resultsCount"></div>
        <div id="resultsList" class="results-list"></div>
    `;
    // insert after header
    headerPlaceholder.parentNode.insertBefore(container, headerPlaceholder.nextSibling);
    resultsList = document.getElementById('resultsList');
    resultsCount = document.getElementById('resultsCount');
}

// Example FreeCAD files array
const fcstdFiles = [
    "Freecad Templates Master Collection.fcstd",
    "Sheet Template.fcstd",
    "Uncategorized/Tattoo Stencil.fcstd",
    "Production/Manufacturing/Wood Briquette Press.fcstd"
];

function displayResults(query) {
    const filtered = fcstdFiles.filter(file => file.toLowerCase().includes(query.toLowerCase()));

    resultsList.innerHTML = '';
    if (!query.trim()) { resultsCount.innerHTML = ''; return; }

    if (filtered.length === 0) {
        resultsList.innerHTML = '<div class="no-results">No files found matching your search.</div>';
        resultsCount.innerHTML = '';
        return;
    }

    resultsCount.innerHTML = `Found ${filtered.length} file${filtered.length !== 1 ? 's' : ''}`;

    filtered.forEach(file => {
        const fileName = file.split('/').pop();
        const filePath = file.substring(0, file.lastIndexOf('/') + 1) || '';
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <a href="${file}" download title="Download ${fileName}">${fileName}</a>
            <div class="result-path">📁 ${filePath}</div>
        `;
        resultsList.appendChild(div);
    });
}

if (searchBox) {
    searchBox.addEventListener('input', e => displayResults(e.target.value));
}
