import React, { useState, useEffect } from 'react';

function ExerciseView({ mode, duration, cycleLimit, onStop }) {
    // Start with 'ready' state to ensure animation triggers from Thin -> Thick
    const [phase, setPhase] = useState('ready');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showSeconds, setShowSeconds] = useState(false);

    // Derived state for current phase duration
    // If phase is 'ready', use a tiny duration or 0 to switch instantly, 
    // BUT we want the first inhale to animate, so we need the transition to happen.
    // 'ready' should look like 'exhale' (thin). 
    // Then we switch to 'inhale'.
    const currentPhaseDuration = mode[phase] || 0;

    // Initial Trigger for Animation
    useEffect(() => {
        // Immediate switch from 'ready' to 'inhale' on mount
        // We use a small timeout to allow the browser to paint the 'ready' state first
        if (phase === 'ready') {
            requestAnimationFrame(() => {
                setPhase('inhale');
            });
        }
    }, []); // Run once on mount

    // Main Timer & Phase Logic
    useEffect(() => {
        if (phase === 'ready') return; // Wait for start

        let interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [phase]);

    // Phase Transitions Logic
    useEffect(() => {
        if (phase === 'ready') return;

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

    // ... (rest of the file)

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
            {/* Mode Title - Outside and Above */}
            <h2 className="mode-title-static" style={{ color: mode.textColor }}>
                {mode.title}
            </h2>

            <div className="circle-container">
                {/* 
                    Outer Circle: Fixed Size, Gradient Background
                 */}
                <div
                    className={`breathing-circle-outer`}
                    style={{
                        background: mode.gradient
                    }}
                >
                    {/* Inner Mask (Hole) */}
                    <div
                        className={`donut-hole ${phase}`}
                        style={{
                            transitionDuration: `${mode[phase]}s`
                        }}
                    ></div>
                </div>

                {/* Static Text Overlay - Centered in Circle Container */}
                <div className="instruction-content static-overlay">
                    <span
                        className="instruction-text"
                        style={{ color: mode.textColor, position: 'relative', zIndex: 10 }}
                    >
                        {instructionMap[phase]}
                    </span>
                    {showSeconds && (
                        <span className="seconds-text" style={{ color: mode.textColor, position: 'relative', zIndex: 10 }}>
                            {remainingPhaseTime}
                        </span>
                    )}
                </div>
            </div>

            <div className="footer-controls">
                <button
                    className={`toggle-seconds ${showSeconds ? 'active' : ''}`}
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
