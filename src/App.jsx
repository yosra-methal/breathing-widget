import { useState, useEffect } from 'react'
import { MODES } from './constants'
import SelectionView from './components/SelectionView'
import ExerciseView from './components/ExerciseView'
import './App.css' // We might need a specific CSS file for App layout

function App() {
    const [currentModeId, setCurrentModeId] = useState('grounding');
    const [view, setView] = useState('SELECTION'); // 'SELECTION' | 'EXERCISE'
    // Duration in seconds. For 'sleep', it might be ignored if we track cycles, 
    // but User said "Default duration = 4 complete cycles". 
    // We can track time OR cycles. Let's store selectedDuration for time-based modes.
    const [selectedDuration, setSelectedDuration] = useState(MODES.grounding.defaultDuration);
    const [cycleCount, setCycleCount] = useState(4); // Only for 'sleep'

    const currentMode = MODES[currentModeId];

    // Reset duration when mode changes if it hasn't been manually set? 
    // User spec: "Default duration (if not modified by the user)".
    // So when mode changes, we should probably reset to that mode's default.
    useEffect(() => {
        if (currentMode.defaultDuration) {
            setSelectedDuration(currentMode.defaultDuration);
        } else if (currentMode.id === 'sleep') {
            // Sleep uses cycles by default
            setCycleCount(currentMode.defaultCycles);
        }
    }, [currentModeId]);

    const handleStart = () => {
        setView('EXERCISE');
    };

    const handleStop = () => {
        setView('SELECTION');
    };

    return (
        <div className="app-container" style={{ background: 'var(--color-bg)' }}>
            {view === 'SELECTION' ? (
                <SelectionView
                    currentModeId={currentModeId}
                    setMode={setCurrentModeId}
                    duration={selectedDuration}
                    setDuration={setSelectedDuration}
                    // Cycle props for sleep mode could be added here if we want a selector for it?
                    // User only mentioned specific duration selector 1,2,3,5,10m.
                    onStart={handleStart}
                />
            ) : (
                <ExerciseView
                    mode={currentMode}
                    duration={selectedDuration}
                    cycleLimit={currentMode.id === 'sleep' ? cycleCount : null}
                    onStop={handleStop}
                />
            )}
        </div>
    )
}

export default App

