import './ControlPanel.css';

function ControlPanel({
  mutationRate,
  setMutationRate,
  viewMode,
  setViewMode,
  isAnimating,
  setIsAnimating,
  theme,
  setTheme,
  colorBlindMode,
  setColorBlindMode,
}) {
  return (
    <div className="control-panel">
      <h3>Controls</h3>

      <div className="control-group">
        <label>Mutation Rate: {(mutationRate * 100).toFixed(0)}%</label>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.01"
          value={mutationRate}
          onChange={(e) => setMutationRate(parseFloat(e.target.value))}
        />
        <div className="range-labels">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      <div className="control-group">
        <label>View Mode</label>
        <select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
          <option value="double-helix">Double Helix</option>
          <option value="linear">Linear</option>
          <option value="compact">Compact</option>
          <option value="chromosome">Chromosome</option>
          <option value="replication">Replication</option>
        </select>
      </div>

      <div className="control-group">
        <label className="toggle-label">
          <span className="toggle-text">Animation</span>
          <input
            type="checkbox"
            checked={isAnimating}
            onChange={(e) => setIsAnimating(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="control-group">
        <label>Theme</label>
        <div className="theme-buttons">
          <button
            className={theme === 'dark' ? 'active' : ''}
            onClick={() => setTheme('dark')}
          >
            Dark
          </button>
          <button
            className={theme === 'light' ? 'active' : ''}
            onClick={() => setTheme('light')}
          >
            Light
          </button>
        </div>
      </div>

      <div className="control-group">
        <label className="toggle-label">
          <span className="toggle-text">Color Blind Mode</span>
          <input
            type="checkbox"
            checked={colorBlindMode}
            onChange={(e) => setColorBlindMode(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <div className="legend">
        <h4>Base Pair Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span
              className="color-dot"
              style={{ background: colorBlindMode ? '#0077BB' : '#ef4444' }}
            ></span>
            Adenine (A)
          </div>
          <div className="legend-item">
            <span
              className="color-dot"
              style={{ background: colorBlindMode ? '#EE7733' : '#10b981' }}
            ></span>
            Thymine (T)
          </div>
          <div className="legend-item">
            <span
              className="color-dot"
              style={{ background: colorBlindMode ? '#009988' : '#3b82f6' }}
            ></span>
            Guanine (G)
          </div>
          <div className="legend-item">
            <span
              className="color-dot"
              style={{ background: colorBlindMode ? '#CC3311' : '#f59e0b' }}
            ></span>
            Cytosine (C)
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
