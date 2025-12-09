import React from 'react';
import { MODES, DURATIONS } from '../constants';

function SelectionView({ currentModeId, setMode, duration, setDuration, onStart }) {
    const currentMode = MODES[currentModeId];

    return (
        <div className="selection-view">
            <div className="circle-container">
                {/* Placeholder for Static Gradient Circle */}
                <div
                    className="breathing-circle static"
                    style={{ background: currentMode.gradient }}
                ></div>
                <h2 className="mode-title-overlay">{currentMode.title}</h2>
            </div>

            <div className="controls">
                <div className="mode-selector">
                    {Object.values(MODES).map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={currentModeId === m.id ? 'active' : ''}
                            style={{ borderColor: currentModeId === m.id ? 'var(--color-text)' : 'transparent' }}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                {currentModeId !== 'sleep' && (
                    <div className="duration-selector">
                        <label>Duration:</label>
                        <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
                            {DURATIONS.map(d => (
                                <option key={d} value={d}>{d / 60} min</option>
                            ))}
                        </select>
                    </div>
                )}

                {currentModeId === 'sleep' && (
                    <div className="duration-info">
                        Running for {MODES.sleep.defaultCycles} cycles
                    </div>
                )}

                <button className="start-button" onClick={onStart}>
                    START
                </button>
            </div>
        </div>
    );
}

export default SelectionView;
