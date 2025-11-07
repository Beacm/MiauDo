// Project Management

function loadSampleData() {
    const sampleProject = {
        id: state.nextProjectId++,
        nombre: "Proyecto de Ejemplo",
        descripción: "Este es un proyecto de ejemplo para demostrar las funcionalidades",
        color: "#8a7cea",
        fecha_inicio: "2025-11-07",
        fecha_fin: "2025-11-07",
        tareas: [
            {
                id: state.nextTaskId++,
                nombre: "Tarea de ejemplo",
                descripción: "Esta es una tarea de ejemplo",
                fecha_inicio: "2025-11-07",
                fecha_fin: "2025-11-07",
                completada: false,
                subtareas: [
                    {
                        id: state.nextSubtaskId++,
                        nombre: "Subtarea de ejemplo",
                        descripción: "Esta es una subtarea de ejemplo",
                        fecha_inicio: "2025-11-07",
                        fecha_fin: "2025-11-07",
                        completada: false
                    }
                ]
            }
        ]
    };

    state.projects.push(sampleProject);

    if (document.getElementById('projects-list')) {
        renderProjects();
    }
}

function renderProjects() {
    const projectsList = document.getElementById('projects-list');
    if (!projectsList) return;

    projectsList.innerHTML = '';

    if (state.projects.length === 0) {
        projectsList.innerHTML = '<p>No hay proyectos. ¡Crea uno nuevo!</p>';
        return;
    }

    state.projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-card';
        projectElement.style.borderLeftColor = project.color;
        projectElement.id = `project-${project.id}`;

        let tasksHTML = '';
        project.tareas.forEach(task => {
            let subtasksHTML = '';
            task.subtareas.forEach(subtask => {
                subtasksHTML += `
                    <div class="subtask-item" id="subtask-${project.id}-${task.id}-${subtask.id}">
                        <div class="subtask-checkbox ${subtask.completada ? 'checked' : ''}">
                            ${subtask.completada ? '<i class="fas fa-check"></i>' : ''}
                        </div>
                        <div class="subtask-name">${subtask.nombre}</div>
                        <div class="subtask-actions">
                            <div class="subtask-action" data-project="${project.id}" data-task="${task.id}" data-subtask="${subtask.id}">
                                <i class="fas fa-edit"></i>
                            </div>
                            <div class="subtask-action" data-project="${project.id}" data-task="${task.id}" data-subtask="${subtask.id}">
                                <i class="fas fa-trash"></i>
                            </div>
                        </div>
                    </div>
                `;
            });

            tasksHTML += `
                <div class="task-item" id="task-${project.id}-${task.id}">
                    <div class="task-checkbox ${task.completada ? 'checked' : ''}">
                        ${task.completada ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                    <div class="task-name">${task.nombre}</div>
                    <div class="task-actions">
                        <div class="task-action" data-project="${project.id}" data-task="${task.id}">
                            <i class="fas fa-plus"></i>
                        </div>
                        <div class="task-action" data-project="${project.id}" data-task="${task.id}">
                            <i class="fas fa-edit"></i>
                        </div>
                        <div class="task-action" data-project="${project.id}" data-task="${task.id}">
                            <i class="fas fa-trash"></i>
                        </div>
                    </div>
                </div>
                ${subtasksHTML}
            `;
        });

        projectElement.innerHTML = `
            <div class="project-header">
                <div class="project-color" style="background: ${project.color}"></div>
                <div class="project-name">${project.nombre}</div>
                <div class="project-actions">
                    <div class="project-action" data-project="${project.id}">
                        <i class="fas fa-plus"></i>
                    </div>
                    <div class="project-action" data-project="${project.id}">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="project-action" data-project="${project.id}">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            </div>
            <div class="project-description">${project.descripción}</div>
            <div class="project-dates">${formatDate(project.fecha_inicio)} - ${formatDate(project.fecha_fin)}</div>
            <div class="project-tasks">
                ${tasksHTML}
            </div>
        `;

        projectsList.appendChild(projectElement);
    });

    // Add event listeners
    addProjectEventListeners();
    highlightProjectAndTask();
}

