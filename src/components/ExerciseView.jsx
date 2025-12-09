import React, { useState, useEffect } from 'react';

function ExerciseView({ mode, duration, cycleLimit, onStop }) {
    const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, holdEmpty
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showSeconds, setShowSeconds] = useState(false);

    // Derived state for current phase duration
    const currentPhaseDuration = mode[phase];

    // Main Timer & Phase Logic
    useEffect(() => {
        let phaseTime = 0;
        let localPhase = 'inhale';
        let cycle = 0;

        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);

            // Check total duration stop condition
            if (cycleLimit === null && duration > 0) {
                // Check if total time exceeded (rough check, can be refined)
            }
        }, 1000);

        // However, for smooth animation, we should rely on CSS transitions triggered by state changes.
        // We'll use a timeout loop for the phases exactly.

        return () => clearInterval(interval);
    }, []);

    // Better Approach: Use setTimeout for phase storage to avoid re-render drift
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

    // Total Duration Timer (Independent)
    useEffect(() => {
        if (cycleLimit !== null) return; // Cycle based stop handled in phase logic

        const timer = setInterval(() => {
            setElapsedTime(prev => {
                if (prev >= duration) {
                    onStop();
                    return prev;
                }
                return prev + 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [duration, cycleLimit, onStop]);


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

    // Cycle counter Ref
    // Using a ref for cycle count to avoid re-triggering effects if not needed for render
    // Actually we need to stop, so...
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

    const instructionMap = {
        inhale: "Inhale",
        hold: "Hold",
        exhale: "Exhale",
        holdEmpty: "Hold"
    };

    return (
        <div className="exercise-view">
            {/* Removed Title as requested */}

            <div className="circle-container">
                <div
                    className={`breathing-circle ${phase}`}
                    style={{
                        background: mode.gradient,
                        // IMPT: Transition duration must match the CURRENT phase duration
                        transitionDuration: `${mode[phase]}s`
                    }}
                >
                    <div className="instruction-content">
                        <span className="instruction-text">{instructionMap[phase]}</span>
                        {showSeconds && (
                            // Showing total time left or phase time left? 
                            // User asked for "phase seconds countdown".
                            // This design implements a simple total duration or needs complex timer for phase.
                            // Accessing phaseTimeLeft cleanly with timeouts is harder.
                            // Let's stick to instruction for now and total time if needed or just hide logic.
                            // If "phase seconds countdown" is critical, we need the setInterval approach back.
                            <span className="seconds-text"></span>
                        )}
                    </div>
                </div>
            </div>

            {/* Seconds toggle logic requires tick update. 
                 To fix the animation bug critical first, I used setTimeout.
                 To show countdown, I need a ticker.
             */}

            <div className="footer-controls">
                <button
                    className="toggle-seconds"
                    onClick={() => setShowSeconds(!showSeconds)}
                    style={{ visibility: 'hidden' }} // Temporarily hide if logic is complex, OR fix logic.
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

// Let's reimplement with a TICKER for both Animation AND Countdown to satisfy all constraints.
// Timeout is good for exact phase switching but bad for countdown UI.
// Ticker is good for UI but requires careful state sync.

function ExerciseViewFinal({ mode, duration, cycleLimit, onStop }) {
    const [phase, setPhase] = useState('inhale');
    const [phaseTimeLeft, setPhaseTimeLeft] = useState(mode.inhale);
    const [cycles, setCycles] = useState(0);
    const [showSeconds, setShowSeconds] = useState(false);

    useEffect(() => {
        // Initialize first phase
        setPhaseTimeLeft(mode.inhale);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setPhaseTimeLeft(prev => {
                const next = prev - 1;
                if (next < 0) {
                    // Handled in effect below
                    return 0;
                }
                return next;
            });

            if (cycleLimit === null) {
                // Duration decrement logic if we tracked total time
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Watch for phase end
    useEffect(() => {
        if (phaseTimeLeft >= 0) return; // Wait until -1 or handle at 0? 
        // If we count down 4, 3, 2, 1, 0... then switch.
        // It stays at 0 for 1 sec? No.

        // Let's do: When it hits 0, switch.
        // But the previous interval runs every 1s.
    }, [phaseTimeLeft]);

    return null;
}
// Retrying the edit with the Timeout + Ticker approach for best of both worlds?
// No, KISS. Pure state machine with CSS transition is smoothest for animation.
// Countdown can be separate.

export default function ExerciseView({ mode, duration, cycleLimit, onStop }) {
    const [phase, setPhase] = useState('inhale');
    const [remainingPhaseTime, setRemainingPhaseTime] = useState(mode.inhale);
    const [cycles, setCycles] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [showSeconds, setShowSeconds] = useState(false);

    useEffect(() => {
        // Reset on mount
        setPhase('inhale');
        setRemainingPhaseTime(mode.inhale);
        setCycles(0);
        setTotalTime(0);
    }, [mode]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTotalTime(t => {
                if (cycleLimit === null && t >= duration) {
                    onStop();
                    return t;
                }
                return t + 1;
            });

            setRemainingPhaseTime(prev => {
                if (prev <= 1) {
                    // Time to switch phase
                    // We return 0 here, but the trigger to switch happens via effect or immediate calculation?
                    // Doing it inside setState is safe for atomic updates but harder to trigger side effects (phase change).
                    // Let's return prev - 1 and handle switch in Effect.
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [duration, cycleLimit, onStop]);

    // Handle Phase Switch
    useEffect(() => {
        if (remainingPhaseTime > 0) return;

        // Switch Phase
        let nextPhase = phase;

        if (phase === 'inhale') nextPhase = mode.hold > 0 ? 'hold' : 'exhale';
        else if (phase === 'hold') nextPhase = 'exhale';
        else if (phase === 'exhale') nextPhase = mode.holdEmpty > 0 ? 'holdEmpty' : 'inhale';
        else if (phase === 'holdEmpty') nextPhase = 'inhale';

        // Check Completion
        if ((phase === 'exhale' && mode.holdEmpty === 0) || phase === 'holdEmpty') {
            const newCycles = cycles + 1;
            setCycles(newCycles);
            if (cycleLimit !== null && newCycles >= cycleLimit) {
                onStop();
                return;
            }
        }

        setPhase(nextPhase);
        setRemainingPhaseTime(mode[nextPhase]);

    }, [remainingPhaseTime, phase, mode, cycles, cycleLimit, onStop]);

    const instructionMap = {
        inhale: "Inhale",
        hold: "Hold",
        exhale: "Exhale",
        holdEmpty: "Hold"
    };

    return (
        <div className="exercise-view">
            <div className="circle-container">
                <div
                    className={`breathing-circle ${phase}`}
                    style={{
                        background: mode.gradient,
                        // Transition matches the TOTAL duration of the phase to ensure it reaches target scale exactly at end
                        transitionDuration: `${mode[phase]}s`
                    }}
                >
                    <div className="instruction-content">
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
