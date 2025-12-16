import { generatePunnettSquare, GENES } from '../utils/genetics';
import './PunnettSquare.css';

function PunnettSquare({ parent1, parent2, selectedGene, onClose }) {
  if (!selectedGene) return null;

  const square = generatePunnettSquare(parent1, parent2, selectedGene);
  const geneName = GENES[selectedGene]?.name || selectedGene;

  return (
    <div className="punnett-overlay" onClick={onClose}>
      <div className="punnett-modal" onClick={(e) => e.stopPropagation()}>
        <div className="punnett-header">
          <h3>Punnett Square: {geneName}</h3>
          <button className="close-btn" onClick={onClose}>x</button>
        </div>

        <div className="punnett-grid">
          <div className="punnett-cell corner"></div>
          <div className="punnett-cell header">{square.parent2Alleles[0]}</div>
          <div className="punnett-cell header">{square.parent2Alleles[1]}</div>

          <div className="punnett-cell header">{square.parent1Alleles[0]}</div>
          <div className="punnett-cell result">
            <span className="alleles">
              {square.combinations[0].alleles.join('')}
            </span>
            <span className="expressed">{square.combinations[0].expressed}</span>
          </div>
          <div className="punnett-cell result">
            <span className="alleles">
              {square.combinations[1].alleles.join('')}
            </span>
            <span className="expressed">{square.combinations[1].expressed}</span>
          </div>

          <div className="punnett-cell header">{square.parent1Alleles[1]}</div>
          <div className="punnett-cell result">
            <span className="alleles">
              {square.combinations[2].alleles.join('')}
            </span>
            <span className="expressed">{square.combinations[2].expressed}</span>
          </div>
          <div className="punnett-cell result">
            <span className="alleles">
              {square.combinations[3].alleles.join('')}
            </span>
            <span className="expressed">{square.combinations[3].expressed}</span>
          </div>
        </div>

        <div className="probabilities">
          <h4>Probabilities</h4>
          {Object.entries(square.probabilities).map(([trait, prob]) => (
            <div key={trait} className="prob-row">
              <span className="prob-trait">{trait}</span>
              <div className="prob-bar">
                <div className="prob-fill" style={{ width: `${prob}%` }}></div>
              </div>
              <span className="prob-value">{prob}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PunnettSquare;