function addProjectEventListeners() {
    // Project actions
    document.querySelectorAll('.project-action').forEach(action => {
        const projectId = parseInt(action.getAttribute('data-project'));

        if (action.querySelector('.fa-plus')) {
            action.addEventListener('click', () => addTask(projectId));
        } else if (action.querySelector('.fa-edit')) {
            action.addEventListener('click', () => editProject(projectId));
        } else if (action.querySelector('.fa-trash')) {
            action.addEventListener('click', () => deleteProject(projectId));
        }
    });

    // Task actions
    document.querySelectorAll('.task-action').forEach(action => {
        const projectId = parseInt(action.getAttribute('data-project'));
        const taskId = parseInt(action.getAttribute('data-task'));

        if (action.querySelector('.fa-plus')) {
            action.addEventListener('click', () => addSubtask(projectId, taskId));
        } else if (action.querySelector('.fa-edit')) {
            action.addEventListener('click', () => editTask(projectId, taskId));
        } else if (action.querySelector('.fa-trash')) {
            action.addEventListener('click', () => deleteTask(projectId, taskId));
        }
    });

    // Task checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        const parentTask = checkbox.closest('.task-item');
        if (parentTask) {
            const idParts = parentTask.id.split('-');
            const projectId = parseInt(idParts[1]);
            const taskId = parseInt(idParts[2]);
            checkbox.addEventListener('click', () => toggleTaskCompletion(projectId, taskId));
        }
    });

    // Subtask actions
    document.querySelectorAll('.subtask-action').forEach(action => {
        const projectId = parseInt(action.getAttribute('data-project'));
        const taskId = parseInt(action.getAttribute('data-task'));
        const subtaskId = parseInt(action.getAttribute('data-subtask'));

        if (action.querySelector('.fa-edit')) {
            action.addEventListener('click', () => editSubtask(projectId, taskId, subtaskId));
        } else if (action.querySelector('.fa-trash')) {
            action.addEventListener('click', () => deleteSubtask(projectId, taskId, subtaskId));
        }
    });

    // Subtask checkboxes
    document.querySelectorAll('.subtask-checkbox').forEach(checkbox => {
        const parentSubtask = checkbox.closest('.subtask-item');
        if (parentSubtask) {
            const idParts = parentSubtask.id.split('-');
            const projectId = parseInt(idParts[1]);
            const taskId = parseInt(idParts[2]);
            const subtaskId = parseInt(idParts[3]);
            checkbox.addEventListener('click', () => toggleSubtaskCompletion(projectId, taskId, subtaskId));
        }
    });
}

