// Search Functionality

function performSearch(query) {
    if (!query) {
        document.getElementById('search-results').style.display = 'none';
        return;
    }
    
    state.searchResults = [];
    const lowerQuery = query.toLowerCase();
    
    // Search in projects
    state.projects.forEach(project => {
        if (project.nombre.toLowerCase().includes(lowerQuery) || 
            project.descripción.toLowerCase().includes(lowerQuery)) {
            state.searchResults.push({
                type: 'project',
                id: project.id,
                name: project.nombre,
                description: project.descripción
            });
        }
        
        // Search in tasks
        project.tareas.forEach(task => {
            if (task.nombre.toLowerCase().includes(lowerQuery) || 
                task.descripción.toLowerCase().includes(lowerQuery)) {
                state.searchResults.push({
                    type: 'task',
                    id: task.id,
                    projectId: project.id,
                    name: task.nombre,
                    description: task.descripción
                });
            }
            
            // Search in subtasks
            task.subtareas.forEach(subtask => {
                if (subtask.nombre.toLowerCase().includes(lowerQuery) || 
                    subtask.descripción.toLowerCase().includes(lowerQuery)) {
                    state.searchResults.push({
                        type: 'subtask',
                        id: subtask.id,
                        projectId: project.id,
                        taskId: task.id,
                        name: subtask.nombre,
                        description: subtask.descripción
                    });
                }
            });
        });
    });
    
    // Search in calendar (by date)
    const dateMatch = query.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
    if (dateMatch) {
        state.searchResults.push({
            type: 'calendar',
            date: dateMatch[0],
            name: `Calendario: ${dateMatch[0]}`,
            description: 'Ver tareas para esta fecha'
        });
    }
    
    // Search in pomodoro settings
    if (lowerQuery.includes('pomodoro') || lowerQuery.includes('temporizador')) {
        state.searchResults.push({
            type: 'pomodoro',
            name: 'Pomodoro Timer',
            description: 'Abrir temporizador de productividad'
        });
    }
    
    displaySearchResults();
}

function displaySearchResults() {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    
    if (state.searchResults.length === 0) {
        resultsContainer.innerHTML = '<div class="search-result-item">No se encontraron resultados</div>';
    } else {
        state.searchResults.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result-item';
            
            let icon = 'fas fa-search';
            if (result.type === 'project') icon = 'fas fa-folder';
            else if (result.type === 'task') icon = 'fas fa-tasks';
            else if (result.type === 'subtask') icon = 'fas fa-list';
            else if (result.type === 'calendar') icon = 'fas fa-calendar';
            else if (result.type === 'pomodoro') icon = 'fas fa-clock';
            
            resultElement.innerHTML = `
                <i class="${icon}"></i>
                <div>
                    <div class="result-name">${result.name}</div>
                    <div class="result-description">${result.description}</div>
                </div>
            `;
            
            resultElement.addEventListener('click', function() {
                handleSearchResultClick(result);
            });
            
            resultsContainer.appendChild(resultElement);
        });
    }
    
    resultsContainer.style.display = 'block';
}

function handleSearchResultClick(result) {
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('search-input').value = '';
    
    switch(result.type) {
        case 'project':
            state.highlightedProject = result.id;
            openWindow('projects');
            break;
        case 'task':
            state.highlightedProject = result.projectId;
            state.highlightedTask = result.id;
            openWindow('projects');
            break;
        case 'subtask':
            state.highlightedProject = result.projectId;
            state.highlightedTask = result.taskId;
            openWindow('projects');
            break;
        case 'calendar':
            openWindow('calendar');
            break;
        case 'pomodoro':
            openWindow('pomodoro');
            break;
    }
}