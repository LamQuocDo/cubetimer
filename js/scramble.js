// ===========================
//  Lớp sinh scramble (xáo trộn) - Chuẩn WCA
// ===========================
class Scramble {
  constructor(type = '3x3x3') {
    this.faceGroups = {
      U: ['U', 'D'], D: ['U', 'D'],
      L: ['L', 'R'], R: ['L', 'R'],
      F: ['F', 'B'], B: ['F', 'B']
    };
    this.faceList = ['U', 'D', 'L', 'R', 'F', 'B'];
    this.type = type.toLowerCase();
    this.wideFaces = ['u', 'd', 'l', 'r', 'f', 'b'];
    this.sliceFaces = ['M', 'E', 'S'];
  }

  getAngle() {
    const angles = ["", "2", "'"];
    return angles[Math.floor(Math.random() * angles.length)];
  }

  getStepCount() {
    const map = { "2x2x2": 11, "3x3x3": 20, "4x4x4": 40, "5x5x5": 60 };
    return map[this.type] || 20;
  }

  generateMove(lastFace = '') {
    let face, angle, isWide = false, isSlice = false;

    let available = this.faceList.filter(f =>
      !lastFace || !this.faceGroups[lastFace].includes(f)
    );
    face = available[Math.floor(Math.random() * available.length)];
    angle = this.getAngle();

    if (this.type === '4x4x4' || this.type === '5x5x5') {
      const rand = Math.random();
      if (rand < 0.4) {
        const idx = this.faceList.indexOf(face);
        face = this.wideFaces[idx];
        isWide = true;
      } else if (rand < 0.6) {
        face = this.sliceFaces[Math.floor(Math.random() * this.sliceFaces.length)];
        isSlice = true;
      }
    }

    return { face, angle, isWide, isSlice };
  }

  generate() {
    const moves = [];
    let lastFace = '';
    const count = this.getStepCount();

    for (let i = 0; i < count; i++) {
      const move = this.generateMove(lastFace);
      const notation = move.face + move.angle;

      if (!move.isWide && !move.isSlice) {
        lastFace = move.face;
      } else if (move.isWide) {
        lastFace = move.face.toUpperCase();
      }

      moves.push(notation);
    }

    return moves.join(' ');
  }
}


// ===========================
//  KHI ĐỔI CUBE → LƯU LOẠI MỚI + RELOAD TRANG
// ===========================
function handleCubeChange() {
  const newType = document.getElementById('cubeType').value;
  const currentType = localStorage.getItem('currentCubeType');

  // Nếu đổi loại cube -> reload
  if (currentType && currentType !== newType) {
  }

  // Lưu loại cube mới + reload
  localStorage.setItem('currentCubeType', newType);
  location.reload(); // LOAD LẠI TRANG → TỰ ĐỘNG TẠO SCRAMBLE MỚI
}


// ===========================
//  DOM Ready: Tạo scramble + khôi phục loại cube
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const cubeSelect = document.getElementById('cubeType');
  const savedType = localStorage.getItem('currentCubeType') || '3x3x3';

  // Khôi phục loại cube
  if (cubeSelect) {
    cubeSelect.value = savedType;
  }

  // Tạo scramble đầu tiên
  const scramble = new Scramble(savedType);
  document.getElementById('scramble').innerText = scramble.generate();

  // Khi đổi cube → reload trang
  if (cubeSelect) {
    cubeSelect.addEventListener('change', handleCubeChange);
  }
});