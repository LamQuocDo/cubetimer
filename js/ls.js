// ls.js
import { db } from "./firebase_config.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// =======================
//  DOM ELEMENTS
// =======================
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");

let isLogin = true;

// =======================
//  CHECK LOGIN STATE
// =======================
const sessionRef = doc(db, "session", "current");

(async () => {
  const snap = await getDoc(sessionRef);
  if (snap.exists() && snap.data().user) {
    location.href = "../index.html";
  }
})();

// =======================
//  UI TOGGLE
// =======================
function updateForm() {
  if (isLogin) {
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    formTitle.textContent = "Đăng nhập";
    toggleText.innerHTML = `Chưa có tài khoản? <a href="#" id="toggleLink">Đăng ký</a>`;
  } else {
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
    formTitle.textContent = "Đăng ký";
    toggleText.innerHTML = `Đã có tài khoản? <a href="#" id="toggleLink">Đăng nhập</a>`;
  }

  document.getElementById("toggleLink").addEventListener("click", toggle);
}

function toggle(e) {
  e.preventDefault();
  isLogin = !isLogin;
  updateForm();
}

document.getElementById("toggleLink").addEventListener("click", toggle);

// =======================
//  LOGIN
// =======================
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = document.getElementById("login_user");
  const pass = document.getElementById("login_password");
  const wcaInput = document.getElementById("WCAID");

  let valid = true;

  if (user.value.length < 6 || user.value.length > 18) {
    user.classList.add("is-invalid");
    valid = false;
  } else user.classList.remove("is-invalid");

  if (pass.value.length < 6 || pass.value.length > 18) {
    pass.classList.add("is-invalid");
    valid = false;
  } else pass.classList.remove("is-invalid");

  const userRef = doc(db, "users", user.value);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("Tài khoản không tồn tại");
    valid = false;
  } else {
    const data = snap.data();
    if (data.pass !== pass.value) {
      alert("Mật khẩu không đúng");
      valid = false;
    }
  }

  if (valid) {
    await setDoc(sessionRef, {
      user: user.value,
      loggedIn: true,
      WCA_ID: wcaInput && wcaInput.value.trim() !== ""
        ? wcaInput.value.trim()
        : null
    });

    window.location.href = "../index.html";
  }
});

// =======================
//  REGISTER
// =======================
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = document.getElementById("reg_username");
  const email = document.getElementById("reg_email");
  const pass = document.getElementById("reg_password");
  const confirm = document.getElementById("reg_confirm");

  let valid = true;

  if (user.value.length < 6 || user.value.length > 18) {
    user.classList.add("is-invalid");
    valid = false;
  } else user.classList.remove("is-invalid");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    email.classList.add("is-invalid");
    valid = false;
  } else email.classList.remove("is-invalid");

  if (pass.value.length < 6 || pass.value.length > 18) {
    pass.classList.add("is-invalid");
    valid = false;
  } else pass.classList.remove("is-invalid");

  if (pass.value !== confirm.value) {
    confirm.classList.add("is-invalid");
    valid = false;
  } else confirm.classList.remove("is-invalid");

  const userRef = doc(db, "users", user.value);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    alert("Tài khoản đã tồn tại");
    return;
  }

  if (valid) {
    await setDoc(userRef, {
      name: user.value,
      email: email.value,
      pass: pass.value
    });

    alert("Đăng ký thành công");
    toggle(e);
  }
});
