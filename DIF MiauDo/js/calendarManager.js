// Calendar Management
let currentCalendarDate = new Date();

function renderCalendar() {
    const calendarTitle = document.getElementById('calendar-title');
    const calendarGrid = document.getElementById('calendar-grid');
    
    if (!calendarTitle || !calendarGrid) return;
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Set calendar title
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    calendarTitle.textContent = `${monthNames[month]} ${year}`;
    
    // Clear calendar grid
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const currentDate = new Date(year, month, day);
        if (currentDate.getTime() === today.getTime()) {
            dayElement.classList.add('today');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Add tasks for this day (only pending ones)
        const dayTasks = document.createElement('div');
        dayTasks.className = 'day-tasks';
        
        // Find pending tasks and subtasks for this day
        let hasPendingTasks = false;
        
        state.projects.forEach(project => {
            project.tareas.forEach(task => {
                // Only show if task is not completed
                if (!task.completada) {
                    const taskDate = new Date(task.fecha_fin);
                    taskDate.setHours(0, 0, 0, 0);
                    
                    if (taskDate.getTime() === currentDate.getTime()) {
                        const taskElement = document.createElement('div');
                        taskElement.className = 'day-task';
                        taskElement.style.backgroundColor = project.color;
                        taskElement.textContent = task.nombre;
                        dayTasks.appendChild(taskElement);
                        hasPendingTasks = true;
                    }
                }
                
                task.subtareas.forEach(subtask => {
                    // Only show if subtask is not completed
                    if (!subtask.completada) {
                        const subtaskDate = new Date(subtask.fecha_fin);
                        subtaskDate.setHours(0, 0, 0, 0);
                        
                        if (subtaskDate.getTime() === currentDate.getTime()) {
                            const subtaskElement = document.createElement('div');
                            subtaskElement.className = 'day-task';
                            subtaskElement.style.backgroundColor = project.color;
                            subtaskElement.textContent = subtask.nombre;
                            dayTasks.appendChild(subtaskElement);
                            hasPendingTasks = true;
                        }
                    }
                });
            });
        });
        
        // Add mouse events for tooltip
        if (hasPendingTasks) {
            dayElement.addEventListener('mouseenter', function(e) {
                showCalendarTooltip(e, currentDate);
            });
            
            dayElement.addEventListener('mousemove', function(e) {
                moveCalendarTooltip(e);
            });
            
            dayElement.addEventListener('mouseleave', function() {
                hideCalendarTooltip();
            });
        }
        
        dayElement.appendChild(dayTasks);
        calendarGrid.appendChild(dayElement);
    }
}

function showCalendarTooltip(e, date) {
    const tooltip = document.getElementById('calendar-tooltip');
    const tooltipDate = document.getElementById('tooltip-date');
    const tooltipTasks = document.getElementById('tooltip-tasks');
    
    // Set date in tooltip
    const dateString = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
    tooltipDate.textContent = dateString;
    
    // Clear previous tasks
    tooltipTasks.innerHTML = '';
    
    // Find pending tasks and subtasks for this date
    let hasTasks = false;
    
    state.projects.forEach(project => {
        project.tareas.forEach(task => {
            // Only show if task is not completed
            if (!task.completada) {
                const taskDate = new Date(task.fecha_fin);
                taskDate.setHours(0, 0, 0, 0);
                
                if (taskDate.getTime() === date.getTime()) {
                    const taskElement = document.createElement('div');
                    taskElement.className = 'tooltip-task';
                    taskElement.textContent = `${project.nombre}: ${task.nombre}`;
                    taskElement.addEventListener('click', function() {
                        state.highlightedProject = project.id;
                        state.highlightedTask = task.id;
                        openWindow('projects');
                        hideCalendarTooltip();
                    });
                    tooltipTasks.appendChild(taskElement);
                    hasTasks = true;
                }
            }
            
            task.subtareas.forEach(subtask => {
                // Only show if subtask is not completed
                if (!subtask.completada) {
                    const subtaskDate = new Date(subtask.fecha_fin);
                    subtaskDate.setHours(0, 0, 0, 0);
                    
                    if (subtaskDate.getTime() === date.getTime()) {
                        const subtaskElement = document.createElement('div');
                        subtaskElement.className = 'tooltip-task';
                        subtaskElement.textContent = `${project.nombre}: ${subtask.nombre}`;
                        subtaskElement.addEventListener('click', function() {
                            state.highlightedProject = project.id;
                            state.highlightedTask = task.id;
                            openWindow('projects');
                            hideCalendarTooltip();
                        });
                        tooltipTasks.appendChild(subtaskElement);
                        hasTasks = true;
                    }
                }
            });
        });
    });
    
    if (hasTasks) {
        tooltip.style.display = 'block';
        moveCalendarTooltip(e);
    }
}

function moveCalendarTooltip(e) {
    const tooltip = document.getElementById('calendar-tooltip');
    tooltip.style.left = (e.pageX + 10) + 'px';
    tooltip.style.top = (e.pageY + 10) + 'px';
}

function hideCalendarTooltip() {
    const tooltip = document.getElementById('calendar-tooltip');
    tooltip.style.display = 'none';
}

function changeCalendarMonth(direction) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    renderCalendar();
}

function goToToday() {
    currentCalendarDate = new Date();
    renderCalendar();
}