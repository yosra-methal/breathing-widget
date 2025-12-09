import React, { useState, useEffect, useRef } from 'react';

function ExerciseView({ mode, duration, cycleLimit, onStop }) {
    const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, holdEmpty
    const [timeLeft, setTimeLeft] = useState(duration);
    const [cycleCount, setCycleCount] = useState(0);
    const [secondsInPhase, setSecondsInPhase] = useState(mode.inhale);
    const [showSeconds, setShowSeconds] = useState(false);
    const [phaseTimeLeft, setPhaseTimeLeft] = useState(mode.inhale);

    // Refs to handle timers to avoid closure stale state issues if not careful, 
    // but useEffect with proper deps should be fine.

    useEffect(() => {
        let text = "";
        switch (phase) {
            case 'inhale': text = "Inhale"; break;
            case 'hold': text = "Hold"; break;
            case 'exhale': text = "Exhale"; break;
            case 'holdEmpty': text = "Hold"; break;
        }
        // Could update title or text state here
    }, [phase]);

    // Main Timer Loop
    useEffect(() => {
        const timer = setInterval(() => {
            // 1. Update Total Timer (if not cycle based or even if cycle based for display)
            if (cycleLimit === null) {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        onStop();
                        return 0;
                    }
                    return prev - 1;
                });
            }

            // 2. Update Phase Timer
            setPhaseTimeLeft(prev => {
                if (prev <= 1) {
                    // Phase ended, switch to next phase
                    return 0; // Will be reset in the effect dependencies or next tick logic
                    // Actually clearer to handle transition here or in a separate effect monitoring phaseTimeLeft
                }
                return prev - 1;
            });

        }, 1000);

        return () => clearInterval(timer);
    }, [cycleLimit, onStop]);


    // Handle Phase Transitions
    useEffect(() => {
        if (phaseTimeLeft > 0) return;

        // Calculate next phase
        let nextPhase = '';
        let nextDuration = 0;

        if (phase === 'inhale') {
            if (mode.hold > 0) {
                nextPhase = 'hold';
                nextDuration = mode.hold;
            } else {
                nextPhase = 'exhale';
                nextDuration = mode.exhale;
            }
        } else if (phase === 'hold') {
            nextPhase = 'exhale';
            nextDuration = mode.exhale;
        } else if (phase === 'exhale') {
            if (mode.holdEmpty > 0) {
                nextPhase = 'holdEmpty';
                nextDuration = mode.holdEmpty;
            } else {
                // Cycle Complete
                handleCycleComplete();
                nextPhase = 'inhale';
                nextDuration = mode.inhale;
            }
        } else if (phase === 'holdEmpty') {
            // Cycle Complete
            handleCycleComplete();
            nextPhase = 'inhale';
            nextDuration = mode.inhale;
        }

        setPhase(nextPhase);
        setPhaseTimeLeft(nextDuration);

    }, [phaseTimeLeft, phase, mode]);

    const handleCycleComplete = () => {
        setCycleCount(prev => {
            const newCount = prev + 1;
            if (cycleLimit !== null && newCount >= cycleLimit) {
                // Stop immediately or wait for last phase animation?
                // Usually better to stop.
                onStop();
            }
            return newCount;
        });
    };

    // Instruction Text Map
    const instructionMap = {
        inhale: "Inhale",
        hold: "Hold",
        exhale: "Exhale",
        holdEmpty: "Hold"
    };

    return (
        <div className="exercise-view">
            <div className="header">
                <h2>{mode.title}</h2>
            </div>

            <div className="circle-container">
                <div
                    className={`breathing - circle ${phase} `}
                    style={{
                        background: mode.gradient,
                        // Dynamic animation duration based on phase time?
                        // CSS transition handles smoothness, but for precise timing we might need animation-duration style
                        transitionDuration: `${phaseTimeLeft === mode[phase] ? 0 : 0.5} s` // Hacky. Better to stick to CSS classes or use framer-motion.
                        // Actually, for pure CSS scaling:
                    }}
                >
                    <div className="instruction-content">
                        <span className="instruction-text">{instructionMap[phase]}</span>
                        {showSeconds && (
                            <span className="seconds-text">{phaseTimeLeft}s</span>
                        )}
                    </div>
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
