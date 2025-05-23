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
        '1': 'C#2',
        'z': 'D2',
        '2': 'D#2',
        'x': 'E2',
        'c': 'F2',
        '3': 'F#2',
        'v': 'G2',
        '4': 'G#2',
        'b': 'A2',
        '5': 'A#2',
        'n': 'B2',
        'm': 'C3'
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
        'C3': 1046.50
    };
    
    // Create floating hearts
    function createHearts() {
        const heartsContainer = document.getElementById('hearts-container');
        const numberOfHearts = 20;
        
        for (let i = 0; i < numberOfHearts; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            
            // Random position
            const left = Math.random() * 100;
            const size = Math.random() * 20 + 10;
            const animationDuration = Math.random() * 15 + 10;
            const delay = Math.random() * 15;
            
            heart.style.left = `${left}%`;
            heart.style.bottom = '-50px';
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.animationDuration = `${animationDuration}s`;
            heart.style.animationDelay = `${delay}s`;
            
            // Adjust the before and after pseudo-elements
            heart.style.setProperty('--size', `${size}px`);
            
            heartsContainer.appendChild(heart);
        }
    }
    
    // Create hearts on load
    createHearts();
    
    // Function to play a note
    function playNote(note) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = noteFrequencies[note];
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
        
        return oscillator;
    }
    
    // Position black keys correctly
    function positionBlackKeys() {
        // First octave
        document.querySelector('.key-C\\#').style.left = (document.querySelector('.key-C').offsetLeft + document.querySelector('.key-C').offsetWidth - 20) + 'px';
        document.querySelector('.key-D\\#').style.left = (document.querySelector('.key-D').offsetLeft + document.querySelector('.key-D').offsetWidth - 20) + 'px';
        document.querySelector('.key-F\\#').style.left = (document.querySelector('.key-F').offsetLeft + document.querySelector('.key-F').offsetWidth - 20) + 'px';
        document.querySelector('.key-G\\#').style.left = (document.querySelector('.key-G').offsetLeft + document.querySelector('.key-G').offsetWidth - 20) + 'px';
        document.querySelector('.key-A\\#').style.left = (document.querySelector('.key-A').offsetLeft + document.querySelector('.key-A').offsetWidth - 20) + 'px';
        
        // Second octave
        document.querySelector('.key-C\\#2').style.left = (document.querySelector('.key-C2').offsetLeft + document.querySelector('.key-C2').offsetWidth - 20) + 'px';
        document.querySelector('.key-D\\#2').style.left = (document.querySelector('.key-D2').offsetLeft + document.querySelector('.key-D2').offsetWidth - 20) + 'px';
        document.querySelector('.key-F\\#2').style.left = (document.querySelector('.key-F2').offsetLeft + document.querySelector('.key-F2').offsetWidth - 20) + 'px';
        document.querySelector('.key-G\\#2').style.left = (document.querySelector('.key-G2').offsetLeft + document.querySelector('.key-G2').offsetWidth - 20) + 'px';
        document.querySelector('.key-A\\#2').style.left = (document.querySelector('.key-A2').offsetLeft + document.querySelector('.key-A2').offsetWidth - 20) + 'px';
    }
    
    // Position black keys on load and window resize
    window.addEventListener('load', positionBlackKeys);
    window.addEventListener('resize', positionBlackKeys);
    
    // Add click event listeners to piano keys
    keys.forEach(key => {
        key.addEventListener('mousedown', () => {
            const note = key.getAttribute('data-note');
            playNote(note);
            key.classList.add('active');
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
        if (e.repeat) return; // Prevent holding key
        
        const key = e.key.toLowerCase();
        if (keyMap[key]) {
            const note = keyMap[key];
            const keyElement = document.querySelector(`.key[data-note="${note}"]`);
            
            if (keyElement && !keyElement.classList.contains('active')) {
                playNote(note);
                keyElement.classList.add('active');
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
    
    // Toggle key labels
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
    
    // Toggle hearts
    const toggleHeartsBtn = document.getElementById('toggle-hearts');
    toggleHeartsBtn.addEventListener('click', () => {
        const heartsContainer = document.getElementById('hearts-container');
        if (heartsContainer.style.display === 'none') {
            heartsContainer.style.display = 'block';
        } else {
            heartsContainer.style.display = 'none';
        }
    });
    
    // Play demo
    const playDemoBtn = document.getElementById('play-demo');
    playDemoBtn.addEventListener('click', async () => {
        // Simple melody (Twinkle Twinkle Little Star)
        const melody = [
            'C', 'C', 'G', 'G', 'A', 'A', 'G', 
            'F', 'F', 'E', 'E', 'D', 'D', 'C',
            'G', 'G', 'F', 'F', 'E', 'E', 'D',
            'G', 'G', 'F', 'F', 'E', 'E', 'D',
            'C', 'C', 'G', 'G', 'A', 'A', 'G',
            'F', 'F', 'E', 'E', 'D', 'D', 'C'
        ];
        
        // Disable buttons during demo
        playDemoBtn.disabled = true;
        toggleLabelsBtn.disabled = true;
        
        for (const note of melody) {
            const keyElement = document.querySelector(`.key[data-note="${note}"]`);
            keyElement.classList.add('active');
            playNote(note);
            
            // Wait for 300ms before playing the next note
            await new Promise(resolve => setTimeout(resolve, 300));
            keyElement.classList.remove('active');
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        // Re-enable buttons after demo
        playDemoBtn.disabled = false;
        toggleLabelsBtn.disabled = false;
    });
});
