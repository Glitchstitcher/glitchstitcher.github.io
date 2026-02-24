// Inject header with search bar
const headerPlaceholder = document.getElementById('header-placeholder');

if (headerPlaceholder) {
    headerPlaceholder.innerHTML = `
        <header class="protected-header">
            <div class="logo">Portfolio</div>
            <input type="text" id="searchBox" placeholder="Search .fcstd files..." autocomplete="off">
            <div id="searchResultsPopup" class="search-results-popup" style="display:none;"></div>
        </header>
    `;
}

// Reference elements
const searchBox = document.getElementById('searchBox');
const resultsPopup = document.getElementById('searchResultsPopup');
let fcstdFiles = [];

// Fetch searchfiles.json
fetch('/portfolio/searchfiles.json')
  .then(resp => resp.json())
  .then(data => { fcstdFiles = data; })
  .catch(err => console.error('Failed to load searchfiles.json:', err));

// Display search results
function displayResults(query) {
    resultsPopup.innerHTML = '';
    if (!query.trim() || fcstdFiles.length === 0) {
        resultsPopup.style.display = 'none';
        return;
    }

    const filtered = fcstdFiles.filter(file => file.toLowerCase().includes(query.toLowerCase()));

    if (filtered.length === 0) {
        resultsPopup.innerHTML = '<div class="no-results">No files found.</div>';
    } else {
        filtered.forEach(file => {
            const fileName = file.split('/').pop();
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `
                <a href="/portfolio/${file}" download title="Download ${fileName}">${fileName}</a>
                <div class="result-path">📁 ${file.substring(0, file.lastIndexOf('/') + 1)}</div>
            `;
            resultsPopup.appendChild(div);
        });
    }

    resultsPopup.style.display = 'block';
}

// Event listeners
if (searchBox) {
    searchBox.addEventListener('input', e => displayResults(e.target.value));
    searchBox.addEventListener('focus', e => {
        if (searchBox.value.trim()) displayResults(searchBox.value);
    });
}

// Hide popup when clicking outside
document.addEventListener('click', e => {
    if (!headerPlaceholder.contains(e.target)) {
        resultsPopup.style.display = 'none';
    }
});
