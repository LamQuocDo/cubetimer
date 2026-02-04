import { db } from "./firebase_config.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ===========================
//  SCRAMBLE GENERATOR
// ===========================
export class Scramble {
  constructor(type = "3x3x3") {
    this.type = type.toLowerCase();
    this.faceGroups = {
      U: ["U", "D"], D: ["U", "D"],
      L: ["L", "R"], R: ["L", "R"],
      F: ["F", "B"], B: ["F", "B"]
    };
    this.faceList = ["U", "D", "L", "R", "F", "B"];
  }

  getStepCount() {
    const map = {
      "2x2x2": 11, "3x3x3": 20, "4x4x4": 40, "5x5x5": 60,
      "6x6x6": 80, "7x7x7": 100, "skewb": 11, "pyraminx": 11,
      "megaminx": 70, "square-1": 15
    };
    return map[this.type] || 20;
  }

  getAngle() {
    return ["", "2", "'"][Math.floor(Math.random() * 3)];
  }

  generateNxN() {
    const moves = [];
    let lastFace = "";
    for (let i = 0; i < this.getStepCount(); i++) {
      const available = this.faceList.filter(f => !lastFace || !this.faceGroups[lastFace].includes(f));
      let face = available[Math.floor(Math.random() * available.length)];
      let angle = this.getAngle();
      if (["4x4x4", "5x5x5", "6x6x6", "7x7x7"].includes(this.type) && Math.random() < 0.5) face += "w";
      moves.push(face + angle);
      lastFace = face[0];
    }
    return moves.join(" ");
  }

  generateSkewb() {
    const faces = ["R", "L", "B", "U"];
    let moves = [], last = "";
    while (moves.length < this.getStepCount()) {
      const f = faces[Math.floor(Math.random() * faces.length)];
      if (f === last) continue;
      moves.push(f + ["", "'"][Math.floor(Math.random() * 2)]);
      last = f;
    }
    return moves.join(" ");
  }

  generatePyraminx() {
    const faces = ["R", "L", "U", "B"], tips = ["r", "l", "u", "b"];
    let moves = [], last = "";
    while (moves.length < 8) {
      const f = faces[Math.floor(Math.random() * faces.length)];
      if (f === last) continue;
      moves.push(f + ["", "'"][Math.floor(Math.random() * 2)]);
      last = f;
    }
    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
      moves.push(tips[i] + ["", "'"][Math.floor(Math.random() * 2)]);
    }
    return moves.join(" ");
  }

  generateMegaminx() {
    let moves = [];
    const patterns = [["R++", "D--"], ["R--", "D++"]];
    for (let i = 0; i < 7; i++) {
      const p = patterns[Math.floor(Math.random() * 2)];
      for (let j = 0; j < 5; j++) moves.push(p[0], p[1]);
      moves.push("U" + (Math.random() < 0.5 ? "" : "'") + "\n");
    }
    return moves.join(" ");
  }

  generateSquare1() {
    let moves = [];
    for (let i = 0; i < this.getStepCount(); i++) {
      const a = Math.floor(Math.random() * 12) - 6;
      const b = Math.floor(Math.random() * 12) - 6;
      moves.push(`(${a},${b})`);
      if (Math.random() < 0.7) moves.push("/");
    }
    return moves.join(" ");
  }

  generate() {
    switch (this.type) {
      case "skewb": return this.generateSkewb();
      case "pyraminx": return this.generatePyraminx();
      case "megaminx": return this.generateMegaminx();
      case "square-1": return this.generateSquare1();
      default: return this.generateNxN();
    }
  }
}

// ===========================
//  EXPORTED UTILS
// ===========================
export function generateNewScramble() {
  const scrambleEl = document.getElementById("scramble");
  const cubeSelect = document.getElementById("cubeType");
  if (!scrambleEl) return;
  const type = cubeSelect ? cubeSelect.value : "3x3x3";
  const sc = new Scramble(type);
  scrambleEl.innerText = sc.generate();
}

const settingsRef = doc(db, "settings", "cube");

document.addEventListener("DOMContentLoaded", async () => {
  const cubeSelect = document.getElementById("cubeType");
  const snap = await getDoc(settingsRef);
  const savedType = snap.exists() ? snap.data().type : "3x3x3";

  if (cubeSelect) {
    cubeSelect.value = savedType;
    cubeSelect.addEventListener("change", async () => {
      await setDoc(settingsRef, { type: cubeSelect.value });
      localStorage.setItem("currentCubeType", cubeSelect.value);
      generateNewScramble();
    });
  }
  generateNewScramble();
});