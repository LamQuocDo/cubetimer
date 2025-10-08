// ========== Khai báo biến trạng thái ==========
let timerInterval;             // Bộ đếm thời gian setInterval
let startTime;                 // Thời điểm bắt đầu solve
let running = false;           // Trạng thái đồng hồ: đang chạy hay không
let spacePressed = false;      // Cờ kiểm tra đã giữ phím Space chưa
let holdStartTime = null;      // Thời điểm bắt đầu giữ Space
let canStart = false;          // Đã giữ đủ lâu để bắt đầu chưa
let timeCount = 0;             // Bộ đếm số solve
const times = [];              // Danh sách thời gian đã solve

// ========== Lấy phần tử HTML ==========
const timerDisplay = document.getElementById('timer');
const historyList = document.getElementById('historyList');

// ========== Tạo phần hiển thị ao5 & ao12 ==========
const ao5Display = document.createElement('div');
ao5Display.className = 'ao-display';
ao5Display.textContent = 'ao5: --';
timerDisplay.insertAdjacentElement('afterend', ao5Display);

const ao12Display = document.createElement('div');
ao12Display.className = 'ao-display';
ao12Display.textContent = 'ao12: --';
ao5Display.insertAdjacentElement('afterend', ao12Display);


// ========== Cập nhật đồng hồ khi đang solve ==========
function updateTimer() {
  const elapsed = (Date.now() - startTime) / 1000;
  timerDisplay.textContent = elapsed.toFixed(2);

  // Đổi màu nếu vượt thành tích mục tiêu
  const targetTime = parseFloat(localStorage.getItem("targetTime"));
  if (!isNaN(targetTime)) {
    if (elapsed > targetTime) {
      timerDisplay.style.color = 'red';
    } else {
      timerDisplay.style.color = document.body.classList.contains('light') ? '#000' : '#fff';
    }
  }
}


// ========== Sự kiện khi nhấn phím ==========
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !spacePressed) {
    e.preventDefault();
    spacePressed = true;
    holdStartTime = Date.now();
    timerDisplay.style.color = 'red';

    // Giữ > 300ms mới cho phép bắt đầu solve
    setTimeout(() => {
      if (spacePressed && !running) {
        canStart = true;
        timerDisplay.style.color = 'lime'; // Hiệu ứng "sẵn sàng"
      }
    }, 300);
  }

  // Phím R để reset toàn bộ thời gian và danh sách
  if (e.code === 'KeyR') {
    clearInterval(timerInterval);
    running = false;
    timerDisplay.textContent = '0.00';
    timerDisplay.style.color = '#fff';

    times.length = 0;
    timeCount = 0;
    historyList.innerHTML = '';
    ao5Display.textContent = 'ao5: --';
    ao12Display.textContent = 'ao12: --';
  }
});


// ========== Khi thả phím ==========
document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    spacePressed = false;

    if (!running && canStart) {
      // Bắt đầu solve
      running = true;
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 10);
      timerDisplay.style.color = document.body.classList.contains('light') ? '#000' : '#fff';
    } else if (running) {
      // Kết thúc solve
      running = false;
      clearInterval(timerInterval);
      timerDisplay.style.color = document.body.classList.contains('light') ? '#000' : '#fff';

      saveTime(timerDisplay.textContent); // Lưu thời gian
      generateScramble();                 // Tạo scramble mới
    }

    canStart = false;
  }
});


// ========== Lưu thời gian vào danh sách ==========
function saveTime(timeText) {
  const timeValue = parseFloat(timeText);
  times.push(timeValue);
  refreshHistory();
  updateAverages();
}


// ========== Cập nhật lịch sử solve ==========
function refreshHistory() {
  historyList.innerHTML = '';
  let displayIndex = 1;

  times.forEach((t, idx) => {
    if (t !== null) {
      const li = document.createElement('li');
      li.textContent = `${displayIndex}) ${t.toFixed(2)}`;
      li.dataset.index = idx;

      // Cho phép xóa thời gian bằng cách click
      li.addEventListener('click', () => {
        if (confirm(`Xóa thời gian ${t.toFixed(2)}?`)) {
          times[idx] = null;
          refreshHistory();
          updateAverages();
        }
      });

      historyList.insertBefore(li, historyList.firstChild);
      displayIndex++;
    }
  });
}


// ========== Tính và cập nhật trung bình ao5 & ao12 ==========
function updateAverages() {
  ao5Display.textContent = 'ao5: ' + calcAverage(5);
  ao12Display.textContent = 'ao12: ' + calcAverage(12);
}

// Tính trung bình loại bỏ 1 giá trị nhanh và 1 chậm nhất
function calcAverage(count) {
  const validTimes = times.filter(t => t !== null);
  if (validTimes.length < count) return '--';

  const recent = validTimes.slice(-count);
  const sorted = [...recent].sort((a, b) => a - b);

  sorted.shift(); // Bỏ nhanh nhất
  sorted.pop();   // Bỏ chậm nhất

  const avg = sorted.reduce((a, b) => a + b, 0) / (count - 2);
  return avg.toFixed(2);
}


