  document.addEventListener('DOMContentLoaded', function() {
    const keys = document.querySelectorAll('.key');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const keyMap = {
        // First octave
        'a': 'C',
        'w': 'C#',
        's': 'D',
        'e': 'D#',
        'd': 'E',
        'f': 'F',
        't': 'F#',
        'g': 'G',
        'y': 'G#',
        'h': 'A',
        'u': 'A#',
        'j': 'B',
        // Second octave
        'k': 'C2',
        'i': 'C#2',
        'l': 'D2',
        '1': 'D#2',
        'z': 'E2',
        'x': 'F2',
        '2': 'F#2',
        'c': 'G2',
        '3': 'G#2',
        'v': 'A2',
        '4': 'A#2',
        'b': 'B2',
        'n': 'C3',
        '5': 'C#3',
        'm': 'D3',
        '6': 'D#3',
        ',': 'E3',
        // Third octave
        'q': 'F3',
        '7': 'F#3',
        'w': 'G3',
        '8': 'G#3',
        'r': 'A3'
    };
    
    // Frequencies for each note (in Hz)
    const noteFrequencies = {
        // First octave
        'C': 261.63,
        'C#': 277.18,
        'D': 293.66,
        'D#': 311.13,
        'E': 329.63,
        'F': 349.23,
        'F#': 369.99,
        'G': 392.00,
        'G#': 415.30,
        'A': 440.00,
        'A#': 466.16,
        'B': 493.88,
        // Second octave
        'C2': 523.25,
        'C#2': 554.37,
        'D2': 587.33,
        'D#2': 622.25,
        'E2': 659.25,
        'F2': 698.46,
        'F#2': 739.99,
        'G2': 783.99,
        'G#2': 830.61,
        'A2': 880.00,
        'A#2': 932.33,
        'B2': 987.77,
        'C3': 1046.50,
        'C#3': 1108.73,
        'D3': 1174.66,
        'D#3': 1244.51,
        'E3': 1318.51,
        // Third octave
        'F3': 1396.91,
        'F#3': 1479.98,
        'G3': 1567.98,
        'G#3': 1661.22,
        'A3': 1760.00
    };
    
    // Create floating hearts
    function createHearts() {
        const heartsContainer = document.getElementById('hearts-container');
        const numberOfHearts = 15;
        
        for (let i = 0; i < numberOfHearts; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            
            const left = Math.random() * 100;
            const size = Math.random() * 15 + 10;
            const animationDuration = Math.random() * 10 + 15;
            const delay = Math.random() * 20;
            
            heart.style.left = `${left}%`;
            heart.style.bottom = '-50px';
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.animationDuration = `${animationDuration}s`;
            heart.style.animationDelay = `${delay}s`;
            
            heartsContainer.appendChild(heart);
        }
    }
    
    // Create floating musical notes
    function createMusicalNotes() {
        const notesContainer = document.getElementById('musical-notes-container');
        const musicalSymbols = ['♪', '♫', '♬', '♩', '♭', '♯', '𝄞'];
        const numberOfNotes = 12;
        
        for (let i = 0; i < numberOfNotes; i++) {
            const note = document.createElement('div');
            note.classList.add('musical-note');
            note.textContent = musicalSymbols[Math.floor(Math.random() * musicalSymbols.length)];
            
            const left = Math.random() * 100;
            const size = Math.random() * 20 + 20;
            const animationDuration = Math.random() * 8 + 12;
            const delay = Math.random() * 15;
            
            note.style.left = `${left}%`;
            note.style.fontSize = `${size}px`;
            note.style.animationDuration = `${animationDuration}s`;
            note.style.animationDelay = `${delay}s`;
            
            notesContainer.appendChild(note);
        }
    }
    
    // Create sparkle effect
    function createSparkle(element) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        const rect = element.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        element.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 600);
    }
    
    // Initialize background elements
    createHearts();
    createMusicalNotes();
    
    // Function to play a note with enhanced sound
    function playNote(note) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filterNode = audioContext.createBiquadFilter();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = noteFrequencies[note];
        
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 2000;
        
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);
        
        oscillator.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.5);
        
        return oscillator;
    }
    
    // Position black keys correctly
    function positionBlackKeys() {
        const blackKeyPositions = [
            { selector: '.key-C\\#', whiteKey: '.key-C' },
            { selector: '.key-D\\#', whiteKey: '.key-D' },
            { selector: '.key-F\\#', whiteKey: '.key-F' },
            { selector: '.key-G\\#', whiteKey: '.key-G' },
            { selector: '.key-A\\#', whiteKey: '.key-A' },
            { selector: '.key-C\\#2', whiteKey: '.key-C2' },
            { selector: '.key-D\\#2', whiteKey: '.key-D2' },
            { selector: '.key-F\\#2', whiteKey: '.key-F2' },
            { selector: '.key-G\\#2', whiteKey: '.key-G2' },
            { selector: '.key-A\\#2', whiteKey: '.key-A2' },
            { selector: '.key-C\\#3', whiteKey: '.key-C3' },
            { selector: '.key-D\\#3', whiteKey: '.key-D3' },
            { selector: '.key-F\\#3', whiteKey: '.key-F3' },
            { selector: '.key-G\\#3', whiteKey: '.key-G3' }
        ];
        
        blackKeyPositions.forEach(pos => {
            const blackKey = document.querySelector(pos.selector);
            const whiteKey = document.querySelector(pos.whiteKey);
            if (blackKey && whiteKey) {
                blackKey.style.left = (whiteKey.offsetLeft + whiteKey.offsetWidth - 20) + 'px';
            }
        });
    }
    
    // Position black keys on load and resize
    window.addEventListener('load', positionBlackKeys);
    window.addEventListener('resize', positionBlackKeys);
    
    // Add click event listeners to piano keys
    keys.forEach(key => {
        key.addEventListener('mousedown', () => {
            const note = key.getAttribute('data-note');
            playNote(note);
            key.classList.add('active');
            createSparkle(key);
        });
        
        key.addEventListener('mouseup', () => {
            key.classList.remove('active');
        });
        
        key.addEventListener('mouseleave', () => {
            key.classList.remove('active');
        });
    });
    
    // Add keyboard event listeners
    document.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        
        const key = e.key.toLowerCase();
        if (keyMap[key]) {
            const note = keyMap[key];
            const keyElement = document.querySelector(`.key[data-note="${note}"]`);
            
            if (keyElement && !keyElement.classList.contains('active')) {
                playNote(note);
                keyElement.classList.add('active');
                createSparkle(keyElement);
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (keyMap[key]) {
            const note = keyMap[key];
            const keyElement = document.querySelector(`.key[data-note="${note}"]`);
            
            if (keyElement) {
                keyElement.classList.remove('active');
            }
        }
    });
    
    // Control buttons
    const toggleLabelsBtn = document.getElementById('toggle-labels');
    toggleLabelsBtn.addEventListener('click', () => {
        keys.forEach(key => {
            key.classList.toggle('hide-label');
            if (key.classList.contains('hide-label')) {
                key.textContent = '';
            } else {
                key.textContent = key.getAttribute('data-key').toUpperCase();
            }
        });
    });
    
    const toggleHeartsBtn = document.getElementById('toggle-hearts');
    toggleHeartsBtn.addEventListener('click', () => {
        const heartsContainer = document.getElementById('hearts-container');
        heartsContainer.style.display = heartsContainer.style.display === 'none' ? 'block' : 'none';
    });
    
    const toggleNotesBtn = document.getElementById('toggle-notes');
    toggleNotesBtn.addEventListener('click', () => {
        const notesContainer = document.getElementById('musical-notes-container');
        notesContainer.style.display = notesContainer.style.display === 'none' ? 'block' : 'none';
    });
    
    const playDemoBtn = document.getElementById('play-demo');
    playDemoBtn.addEventListener('click', async () => {
        const melody = [
            'C', 'C', 'G', 'G', 'A', 'A', 'G', 
            'F', 'F', 'E', 'E', 'D', 'D', 'C',
            'G', 'G', 'F', 'F', 'E', 'E', 'D',
            'G', 'G', 'F', 'F', 'E', 'E', 'D',
            'C', 'C', 'G', 'G', 'A', 'A', 'G',
            'F', 'F', 'E', 'E', 'D', 'D', 'C'
        ];
        
        playDemoBtn.disabled = true;
        toggleLabelsBtn.disabled = true;
        
        for (const note of melody) {
            const keyElement = document.querySelector(`.key[data-note="${note}"]`);
            if (keyElement) {
                keyElement.classList.add('active');
                playNote(note);
                createSparkle(keyElement);
                
                await new Promise(resolve => setTimeout(resolve, 400));
                keyElement.classList.remove('active');
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        
        playDemoBtn.disabled = false;
        toggleLabelsBtn.disabled = false;
    });
});
