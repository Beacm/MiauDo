// Main Application

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 60000);
    
    // Add event listeners for desktop icons
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('dblclick', function() {
            const app = this.getAttribute('data-app');
            openWindow(app);
        });
    });
    
    // Add event listener for search input
    document.getElementById('search-input').addEventListener('input', function(e) {
        performSearch(e.target.value);
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-bar') && !e.target.closest('.search-results')) {
            document.getElementById('search-results').style.display = 'none';
        }
    });
    
    // Load sample data
    loadSampleData();
    
    console.log('Productividad Pro inicializado correctamente');
});