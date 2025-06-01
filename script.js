createApp({
    setup() {
        const showLabels = ref(true);
        const heartsEnabled = ref(true);
        const audioContext = ref(null);
        const activeNotes = ref(new Set());
        const isPlayingDemo = ref(false);

        const pianoKeys = reactive([
            { type: 'white', class: 'key-C', dataNote: 'C', dataKey: 'a', label: 'A', frequency: 261.63 },
            { type: 'white', class: 'key-D', dataNote: 'D', dataKey: 's', label: 'S', frequency: 293.66 },
            { type: 'white', class: 'key-E', dataNote: 'E', dataKey: 'd', label: 'D', frequency: 329.63 },
            { type: 'white', class: 'key-F', dataNote: 'F', dataKey: 'f', label: 'F', frequency: 349.23 },
            { type: 'white', class: 'key-G', dataNote: 'G', dataKey: 'g', label: 'G', frequency: 392.00 },
            { type: 'white', class: 'key-A', dataNote: 'A', dataKey: 'h', label: 'H', frequency: 440.00 },
            { type: 'white', class: 'key-B', dataNote: 'B', dataKey: 'j', label: 'J', frequency: 493.88 },
            { type: 'white', class: 'key-C2', dataNote: 'C2', dataKey: 'k', label: 'K', frequency: 523.25 },
            { type: 'white', class: 'key-D2', dataNote: 'D2', dataKey: 'l', label: 'L', frequency: 587.33 },
            { type: 'white', class: 'key-E2', dataNote: 'E2', dataKey: 'z', label: 'Z', frequency: 659.25 },
            { type: 'white', class: 'key-F2', dataNote: 'F2', dataKey: 'x', label: 'X', frequency: 698.46 },
            { type: 'white', class: 'key-G2', dataNote: 'G2', dataKey: 'c', label: 'C', frequency: 783.99 },
            { type: 'white', class: 'key-A2', dataNote: 'A2', dataKey: 'v', label: 'V', frequency: 880.00 },
            { type: 'white', class: 'key-B2', dataNote: 'B2', dataKey: 'b', label: 'B', frequency: 987.77 },
            { type: 'white', class: 'key-C3', dataNote: 'C3', dataKey: 'n', label: 'N', frequency: 1046.50 },
            { type: 'white', class: 'key-D3', dataNote: 'D3', dataKey: 'm', label: 'M', frequency: 1174.66 },
            { type: 'white', class: 'key-E3', dataNote: 'E3', dataKey: ',', label: ',', frequency: 1318.51 },
            { type: 'white', class: 'key-F3', dataNote: 'F3', dataKey: 'q', label: 'Q', frequency: 1396.91 },
            { type: 'white', class: 'key-G3', dataNote: 'G3', dataKey: 'w', label: 'W', frequency: 1567.98 },
            { type: 'white', class: 'key-A3', dataNote: 'A3', dataKey: 'e', label: 'E', frequency: 1760.00 },
            { type: 'black', class: 'key-C#', dataNote: 'C#', dataKey: 'o', label: 'O', frequency: 277.18 },
            { type: 'black', class: 'key-D#', dataNote: 'D#', dataKey: 'r', label: 'R', frequency: 311.13 },
            { type: 'black', class: 'key-F#', dataNote: 'F#', dataKey: 't', label: 'T', frequency: 369.99 },
            { type: 'black', class: 'key-G#', dataNote: 'G#', dataKey: 'y', label: 'Y', frequency: 415.30 },
            { type: 'black', class: 'key-A#', dataNote: 'A#', dataKey: 'u', label: 'U', frequency: 466.16 },
            { type: 'black', class: 'key-C#2', dataNote: 'C#2', dataKey: 'i', label: 'I', frequency: 554.37 },
            { type: 'black', class: 'key-D#2', dataNote: 'D#2', dataKey: '1', label: '1', frequency: 622.25 },
            { type: 'black', class: 'key-F#2', dataNote: 'F#2', dataKey: '2', label: '2', frequency: 739.99 },
            { type: 'black', class: 'key-G#2', dataNote: 'G#2', dataKey: '3', label: '3', frequency: 830.61 },
            { type: 'black', class: 'key-A#2', dataNote: 'A#2', dataKey: '4', label: '4', frequency: 932.33 },
            { type: 'black', class: 'key-C#3', dataNote: 'C#3', dataKey: '5', label: '5', frequency: 1108.73 },
            { type: 'black', class: 'key-D#3', dataNote: 'D#3', dataKey: '6', label: '6', frequency: 1244.51 },
            { type: 'black', class: 'key-F#3', dataNote: 'F#3', dataKey: '7', label: '7', frequency: 1479.98 },
            { type: 'black', class: 'key-G#3', dataNote: 'G#3', dataKey: '8', label: '8', frequency: 1661.22 },
        ]);

        const keyMap = {};
        pianoKeys.forEach(key => {
            keyMap[key.dataKey] = key.dataNote;
        });

        const demoMelody = reactive([
            'C', 'C', 'G', 'G', 'A', 'A', 'G',
            'F', 'F', 'E', 'E', 'D', 'D', 'C',
            'G', 'G', 'F', 'F', 'E', 'E', 'D',
            'G', 'G', 'F', 'F', 'E', 'E', 'D',
            'C', 'C', 'G', 'G', 'A', 'A', 'G',
            'F', 'F', 'E', 'E', 'D', 'D', 'C'
        ]);

        const heartsButtonText = computed(() =>
            heartsEnabled.value ? 'Disable Hearts' : 'Enable Hearts'
        );

        function toggleLabels() {
            showLabels.value = !showLabels.value;
        }

        function toggleHearts() {
            heartsEnabled.value = !heartsEnabled.value;
            const backgroundHearts = document.getElementById('background-hearts-container');
            if (backgroundHearts) {
                backgroundHearts.style.display = heartsEnabled.value ? 'block' : 'none';
            }
        }

        async function playDemo() {
            if (isPlayingDemo.value) return;
            isPlayingDemo.value = true;

            for (const note of demoMelody) {
                if (!isPlayingDemo.value) break;

                const key = pianoKeys.find(k => k.dataNote === note);
                if (key) {
                    playNote(key);
                    await new Promise(resolve => setTimeout(resolve, 400));
                    activeNotes.value.delete(note);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }

            isPlayingDemo.value = false;
        }

        const playNote = (key, event) => {
            if (!audioContext.value) {
                audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (heartsEnabled.value && event && event.currentTarget) {
                createHeartsForKey(event.currentTarget);
            }

            const oscillator = audioContext.value.createOscillator();
            const gainNode = audioContext.value.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = key.frequency;
            gainNode.gain.setValueAtTime(0.2, audioContext.value.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.value.destination);

            oscillator.start();

            activeNotes.value.add(key.dataNote);

            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.value.currentTime + 1);

            oscillator.stop(audioContext.value.currentTime + 1);

            oscillator.onended = () => {
                activeNotes.value.delete(key.dataNote);
                oscillator.disconnect();
                gainNode.disconnect();
            };
        };


        function playSound(note) {
            const frequency = noteFrequencies[note];
            if (!frequency) return;

            const oscillator = audioContext.value.createOscillator();
            const gainNode = audioContext.value.createGain();
            const filterNode = audioContext.value.createBiquadFilter();

            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;

            filterNode.type = 'lowpass';
            filterNode.frequency.value = 2000;

            gainNode.gain.setValueAtTime(0.15, audioContext.value.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.value.currentTime + 1.5);

            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioContext.value.destination);

            oscillator.start();
            oscillator.stop(audioContext.value.currentTime + 1.5);

            setTimeout(() => {
                activeNotes.value.delete(note);
            }, 150);
        }

        function createRipple(element) {
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');

            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = rect.width / 2 - size / 2;
            const y = rect.height / 2 - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            element.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        function createHeartsForKey(element) {
            const rect = element.getBoundingClientRect();
            const numHearts = Math.floor(Math.random() * 3) + 3; // smth betwenr 3 and 5 hearts

            for (let i = 0; i < numHearts; i++) {
                const x = rect.left + Math.random() * rect.width;
                const y = rect.top;

                setTimeout(() => {
                    createPlayingHeart(x, y);
                }, i * 100);
            }
        }

        function createPlayingHeart(x, y) {
            const heartsContainer = document.getElementById('playing-hearts-container');
            if (!heartsContainer) return;

            const heart = document.createElement('div');
            heart.classList.add('playing-heart');

            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;

            const size = Math.random() * 10 + 20;
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.setProperty('--size', `${size}px`);

            const animationDuration = Math.random() * 1 + 3;
            heart.style.animationDuration = `${animationDuration}s`;

            const drift = Math.random() * 100 - 50;
            heart.style.setProperty('--drift', `${drift}px`);

            heartsContainer.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, animationDuration * 1000);
        }

        function createParticles() {
            const particlesContainer = document.getElementById('floating-particles');
            if (!particlesContainer) return;

            particlesContainer.innerHTML = '';
            const numberOfParticles = 8;

            for (let i = 0; i < numberOfParticles; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');

                const left = Math.random() * 100;
                const animationDuration = Math.random() * 10 + 15;
                const delay = Math.random() * 20;

                particle.style.left = `${left}%`;
                particle.style.animationDuration = `${animationDuration}s`;
                particle.style.animationDelay = `${delay}s`;

                particlesContainer.appendChild(particle);
            }
        }

        function createBackgroundHearts() {
            const heartsContainer = document.getElementById('background-hearts-container');
            if (!heartsContainer) return;

            heartsContainer.innerHTML = '';
            const numberOfHearts = 15;

            for (let i = 0; i < numberOfHearts; i++) {
                const heart = document.createElement('div');
                heart.classList.add('background-heart');

                const left = Math.random() * 100;
                const size = Math.random() * 15 + 10;
                const animationDuration = Math.random() * 10 + 15;
                const delay = Math.random() * 20;
                const drift = Math.random() * 100 - 50;

                heart.style.left = `${left}%`;
                heart.style.width = `${size}px`;
                heart.style.height = `${size}px`;
                heart.style.animationDuration = `${animationDuration}s`;
                heart.style.animationDelay = `${delay}s`;
                heart.style.setProperty('--drift', `${drift}px`);
                heart.style.setProperty('--size', `${size}px`);

                heartsContainer.appendChild(heart);
            }
        }

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

        function handleKeyDown(e) {
            if (e.repeat || isPlayingDemo.value) return;

            const key = e.key.toLowerCase();
            if (keyMap[key]) {
                const note = keyMap[key];
                const keyElement = document.querySelector(`.key[data-note="${note}"]`);
                if (keyElement && !activeNotes.value.has(note)) {
                    playNote(
                        pianoKeys.find(k => k.dataNote === note),
                        { currentTarget: keyElement }
                    );
                }
            }
        }

        function handleKeyUp(e) {
            const key = e.key.toLowerCase();
            if (keyMap[key]) {
                const note = keyMap[key];
                activeNotes.value.delete(note);
            }
        }

        onMounted(() => {
            createParticles();
            createBackgroundHearts();
            positionBlackKeys();

            window.addEventListener('resize', positionBlackKeys);
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
        });

        return {
            showLabels,
            heartsEnabled,
            pianoKeys,
            activeNotes,
            heartsButtonText,
            toggleLabels,
            toggleHearts,
            playDemo,
            playNote
        };
    }
}).mount('#app');