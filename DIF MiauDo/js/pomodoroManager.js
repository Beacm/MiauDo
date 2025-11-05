// Pomodoro Timer

function startPomodoro() {
    if (state.pomodoro.isRunning) return;
    
    state.pomodoro.isRunning = true;
    document.getElementById('start-pomodoro').style.display = 'none';
    document.getElementById('pause-pomodoro').style.display = 'inline-block';
    
    state.pomodoro.timerInterval = setInterval(function() {
        state.pomodoro.timeLeft--;
        
        if (state.pomodoro.timeLeft <= 0) {
            clearInterval(state.pomodoro.timerInterval);
            
            if (state.pomodoro.isFocus) {
                state.pomodoro.sessionsCompleted++;
                state.pomodoro.totalStudyTime += state.pomodoro.focusTime;
                state.pomodoro.isFocus = false;
                state.pomodoro.timeLeft = state.pomodoro.breakTime;
                alert('¡Sesión de enfoque completada! Tiempo de descanso.');
            } else {
                state.pomodoro.isFocus = true;
                state.pomodoro.timeLeft = state.pomodoro.focusTime;
                alert('¡Descanso completado! Volviendo al modo de enfoque.');
            }
            
            updatePomodoroDisplay();
            startPomodoro();
            return;
        }
        
        updatePomodoroDisplay();
    }, 1000);
}

function pausePomodoro() {
    if (!state.pomodoro.isRunning) return;
    
    state.pomodoro.isRunning = false;
    clearInterval(state.pomodoro.timerInterval);
    
    document.getElementById('start-pomodoro').style.display = 'inline-block';
    document.getElementById('pause-pomodoro').style.display = 'none';
}

function resetPomodoro() {
    state.pomodoro.isRunning = false;
    clearInterval(state.pomodoro.timerInterval);
    
    state.pomodoro.timeLeft = state.pomodoro.isFocus ? state.pomodoro.focusTime : state.pomodoro.breakTime;
    
    document.getElementById('start-pomodoro').style.display = 'inline-block';
    document.getElementById('pause-pomodoro').style.display = 'none';
    
    updatePomodoroDisplay();
}

function updatePomodoroDisplay() {
    const minutes = Math.floor(state.pomodoro.timeLeft / 60);
    const seconds = state.pomodoro.timeLeft % 60;
    
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const totalTime = state.pomodoro.isFocus ? state.pomodoro.focusTime : state.pomodoro.breakTime;
    const progress = ((totalTime - state.pomodoro.timeLeft) / totalTime) * 100;
    document.getElementById('pomodoro-progress').style.width = `${progress}%`;
    
    document.getElementById('sessions-completed').textContent = state.pomodoro.sessionsCompleted;
    
    const totalHours = Math.floor(state.pomodoro.totalStudyTime / 3600);
    const totalMinutes = Math.floor((state.pomodoro.totalStudyTime % 3600) / 60);
    document.getElementById('total-study-time').textContent = 
        `${totalHours}:${totalMinutes.toString().padStart(2, '0')}`;
}

function openPomodoroSettings() {
    const modal = document.getElementById('pomodoro-settings-modal');
    
    document.getElementById('focus-hours').value = Math.floor(state.pomodoro.focusTime / 3600);
    document.getElementById('focus-minutes').value = Math.floor((state.pomodoro.focusTime % 3600) / 60);
    document.getElementById('break-hours').value = Math.floor(state.pomodoro.breakTime / 3600);
    document.getElementById('break-minutes').value = Math.floor((state.pomodoro.breakTime % 3600) / 60);
    document.getElementById('target-hours').value = Math.floor(state.pomodoro.targetTime / 3600);
    document.getElementById('target-minutes').value = Math.floor((state.pomodoro.targetTime % 3600) / 60);
    
    // Add event listeners to modal buttons
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.btn-secondary');
    const saveBtn = modal.querySelector('.btn-primary');
    
    closeBtn.onclick = () => closeModal('pomodoro-settings-modal');
    cancelBtn.onclick = () => closeModal('pomodoro-settings-modal');
    saveBtn.onclick = savePomodoroSettings;
    
    modal.style.display = 'flex';
}

function savePomodoroSettings() {
    const focusHours = parseInt(document.getElementById('focus-hours').value) || 0;
    const focusMinutes = parseInt(document.getElementById('focus-minutes').value) || 0;
    const breakHours = parseInt(document.getElementById('break-hours').value) || 0;
    const breakMinutes = parseInt(document.getElementById('break-minutes').value) || 0;
    const targetHours = parseInt(document.getElementById('target-hours').value) || 0;
    const targetMinutes = parseInt(document.getElementById('target-minutes').value) || 0;
    
    state.pomodoro.focusTime = (focusHours * 3600) + (focusMinutes * 60);
    state.pomodoro.breakTime = (breakHours * 3600) + (breakMinutes * 60);
    state.pomodoro.targetTime = (targetHours * 3600) + (targetMinutes * 60);
    
    state.pomodoro.timeLeft = state.pomodoro.isFocus ? state.pomodoro.focusTime : state.pomodoro.breakTime;
    
    closeModal('pomodoro-settings-modal');
    updatePomodoroDisplay();
}