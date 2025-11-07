// Main Application
// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initTime();
    initDesktopIcons();
    initSearchBar();
    closeSearchBarAction();
    loadSampleData();
    
    console.log('Productividad Pro inicializado correctamente');
});

function closeSearchBarAction() {
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-bar') && !e.target.closest('.search-results')) {
            document.getElementById('search-results').style.display = 'none';
        }
    });
}

function initSearchBar() {
    document.getElementById('search-input').addEventListener('input', function (e) {
        performSearch(e.target.value);
    });
}

function initTime() {
    updateTime();
    setInterval(updateTime, 60000);
}

function initDesktopIcons() {
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('dblclick', function () {
            const app = this.getAttribute('data-app');
            openWindow(app);
        });
    });
}