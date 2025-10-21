// Haptic Feedback Utility
// Uses the Vibration API for haptic feedback on supported devices

const haptics = {
    // Check if vibration is supported
    isSupported: () => {
        return 'vibrate' in navigator;
    },
    
    // Light tap - for button presses, UI interactions
    light: () => {
        if (haptics.isSupported()) {
            navigator.vibrate(10);
        }
    },
    
    // Medium impact - for selections, toggles
    medium: () => {
        if (haptics.isSupported()) {
            navigator.vibrate(20);
        }
    },
    
    // Heavy impact - for important actions, errors
    heavy: () => {
        if (haptics.isSupported()) {
            navigator.vibrate(30);
        }
    },
    
    // Success pattern - for completions
    success: () => {
        if (haptics.isSupported()) {
            navigator.vibrate([10, 50, 10]);
        }
    },
    
    // Error pattern - for mistakes
    error: () => {
        if (haptics.isSupported()) {
            navigator.vibrate([30, 50, 30, 50, 30]);
        }
    },
    
    // Selection - for picking items
    selection: () => {
        if (haptics.isSupported()) {
            navigator.vibrate(15);
        }
    },
    
    // Double tap
    doubleTap: () => {
        if (haptics.isSupported()) {
            navigator.vibrate([10, 30, 10]);
        }
    },
    
    // Spinner spin - continuous light vibration
    spin: (intensity) => {
        if (haptics.isSupported() && intensity > 5) {
            const duration = Math.min(Math.floor(intensity / 10), 20);
            navigator.vibrate(duration);
        }
    },
    
    // Pop - for pop-it bubbles
    pop: () => {
        if (haptics.isSupported()) {
            navigator.vibrate(8);
        }
    }
};

// Tab Navigation
const tabs = document.querySelectorAll('.tab');
const screens = document.querySelectorAll('.screen');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetScreen = tab.dataset.screen;
        
        tabs.forEach(t => t.classList.remove('active'));
        screens.forEach(s => s.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(targetScreen).classList.add('active');
        
        // Haptic feedback for tab change
        haptics.selection();

        if (targetScreen === 'drawing-screen') {
            resizeCanvas();
        }
    });
});

// Buttons Screen
let counter = 0;
const counterDisplay = document.getElementById('counter');
const buttonsGrid = document.getElementById('buttonsGrid');
const resetButton = document.getElementById('resetButton');
const randomizeButton = document.getElementById('randomizeButton');

const shapes = ['circle', 'square', 'rounded'];
const sizes = ['small', 'medium', 'large', 'wide', 'tall'];
const colors = ['#007AFF', '#FF3B30', '#34C759', '#FF9500', '#AF52DE', '#FF2D55', '#5AC8FA', '#FFCC00'];

const icons = [
    { name: 'Zap', label: 'ZAP!' },
    { name: 'Sparkles', label: 'SHINE' },
    { name: 'Star', label: 'STAR' },
    { name: 'Heart', label: 'LOVE' },
    { name: 'Rocket', label: 'BLAST' },
    { name: 'Flame', label: 'FIRE' },
    { name: 'Trophy', label: 'WIN' },
    { name: 'Crown', label: 'KING' },
    { name: 'Diamond', label: 'GEM' },
    { name: 'Candy', label: 'SWEET' },
    { name: 'Target', label: 'HIT' },
    { name: 'Pizza', label: 'YUM' },
    { name: 'Music', label: 'TUNE' },
    { name: 'Gamepad2', label: 'PLAY' },
    { name: 'Gift', label: 'GIFT' },
    { name: 'PartyPopper', label: 'PARTY' },
    { name: 'Smile', label: 'HAPPY' },
    { name: 'Sun', label: 'SUNNY' },
    { name: 'Moon', label: 'NIGHT' },
    { name: 'Cloud', label: 'CLOUD' },
    { name: 'Snowflake', label: 'SNOW' },
    { name: 'Lightbulb', label: 'IDEA' },
    { name: 'Glasses', label: 'COOL' },
    { name: 'Watch', label: 'TIME' },
    { name: 'Puzzle', label: 'SOLVE' },
    { name: 'Bug', label: 'BUG' },
    { name: 'Cherry', label: 'CHERRY' },
    { name: 'Apple', label: 'APPLE' },
    { name: 'Cookie', label: 'COOKIE' },
    { name: 'IceCream', label: 'ICE' }
];

const animations = [
    'animate-bounce',
    'animate-spin', 
    'animate-wiggle',
    'animate-pulse',
    'animate-shake',
    'animate-jello',
    'animate-glow',
    'animate-rainbow'
];

