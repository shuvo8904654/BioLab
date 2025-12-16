const GENES = {
  eyeColor: {
    name: 'Eye Color',
    alleles: ['brown', 'blue', 'green', 'hazel'],
    colors: {
      brown: '#8B4513',
      blue: '#4169E1',
      green: '#228B22',
      hazel: '#8E7618',
    },
    dominance: ['brown', 'hazel', 'green', 'blue'],
  },
  hairColor: {
    name: 'Hair Color',
    alleles: ['black', 'brown', 'blonde', 'red'],
    colors: {
      black: '#1a1a1a',
      brown: '#8B4513',
      blonde: '#F4D03F',
      red: '#B7410E',
    },
    dominance: ['black', 'brown', 'red', 'blonde'],
  },
  height: {
    name: 'Height',
    alleles: ['tall', 'medium', 'short'],
    values: { tall: 190, medium: 170, short: 155 },
    dominance: ['tall', 'medium', 'short'],
  },
  skinTone: {
    name: 'Skin Tone',
    alleles: ['dark', 'medium', 'light', 'fair'],
    colors: {
      dark: '#8D5524',
      medium: '#C68642',
      light: '#E0AC69',
      fair: '#F1C27D',
    },
    dominance: ['dark', 'medium', 'light', 'fair'],
  },
  bloodType: {
    name: 'Blood Type',
    alleles: ['A', 'B', 'AB', 'O'],
    dominance: ['AB', 'A', 'B', 'O'],
  },
  freckles: {
    name: 'Freckles',
    alleles: ['present', 'absent'],
    dominance: ['present', 'absent'],
  },
  dimples: {
    name: 'Dimples',
    alleles: ['present', 'absent'],
    dominance: ['present', 'absent'],
  },
  earlobes: {
    name: 'Earlobes',
    alleles: ['detached', 'attached'],
    dominance: ['detached', 'attached'],
  },
  widowsPeak: {
    name: "Widow's Peak",
    alleles: ['present', 'absent'],
    dominance: ['present', 'absent'],
  },
  tongueRolling: {
    name: 'Tongue Rolling',
    alleles: ['can', 'cannot'],
    dominance: ['can', 'cannot'],
  },
  cleftChin: {
    name: 'Cleft Chin',
    alleles: ['present', 'absent'],
    dominance: ['present', 'absent'],
  },
  hairType: {
    name: 'Hair Type',
    alleles: ['curly', 'wavy', 'straight'],
    dominance: ['curly', 'wavy', 'straight'],
  },
};

const BASE_PAIRS = ['A-T', 'T-A', 'G-C', 'C-G'];

function generateRandomGenome() {
  const genome = {
    genes: {},
    dnaSequence: [],
    id: Math.random().toString(36).substr(2, 9),
  };

  Object.keys(GENES).forEach((geneKey) => {
    const gene = GENES[geneKey];
    const allele1 = gene.alleles[Math.floor(Math.random() * gene.alleles.length)];
    const allele2 = gene.alleles[Math.floor(Math.random() * gene.alleles.length)];

    genome.genes[geneKey] = {
      allele1,
      allele2,
      expressed: determineExpression(gene, allele1, allele2),
    };
  });

  for (let i = 0; i < 50; i++) {
    genome.dnaSequence.push(BASE_PAIRS[Math.floor(Math.random() * BASE_PAIRS.length)]);
  }

  return genome;
}

function determineExpression(gene, allele1, allele2) {
  if (allele1 === allele2) return allele1;

  const dom1 = gene.dominance.indexOf(allele1);
  const dom2 = gene.dominance.indexOf(allele2);

  return dom1 <= dom2 ? allele1 : allele2;
}

