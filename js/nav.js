// nav.js
import { db } from "./firebase_config.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ========== LOGIN / LOGOUT ==========
window.addEventListener("DOMContentLoaded", async () => {
  const loginLink = document.getElementById("ls");
  const logoutLink = document.getElementById("logoutLink");

  const sessionRef = doc(db, "session", "current");
  const snap = await getDoc(sessionRef);
  const isLoggedIn = snap.exists() && snap.data().user;

  if (isLoggedIn) {
    loginLink.style.display = "none";
    logoutLink.style.display = "inline";
  } else {
    loginLink.style.display = "inline";
    logoutLink.style.display = "none";
  }

  // Đăng xuất
  logoutLink.addEventListener("click", async (e) => {
    e.preventDefault();

    await setDoc(sessionRef, {
      user: null,
      loggedIn: false,
      WCA_ID: null
    });

    window.location.href = "index.html";
  });
});

// ========== MENU HAMBURGER ==========
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("overlay");

  menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
});

// ========== TARGET TIME ==========
document.getElementById("target-time-btn").addEventListener("click", () => {
  document.getElementById("target-time-modal").style.display = "block";
});

document.getElementById("set-target-btn").addEventListener("click", async () => {
  const value = parseFloat(document.getElementById("target-input").value);

  if (!isNaN(value)) {
    const settingRef = doc(db, "settings", "targetTime");
    await setDoc(settingRef, { value });
  }

  document.getElementById("target-time-modal").style.display = "none";
});

// ========== THEME SWITCH ==========
const themeSwitch = document.getElementById("themeSwitch");
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("light", themeSwitch.checked);
  document.getElementById("themeName").innerText =
    themeSwitch.checked ? "Sáng" : "Tối";
});

// ========== WCA API CODE (giữ nguyên hành vi) ==========
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (code) {
  const sessionRef = doc(db, "session", "current");
  updateDoc(sessionRef, { WCAAPICODE: code });
}
