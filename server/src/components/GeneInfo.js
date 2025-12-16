import React from 'react';
import './GeneInfo.css';

function GeneInfo({ selectedGene }) {
  const baseNames = {
    'A': 'Adenine',
    'T': 'Thymine',
    'G': 'Guanine',
    'C': 'Cytosine'
  };

  const baseDescriptions = {
    'A': 'A purine base that pairs with Thymine via two hydrogen bonds.',
    'T': 'A pyrimidine base that pairs with Adenine via two hydrogen bonds.',
    'G': 'A purine base that pairs with Cytosine via three hydrogen bonds.',
    'C': 'A pyrimidine base that pairs with Guanine via three hydrogen bonds.'
  };

  if (!selectedGene) {
    return (
      <div className="gene-info">
        <h3>Gene Info</h3>
        <p className="placeholder">Click on a base pair in the DNA viewer to see details</p>
      </div>
    );
  }

  const [base1, base2] = selectedGene.pair.split('-');

  return (
    <div className="gene-info">
      <h3>Gene Info</h3>
      
      <div className="info-section">
        <div className="info-label">Position</div>
        <div className="info-value">Base Pair #{selectedGene.index + 1}</div>
      </div>

      <div className="info-section">
        <div className="info-label">Pair Type</div>
        <div className="info-value pair-display">
          <span className={`base base-${base1}`}>{base1}</span>
          <span className="pair-connector">—</span>
          <span className={`base base-${base2}`}>{base2}</span>
        </div>
      </div>

      <div className="base-details">
        <div className="base-card">
          <div className={`base-header base-${base1}`}>
            {baseNames[base1]}
          </div>
          <p>{baseDescriptions[base1]}</p>
        </div>
        
        <div className="base-card">
          <div className={`base-header base-${base2}`}>
            {baseNames[base2]}
          </div>
          <p>{baseDescriptions[base2]}</p>
        </div>
      </div>

      <div className="bond-info">
        {(base1 === 'A' || base1 === 'T') ? '2 Hydrogen Bonds' : '3 Hydrogen Bonds'}
      </div>
    </div>
  );
}

export default GeneInfo;