function highlightProjectAndTask() {
    document.querySelectorAll('.project-card, .task-item').forEach(el => {
        el.style.backgroundColor = '';
        el.style.border = '';
    });

    if (state.highlightedProject) {
        const projectElement = document.getElementById(`project-${state.highlightedProject}`);
        if (projectElement) {
            projectElement.style.backgroundColor = '#f0f8ff';
            projectElement.style.border = '2px solid #8a7cea';
            projectElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            if (state.highlightedTask) {
                const taskElement = document.getElementById(`task-${state.highlightedProject}-${state.highlightedTask}`);
                if (taskElement) {
                    taskElement.style.backgroundColor = '#f0f8ff';
                    taskElement.style.border = '1px solid #8a7cea';
                    taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    }

    state.highlightedProject = null;
    state.highlightedTask = null;
}

function initializeColorPicker() {
    const colorPreview = document.getElementById('color-preview');
    const colorPickerPopup = document.getElementById('color-picker-popup');
    const colorWheel = document.getElementById('color-wheel');
    const closePopupBtn = colorPickerPopup.querySelector('.close-popup');
    const confirmColorBtn = document.getElementById('confirm-color');
    const cancelColorBtn = document.getElementById('cancel-color');
    const colorSelector = colorWheel.querySelector('.color-selector');

    let currentColor = colorPreview.style.backgroundColor || '#8a7cea';
    let tempColor = currentColor;

    // Crear overlay si no existe
    let overlay = document.getElementById('popup-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'popup-overlay';
        overlay.id = 'popup-overlay';
        document.body.appendChild(overlay);
    }

    function updateColor(x, y) {
        const rect = colorWheel.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;

        // Calcular ángulo y distancia
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), centerX);
        const saturation = distance / centerX;

        // Convertir HSL a HEX
        const hexColor = hslToHex(angle, saturation * 100, 70);

        tempColor = hexColor;
        colorPreview.style.backgroundColor = hexColor;

        // Mover el selector
        const selectorX = centerX + (distance * Math.cos(angle * Math.PI / 180));
        const selectorY = centerY + (distance * Math.sin(angle * Math.PI / 180));

        colorSelector.style.left = selectorX + 'px';
        colorSelector.style.top = selectorY + 'px';
    }

    function setupColorWheel() {
        colorWheel.addEventListener('click', function (e) {
            const rect = colorWheel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            updateColor(x, y);
        });

        colorWheel.addEventListener('mousedown', function (e) {
            const rect = colorWheel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            updateColor(x, y);

            function mouseMoveHandler(e) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                updateColor(x, y);
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
    }

    function showColorPicker() {
        // Mostrar overlay
        overlay.style.display = 'block';

        // Mostrar popup
        colorPickerPopup.style.display = 'block';

        // Guardar color actual temporalmente
        currentColor = colorPreview.style.backgroundColor || '#8a7cea';
        tempColor = currentColor;

        // Inicializar posición del selector basado en el color actual
        initializeSelectorPosition();
    }

    function hideColorPicker() {
        overlay.style.display = 'none';
        colorPickerPopup.style.display = 'none';
    }

    function confirmColor() {
        currentColor = tempColor;
        colorPreview.style.backgroundColor = currentColor;
        hideColorPicker();
    }

    function cancelColor() {
        // Restaurar color original
        colorPreview.style.backgroundColor = currentColor;
        hideColorPicker();
    }

    function initializeSelectorPosition() {
        // Convertir HEX a HSL para posicionar el selector
        const hex = currentColor.startsWith('#') ? currentColor : '#8a7cea';
        const hsl = hexToHsl(hex);

        const centerX = 100; // Mitad del color wheel (200px / 2)
        const centerY = 100;

        const angle = hsl.h;
        const distance = (hsl.s / 100) * centerX;

        const selectorX = centerX + (distance * Math.cos(angle * Math.PI / 180));
        const selectorY = centerY + (distance * Math.sin(angle * Math.PI / 180));

        colorSelector.style.left = selectorX + 'px';
        colorSelector.style.top = selectorY + 'px';
    }

    // Event listeners - ahora solo en el color preview
    colorPreview.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        showColorPicker();
    });

    closePopupBtn.addEventListener('click', cancelColor);
    confirmColorBtn.addEventListener('click', confirmColor);
    cancelColorBtn.addEventListener('click', cancelColor);

    // Cerrar al hacer clic en el overlay
    overlay.addEventListener('click', cancelColor);

    // Prevenir que el clic en el popup cierre el color picker
    colorPickerPopup.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    setupColorWheel();

    // Inicializar con un color si no hay uno
    if (!colorPreview.style.backgroundColor) {
        const randomColor = generateUniquePastelColor();
        colorPreview.style.backgroundColor = randomColor;
        currentColor = randomColor;
    }
}

function hexToHsl(hex) {
    // Convertir HEX a RGB
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    // Convertir RGB a HSL
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// Modal functions
function openProjectModal(projectId = null) {
    const modal = document.getElementById('project-modal');
    const title = document.getElementById('project-modal-title');
    const nameInput = document.getElementById('project-name');
    const descriptionInput = document.getElementById('project-description');
    const startInput = document.getElementById('project-start');
    const endInput = document.getElementById('project-end');

    // Remover event listeners anteriores para evitar duplicados
    const oldModal = modal.cloneNode(true);
    modal.parentNode.replaceChild(oldModal, modal);

    if (projectId) {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
            title.textContent = 'Editar Proyecto';
            nameInput.value = project.nombre;
            descriptionInput.value = project.descripción;
            startInput.value = project.fecha_inicio;
            endInput.value = project.fecha_fin;
            document.getElementById('color-preview').style.backgroundColor = project.color;
            oldModal.setAttribute('data-project-id', projectId);
        }
    } else {
        title.textContent = 'Nuevo Proyecto';
        nameInput.value = '';
        descriptionInput.value = '';
        startInput.value = '';
        endInput.value = '';

        // Generar color pastel único
        const randomColor = generateUniquePastelColor();
        document.getElementById('color-preview').style.backgroundColor = randomColor;
        oldModal.removeAttribute('data-project-id');
    }

    // Add event listeners to modal buttons
    const closeBtn = oldModal.querySelector('.close-modal');
    const cancelBtn = oldModal.querySelector('.btn-secondary');
    const saveBtn = oldModal.querySelector('.btn-primary');

    closeBtn.onclick = () => closeModal('project-modal');
    cancelBtn.onclick = () => closeModal('project-modal');
    saveBtn.onclick = saveProject;

    oldModal.style.display = 'flex';

    // Inicializar color picker después de que el modal esté visible
    setTimeout(() => {
        initializeColorPicker();
    }, 100);
}

function saveProject() {
    const modal = document.getElementById('project-modal');
    const name = document.getElementById('project-name').value;
    const description = document.getElementById('project-description').value;
    const start = document.getElementById('project-start').value;
    const end = document.getElementById('project-end').value;
    const color = document.getElementById('color-preview').style.backgroundColor;

    if (!name) {
        alert('El nombre del proyecto es obligatorio');
        return;
    }

    const projectId = modal.getAttribute('data-project-id');

    if (projectId) {
        const project = state.projects.find(p => p.id === parseInt(projectId));
        if (project) {
            project.nombre = name;
            project.descripción = description;
            project.fecha_inicio = start;
            project.fecha_fin = end;
            project.color = color;
        }
    } else {
        const newProject = {
            id: state.nextProjectId++,
            nombre: name,
            descripción: description,
            color: color,
            fecha_inicio: start,
            fecha_fin: end,
            tareas: []
        };

        state.projects.push(newProject);
    }

    closeModal('project-modal');
    renderProjects();
    if (document.getElementById('calendar-grid')) renderCalendar();
}

function editProject(projectId) {
    openProjectModal(projectId);
}

function deleteProject(projectId) {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        state.projects = state.projects.filter(p => p.id !== projectId);
        renderProjects();
        if (document.getElementById('calendar-grid')) renderCalendar();
    }
}

