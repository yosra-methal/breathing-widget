import React from 'react';
import { MODES, DURATIONS } from '../constants';

function SelectionView({ currentModeId, setMode, duration, setDuration, onStart }) {
    const currentMode = MODES[currentModeId];

    return (
        <div className="selection-view">
            {/* Mode Title - Outside and Above (Consistent with ExerciseView) */}
            <h2
                className="mode-title-static"
                style={{ color: currentMode.textColor, marginBottom: '20px' }}
            >
                {currentMode.title}
            </h2>

            <div className="circle-container">
                {/* Static Solid Circle (Smaller) */}
                <div
                    className="breathing-circle-solid"
                    style={{
                        background: currentMode.gradient,
                        width: '160px', // Smaller than 200px/220px
                        height: '160px',
                        borderRadius: '50%'
                    }}
                ></div>
            </div>

            <div className="controls">
                <div className="mode-selector">
                    {Object.values(MODES).map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={currentModeId === m.id ? 'active' : ''}
                            style={{
                                borderColor: currentModeId === m.id ? 'var(--color-text)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: m.gradient,
                                display: 'inline-block'
                            }}></span>
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



                <button className="start-button" onClick={onStart}>
                    START
                </button>
            </div>
        </div>
    );
}

export default SelectionView;
