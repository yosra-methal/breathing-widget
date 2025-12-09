import React, { useState, useEffect } from 'react';

function ExerciseView({ mode, duration, cycleLimit, onStop }) {
    const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, holdEmpty
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showSeconds, setShowSeconds] = useState(false);

    // Derived state for current phase duration
    const currentPhaseDuration = mode[phase];

    // Main Timer & Phase Logic
    useEffect(() => {
        let interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Phase Transitions Logic
    useEffect(() => {
        let timeoutId;

        const runPhase = () => {
            const phaseDuration = mode[phase] * 1000;

            // If phase is 0 (e.g. hold=0), skip immediately
            if (phaseDuration === 0) {
                handlePhaseComplete();
                return;
            }

            timeoutId = setTimeout(() => {
                handlePhaseComplete();
            }, phaseDuration);
        };

        runPhase();

        return () => clearTimeout(timeoutId);
    }, [phase, mode]); // Re-run when phase changes

    // Total Duration Timer Stop Logic
    useEffect(() => {
        if (cycleLimit !== null) return; // Cycle based stop handled in phase logic

        const timer = setInterval(() => {
            // We are tracking elapsed time separately but here we need to check limit
        }, 1000);

        // Actually simpler: check elapsed vs duration in the main interval or Effect?
        // Let's rely on the separate interval for stop condition
        const checkStop = setInterval(() => {
            // We can't easily access elapsed here without ref or dependency.
            // Simpler: Just rely on the main elapsedTime state?
        }, 1000);

        return () => clearInterval(checkStop);
    }, [duration, cycleLimit]);

    // Better Total Timer
    useEffect(() => {
        if (cycleLimit !== null) return;
        if (elapsedTime >= duration) {
            onStop();
        }
    }, [elapsedTime, duration, cycleLimit, onStop]);


    const handlePhaseComplete = () => {
        setPhase(prev => {
            if (prev === 'inhale') return mode.hold > 0 ? 'hold' : 'exhale';
            if (prev === 'hold') return 'exhale';
            if (prev === 'exhale') return mode.holdEmpty > 0 ? 'holdEmpty' : 'inhale';
            if (prev === 'holdEmpty') return 'inhale';
            return 'inhale';
        });

        // Check loops
        if (phase === 'exhale' && mode.holdEmpty === 0) handleCycleComplete();
        if (phase === 'holdEmpty') handleCycleComplete();
    };

    const [cycles, setCycles] = useState(0);
    const handleCycleComplete = () => {
        setCycles(c => {
            const next = c + 1;
            if (cycleLimit !== null && next >= cycleLimit) {
                setTimeout(onStop, 0);
            }
            return next;
        });
    }

    // Remaining Phase Time Logic (for display only)
    const [remainingPhaseTime, setRemainingPhaseTime] = useState(mode[phase]);
    useEffect(() => {
        setRemainingPhaseTime(mode[phase]);
        const interval = setInterval(() => {
            setRemainingPhaseTime(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(interval);
    }, [phase]);


    const instructionMap = {
        inhale: "Inhale",
        hold: "Hold",
        exhale: "Exhale",
        holdEmpty: "Hold"
    };

    return (
        <div className="exercise-view">
            {/* No Title */}

            <div className="circle-container">
                {/* Animated Ring (Background) */}
                <div
                    className={`breathing-circle ${phase}`}
                    style={{
                        // Use border/box-shadow for annular ring or just a div with border
                        // If we use background gradient, mask it? Or just use a border with scaling.
                        // User wants "ANNULAR RING (thick border/donut shape)"
                        // Best way: Donut is a div with border-radius 50%, transparent bg, thick border (or box-shadow).
                        // BUT User wants Gradient. Border gradients are tricky with radius.
                        // Easier: Div with Gradient BG, and a smaller White Div inside (Mask).
                        // OR: Conic gradient border.
                        // Let's stick to Gradient Background + Masking for reliable "Buttery" look.
                        background: mode.gradient,
                        transitionDuration: `${mode[phase]}s`
                    }}
                >
                    {/* Inner Mask for Donut Effect - SCALES WITH PARENT? 
                        If Parent scales, Inner Mask scales = Ring thickness changes?
                        User wants "ONLY THIS RING expands". 
                        If we scale the ring, the hole scales too, so thickness stays proportional. This is usually desired.
                        If thickness must be constant, it's harder. Assuming proportional scale is fine for "Donut".
                        
                        WAIT: Text must be STATIC.
                        So Text CANNOT be a child of `breathing-circle` if `breathing-circle` transforms.
                        Text must be a sibling.
                    */}
                    <div className="donut-hole"></div>
                </div>

                {/* Static Text Overlay (Sibling, absolutley positioned) */}
                <div className="instruction-content static-overlay">
                    <span
                        className="instruction-text"
                        style={{ color: mode.textColor }}
                    >
                        {instructionMap[phase]}
                    </span>
                    {showSeconds && (
                        <span className="seconds-text" style={{ color: mode.textColor }}>
                            {remainingPhaseTime}
                            {/* Removed 's' unit */}
                        </span>
                    )}
                </div>
            </div>

            <div className="footer-controls">
                <button
                    className="toggle-seconds"
                    onClick={() => setShowSeconds(!showSeconds)}
                >
                    {showSeconds ? "Hide Seconds" : "Show Seconds"}
                </button>

                <button className="stop-button" onClick={onStop}>
                    STOP
                </button>
            </div>
        </div>
    );
}

export default ExerciseView;
