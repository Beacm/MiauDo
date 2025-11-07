// Window Management

// Window Management

function openWindow(type) {
    const existingWindow = state.windows.find(w => w.type === type);
    if (existingWindow) {
        bringToFront(existingWindow.id);
        return;
    }
    
    const windowId = 'window-' + Date.now();
    const windowTitle = getWindowTitle(type);
    const windowIcon = getWindowIcon(type);
    
    const windowElement = document.createElement('div');
    windowElement.className = 'window';
    windowElement.id = windowId;
    
    // Calcular posición centrada y dentro de los límites
    const windowWidth = 800;
    const windowHeight = 600;
    const maxLeft = window.innerWidth - windowWidth - 20;
    const maxTop = window.innerHeight - windowHeight - 70; // Considerando la taskbar
    
    let left = 50;
    let top = 50;
    
    // Si hay otras ventanas, colocar en posición escalonada
    const windowCount = state.windows.length;
    if (windowCount > 0) {
        left = 50 + (windowCount * 30);
        top = 50 + (windowCount * 30);
    }
    
    // Asegurar que no se salga de los límites
    left = Math.min(left, maxLeft);
    top = Math.min(top, maxTop);
    left = Math.max(20, left);
    top = Math.max(20, top);
    
    windowElement.style.top = top + 'px';
    windowElement.style.left = left + 'px';
    windowElement.style.width = windowWidth + 'px';
    windowElement.style.height = windowHeight + 'px';
    windowElement.style.zIndex = getNextZIndex();
    
    windowElement.innerHTML = `
        <div class="window-header">
            <div class="window-title">${windowTitle}</div>
            <div class="window-controls">
                <div class="window-control" id="minimize-${windowId}">
                    <i class="fas fa-minus"></i>
                </div>
                <div class="window-control" id="maximize-${windowId}">
                    <i class="fas fa-square"></i>
                </div>
                <div class="window-control" id="close-${windowId}">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        </div>
        <div class="window-content" id="${windowId}-content">
            ${getWindowContent(type)}
        </div>
    `;
    
    document.body.appendChild(windowElement);
    
    const windowObj = {
        id: windowId,
        type: type,
        title: windowTitle,
        icon: windowIcon,
        minimized: false,
        maximized: false,
        element: windowElement,
        originalPosition: { left: left, top: top },
        originalSize: { width: windowWidth, height: windowHeight }
    };
    
    state.windows.push(windowObj);
    state.activeWindowId = windowId;
    
    addToTaskbar(windowObj);
    makeDraggable(windowElement);
    
    // Add event listeners for window controls
    document.getElementById(`minimize-${windowId}`).addEventListener('click', () => minimizeWindow(windowId));
    document.getElementById(`maximize-${windowId}`).addEventListener('click', () => toggleMaximizeWindow(windowId));
    document.getElementById(`close-${windowId}`).addEventListener('click', () => closeWindow(windowId));
    
    windowElement.addEventListener('mousedown', () => bringToFront(windowId));
    
    initializeWindowContent(type, windowId);
    
    if (type === 'projects' && (state.highlightedProject || state.highlightedTask)) {
        setTimeout(() => highlightProjectAndTask(), 100);
    }
}

function initializeWindowContent(type, windowId) {
    switch(type) {
        case 'projects':
            document.getElementById('new-project-btn').addEventListener('click', openProjectModal);
            document.getElementById('project-filter').addEventListener('change', filterProjects);
            renderProjects();
            break;
        case 'calendar':
            document.getElementById('prev-month').addEventListener('click', () => changeCalendarMonth(-1));
            document.getElementById('next-month').addEventListener('click', () => changeCalendarMonth(1));
            document.getElementById('go-today').addEventListener('click', goToToday);
            renderCalendar();
            break;
        case 'pomodoro':
            document.getElementById('start-pomodoro').addEventListener('click', startPomodoro);
            document.getElementById('pause-pomodoro').addEventListener('click', pausePomodoro);
            document.getElementById('reset-pomodoro').addEventListener('click', resetPomodoro);
            document.getElementById('pomodoro-settings-btn').addEventListener('click', openPomodoroSettings);
            updatePomodoroDisplay();
            break;
        case 'music':
            document.getElementById('play-pause').addEventListener('click', togglePlayPause);
            document.getElementById('prev-track').addEventListener('click', previousTrack);
            document.getElementById('next-track').addEventListener('click', nextTrack);
            updateMusicDisplay();
            break;
    }
}

function addToTaskbar(windowObj) {
    const taskbarIcons = document.querySelector('.taskbar-icons');
    const taskbarIcon = document.createElement('div');
    taskbarIcon.className = 'taskbar-icon';
    taskbarIcon.innerHTML = `<i class="${windowObj.icon}"></i>`;
    taskbarIcon.setAttribute('data-window-id', windowObj.id);
    
    taskbarIcon.addEventListener('click', function() {
        const windowId = this.getAttribute('data-window-id');
        const window = state.windows.find(w => w.id === windowId);
        
        if (window.minimized) {
            restoreWindow(windowId);
        } else {
            minimizeWindow(windowId);
        }
    });
    
    taskbarIcons.appendChild(taskbarIcon);
}

function removeFromTaskbar(windowId) {
    const taskbarIcon = document.querySelector(`.taskbar-icon[data-window-id="${windowId}"]`);
    if (taskbarIcon) {
        taskbarIcon.remove();
    }
}

function bringToFront(windowId) {
    const window = state.windows.find(w => w.id === windowId);
    if (window && !window.minimized) {
        window.element.style.zIndex = getNextZIndex();
        state.activeWindowId = windowId;
        
        document.querySelectorAll('.taskbar-icon').forEach(icon => {
            icon.classList.remove('active');
        });
        
        const taskbarIcon = document.querySelector(`.taskbar-icon[data-window-id="${windowId}"]`);
        if (taskbarIcon) {
            taskbarIcon.classList.add('active');
        }
    }
}

function minimizeWindow(windowId) {
    const window = state.windows.find(w => w.id === windowId);
    if (window) {
        window.element.style.display = 'none';
        window.minimized = true;
        
        const taskbarIcon = document.querySelector(`.taskbar-icon[data-window-id="${windowId}"]`);
        if (taskbarIcon) {
            taskbarIcon.classList.add('active');
        }
    }
}

function restoreWindow(windowId) {
    const window = state.windows.find(w => w.id === windowId);
    if (window) {
        window.element.style.display = 'flex';
        window.minimized = false;
        bringToFront(windowId);
    }
}

function toggleMaximizeWindow(windowId) {
    const window = state.windows.find(w => w.id === windowId);
    if (window) {
        if (window.maximized) {
            window.element.classList.remove('maximized');
            window.maximized = false;
        } else {
            window.element.classList.add('maximized');
            window.maximized = true;
        }
    }
}

function closeWindow(windowId) {
    const window = state.windows.find(w => w.id === windowId);
    if (window) {
        window.element.remove();
        state.windows = state.windows.filter(w => w.id !== windowId);
        removeFromTaskbar(windowId);
        
        if (state.activeWindowId === windowId) {
            state.activeWindowId = state.windows.length > 0 ? state.windows[state.windows.length - 1].id : null;
        }
    }
}