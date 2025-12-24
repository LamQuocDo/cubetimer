// ===========================
//  SCRAMBLE GENERATOR
// ===========================

class Scramble {
  constructor(type = '3x3x3') {
    this.type = type.toLowerCase();

    this.faceGroups = {
      U: ['U', 'D'], D: ['U', 'D'],
      L: ['L', 'R'], R: ['L', 'R'],
      F: ['F', 'B'], B: ['F', 'B']
    };

    this.faceList = ['U', 'D', 'L', 'R', 'F', 'B'];
  }

  // ===========================
  //  STEP COUNT (WCA)
  // ===========================
  getStepCount() {
    const map = {
      "2x2x2": 11,
      "3x3x3": 20,
      "4x4x4": 40,
      "5x5x5": 60,
      "6x6x6": 80,
      "7x7x7": 100,
      "skewb": 11,
      "pyraminx": 11,
      "megaminx": 70,
      "square-1": 15
    };
    return map[this.type] || 20;
  }

  getAngle() {
    return ["", "2", "'"][Math.floor(Math.random() * 3)];
  }

  // ===========================
  //  CUBE NxN (2x2 -> 7x7)
  // ===========================
  generateMove(lastFace = '') {
    let available = this.faceList.filter(f =>
      !lastFace || !this.faceGroups[lastFace].includes(f)
    );

    let face = available[Math.floor(Math.random() * available.length)];
    let angle = this.getAngle();

    // 4x4+
    if (['4x4x4', '5x5x5', '6x6x6', '7x7x7'].includes(this.type)) {
      if (Math.random() < 0.5) {
        face += 'w'; // Uw Dw ...
      }
    }

    return { face, angle };
  }

  generateNxN() {
    const moves = [];
    let lastFace = '';
    const count = this.getStepCount();

    for (let i = 0; i < count; i++) {
      const m = this.generateMove(lastFace);
      moves.push(m.face + m.angle);
      lastFace = m.face[0].toUpperCase();
    }
    return moves.join(' ');
  }

  // ===========================
  //  SKEWB
  // ===========================
  generateSkewb() {
    const faces = ['R', 'L', 'B', 'U'];
    const angles = ["", "'"];
    const moves = [];
    let last = '';

    while (moves.length < this.getStepCount()) {
      const f = faces[Math.floor(Math.random() * faces.length)];
      if (f === last) continue;
      moves.push(f + angles[Math.floor(Math.random() * 2)]);
      last = f;
    }
    return moves.join(' ');
  }

  // ===========================
  //  PYRAMINX
  // ===========================
  generatePyraminx() {
    const faces = ['R', 'L', 'U', 'B'];
    const tips = ['r', 'l', 'u', 'b'];
    const angles = ["", "'"];
    const moves = [];
    let last = '';

    while (moves.length < 8) {
      const f = faces[Math.floor(Math.random() * faces.length)];
      if (f === last) continue;
      moves.push(f + angles[Math.floor(Math.random() * 2)]);
      last = f;
    }

    // tips
    const tipCount = Math.floor(Math.random() * 4);
    for (let i = 0; i < tipCount; i++) {
      moves.push(
        tips[Math.floor(Math.random() * tips.length)] +
        angles[Math.floor(Math.random() * 2)]
      );
    }

    return moves.join(' ');
  }

  // ===========================
  //  MEGAMINX (WCA)
  // ===========================
  generateMegaminx() {
    const moves = [];
    const patterns = [
      ['R++', 'D--'],
      ['R--', 'D++']
    ];

    for (let i = 0; i < 7; i++) {
      const p = patterns[Math.floor(Math.random() * 2)];
      for (let j = 0; j < 5; j++) {
        moves.push(p[0], p[1]);
      }
    }
    return moves.join(' ');
  }

  // ===========================
  //  SQUARE-1
  // ===========================
  generateSquare1() {
    const moves = [];

    for (let i = 0; i < this.getStepCount(); i++) {
      const a = Math.floor(Math.random() * 12) - 6;
      const b = Math.floor(Math.random() * 12) - 6;
      moves.push(`(${a},${b})`);
      if (Math.random() < 0.7) moves.push('/');
    }

    return moves.join(' ');
  }

  // ===========================
  //  MAIN
  // ===========================
  generate() {
    switch (this.type) {
      case 'skewb': return this.generateSkewb();
      case 'pyraminx': return this.generatePyraminx();
      case 'megaminx': return this.generateMegaminx();
      case 'square-1': return this.generateSquare1();
      default: return this.generateNxN();
    }
  }
}

// ===========================
//  CUBE CHANGE HANDLER
// ===========================
function handleCubeChange() {
  const type = document.getElementById('cubeType').value;
  localStorage.setItem('currentCubeType', type);
  location.reload();
}

// ===========================
//  DOM READY
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const cubeSelect = document.getElementById('cubeType');
  const savedType = localStorage.getItem('currentCubeType') || '3x3x3';

  if (cubeSelect) cubeSelect.value = savedType;

  const scramble = new Scramble(savedType);
  document.getElementById('scramble').innerText = scramble.generate();

  if (cubeSelect) {
    cubeSelect.addEventListener('change', handleCubeChange);
  }
});
