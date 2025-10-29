// Đồng bộ theme với index.html
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.className = savedTheme;
  updateThemeButton(savedTheme);

  // Xử lý nút đổi theme
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.className;
      const newTheme = currentTheme === "light" ? "dark" : "light";
      document.documentElement.className = newTheme;
      localStorage.setItem("theme", newTheme);
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

// === Giữ nguyên toàn bộ code cũ bên dưới ===

let username = localStorage.getItem("currentUser");

if (!username) {
  const keys = Object.keys(localStorage);
  const userKeys = keys.filter(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      return data && data.name && data.email && data.pass;
    } catch {
      return false;
    }
  });

  if (userKeys.length === 1) {
    username = userKeys[0];
    localStorage.setItem("currentUser", username);
  } else if (userKeys.length > 1) {
    alert("Có nhiều tài khoản! Vui lòng đăng nhập lại.");
    window.location.href = "../index.html";
  }
}

const user = username ? JSON.parse(localStorage.getItem(username)) : null;
const title = document.getElementById("name");
const showEmail = document.getElementById("email");
const passDisplay = document.getElementById("passDisplay");

if (username && user) {
  title.textContent = `Tên tài khoản: ${username}`;
  showEmail.textContent = `Email: ${user.email}`;
  passDisplay.textContent = "Mật khẩu: ********"; // Ẩn mật khẩu
} else {
  alert("Bạn chưa đăng nhập!");
  window.location.href = "../index.html";
}

// --- Backdrop chung cho tất cả modal ---
const backdrop = document.createElement("div");
backdrop.className = "modal-backdrop";
document.body.appendChild(backdrop);

// --- Modal đổi email ---
const editEmailBtn = document.getElementById("editEmailBtn");
const cEmailModal = document.querySelector(".c-email");
const saveEmailBtn = document.getElementById("saveEmail");
const newEmailInput = document.getElementById("newEmail");

function openModal(modal) {
  modal.classList.add("show");
  backdrop.classList.add("show");
}

function closeModal(modal) {
  modal.classList.remove("show");
  backdrop.classList.remove("show");
}

editEmailBtn.addEventListener("click", (e) => {
  e.preventDefault();
  openModal(cEmailModal);
  newEmailInput.focus();
  newEmailInput.select();
});

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

// --- Cập nhật email ---
saveEmailBtn.addEventListener("click", () => {
  const newEmail = newEmailInput.value.trim();

  if (!newEmail) {
    alert("Vui lòng nhập email mới!");
    return;
  }
  if (!newEmail.includes("@") || !newEmail.includes(".")) {
    alert("Email không hợp lệ!");
    return;
  }

  user.email = newEmail;
  localStorage.setItem(username, JSON.stringify(user));
  showEmail.textContent = `Email: ${newEmail}`;
  closeModal(cEmailModal);
  newEmailInput.value = "";
  alert("Đã cập nhật email thành công!");
});

// --- Show/Hide Password ---
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

/// --- Modal đổi mật khẩu ---
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

savePassBtn.addEventListener("click", () => {
  const oldPass = oldPassInput.value;
  const newPass = newPassInput.value;
  const confirmPass = confirmPassInput.value;

  // Kiểm tra nhập đủ
  if (!oldPass || !newPass || !confirmPass) {
    alert("Vui lòng nhập đầy đủ các trường!");
    return;
  }

  // Kiểm tra mật khẩu cũ
  if (oldPass !== user.pass) {
    alert("Mật khẩu cũ không đúng!");
    oldPassInput.focus();
    oldPassInput.select();
    return;
  }

  // Kiểm tra độ dài mật khẩu mới
  if (newPass.length < 6) {
    alert("Mật khẩu mới phải ít nhất 6 ký tự!");
    return;
  }

  // Kiểm tra xác nhận
  if (newPass !== confirmPass) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  // Cập nhật thành công
  user.pass = newPass;
  localStorage.setItem(username, JSON.stringify(user));

  // Reset hiển thị
  passDisplay.textContent = "Mật khẩu: ********";
  isPassVisible = false;
  showPassBtn.textContent = "Hiện";

  // Đóng modal + xóa input
  closeModal(cPassModal);
  oldPassInput.value = "";
  newPassInput.value = "";
  confirmPassInput.value = "";

  alert("Đổi mật khẩu thành công!");
});

// --- API rank ---
document.addEventListener("DOMContentLoaded", async () => {
  const id = localStorage.getItem("WCA_ID");

  if (!id) {
    document.getElementById("rankWCA").textContent = "Xếp hạng 3x3 avg: Chưa liên kết WCA ID";
    return;
  }

  try {
    const res = await fetch(`https://api.worldcubeassociation.org/persons/${id}`);
    if (!res.ok) {
      document.getElementById("rankWCA").textContent = "Xếp hạng 3x3 avg: Không tìm thấy";
      return;
    }

    const data = await res.json();
    const records = data.personal_records;
    let rank = "Không có dữ liệu";

    if (records && records["333"] && records["333"].average) {
      rank = records["333"].average.world_rank;
    }

    document.getElementById("rankWCA").textContent = `Xếp hạng 3x3 avg: #${rank}`;
  } catch (err) {
    console.error("Lỗi API WCA:", err);
    document.getElementById("rankWCA").textContent = "Lỗi khi lấy dữ liệu từ API!";
  }
});

