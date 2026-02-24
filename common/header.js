document.addEventListener("DOMContentLoaded", () => {
    // Ensure charset exists
    if (!document.querySelector('meta[charset]')) {
        const meta = document.createElement('meta');
        meta.setAttribute('charset', 'UTF-8');
        document.head.prepend(meta);
    }

    // Ensure viewport exists
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = "viewport";
        viewport.content = "width=device-width, initial-scale=1.0";
        document.head.appendChild(viewport);
    }

    // Set title format
    const baseTitle = "My Site";
    if (document.title) {
        document.title = document.title + " | " + baseTitle;
    } else {
        document.title = baseTitle;
    }
});
