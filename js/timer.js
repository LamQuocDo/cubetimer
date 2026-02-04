import { db } from "./firebase_config.js";
import {
  doc, setDoc, updateDoc, arrayUnion, arrayRemove
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { generateNewScramble } from "./scramble.js";

// ========== STATE ==========
let timerInterval = null, startTime = 0, running = false;
let spacePressed = false, canStart = false;
const times = [];

// ========== DOM ==========
const timerDisplay = document.getElementById("timer");
const historyList = document.getElementById("historyList");

// Chèn AO Display nếu chưa có
const ao5Display = document.createElement("div");
ao5Display.className = "ao-display";
ao5Display.textContent = "avg5: --";
timerDisplay.insertAdjacentElement("afterend", ao5Display);

const ao12Display = document.createElement("div");
ao12Display.className = "ao-display";
ao12Display.textContent = "avg12: --";
ao5Display.insertAdjacentElement("afterend", ao12Display);

// ========== FIRESTORE HELPERS ==========
async function saveSolveToFirestore(timeValue) {
  const cubeType = document.getElementById("cubeType")?.value || "3x3x3";
  const docRef = doc(db, "sessions", "default");
  const data = { solves: arrayUnion(timeValue), cubeType, updatedAt: Date.now() };
  try {
    await updateDoc(docRef, data);
  } catch {
    await setDoc(docRef, data);
  }
}

// ========== LOGIC ==========
function updateTimer() {
  const elapsed = (Date.now() - startTime) / 1000;
  timerDisplay.textContent = elapsed.toFixed(2);
  const target = parseFloat(localStorage.getItem("targetTime"));
  if (!isNaN(target) && elapsed > target) timerDisplay.style.color = "red";
}

function saveTime(timeText) {
  const timeValue = parseFloat(timeText);
  if (isNaN(timeValue)) return;
  times.push(timeValue);
  saveSolveToFirestore(timeValue);
  refreshHistory();
  updateAverages();
  
  // ✅ ĐỔI SCRAMBLE MỚI NGAY LẬP TỨC
  generateNewScramble();
}

function refreshHistory() {
  historyList.innerHTML = "";
  
  // Lọc bỏ các giá trị null nếu lỡ có (đảm bảo mảng sạch)
  // Tuy nhiên nếu dùng splice bên dưới thì mảng sẽ luôn sạch.
  
  times.forEach((t, idx) => {
    if (t === null) return; 

    const li = document.createElement("li");
    // Số thứ tự sẽ luôn đúng vì idx được tính lại dựa trên các phần tử hiện có
    li.textContent = `${idx + 1}) ${t.toFixed(2)}`;

    li.onclick = async () => {
      if (confirm(`Xóa lần giải ${t.toFixed(2)}?`)) {
        // ✅ Dùng splice để cắt phần tử ra khỏi mảng 'times'
        // Cú pháp: splice(vị trí bắt đầu, số lượng phần tử cần xóa)
        times.splice(idx, 1); 

        // Xóa trên Firestore
        await updateDoc(doc(db, "sessions", "default"), { 
          solves: arrayRemove(t) 
        });

        // Vẽ lại danh sách (số thứ tự sẽ tự động được đánh lại từ 1)
        refreshHistory();
        updateAverages();
      }
    };

    // Đưa lần giải mới nhất lên đầu danh sách hiển thị
    historyList.insertBefore(li, historyList.firstChild);
  });
}

function updateAverages() {
  const valid = times.filter(t => t !== null);
  const calc = (n) => {
    if (valid.length < n) return "--";
    let recent = valid.slice(-n).sort((a, b) => a - b);
    recent.shift(); recent.pop();
    return (recent.reduce((a, b) => a + b, 0) / (n - 2)).toFixed(2);
  };
  ao5Display.textContent = "avg5: " + calc(5);
  ao12Display.textContent = "avg12: " + calc(12);
}

// ========== EVENTS ==========
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !spacePressed) {
    e.preventDefault();
    spacePressed = true;
    if (running) {
      stopTimer();
    } else {
      timerDisplay.style.color = "red";
      setTimeout(() => { if (spacePressed) { canStart = true; timerDisplay.style.color = "lime"; }}, 300);
    }
  }
  if (e.code === "KeyR") resetSession();
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    spacePressed = false;
    if (!running && canStart) startTimer();
    canStart = false;
  }
});

function startTimer() {
  running = true;
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 10);
  timerDisplay.style.color = "#fff";
}

function stopTimer() {
  running = false;
  clearInterval(timerInterval);
  timerDisplay.style.color = document.body.classList.contains("light") ? "#000" : "#fff";
  saveTime(timerDisplay.textContent);
}

function resetSession() {
  clearInterval(timerInterval);
  running = false;
  times.length = 0;
  timerDisplay.textContent = "0.00";
  refreshHistory();
  updateAverages();
  generateNewScramble();
}