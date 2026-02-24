// protectedheader.js
// Adds a search box to the existing header without replacing it

// Find your existing header (assumes it has id="site-header" or change selector)
const header = document.getElementById('site-header');

if (header) {
    // Create search input
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.id = 'searchBox';
    searchBox.placeholder = 'Search .fcstd files...';
    searchBox.autocomplete = 'off';
    searchBox.style.marginLeft = '10px'; // adjust as needed

    // Create results popup
    const resultsPopup = document.createElement('div');
    resultsPopup.id = 'searchResultsPopup';
    resultsPopup.className = 'search-results-popup';
    resultsPopup.style.display = 'none';
    resultsPopup.style.position = 'absolute';
    resultsPopup.style.top = '100%';
    resultsPopup.style.left = '0';
    resultsPopup.style.right = '0';
    resultsPopup.style.maxHeight = '400px';
    resultsPopup.style.overflowY = 'auto';
    resultsPopup.style.zIndex = '1000';
    resultsPopup.style.background = '#fff';
    resultsPopup.style.border = '1px solid #ccc';

    // Append search elements to header
    header.appendChild(searchBox);
    header.appendChild(resultsPopup);

    // Search logic
    let fcstdFiles = [];
    fetch('../portfolio/searchfiles.json')  // adjust path if needed
        .then(resp => resp.json())
        .then(data => { fcstdFiles = data; })
        .catch(err => console.error('Failed to load searchfiles.json:', err));

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
                    <a href="../portfolio/${file}" download title="Download ${fileName}">${fileName}</a>
                    <div class="result-path">📁 ${file.substring(0, file.lastIndexOf('/') + 1)}</div>
                `;
                resultsPopup.appendChild(div);
            });
        }
        resultsPopup.style.display = 'block';
    }

    // Event listeners
    searchBox.addEventListener('input', e => displayResults(e.target.value));
    searchBox.addEventListener('focus', e => {
        if (searchBox.value.trim()) displayResults(searchBox.value);
    });

    // Hide popup when clicking outside
    document.addEventListener('click', e => {
        if (!header.contains(e.target)) {
            resultsPopup.style.display = 'none';
        }
    });
}
