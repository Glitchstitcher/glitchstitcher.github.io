document.addEventListener("DOMContentLoaded", () => {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    // Adjust path if portfolio.html is in /portfolio/
    fetch('../common/header.html')
        .then(resp => resp.text())
        .then(html => {
            // Add header HTML
            placeholder.innerHTML = html;

            // Now header exists
            const header = document.querySelector('.site-header');
            if (!header) return;

            // Add search box
            const searchBox = document.createElement('input');
            searchBox.type = 'text';
            searchBox.id = 'searchBox';
            searchBox.placeholder = 'Search .fcstd files...';
            searchBox.autocomplete = 'off';
            searchBox.style.marginLeft = '10px';

            const resultsPopup = document.createElement('div');
            resultsPopup.id = 'searchResultsPopup';
            resultsPopup.className = 'search-results-popup';
            resultsPopup.style.display = 'none';

            header.appendChild(searchBox);
            header.appendChild(resultsPopup);

            // Load files for search
            let fcstdFiles = [];
            fetch('../portfolio/searchfiles.json')
                .then(r => r.json())
                .then(data => fcstdFiles = data)
                .catch(console.error);

            // Search logic
            function displayResults(query) {
                resultsPopup.innerHTML = '';
                if (!query.trim() || fcstdFiles.length === 0) {
                    resultsPopup.style.display = 'none';
                    return;
                }
                const filtered = fcstdFiles.filter(f => f.toLowerCase().includes(query.toLowerCase()));
                if (filtered.length === 0) resultsPopup.innerHTML = '<div class="no-results">No files found.</div>';
                else filtered.forEach(f => {
                    const fileName = f.split('/').pop();
                    const div = document.createElement('div');
                    div.className = 'result-item';
                    div.innerHTML = `
                        <a href="../portfolio/${f}" download>${fileName}</a>
                        <div class="result-path">📁 ${f.substring(0,f.lastIndexOf('/')+1)}</div>
                    `;
                    resultsPopup.appendChild(div);
                });
                resultsPopup.style.display = 'block';
            }

            searchBox.addEventListener('input', e => displayResults(e.target.value));
            searchBox.addEventListener('focus', () => {
                if (searchBox.value.trim()) displayResults(searchBox.value);
            });
            document.addEventListener('click', e => {
                if (!header.contains(e.target)) resultsPopup.style.display = 'none';
            });
        })
        .catch(err => console.error('Failed to load header:', err));
});
