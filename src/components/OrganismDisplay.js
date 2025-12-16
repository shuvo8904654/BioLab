import './OrganismDisplay.css';
import { GENES } from '../utils/genetics';

function OrganismDisplay({ genome }) {
  const traits = genome.genes;

  return (
    <div className="organism-display">
      <div className="organism-avatar">
        <div className="avatar-face">
          <div
            className="avatar-eyes"
            style={{
              '--eye-color': GENES.eyeColor.colors[traits.eyeColor.expressed],
            }}
          >
            <div className="eye left"></div>
            <div className="eye right"></div>
          </div>
          <div className="avatar-mouth"></div>
          {traits.dimples.expressed === 'present' && (
            <div className="dimples">
              <div className="dimple left"></div>
              <div className="dimple right"></div>
            </div>
          )}
          {traits.freckles.expressed === 'present' && (
            <div className="freckles">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          {traits.cleftChin?.expressed === 'present' && (
            <div className="cleft-chin"></div>
          )}
        </div>
        <div
          className="avatar-hair"
          style={{
            background: GENES.hairColor.colors[traits.hairColor.expressed],
          }}
          data-type={traits.hairType?.expressed || 'straight'}
        ></div>
        {traits.widowsPeak?.expressed === 'present' && (
          <div
            className="widows-peak"
            style={{
              borderTopColor:
                GENES.hairColor.colors[traits.hairColor.expressed],
            }}
          ></div>
        )}
        <div
          className="avatar-skin"
          style={{
            background: GENES.skinTone.colors[traits.skinTone.expressed],
          }}
        ></div>
      </div>

      <div className="traits-list">
        <div className="trait">
          <span className="trait-name">Eyes:</span>
          <span className="trait-value">{traits.eyeColor.expressed}</span>
        </div>
        <div className="trait">
          <span className="trait-name">Hair:</span>
          <span className="trait-value">{traits.hairColor.expressed}</span>
        </div>
        <div className="trait">
          <span className="trait-name">Height:</span>
          <span className="trait-value">{traits.height.expressed}</span>
        </div>
        <div className="trait">
          <span className="trait-name">Blood:</span>
          <span className="trait-value">{traits.bloodType.expressed}</span>
        </div>
      </div>

      <div className="traits-extra">
        {traits.tongueRolling?.expressed === 'can' && (
          <span className="trait-tag red">Can Roll Tongue</span>
        )}
        {traits.widowsPeak?.expressed === 'present' && (
          <span className="trait-tag">Widow's Peak</span>
        )}
        {traits.cleftChin?.expressed === 'present' && (
          <span className="trait-tag">Cleft Chin</span>
        )}
      </div>
    </div>
  );
}

export default OrganismDisplay;