function addTask(projectId) {
    openTaskModal(projectId);
}

function openTaskModal(projectId, taskId = null) {
    const modal = document.getElementById('task-modal');
    const title = document.getElementById('task-modal-title');
    const nameInput = document.getElementById('task-name');
    const descriptionInput = document.getElementById('task-description');
    const startInput = document.getElementById('task-start');
    const endInput = document.getElementById('task-end');

    if (taskId) {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
            const task = project.tareas.find(t => t.id === taskId);
            if (task) {
                title.textContent = 'Editar Tarea';
                nameInput.value = task.nombre;
                descriptionInput.value = task.descripción;
                startInput.value = task.fecha_inicio;
                endInput.value = task.fecha_fin;
                modal.setAttribute('data-project-id', projectId);
                modal.setAttribute('data-task-id', taskId);
            }
        }
    } else {
        title.textContent = 'Nueva Tarea';
        nameInput.value = '';
        descriptionInput.value = '';
        startInput.value = '';
        endInput.value = '';
        modal.setAttribute('data-project-id', projectId);
        modal.removeAttribute('data-task-id');
    }

    // Add event listeners to modal buttons
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.btn-secondary');
    const saveBtn = modal.querySelector('.btn-primary');

    closeBtn.onclick = () => closeModal('task-modal');
    cancelBtn.onclick = () => closeModal('task-modal');
    saveBtn.onclick = saveTask;

    modal.style.display = 'flex';
}

function saveTask() {
    const modal = document.getElementById('task-modal');
    const name = document.getElementById('task-name').value;
    const description = document.getElementById('task-description').value;
    const start = document.getElementById('task-start').value;
    const end = document.getElementById('task-end').value;

    if (!name) {
        alert('El nombre de la tarea es obligatorio');
        return;
    }

    const projectId = parseInt(modal.getAttribute('data-project-id'));
    const taskId = modal.getAttribute('data-task-id');

    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;

    if (taskId) {
        const task = project.tareas.find(t => t.id === parseInt(taskId));
        if (task) {
            task.nombre = name;
            task.descripción = description;
            task.fecha_inicio = start;
            task.fecha_fin = end;
        }
    } else {
        const newTask = {
            id: state.nextTaskId++,
            nombre: name,
            descripción: description,
            fecha_inicio: start,
            fecha_fin: end,
            completada: false,
            subtareas: []
        };

        project.tareas.push(newTask);
    }

    closeModal('task-modal');
    renderProjects();
    if (document.getElementById('calendar-grid')) renderCalendar();
}

function editTask(projectId, taskId) {
    openTaskModal(projectId, taskId);
}

function deleteTask(projectId, taskId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
            project.tareas = project.tareas.filter(t => t.id !== taskId);
            renderProjects();
            if (document.getElementById('calendar-grid')) renderCalendar();
        }
    }
}

