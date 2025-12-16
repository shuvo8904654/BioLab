import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

const COLOR_SCHEMES = {
  default: {
    A: '#ef4444',
    T: '#10b981',
    G: '#3b82f6',
    C: '#f59e0b',
  },
  colorblind: {
    A: '#0077BB',
    T: '#EE7733',
    G: '#009988',
    C: '#CC3311',
  },
};

function ReplicationFork({ progress, helixData, colorScheme }) {
  const forkPosition = Math.floor(progress * helixData.length);

  return (
    <group>
      {helixData.map((item, i) => {
        if (i > forkPosition) return null;

        const offset = (forkPosition - i) * 0.1;
        const separation = Math.min(offset, 1.5);

        return (
          <group key={`rep-${i}`}>
            <mesh position={[item.pos1[0] - separation, item.pos1[1], item.pos1[2]]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial
                color={colorScheme[item.base1]}
                transparent
                opacity={0.6}
                emissive={colorScheme[item.base1]}
                emissiveIntensity={0.2}
              />
            </mesh>
            <mesh position={[item.pos2[0] + separation, item.pos2[1], item.pos2[2]]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial
                color={colorScheme[item.base2]}
                transparent
                opacity={0.6}
                emissive={colorScheme[item.base2]}
                emissiveIntensity={0.2}
              />
            </mesh>
          </group>
        );
      })}

      <mesh position={[0, (forkPosition - helixData.length / 2) * 0.35, 0]}>
        <torusGeometry args={[2.5, 0.08, 8, 32]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function ChromosomeView({ genome, onGeneSelect }) {
  const genes = Object.entries(genome.genes);
  const chromosomeLength = 8;

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.8, chromosomeLength, 8, 16]} />
        <meshStandardMaterial color="#64748b" transparent opacity={0.3} />
      </mesh>

      {genes.map(([key, gene], i) => {
        const y = (i / genes.length) * chromosomeLength - chromosomeLength / 2;
        const hue = (i / genes.length) * 360;
        const color = `hsl(${hue}, 70%, 50%)`;

        return (
          <group key={key}>
            <mesh
              position={[0, y, 0.9]}
              onClick={() => onGeneSelect({ gene: key, ...gene })}
            >
              <boxGeometry args={[0.4, 0.3, 0.2]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
            </mesh>
            <Text
              position={[1.2, y, 0.9]}
              fontSize={0.25}
              color="#ffffff"
              anchorX="left"
              anchorY="middle"
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
            <Text
              position={[3.5, y, 0.9]}
              fontSize={0.2}
              color="#94a3b8"
              anchorX="left"
              anchorY="middle"
            >
              {gene.expressed}
            </Text>
          </group>
        );
      })}

      <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 12]}>
        <capsuleGeometry args={[0.7, chromosomeLength * 0.9, 8, 16]} />
        <meshStandardMaterial color="#475569" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function DNAHelix({ genome, isAnimating, onGeneSelect, viewMode, colorScheme, replicationProgress }) {
  const groupRef = useRef();
  const sequence = genome.dnaSequence;

  useFrame(() => {
    if (groupRef.current && isAnimating && viewMode !== 'chromosome') {
      if (viewMode === 'double-helix' || viewMode === 'replication') {
        groupRef.current.rotation.y += 0.005;
      } else if (viewMode === 'compact') {
        groupRef.current.rotation.z = Math.sin(Date.now() * 0.0005) * 0.05;
      }
    }
  });

  const helixData = useMemo(() => {
    const data = [];

    sequence.forEach((pair, i) => {
      const [base1, base2] = pair.split('-');

      const isMutated =
        genome.mutations &&
        genome.mutations.some((m) => m.type === 'dna' && m.index === i);

      let pos1, pos2, textPos1, textPos2;

      if (viewMode === 'linear') {
        const x = i * 0.5 - (sequence.length * 0.5) / 2;
        pos1 = [x, 0.8, 0];
        pos2 = [x, -0.8, 0];
        textPos1 = [x, 1.4, 0];
        textPos2 = [x, -1.4, 0];
      } else if (viewMode === 'compact') {
        const cols = 10;
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = (col - cols / 2) * 0.6;
        const y = (row - 2) * 0.8;
        pos1 = [x - 0.15, y, 0];
        pos2 = [x + 0.15, y, 0];
        textPos1 = [x - 0.15, y + 0.25, 0];
        textPos2 = [x + 0.15, y + 0.25, 0];
      } else {
        const radius = 1.2;
        const verticalSpacing = 0.35;
        const twistRate = 0.35;
        const angle = i * twistRate;
        const y = (i - sequence.length / 2) * verticalSpacing;
        pos1 = [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
        pos2 = [
          Math.cos(angle + Math.PI) * radius,
          y,
          Math.sin(angle + Math.PI) * radius,
        ];
        textPos1 = [pos1[0] * 1.5, pos1[1], pos1[2] * 1.5];
        textPos2 = [pos2[0] * 1.5, pos2[1], pos2[2] * 1.5];
      }

      data.push({
        pos1,
        pos2,
        textPos1,
        textPos2,
        color1: colorScheme[base1],
        color2: colorScheme[base2],
        base1,
        base2,
        index: i,
        isMutated,
      });
    });

    return data;
  }, [sequence, genome.mutations, viewMode, colorScheme]);

  const handleClick = (index, base) => {
    onGeneSelect({
      index,
      base,
      pair: sequence[index],
    });
  };

  if (viewMode === 'chromosome') {
    return <ChromosomeView genome={genome} onGeneSelect={onGeneSelect} />;
  }

  const sphereSize = viewMode === 'compact' ? 0.1 : viewMode === 'linear' ? 0.15 : 0.18;
  const fontSize = viewMode === 'compact' ? 0.1 : viewMode === 'linear' ? 0.18 : 0.2;

  return (
    <group ref={groupRef}>
      {helixData.map((item, i) => (
        <group key={i}>
          <mesh
            position={item.pos1}
            onClick={() => handleClick(item.index, item.base1)}
          >
            <sphereGeometry args={[item.isMutated ? sphereSize * 1.3 : sphereSize, 12, 12]} />
            <meshStandardMaterial
              color={item.isMutated ? '#ff00ff' : item.color1}
              emissive={item.isMutated ? '#ff00ff' : item.color1}
              emissiveIntensity={item.isMutated ? 0.8 : 0.3}
            />
          </mesh>

          <Text
            position={item.textPos1}
            fontSize={fontSize}
            color={item.color1}
            anchorX="center"
            anchorY="middle"
          >
            {item.base1}
          </Text>

          <mesh
            position={item.pos2}
            onClick={() => handleClick(item.index, item.base2)}
          >
            <sphereGeometry args={[item.isMutated ? sphereSize * 1.3 : sphereSize, 12, 12]} />
            <meshStandardMaterial
              color={item.isMutated ? '#ff00ff' : item.color2}
              emissive={item.isMutated ? '#ff00ff' : item.color2}
              emissiveIntensity={item.isMutated ? 0.8 : 0.3}
            />
          </mesh>

          <Text
            position={item.textPos2}
            fontSize={fontSize}
            color={item.color2}
            anchorX="center"
            anchorY="middle"
          >
            {item.base2}
          </Text>

          <Line start={item.pos1} end={item.pos2} color="#ffffff" opacity={0.3} />
        </group>
      ))}

      {(viewMode === 'double-helix' || viewMode === 'replication') && (
        <>
          <Backbone helixData={helixData} side={1} />
          <Backbone helixData={helixData} side={-1} />
        </>
      )}

      {viewMode === 'replication' && (
        <ReplicationFork
          progress={replicationProgress}
          helixData={helixData}
          colorScheme={colorScheme}
        />
      )}
    </group>
  );
}

function Line({ start, end, color, opacity }) {
  const ref = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array([...start, ...end]);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [start, end]);

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  );
}

function Backbone({ helixData, side }) {
  const points = useMemo(() => {
    return helixData.map((item) =>
      new THREE.Vector3(...(side === 1 ? item.pos1 : item.pos2))
    );
  }, [helixData, side]);

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points);
  }, [points]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.06, 8, false]} />
      <meshStandardMaterial
        color="#64748b"
        emissive="#64748b"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function DNAViewer({ genome, viewMode, isAnimating, onGeneSelect, fullscreen, theme, colorBlindMode }) {
  const [replicationProgress, setReplicationProgress] = useState(0);
  const [isReplicating, setIsReplicating] = useState(false);

  useEffect(() => {
    if (viewMode === 'replication' && !isReplicating) {
      setIsReplicating(true);
      setReplicationProgress(0);
    } else if (viewMode !== 'replication') {
      setIsReplicating(false);
      setReplicationProgress(0);
    }
  }, [viewMode, isReplicating]);

  useEffect(() => {
    if (isReplicating && replicationProgress < 1) {
      const timer = setTimeout(() => {
        setReplicationProgress((prev) => Math.min(prev + 0.02, 1));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isReplicating, replicationProgress]);

  const bgColor = theme === 'light' ? '#f8fafc' : '#0f172a';
  const colorScheme = colorBlindMode ? COLOR_SCHEMES.colorblind : COLOR_SCHEMES.default;

  const style = fullscreen
    ? { width: '100%', height: '100%', background: bgColor }
    : {
        height: '240px',
        borderRadius: '6px',
        overflow: 'hidden',
        background: theme === 'light' ? '#e2e8f0' : '#1e293b',
      };

  const getCameraPosition = () => {
    if (viewMode === 'linear') return [0, 0, 10];
    if (viewMode === 'compact') return [0, 0, 8];
    if (viewMode === 'chromosome') return [2, 0, 8];
    return [0, 0, 12];
  };

  return (
    <div style={style}>
      <Canvas camera={{ position: getCameraPosition(), fov: 50 }} key={viewMode}>
        <ambientLight intensity={theme === 'light' ? 0.8 : 0.6} />
        <pointLight position={[10, 10, 10]} intensity={theme === 'light' ? 1 : 0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#94a3b8" />

        <DNAHelix
          genome={genome}
          isAnimating={isAnimating}
          onGeneSelect={onGeneSelect}
          viewMode={viewMode}
          colorScheme={colorScheme}
          replicationProgress={replicationProgress}
        />

        <OrbitControls enableZoom={true} enablePan={true} minDistance={3} maxDistance={30} />
      </Canvas>

      {viewMode === 'replication' && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)',
            padding: '8px 16px',
            borderRadius: '20px',
            color: '#fff',
            fontSize: '0.8rem',
          }}
        >
          Replication: {Math.round(replicationProgress * 100)}%
        </div>
      )}
    </div>
  );
}

export default DNAViewer;
