// profile.js
import { db } from "./firebase_config.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// =======================
//  THEME (giữ logic cũ)
// =======================
document.addEventListener("DOMContentLoaded", async () => {
  const themeRef = doc(db, "settings", "theme");
  const snap = await getDoc(themeRef);
  const savedTheme = snap.exists() ? snap.data().value : "light";

  document.documentElement.className = savedTheme;
  updateThemeButton(savedTheme);

  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", async () => {
      const currentTheme = document.documentElement.className;
      const newTheme = currentTheme === "light" ? "dark" : "light";
      document.documentElement.className = newTheme;
      await setDoc(themeRef, { value: newTheme });
      updateThemeButton(newTheme);
    });
  }
});

function updateThemeButton(theme) {
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  }
}

// =======================
//  LOAD USER SESSION
// =======================
const sessionRef = doc(db, "session", "current");
const sessionSnap = await getDoc(sessionRef);

if (!sessionSnap.exists() || !sessionSnap.data().user) {
  alert("Bạn chưa đăng nhập!");
  window.location.href = "../index.html";
}

const username = sessionSnap.data().user;
const userRef = doc(db, "users", username);
const userSnap = await getDoc(userRef);

if (!userSnap.exists()) {
  alert("Không tìm thấy tài khoản!");
  window.location.href = "../index.html";
}

const user = userSnap.data();

// =======================
//  HIỂN THỊ THÔNG TIN
// =======================
const title = document.getElementById("name");
const showEmail = document.getElementById("email");
const passDisplay = document.getElementById("passDisplay");

title.textContent = `Tên tài khoản: ${username}`;
showEmail.textContent = `Email: ${user.email}`;
passDisplay.textContent = "Mật khẩu: ********";

// =======================
//  BACKDROP
// =======================
const backdrop = document.createElement("div");
backdrop.className = "modal-backdrop";
document.body.appendChild(backdrop);

function openModal(modal) {
  modal.classList.add("show");
  backdrop.classList.add("show");
}

function closeModal(modal) {
  modal.classList.remove("show");
  backdrop.classList.remove("show");
}

// =======================
//  EDIT EMAIL
// =======================
const editEmailBtn = document.getElementById("editEmailBtn");
const cEmailModal = document.querySelector(".c-email");
const saveEmailBtn = document.getElementById("saveEmail");
const newEmailInput = document.getElementById("newEmail");

editEmailBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(cEmailModal);
  newEmailInput.focus();
  newEmailInput.select();
});

saveEmailBtn.addEventListener("click", async () => {
  const newEmail = newEmailInput.value.trim();

  if (!newEmail) {
    alert("Vui lòng nhập email mới!");
    return;
  }
  if (!newEmail.includes("@") || !newEmail.includes(".")) {
    alert("Email không hợp lệ!");
    return;
  }

  await updateDoc(userRef, { email: newEmail });
  showEmail.textContent = `Email: ${newEmail}`;
  closeModal(cEmailModal);
  newEmailInput.value = "";
  alert("Đã cập nhật email thành công!");
});

// =======================
//  SHOW / HIDE PASSWORD
// =======================
const showPassBtn = document.getElementById("showPassBtn");
let isPassVisible = false;

showPassBtn.addEventListener("click", () => {
  if (isPassVisible) {
    passDisplay.textContent = "Mật khẩu: ********";
    showPassBtn.textContent = "Hiện";
  } else {
    passDisplay.textContent = `Mật khẩu: ${user.pass}`;
    showPassBtn.textContent = "Ẩn";
  }
  isPassVisible = !isPassVisible;
});

// =======================
//  CHANGE PASSWORD
// =======================
const editPassBtn = document.getElementById("editPassBtn");
const cPassModal = document.querySelector(".c-pass");
const savePassBtn = document.getElementById("savePass");
const oldPassInput = document.getElementById("oldPass");
const newPassInput = document.getElementById("newPass");
const confirmPassInput = document.getElementById("confirmPass");

editPassBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(cPassModal);
  oldPassInput.focus();
});

savePassBtn.addEventListener("click", async () => {
  const oldPass = oldPassInput.value;
  const newPass = newPassInput.value;
  const confirmPass = confirmPassInput.value;

  if (!oldPass || !newPass || !confirmPass) {
    alert("Vui lòng nhập đầy đủ các trường!");
    return;
  }

  if (oldPass !== user.pass) {
    alert("Mật khẩu cũ không đúng!");
    oldPassInput.focus();
    oldPassInput.select();
    return;
  }

  if (newPass.length < 6) {
    alert("Mật khẩu mới phải ít nhất 6 ký tự!");
    return;
  }

  if (newPass !== confirmPass) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  await updateDoc(userRef, { pass: newPass });
  user.pass = newPass;

  passDisplay.textContent = "Mật khẩu: ********";
  isPassVisible = false;
  showPassBtn.textContent = "Hiện";

  closeModal(cPassModal);
  oldPassInput.value = "";
  newPassInput.value = "";
  confirmPassInput.value = "";

  alert("Đổi mật khẩu thành công!");
});

// =======================
//  BACKDROP + ESC
// =======================
backdrop.addEventListener("click", () => {
  closeModal(cEmailModal);
  closeModal(cPassModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(cEmailModal);
    closeModal(cPassModal);
  }
});

// =======================
//  WCA RANK (giữ logic)
// =======================
document.addEventListener("DOMContentLoaded", async () => {
  const sessionSnap = await getDoc(sessionRef);
  const id = sessionSnap.exists() ? sessionSnap.data().WCA_ID : null;

  if (!id) {
    document.getElementById("rankWCA").textContent =
      "Xếp hạng 3x3 avg: Chưa liên kết WCA ID";
    return;
  }

  try {
    const res = await fetch(`https://api.worldcubeassociation.org/persons/${id}`);
    if (!res.ok) {
      document.getElementById("rankWCA").textContent =
        "Xếp hạng 3x3 avg: Không tìm thấy";
      return;
    }

    const data = await res.json();
    const records = data.personal_records;
    let rank = "Không có dữ liệu";

    if (records && records["333"] && records["333"].average) {
      rank = records["333"].average.world_rank;
    }

    document.getElementById("rankWCA").textContent =
      `Xếp hạng 3x3 avg: #${rank}`;
  } catch (err) {
    console.error("Lỗi API WCA:", err);
    document.getElementById("rankWCA").textContent =
      "Lỗi khi lấy dữ liệu từ API!";
  }
});
