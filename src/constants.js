export const MODES = {
    grounding: {
        id: 'grounding',
        title: 'Grounding', // Display title
        label: 'Grounding (4-0-6s)', // Button label
        inhale: 4,
        hold: 0,
        exhale: 6,
        holdEmpty: 0,
        defaultDuration: 120, // 2 minutes in seconds
        gradient: 'var(--gradient-grounding)',
        textColor: '#365c7d' // Darker shade of sky blue for text if needed
    },
    calm: {
        id: 'calm',
        title: 'Calm & Rest',
        label: 'Calm & Rest (5-0-5s)',
        inhale: 5,
        hold: 0,
        exhale: 5,
        holdEmpty: 0,
        defaultDuration: 300, // 5 minutes
        gradient: 'var(--gradient-calm)',
        textColor: '#2e7d32' // Darker green
    },
    focus: {
        id: 'focus',
        title: 'Focus',
        label: 'Focus (4-4-4s)',
        inhale: 4,
        hold: 4,
        exhale: 4,
        holdEmpty: 4, // Box breathing usually has hold after exhale too? "4-4-4s" usually implies triangular or box. User said 4-4-4s. Let's assume Inhale 4, Hold 4, Exhale 4, HoldEmpty 0 based on "4-4-4s". Wait, standard Box is 4-4-4-4. Triangular is 4-4-4.
        // User wrote: "Mode 3: Focus (4-4-4s)" implies 3 phases. I will stick to Inhale-Hold-Exhale 4-4-4.
        // However, if it's box breathing, it should be 4-4-4-4. "Focus" is often Box.
        // Let's strictly follow "4-4-4s" -> 4 inhale, 4 hold, 4 exhale.
        defaultDuration: 180, // 3 minutes
        gradient: 'var(--gradient-focus)',
        textColor: '#d84315' // Dark orange
    },
    sleep: {
        id: 'sleep',
        title: 'Sleep & Relax',
        label: 'Sleep & Relax (4-7-8s)',
        inhale: 4,
        hold: 7,
        exhale: 8,
        holdEmpty: 0,
        defaultDuration: null, // Special case: cycle count
        defaultCycles: 4,
        gradient: 'var(--gradient-sleep)',
        textColor: '#4527a0' // Dark purple
    }
};

export const DURATIONS = [60, 120, 180, 300, 600]; // 1, 2, 3, 5, 10 min