function createRandomButton() {
    const button = document.createElement('button');
    button.className = 'fidget-button';
    
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const animation = animations[Math.floor(Math.random() * animations.length)];
    
    button.classList.add(shape);
    button.classList.add(size);
    button.style.background = color;
    button.dataset.animation = animation;
    
    // Create icon element
    const iconElement = document.createElement('i');
    iconElement.setAttribute('data-lucide', icon.name);
    
    // Create label
    const labelElement = document.createElement('span');
    labelElement.textContent = icon.label;
    
    button.appendChild(iconElement);
    button.appendChild(labelElement);
    
    button.addEventListener('click', (e) => {
        counterDisplay.textContent = ++counter;
        
        // Haptic feedback for button press
        haptics.medium();
        
        // Add ripple effect
        button.classList.add('ripple');
        setTimeout(() => button.classList.remove('ripple'), 600);
        
        // Add animation
        button.classList.add(button.dataset.animation);
        setTimeout(() => button.classList.remove(button.dataset.animation), 1000);
        
        // Play sound with varying pitch
        playSound(800 + Math.random() * 400);
        
        // Create particle effect
        createParticles(e.clientX, e.clientY, color);
    });
    
    return button;
}

function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = 0;
        let posY = 0;
        let opacity = 1;
        
        const animate = () => {
            posX += vx * 0.016;
            posY += vy * 0.016;
            opacity -= 0.02;
            
            particle.style.transform = `translate(${posX}px, ${posY}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        animate();
    }
}

function initializeButtons() {
    buttonsGrid.innerHTML = '';
    for (let i = 0; i < 12; i++) {
        buttonsGrid.appendChild(createRandomButton());
    }
    // Initialize Lucide icons
    lucide.createIcons();
}

resetButton.addEventListener('click', () => {
    counter = 0;
    counterDisplay.textContent = counter;
    counterDisplay.style.animation = 'pulse 0.5s ease';
    setTimeout(() => counterDisplay.style.animation = '', 500);
    
    // Haptic feedback for reset
    haptics.light();
    playSound(600);
});

randomizeButton.addEventListener('click', () => {
    buttonsGrid.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        initializeButtons();
        buttonsGrid.style.animation = '';
    }, 500);
    
    // Haptic feedback for randomize
    haptics.success();
    playSound(1000);
});

initializeButtons();

// Spinner Screen
const spinner = document.getElementById('spinner');
const spinnerDesign = document.getElementById('spinnerDesign');
const spinSpeed = document.getElementById('spinSpeed');
const spinnerInfo = document.getElementById('spinnerInfo');
const spinnerTypeBtns = document.querySelectorAll('.spinner-type-btn');

let rotation = 0;
let velocity = 0;
let lastAngle = 0;
let isDragging = false;
let currentSpinnerType = 'classic';
let friction = 0.98;
let lastHapticTime = 0;

// Spinner designs
const spinnerDesigns = {
    classic: () => {
        friction = 0.98;
        spinnerInfo.textContent = 'The original!';
        return `
            <div class="spinner-arm"></div>
            <div class="spinner-arm"></div>
            <div class="spinner-arm"></div>
            <div class="spinner-center"></div>
        `;
    },
    galaxy: () => {
        friction = 0.99;
        spinnerInfo.textContent = 'Smooth like space!';
        let html = '';
        // Create orbits
        [80, 130, 180].forEach(size => {
            html += `<div class="orbit" style="width: ${size}px; height: ${size}px;"></div>`;
        });
        // Create stars
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const distance = 60 + Math.random() * 60;
            const x = 125 + Math.cos(angle) * distance;
            const y = 125 + Math.sin(angle) * distance;
            html += `<div class="star" style="left: ${x}px; top: ${y}px;"></div>`;
        }
        // Create planets
        [70, 100, 115].forEach((angle, i) => {
            const rad = angle * Math.PI / 180;
            const dist = [80, 130, 180][i] / 2;
            const x = 125 + Math.cos(rad) * dist;
            const y = 125 + Math.sin(rad) * dist;
            const size = [15, 20, 12][i];
            html += `<div class="planet" style="left: ${x-size/2}px; top: ${y-size/2}px; width: ${size}px; height: ${size}px;"></div>`;
        });
        return html;
    },
    ninja: () => {
        friction = 0.96;
        spinnerInfo.textContent = 'Fast and sharp!';
        let html = '';
        for (let i = 0; i < 4; i++) {
            html += `<div class="blade" style="transform: translate(0, -50%) rotate(${i * 90}deg);"></div>`;
        }
        html += '<div class="center-hole"></div>';
        return html;
    },
    flower: () => {
        friction = 0.985;
        spinnerInfo.textContent = 'Pretty petals!';
        let html = '';
        for (let i = 0; i < 8; i++) {
            const rotation = (i * 45);
            html += `<div class="petal" style="transform: translate(-30px, -80px) rotate(${rotation}deg);"></div>`;
        }
        html += '<div class="center-circle"></div>';
        return html;
    },
    gear: () => {
        friction = 0.95;
        spinnerInfo.textContent = 'Mechanical power!';
        let html = '';
        for (let i = 0; i < 12; i++) {
            const rotation = (i * 30);
            html += `<div class="gear-tooth" style="transform: translate(-15px, -125px) rotate(${rotation}deg);"></div>`;
        }
        html += '<div class="gear-center"><div class="gear-hole"></div></div>';
        return html;
    }
};

function setSpinnerType(type) {
    currentSpinnerType = type;
    spinnerDesign.innerHTML = spinnerDesigns[type]();
    spinnerDesign.className = 'spinner-design spinner-' + type;
    
    // Reset rotation for new spinner
    rotation = 0;
    velocity = 0;
    spinner.style.transform = 'rotate(0deg)';
    spinSpeed.textContent = '0';
}

// Initialize with classic spinner
setSpinnerType('classic');

// Spinner type button handlers
spinnerTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        spinnerTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setSpinnerType(btn.dataset.type);
        
        // Haptic feedback for spinner change
        haptics.selection();
        playSound(1200);
    });
});

function getAngle(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - centerY, clientX - centerX) * 180 / Math.PI;
}

spinner.addEventListener('mousedown', startDrag);
spinner.addEventListener('touchstart', startDrag);

function startDrag(e) {
    isDragging = true;
    lastAngle = getAngle(e, spinner);
    
    // Haptic feedback when grabbing spinner
    haptics.light();
    e.preventDefault();
}

document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);

function drag(e) {
    if (!isDragging) return;
    const currentAngle = getAngle(e, spinner);
    let delta = currentAngle - lastAngle;
    
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    
    velocity = delta;
    rotation += delta;
    spinner.style.transform = `rotate(${rotation}deg)`;
    spinSpeed.textContent = Math.abs(Math.round(velocity));
    lastAngle = currentAngle;
    
    // Haptic feedback while spinning (throttled)
    const now = Date.now();
    if (now - lastHapticTime > 100) {
        haptics.spin(Math.abs(velocity));
        lastHapticTime = now;
    }
}

document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

function stopDrag() {
    isDragging = false;
}

setInterval(() => {
    if (!isDragging && Math.abs(velocity) > 0.1) {
        rotation += velocity;
        spinner.style.transform = `rotate(${rotation}deg)`;
        velocity *= friction;
        spinSpeed.textContent = Math.abs(Math.round(velocity));
    }
}, 16);

// Sliders Screen
const redSlider = document.getElementById('redSlider');
const greenSlider = document.getElementById('greenSlider');
const blueSlider = document.getElementById('blueSlider');
const redValue = document.getElementById('redValue');
const greenValue = document.getElementById('greenValue');
const blueValue = document.getElementById('blueValue');
const colorPreview = document.getElementById('colorPreview');

function updateColor() {
    const r = Math.round(redSlider.value * 2.55);
    const g = Math.round(greenSlider.value * 2.55);
    const b = Math.round(blueSlider.value * 2.55);
    colorPreview.style.background = `rgb(${r}, ${g}, ${b})`;
}

let lastSliderHaptic = 0;

redSlider.addEventListener('input', () => {
    redValue.textContent = redSlider.value;
    updateColor();
    
    // Throttled haptic feedback for slider
    const now = Date.now();
    if (now - lastSliderHaptic > 50) {
        haptics.light();
        lastSliderHaptic = now;
    }
});

greenSlider.addEventListener('input', () => {
    greenValue.textContent = greenSlider.value;
    updateColor();
    
    const now = Date.now();
    if (now - lastSliderHaptic > 50) {
        haptics.light();
        lastSliderHaptic = now;
    }
});

blueSlider.addEventListener('input', () => {
    blueValue.textContent = blueSlider.value;
    updateColor();
    
    const now = Date.now();
    if (now - lastSliderHaptic > 50) {
        haptics.light();
        lastSliderHaptic = now;
    }
});

updateColor();

// Pop It Screen
const popGrid = document.getElementById('popGrid');
const popCount = document.getElementById('popCount');
const popReset = document.getElementById('popReset');
let poppedBubbles = new Set();

for (let i = 0; i < 48; i++) {
    const bubble = document.createElement('div');
    bubble.className = 'pop-bubble';
    bubble.dataset.index = i;
    bubble.addEventListener('click', () => {
        bubble.classList.toggle('popped');
        if (bubble.classList.contains('popped')) {
            poppedBubbles.add(i);
            // Pop haptic
            haptics.pop();
        } else {
            poppedBubbles.delete(i);
            // Un-pop haptic (lighter)
            haptics.light();
        }
        popCount.textContent = poppedBubbles.size;
        playSound(1000 + Math.random() * 200);
    });
    popGrid.appendChild(bubble);
}

popReset.addEventListener('click', () => {
    document.querySelectorAll('.pop-bubble').forEach(b => b.classList.remove('popped'));
    poppedBubbles.clear();
    popCount.textContent = 0;
    
    // Success haptic for reset
    haptics.success();
    playSound(600);
});

// Drawing Screen
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
const colorOptions = document.querySelectorAll('.color-option');
const clearBtn = document.getElementById('clearCanvas');
let currentColor = '#000000';
let isDrawing = false;

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
}

colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        colorOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        currentColor = option.dataset.color;
        
        // Haptic feedback for color selection
        haptics.selection();
    });
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Haptic feedback for clear
    haptics.medium();
});

function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Light haptic when starting to draw
    haptics.light();
}

function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Simple sound effect
function playSound(frequency = 800) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silently fail if audio context isn't available
    }
}
