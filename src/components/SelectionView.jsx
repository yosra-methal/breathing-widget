import React from 'react';
import { MODES, DURATIONS } from '../constants';

function SelectionView({ currentModeId, setMode, duration, setDuration, onStart }) {
    const currentMode = MODES[currentModeId];

    return (
        <div className="selection-view">
            {/* Mode Title - Outside and Above (Consistent with ExerciseView) */}
            <h2
                className="mode-title-static"
                style={{
                    color: currentMode.textColor
                }}
            >
                {currentMode.title}
            </h2>

            <div className="circle-container">
                {/* Static Solid Circle (Medium Proportion) */}
                <div
                    className="breathing-circle-solid"
                    style={{
                        background: currentMode.gradient,
                        width: '185px', // Medium size (increased from 160px)
                        height: '185px',
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
                            style={
                                currentModeId === m.id
                                    ? {
                                        // Active State: Gradient Border
                                        background: `linear-gradient(white, white) padding-box, ${m.gradient} border-box`,
                                        border: '2px solid transparent',
                                        borderRadius: '20px', // Matches CSS
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: 'var(--color-text)',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                                    }
                                    : {
                                        // Inactive State
                                        borderColor: 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }
                            }
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
