import './OrganismDisplay.css';
import { GENES, SEX_LINKED_GENES, GENETIC_DISORDERS } from '../utils/genetics';
import Tooltip from './Tooltip';

function OrganismDisplay({ genome }) {
  const traits = genome.genes;

  const getSexIcon = () => {
    return genome.sex === 'male' ? '♂' : '♀';
  };

  const getDisorderStatusClass = (status) => {
    if (status === 'affected') return 'status-affected';
    if (status === 'carrier') return 'status-carrier';
    return 'status-normal';
  };

  return (
    <div className="organism-display">
      <div className="organism-avatar">
        <div className="sex-indicator" data-sex={genome.sex}>
          {getSexIcon()}
        </div>
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
        <Tooltip text={GENES.eyeColor.tooltip}>
          <div className="trait">
            <span className="trait-name">Eyes:</span>
            <span className="trait-value">{traits.eyeColor.expressed}</span>
          </div>
        </Tooltip>
        <Tooltip text={GENES.hairColor.tooltip}>
          <div className="trait">
            <span className="trait-name">Hair:</span>
            <span className="trait-value">{traits.hairColor.expressed}</span>
          </div>
        </Tooltip>
        <Tooltip text={GENES.height.tooltip}>
          <div className="trait">
            <span className="trait-name">Height:</span>
            <span className="trait-value">{traits.height.expressed}</span>
          </div>
        </Tooltip>
        <Tooltip text={GENES.bloodType.tooltip}>
          <div className="trait">
            <span className="trait-name">Blood:</span>
            <span className="trait-value">{traits.bloodType.expressed}</span>
          </div>
        </Tooltip>
      </div>

      <div className="traits-extra">
        {traits.tongueRolling?.expressed === 'can' && (
          <Tooltip text={GENES.tongueRolling.tooltip}>
            <span className="trait-tag red">Can Roll Tongue</span>
          </Tooltip>
        )}
        {traits.widowsPeak?.expressed === 'present' && (
          <Tooltip text={GENES.widowsPeak.tooltip}>
            <span className="trait-tag">Widow's Peak</span>
          </Tooltip>
        )}
        {traits.cleftChin?.expressed === 'present' && (
          <Tooltip text={GENES.cleftChin.tooltip}>
            <span className="trait-tag">Cleft Chin</span>
          </Tooltip>
        )}
      </div>

      {genome.sexLinkedGenes && (
        <div className="sex-linked-section">
          <div className="section-label">X-Linked Traits</div>
          <div className="sex-linked-traits">
            {Object.keys(SEX_LINKED_GENES).map((key) => {
              const gene = SEX_LINKED_GENES[key];
              const trait = genome.sexLinkedGenes[key];
              if (!trait) return null;
              const isAffected = trait.expressed !== 'normal';
              return (
                <Tooltip key={key} text={gene.tooltip}>
                  <span className={`trait-tag ${isAffected ? 'affected' : 'normal-trait'}`}>
                    {gene.name}: {trait.expressed}
                  </span>
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}

      {genome.disorders && (
        <div className="disorders-section">
          <div className="section-label">Genetic Conditions</div>
          <div className="disorders-list">
            {Object.keys(GENETIC_DISORDERS).map((key) => {
              const disorder = GENETIC_DISORDERS[key];
              const data = genome.disorders[key];
              if (!data || data.status === 'normal') return null;
              return (
                <Tooltip key={key} text={disorder.tooltip}>
                  <span className={`trait-tag ${getDisorderStatusClass(data.status)}`}>
                    {disorder.name}: {data.status}
                  </span>
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganismDisplay;