function toggleTaskCompletion(projectId, taskId) {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
        const task = project.tareas.find(t => t.id === taskId);
        if (task) {
            task.completada = !task.completada;
            renderProjects();
            if (document.getElementById('calendar-grid')) renderCalendar();
        }
    }
}

function addSubtask(projectId, taskId) {
    openSubtaskModal(projectId, taskId);
}

function openSubtaskModal(projectId, taskId, subtaskId = null) {
    const modal = document.getElementById('subtask-modal');
    const title = document.getElementById('subtask-modal-title');
    const nameInput = document.getElementById('subtask-name');
    const descriptionInput = document.getElementById('subtask-description');
    const startInput = document.getElementById('subtask-start');
    const endInput = document.getElementById('subtask-end');

    if (subtaskId) {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
            const task = project.tareas.find(t => t.id === taskId);
            if (task) {
                const subtask = task.subtareas.find(s => s.id === subtaskId);
                if (subtask) {
                    title.textContent = 'Editar Subtarea';
                    nameInput.value = subtask.nombre;
                    descriptionInput.value = subtask.descripción;
                    startInput.value = subtask.fecha_inicio;
                    endInput.value = subtask.fecha_fin;
                    modal.setAttribute('data-project-id', projectId);
                    modal.setAttribute('data-task-id', taskId);
                    modal.setAttribute('data-subtask-id', subtaskId);
                }
            }
        }
    } else {
        title.textContent = 'Nueva Subtarea';
        nameInput.value = '';
        descriptionInput.value = '';
        startInput.value = '';
        endInput.value = '';
        modal.setAttribute('data-project-id', projectId);
        modal.setAttribute('data-task-id', taskId);
        modal.removeAttribute('data-subtask-id');
    }

    // Add event listeners to modal buttons
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.btn-secondary');
    const saveBtn = modal.querySelector('.btn-primary');

    closeBtn.onclick = () => closeModal('subtask-modal');
    cancelBtn.onclick = () => closeModal('subtask-modal');
    saveBtn.onclick = saveSubtask;

    modal.style.display = 'flex';
}

function saveSubtask() {
    const modal = document.getElementById('subtask-modal');
    const name = document.getElementById('subtask-name').value;
    const description = document.getElementById('subtask-description').value;
    const start = document.getElementById('subtask-start').value;
    const end = document.getElementById('subtask-end').value;

    if (!name) {
        alert('El nombre de la subtarea es obligatorio');
        return;
    }

    const projectId = parseInt(modal.getAttribute('data-project-id'));
    const taskId = parseInt(modal.getAttribute('data-task-id'));
    const subtaskId = modal.getAttribute('data-subtask-id');

    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;

    const task = project.tareas.find(t => t.id === taskId);
    if (!task) return;

    if (subtaskId) {
        const subtask = task.subtareas.find(s => s.id === parseInt(subtaskId));
        if (subtask) {
            subtask.nombre = name;
            subtask.descripción = description;
            subtask.fecha_inicio = start;
            subtask.fecha_fin = end;
        }
    } else {
        const newSubtask = {
            id: state.nextSubtaskId++,
            nombre: name,
            descripción: description,
            fecha_inicio: start,
            fecha_fin: end,
            completada: false
        };

        task.subtareas.push(newSubtask);
    }

    closeModal('subtask-modal');
    renderProjects();
    if (document.getElementById('calendar-grid')) renderCalendar();
}

function editSubtask(projectId, taskId, subtaskId) {
    openSubtaskModal(projectId, taskId, subtaskId);
}

function deleteSubtask(projectId, taskId, subtaskId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta subtarea?')) {
        const project = state.projects.find(p => p.id === projectId);
        if (project) {
            const task = project.tareas.find(t => t.id === taskId);
            if (task) {
                task.subtareas = task.subtareas.filter(s => s.id !== subtaskId);
                renderProjects();
                if (document.getElementById('calendar-grid')) renderCalendar();
            }
        }
    }
}

function toggleSubtaskCompletion(projectId, taskId, subtaskId) {
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
        const task = project.tareas.find(t => t.id === taskId);
        if (task) {
            const subtask = task.subtareas.find(s => s.id === subtaskId);
            if (subtask) {
                subtask.completada = !subtask.completada;
                renderProjects();
                if (document.getElementById('calendar-grid')) renderCalendar();
            }
        }
    }
}

function filterProjects() {
    const filter = document.getElementById('project-filter').value;
    // Implementation would filter projects based on the selected filter
    renderProjects();
}