function crossover(parent1, parent2) {
  const offspring = {
    genes: {},
    dnaSequence: [],
    id: Math.random().toString(36).substr(2, 9),
    parents: [parent1.id, parent2.id],
    inheritedFrom: {},
  };

  Object.keys(GENES).forEach((geneKey) => {
    const gene = GENES[geneKey];
    const fromParent1 =
      Math.random() < 0.5
        ? parent1.genes[geneKey].allele1
        : parent1.genes[geneKey].allele2;
    const fromParent2 =
      Math.random() < 0.5
        ? parent2.genes[geneKey].allele1
        : parent2.genes[geneKey].allele2;

    offspring.genes[geneKey] = {
      allele1: fromParent1,
      allele2: fromParent2,
      expressed: determineExpression(gene, fromParent1, fromParent2),
    };

    offspring.inheritedFrom[geneKey] = {
      allele1Source: 'parent1',
      allele2Source: 'parent2',
    };
  });

  const crossoverPoint = Math.floor(Math.random() * parent1.dnaSequence.length);
  offspring.dnaSequence = [
    ...parent1.dnaSequence.slice(0, crossoverPoint),
    ...parent2.dnaSequence.slice(crossoverPoint),
  ];
  offspring.crossoverPoint = crossoverPoint;

  return offspring;
}

function mutate(genome, mutationRate) {
  const mutated = JSON.parse(JSON.stringify(genome));
  mutated.mutations = [];

  Object.keys(GENES).forEach((geneKey) => {
    const gene = GENES[geneKey];

    if (Math.random() < mutationRate) {
      const oldAllele1 = mutated.genes[geneKey].allele1;
      const oldAllele2 = mutated.genes[geneKey].allele2;
      const newAllele = gene.alleles[Math.floor(Math.random() * gene.alleles.length)];

      if (Math.random() < 0.5) {
        mutated.genes[geneKey].allele1 = newAllele;
        if (newAllele !== oldAllele1) {
          mutated.mutations.push({ gene: geneKey, from: oldAllele1, to: newAllele });
        }
      } else {
        mutated.genes[geneKey].allele2 = newAllele;
        if (newAllele !== oldAllele2) {
          mutated.mutations.push({ gene: geneKey, from: oldAllele2, to: newAllele });
        }
      }
      mutated.genes[geneKey].expressed = determineExpression(
        gene,
        mutated.genes[geneKey].allele1,
        mutated.genes[geneKey].allele2
      );
    }
  });

  mutated.dnaSequence = mutated.dnaSequence.map((bp, index) => {
    if (Math.random() < mutationRate * 0.5) {
      const newBp = BASE_PAIRS[Math.floor(Math.random() * BASE_PAIRS.length)];
      if (newBp !== bp) {
        mutated.mutations.push({ type: 'dna', index, from: bp, to: newBp });
      }
      return newBp;
    }
    return bp;
  });

  return mutated;
}

function generatePunnettSquare(parent1, parent2, geneKey) {
  const p1 = parent1.genes[geneKey];
  const p2 = parent2.genes[geneKey];
  const gene = GENES[geneKey];

  const combinations = [
    { alleles: [p1.allele1, p2.allele1], expressed: determineExpression(gene, p1.allele1, p2.allele1) },
    { alleles: [p1.allele1, p2.allele2], expressed: determineExpression(gene, p1.allele1, p2.allele2) },
    { alleles: [p1.allele2, p2.allele1], expressed: determineExpression(gene, p1.allele2, p2.allele1) },
    { alleles: [p1.allele2, p2.allele2], expressed: determineExpression(gene, p1.allele2, p2.allele2) },
  ];

  const probabilities = {};
  combinations.forEach((combo) => {
    const key = combo.expressed;
    probabilities[key] = (probabilities[key] || 0) + 25;
  });

  return {
    parent1Alleles: [p1.allele1, p1.allele2],
    parent2Alleles: [p2.allele1, p2.allele2],
    combinations,
    probabilities,
  };
}

function generateMultipleOffspring(parent1, parent2, count, mutationRate) {
  const offspring = [];
  for (let i = 0; i < count; i++) {
    let child = crossover(parent1, parent2);
    child = mutate(child, mutationRate);
    offspring.push(child);
  }
  return offspring;
}

function getGeneInfo(geneKey) {
  return GENES[geneKey] || null;
}

export {
  generateRandomGenome,
  crossover,
  mutate,
  getGeneInfo,
  generatePunnettSquare,
  generateMultipleOffspring,
  GENES,
};
