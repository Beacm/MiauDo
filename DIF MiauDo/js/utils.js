// Utility functions

// Application State
const state = {
    windows: [],
    activeWindowId: null,
    projects: [],
    nextProjectId: 1,
    nextTaskId: 1,
    nextSubtaskId: 1,
    pomodoro: {
        focusTime: 25 * 60,
        breakTime: 5 * 60,
        targetTime: 60 * 60,
        isRunning: false,
        isFocus: true,
        timeLeft: 25 * 60,
        sessionsCompleted: 0,
        totalStudyTime: 0,
        timerInterval: null
    },
    music: {
        isPlaying: false,
        currentTrack: 0,
        tracks: [
            { title: "Relaxing Piano", artist: "Nature Sounds" },
            { title: "Ambient Study", artist: "Focus Music" },
            { title: "Calm Ocean", artist: "Meditation Waves" }
        ]
    },
    weather: {
        city: "Madrid",
        temperature: 22,
        condition: "Soleado"
    },
    searchResults: [],
    highlightedProject: null,
    highlightedTask: null
};

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
    
    document.getElementById('current-time').textContent = timeString;
    document.getElementById('current-date').textContent = dateString;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function getNextZIndex() {
    let maxZ = 10;
    state.windows.forEach(window => {
        const z = parseInt(window.element.style.zIndex);
        if (z > maxZ) maxZ = z;
    });
    return maxZ + 1;
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = element.querySelector('.window-header');
    
    header.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function getWindowTitle(type) {
    const titles = {
        'projects': 'Gestor de Proyectos',
        'calendar': 'Calendario',
        'pomodoro': 'Pomodoro Timer',
        'music': 'Reproductor de Música',
        'weather': 'Tiempo'
    };
    return titles[type] || 'Ventana';
}

function getWindowIcon(type) {
    const icons = {
        'projects': 'fas fa-folder',
        'calendar': 'fas fa-calendar-alt',
        'pomodoro': 'fas fa-clock',
        'music': 'fas fa-music',
        'weather': 'fas fa-cloud-sun'
    };
    return icons[type] || 'fas fa-window-restore';
}

function getWindowContent(type) {
    switch(type) {
        case 'projects':
            return `
                <div class="projects-container" id="projects-container">
                    <div class="project-filters">
                        <select id="project-filter">
                            <option value="all">Todos</option>
                            <option value="today">Hoy</option>
                            <option value="week">Esta semana</option>
                            <option value="month">Este mes</option>
                            <option value="overdue">Vencidos</option>
                            <option value="completed">Completados</option>
                        </select>
                    </div>
                    <div id="projects-list"></div>
                    <button class="add-button" id="new-project-btn">
                        <i class="fas fa-plus"></i> Nuevo Proyecto
                    </button>
                </div>
            `;
        case 'calendar':
            return `
                <div class="calendar-container">
                    <div class="calendar-header">
                        <div class="calendar-nav">
                            <div class="calendar-nav-btn" id="prev-month">
                                <i class="fas fa-chevron-left"></i>
                            </div>
                            <div class="calendar-nav-btn" id="go-today">
                                Hoy
                            </div>
                            <div class="calendar-nav-btn" id="next-month">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="calendar-title" id="calendar-title">Enero 2023</div>
                    </div>
                    <div class="calendar-grid" id="calendar-grid">
                        <!-- Calendar days will be populated dynamically -->
                    </div>
                </div>
            `;
        case 'pomodoro':
            return `
                <div class="pomodoro-container">
                    <div class="timer-display" id="timer-display">25:00</div>
                    <div class="timer-controls">
                        <button class="timer-btn start-btn" id="start-pomodoro">Iniciar</button>
                        <button class="timer-btn pause-btn" id="pause-pomodoro" style="display:none">Pausar</button>
                        <button class="timer-btn reset-btn" id="reset-pomodoro">Reiniciar</button>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar" id="pomodoro-progress"></div>
                    </div>
                    <div class="pomodoro-stats">
                        <div class="stat-item">
                            <div class="stat-value" id="sessions-completed">0</div>
                            <div class="stat-label">Sesiones</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="total-study-time">0:00</div>
                            <div class="stat-label">Tiempo Total</div>
                        </div>
                    </div>
                    <button class="add-button" id="pomodoro-settings-btn">
                        <i class="fas fa-cog"></i> Configuración
                    </button>
                </div>
            `;
        case 'music':
            return `
                <div class="music-container">
                    <div class="album-art">
                        <i class="fas fa-music"></i>
                    </div>
                    <div class="song-info">
                        <div class="song-title" id="current-song-title">Relaxing Piano</div>
                        <div class="song-artist" id="current-song-artist">Nature Sounds</div>
                    </div>
                    <div class="music-controls">
                        <div class="control-btn" id="prev-track">
                            <i class="fas fa-step-backward"></i>
                        </div>
                        <div class="control-btn play-btn" id="play-pause">
                            <i class="fas fa-play" id="play-pause-icon"></i>
                        </div>
                        <div class="control-btn" id="next-track">
                            <i class="fas fa-step-forward"></i>
                        </div>
                    </div>
                </div>
            `;
        case 'weather':
            return `
                <div class="weather-container">
                    <div class="weather-icon">
                        <i class="fas fa-sun"></i>
                    </div>
                    <div class="temperature">22°C</div>
                    <div class="weather-condition">Soleado</div>
                    <div class="location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Madrid, España</span>
                    </div>
                </div>
            `;
        default:
            return '<p>Contenido no disponible</p>';
    }
}