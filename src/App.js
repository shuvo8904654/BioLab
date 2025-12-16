import { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';
import DNAViewer from './components/DNAViewer';
import ControlPanel from './components/ControlPanel';
import GeneInfo from './components/GeneInfo';
import OrganismDisplay from './components/OrganismDisplay';
import PunnettSquare from './components/PunnettSquare';
import Tutorial from './components/Tutorial';
import {
  generateRandomGenome,
  crossover,
  mutate,
  generateMultipleOffspring,
  GENES,
} from './utils/genetics';
import soundManager from './utils/sounds';

function App() {
  const [genome1, setGenome1] = useState(() => generateRandomGenome());
  const [genome2, setGenome2] = useState(() => generateRandomGenome());
  const [offspring, setOffspring] = useState(null);
  const [offspringList, setOffspringList] = useState([]);
  const [selectedGene, setSelectedGene] = useState(null);
  const [mutationRate, setMutationRate] = useState(0.05);
  const [viewMode, setViewMode] = useState('double-helix');
  const [isAnimating, setIsAnimating] = useState(true);
  const [activeGenome, setActiveGenome] = useState('parent1');
  const [showPunnett, setShowPunnett] = useState(false);
  const [punnettGene, setPunnettGene] = useState('eyeColor');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [dnaFullscreen, setDnaFullscreen] = useState(false);
  const [dnaHeight, setDnaHeight] = useState(40);
  const isDragging = useRef(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const vh = (clientY / window.innerHeight) * 100;
      const clamped = Math.min(Math.max(vh, 25), 75);
      setDnaHeight(clamped);
    };

    const handleEnd = () => {
      isDragging.current = false;
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  const startResize = (e) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.userSelect = 'none';
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenTutorial', 'true');
  };

  const openTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
  };

  const handleCrossover = useCallback(() => {
    const child = crossover(genome1, genome2);
    const mutatedChild = mutate(child, mutationRate);
    setOffspring(mutatedChild);
    setOffspringList((prev) => [mutatedChild, ...prev].slice(0, 5));
    setActiveGenome('offspring');
    soundManager.playCrossover();
  }, [genome1, genome2, mutationRate]);

  const handleMultipleOffspring = useCallback(() => {
    const children = generateMultipleOffspring(genome1, genome2, 4, mutationRate);
    setOffspringList(children);
    setOffspring(children[0]);
    setActiveGenome('offspring');
    soundManager.playSuccess();
  }, [genome1, genome2, mutationRate]);

  const handleRandomize = useCallback((parent) => {
    const newGenome = generateRandomGenome();
    if (parent === 1) setGenome1(newGenome);
    else setGenome2(newGenome);
    soundManager.playRandomize();
  }, []);

  const handleMutate = useCallback(
    (parent) => {
      if (parent === 1) {
        setGenome1((prev) => {
          const mutated = mutate(prev, mutationRate);
          if (mutated.mutations && mutated.mutations.length > 0) {
            soundManager.playMutation();
          }
          return mutated;
        });
      } else {
        setGenome2((prev) => {
          const mutated = mutate(prev, mutationRate);
          if (mutated.mutations && mutated.mutations.length > 0) {
            soundManager.playMutation();
          }
          return mutated;
        });
      }
    },
    [mutationRate]
  );

  const handleGeneSelect = useCallback((gene) => {
    setSelectedGene(gene);
    soundManager.playSelect();
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveGenome(tab);
    soundManager.playClick();
  }, []);

  const toggleSound = useCallback(() => {
    const enabled = soundManager.toggle();
    setSoundEnabled(enabled);
  }, []);

  const getCurrentGenome = () => {
    if (activeGenome === 'parent1') return genome1;
    if (activeGenome === 'parent2') return genome2;
    if (activeGenome === 'offspring' && offspring) return offspring;
    return genome1;
  };

  const openPunnett = (geneKey) => {
    setPunnettGene(geneKey);
    setShowPunnett(true);
    soundManager.playClick();
  };

  return (
    <div className="app">
      <div 
        className={`dna-fullscreen ${dnaFullscreen ? 'expanded' : ''}`}
        style={{ '--dna-height': `${dnaHeight}vh` }}
      >
        <DNAViewer
          genome={getCurrentGenome()}
          viewMode={viewMode}
          isAnimating={isAnimating}
          onGeneSelect={handleGeneSelect}
          fullscreen={true}
          theme={theme}
          colorBlindMode={colorBlindMode}
        />
        <div className="genome-tabs">
          <button
            className={activeGenome === 'parent1' ? 'active' : ''}
            onClick={() => handleTabChange('parent1')}
          >
            Parent 1
          </button>
          <button
            className={activeGenome === 'parent2' ? 'active' : ''}
            onClick={() => handleTabChange('parent2')}
          >
            Parent 2
          </button>
          {offspring && (
            <button
              className={activeGenome === 'offspring' ? 'active' : ''}
              onClick={() => handleTabChange('offspring')}
            >
              Offspring
            </button>
          )}
        </div>

        <div className="viewer-controls">
          <button onClick={openTutorial} title="Show tutorial">
            Tutorial
          </button>
          <button onClick={toggleSound} title="Toggle sound">
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>
          <button 
            className="fullscreen-btn"
            onClick={() => setDnaFullscreen(!dnaFullscreen)} 
            title={dnaFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {dnaFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      <div 
          className="resize-handle"
          onMouseDown={startResize}
          onTouchStart={startResize}
        >
          <div className="resize-bar"></div>
        </div>
      </div>

      <div 
        className={`side-panel ${dnaFullscreen ? 'hidden' : ''}`}
        style={{ '--dna-height': `${dnaHeight}vh` }}
      >
        <div className="panel-header">
          <h1>3D Genetics Simulator</h1>
        </div>

        <div className="panel-content">
          <div className="organism-section">
            <div className="organism-card">
              <h3>Parent 1</h3>
              <OrganismDisplay genome={genome1} label="Parent 1" />
              <div className="card-controls">
                <button onClick={() => handleRandomize(1)}>Randomize</button>
                <button onClick={() => handleMutate(1)}>Mutate</button>
              </div>
            </div>

            <div className="organism-card">
              <h3>Parent 2</h3>
              <OrganismDisplay genome={genome2} label="Parent 2" />
              <div className="card-controls">
                <button onClick={() => handleRandomize(2)}>Randomize</button>
                <button onClick={() => handleMutate(2)}>Mutate</button>
              </div>
            </div>
          </div>

          <div className="crossover-controls">
            <button className="crossover-btn" onClick={handleCrossover}>
              Create Offspring
            </button>
            <button className="multi-btn" onClick={handleMultipleOffspring}>
              x4
            </button>
          </div>

          {offspring && (
            <div className="organism-card offspring">
              <h3>Offspring</h3>
              <OrganismDisplay genome={offspring} label="Offspring" />
              {offspring.mutations && offspring.mutations.length > 0 && (
                <div className="mutation-badge">
                  {offspring.mutations.length} mutation(s)
                </div>
              )}
            </div>
          )}

          {offspringList.length > 1 && (
            <div className="offspring-list">
              <h4>Recent Offspring</h4>
              <div className="offspring-thumbs">
                {offspringList.map((child, i) => (
                  <button
                    key={child.id}
                    className={offspring?.id === child.id ? 'active' : ''}
                    onClick={() => {
                      setOffspring(child);
                      soundManager.playClick();
                    }}
                  >
                    #{i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="punnett-section">
            <h4>Punnett Square</h4>
            <select
              value={punnettGene}
              onChange={(e) => setPunnettGene(e.target.value)}
            >
              {Object.keys(GENES).map((key) => (
                <option key={key} value={key}>
                  {GENES[key].name}
                </option>
              ))}
            </select>
            <button onClick={() => openPunnett(punnettGene)}>View</button>
          </div>

          <ControlPanel
            mutationRate={mutationRate}
            setMutationRate={setMutationRate}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            theme={theme}
            setTheme={setTheme}
            colorBlindMode={colorBlindMode}
            setColorBlindMode={setColorBlindMode}
          />

          <GeneInfo selectedGene={selectedGene} />
        </div>
      </div>

      {showPunnett && (
        <PunnettSquare
          parent1={genome1}
          parent2={genome2}
          selectedGene={punnettGene}
          onClose={() => setShowPunnett(false)}
        />
      )}

      <Tutorial
        isOpen={showTutorial}
        onClose={closeTutorial}
        currentStep={tutorialStep}
        setCurrentStep={setTutorialStep}
      />
    </div>
  );
}

export default App;

