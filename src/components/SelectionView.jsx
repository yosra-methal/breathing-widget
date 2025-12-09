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
                <h2
                    className="mode-title-overlay"
                    style={{ color: currentMode.textColor }}
                >
                    {currentMode.title}
                </h2>
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

                <div className="duration-selector-container">
                    <label className="duration-label">
                        Duration: <span style={{ fontWeight: 600 }}>{Math.floor(duration / 60)} min</span>
                    </label>
                    <div className="slider-wrapper">
                        <input
                            type="range"
                            min="60"
                            max="600"
                            step="60"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="duration-slider"
                            style={{
                                // Dynamic Accent Color
                                accentColor: currentMode.textColor ? currentMode.textColor : '#2c3e50'
                            }}
                        />
                        <div className="slider-minmax">
                            <span>1m</span>
                            <span>10m</span>
                        </div>
                    </div>
                </div>

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
