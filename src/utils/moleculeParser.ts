import { Atom, Bond, MoleculeData, ELEMENT_RADII } from "../constants";

export function parseMoleculeFile(content: string): MoleculeData[] {
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const molecules: MoleculeData[] = [];
  
  let currentAtoms: Atom[] = [];
  let currentComment = "";
  
  // Helper to finalize the current molecule and add to list
  const finalizeMolecule = () => {
    if (currentAtoms.length > 0) {
      molecules.push({
        atoms: currentAtoms,
        bonds: calculateBonds(currentAtoms),
        comment: currentComment || `Molecule ${molecules.length + 1}`
      });
      currentAtoms = [];
      currentComment = "";
    }
  };

  // Strategy 1: Try to parse as strict XYZ (Count -> Comment -> N Atoms)
  // This is the most reliable for multi-molecule files.
  let isStrictXYZ = false;
  let lineIdx = 0;
  
  // Check if the first line is a number
  if (lines.length > 0 && /^\d+$/.test(lines[0])) {
    // Potential XYZ format
    const tempMolecules: MoleculeData[] = [];
    let tempIdx = 0;
    let validStructure = true;

    while (tempIdx < lines.length) {
      const count = parseInt(lines[tempIdx], 10);
      if (isNaN(count) || count <= 0) {
        validStructure = false;
        break;
      }
      
      // Check if we have enough lines left
      // Need 1 line for count (already read), 1 for comment, count for atoms
      if (tempIdx + 1 + count >= lines.length && tempIdx + 1 + count !== lines.length) {
         // If we are at the end, it might be okay if the file is truncated, 
         // but strictly we expect N atoms.
         // Actually, standard XYZ requires the comment line.
         // Let's be lenient: if comment line is missing but atoms follow? 
         // No, standard XYZ is strict.
      }

      const comment = lines[tempIdx + 1] || "";
      const atomLines = lines.slice(tempIdx + 2, tempIdx + 2 + count);
      
      if (atomLines.length !== count) {
        // Not enough atom lines found matching the count
        validStructure = false;
        break;
      }

      const atoms: Atom[] = [];
      let atomId = 0;
      for (const line of atomLines) {
        const parts = line.split(/\s+/);
        if (parts.length < 4) {
           // Maybe element is implied? Standard XYZ is "Element X Y Z"
           validStructure = false; 
           break;
        }
        const element = parts[0];
        const x = parseFloat(parts[1]);
        const y = parseFloat(parts[2]);
        const z = parseFloat(parts[3]);
        if (isNaN(x) || isNaN(y) || isNaN(z)) {
          validStructure = false;
          break;
        }
        atoms.push({ id: atomId++, element: element.toUpperCase(), x, y, z });
      }

      if (!validStructure) break;

      tempMolecules.push({
        atoms,
        bonds: calculateBonds(atoms),
        comment: comment
      });

      tempIdx += 2 + count;
    }

    if (validStructure && tempMolecules.length > 0) {
      return tempMolecules;
    }
  }

  // Strategy 2: Loose parsing (Heuristic)
  // If strict XYZ failed, we just look for blocks of atom lines.
  // A "header" or "non-atom" line breaks the current molecule.
  
  let idCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(/\s+/);

    // Check if line looks like an atom: "Element X Y Z"
    // Element is string, X Y Z are numbers.
    let isAtomLine = false;
    if (parts.length >= 4) {
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);
      if (!isNaN(x) && !isNaN(y) && !isNaN(z)) {
        // It's an atom line
        isAtomLine = true;
        currentAtoms.push({
          id: idCounter++,
          element: parts[0].toUpperCase(),
          x,
          y,
          z
        });
      }
    }

    if (!isAtomLine) {
      // If we encounter a non-atom line, and we have atoms accumulated, 
      // it's likely a separator or header for the NEXT molecule.
      if (currentAtoms.length > 0) {
        finalizeMolecule();
        idCounter = 0; // Reset ID counter for new molecule
      }
      
      // This line might be the comment/title for the next molecule
      // Ignore if it's just a number (like an atom count we failed to parse strictly)
      // or keep it as comment.
      currentComment = line;
    }
  }

  // Finalize the last one
  finalizeMolecule();

  return molecules;
}

function calculateBonds(atoms: Atom[]): Bond[] {
  const bonds: Bond[] = [];
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const a1 = atoms[i];
      const a2 = atoms[j];
      const dx = a1.x - a2.x;
      const dy = a1.y - a2.y;
      const dz = a1.z - a2.z;
      const distSq = dx*dx + dy*dy + dz*dz;
      const r1 = ELEMENT_RADII[a1.element] || ELEMENT_RADII.DEFAULT;
      const r2 = ELEMENT_RADII[a2.element] || ELEMENT_RADII.DEFAULT;
      const threshold = r1 + r2 + 0.4; 
      const minThreshold = 0.4; 

      if (distSq < threshold * threshold && distSq > minThreshold * minThreshold) {
        bonds.push({ source: a1, target: a2 });
      }
    }
  }
  return bonds;
}
