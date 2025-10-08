// ===========================
//  Lớp sinh scramble (xáo trộn)
// ===========================
class Scramble {
  constructor(type = '3x3x3') {
    //  Các nhóm mặt đối nhau (để tránh lặp lại liên tiếp)
    this.faceGroups = {
      U: ['U', 'D'], D: ['U', 'D'],
      L: ['L', 'R'], R: ['L', 'R'],
      F: ['F', 'B'], B: ['F', 'B']
    };

    // Danh sách các mặt cube cơ bản
    this.faceList = ['U', 'D', 'L', 'R', 'F', 'B'];

    // Loại cube hiện tại (mặc định là 3x3x3)
    this.type = type;
  }

  //  Random 1 góc xoay: "" = 90°, "2" = 180°, "'" = 90° ngược
  getAngle() {
    const angles = ["", "2", "'"];
    return angles[Math.floor(Math.random() * angles.length)];
  }

  //  Xác định số bước scramble theo loại cube
  getStepCount() {
    const stepMap = {
      "2x2x2": 10,
      "3x3x3": 20,
      "4x4x4": 41,
      "5x5x5": 62
    };
    return stepMap[this.type] || 10; // Mặc định 10 nếu không có trong map
  }

  // Tạo một chuỗi bước scramble ngẫu nhiên
  randomSteps() {
    const steps = [];
    let lastFace = null; // Để tránh lặp lại mặt gần nhau (U → D, L → R...)

    for (let i = 0; i < this.getStepCount(); i++) {
      let newFace;

      // Lặp cho đến khi chọn được mặt không thuộc cùng nhóm với mặt trước
      while (true) {
        newFace = this.faceList[Math.floor(Math.random() * this.faceList.length)];
        if (!lastFace || !this.faceGroups[lastFace].includes(newFace)) {
          lastFace = newFace;
          break;
        }
      }

      //  Thêm bước mới: ví dụ "F'", "U2", "R"
      steps.push(newFace + this.getAngle());
    }

    return steps.join(' '); // Ghép các bước thành 1 chuỗi
  }
}


// ===========================
//  Hiển thị scramble lên giao diện
// ===========================
function generateScramble() {
  const type = document.getElementById('cubeType').value;     // Lấy loại cube đang chọn
  const scramble = new Scramble(type);                        // Tạo scramble mới
  document.getElementById('scramble').innerText = scramble.randomSteps(); // Ghi kết quả lên màn hình
}


// ===========================
// ⏲ Khi DOM load xong, tự động chạy scramble và cập nhật khi đổi loại cube
// ===========================
document.addEventListener('DOMContentLoaded', generateScramble);

document.addEventListener('DOMContentLoaded', () => {
  generateScramble(); // chạy ngay khi vào trang

  //  Khi người dùng chọn loại cube khác, thì tạo scramble mới tương ứng
  document.getElementById('cubeType').addEventListener('change', generateScramble);
});
