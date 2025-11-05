// Music Player

function togglePlayPause() {
    state.music.isPlaying = !state.music.isPlaying;
    
    const icon = document.getElementById('play-pause-icon');
    if (state.music.isPlaying) {
        icon.className = 'fas fa-pause';
    } else {
        icon.className = 'fas fa-play';
    }
}

function nextTrack() {
    state.music.currentTrack = (state.music.currentTrack + 1) % state.music.tracks.length;
    updateMusicDisplay();
}

function previousTrack() {
    state.music.currentTrack = (state.music.currentTrack - 1 + state.music.tracks.length) % state.music.tracks.length;
    updateMusicDisplay();
}

function updateMusicDisplay() {
    const currentTrack = state.music.tracks[state.music.currentTrack];
    document.getElementById('current-song-title').textContent = currentTrack.title;
    document.getElementById('current-song-artist').textContent = currentTrack.artist;
}