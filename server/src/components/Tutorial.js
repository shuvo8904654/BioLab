import { useState } from 'react';
import './Tutorial.css';

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to the Genetics Simulator!',
    content: 'This interactive tool helps you understand how genetic inheritance works. Let\'s explore the fascinating world of DNA and heredity.',
    highlight: null,
  },
  {
    id: 'dna',
    title: 'What is DNA?',
    content: 'DNA (Deoxyribonucleic Acid) is the molecule that carries genetic instructions. It\'s made of 4 bases: Adenine (A), Thymine (T), Guanine (G), and Cytosine (C). A always pairs with T, and G always pairs with C.',
    highlight: 'dna-viewer',
  },
  {
    id: 'base-pairs',
    title: 'Base Pairs',
    content: 'The colored spheres represent nucleotide bases. Red = Adenine, Green = Thymine, Blue = Guanine, Orange = Cytosine. The white lines show hydrogen bonds between complementary bases.',
    highlight: 'dna-viewer',
  },
  {
    id: 'genes',
    title: 'Genes & Alleles',
    content: 'Genes are sections of DNA that code for specific traits. Each gene can have different versions called alleles. You inherit one allele from each parent.',
    highlight: 'organism-section',
  },
  {
    id: 'dominance',
    title: 'Dominant vs Recessive',
    content: 'Some alleles are dominant (expressed when present) and others are recessive (only expressed when both copies are the same). For example, brown eyes are dominant over blue eyes.',
    highlight: 'organism-section',
  },
  {
    id: 'parents',
    title: 'Parent Organisms',
    content: 'These two panels show the parent organisms. Each has their own set of genes that determine traits like eye color, hair color, and height. Click "Randomize" to generate new genetic combinations.',
    highlight: 'organism-section',
  },
  {
    id: 'crossover',
    title: 'Creating Offspring',
    content: 'When you click "Create Offspring", the simulator performs genetic crossover - randomly selecting one allele from each parent for every gene. This is how real reproduction works!',
    highlight: 'crossover-btn',
  },
  {
    id: 'mutation',
    title: 'Mutations',
    content: 'Mutations are random changes in DNA. Use the "Mutate" button to introduce mutations. The mutation rate slider controls how likely mutations are. Mutations drive evolution!',
    highlight: 'control-panel',
  },
  {
    id: 'punnett',
    title: 'Punnett Square',
    content: 'The Punnett Square shows all possible genetic combinations for a trait and their probabilities. It\'s a tool geneticists use to predict inheritance patterns.',
    highlight: 'punnett-section',
  },
  {
    id: 'views',
    title: 'Different Views',
    content: 'Try different view modes: Double Helix (classic DNA), Linear (flat view), Compact (grid), Chromosome (gene map), and Replication (watch DNA copy itself).',
    highlight: 'control-panel',
  },
  {
    id: 'complete',
    title: 'You\'re Ready!',
    content: 'Now you understand the basics of genetics! Experiment with creating offspring, introducing mutations, and exploring how traits are inherited. Have fun learning!',
    highlight: null,
  },
];

function Tutorial({ isOpen, onClose, currentStep, setCurrentStep }) {
  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-backdrop" onClick={handleSkip} />
      
      <div className="tutorial-modal">
        <div className="tutorial-progress">
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`progress-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(i)}
            />
          ))}
        </div>

        <div className="tutorial-content">
          <h2>{step.title}</h2>
          <p>{step.content}</p>
        </div>

        <div className="tutorial-actions">
          <button className="skip-btn" onClick={handleSkip}>
            Skip Tutorial
          </button>
          <div className="nav-buttons">
            {!isFirst && (
              <button className="prev-btn" onClick={handlePrev}>
                Back
              </button>
            )}
            <button className="next-btn" onClick={handleNext}>
              {isLast ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>

        <div className="step-counter">
          {currentStep + 1} / {TUTORIAL_STEPS.length}
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
export { TUTORIAL_STEPS };
