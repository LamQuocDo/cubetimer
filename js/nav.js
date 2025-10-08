// ========== Xử lý login/logout ==========
window.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("ls");           // Nút Đăng nhập
  const logoutLink = document.getElementById("logoutLink");  // Nút Đăng xuất

  const isLoggedIn = localStorage.getItem("currentUser");    // Kiểm tra trạng thái người dùng

  //  Nếu đã đăng nhập → ẩn nút "Đăng nhập", hiện "Đăng xuất"
  if (isLoggedIn) {
    loginLink.style.display = "none";
    logoutLink.style.display = "inline";
  } else {
    //  Nếu chưa đăng nhập → hiện "Đăng nhập", ẩn "Đăng xuất"
    loginLink.style.display = "inline";
    logoutLink.style.display = "none";
  }

  //  Khi bấm "Đăng xuất" → xóa trạng thái đăng nhập + quay về trang chính
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
});


// ========== Xử lý menu hamburger (hiện nav ở mobile) ==========
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");          // Nút ☰
  const sidebar = document.querySelector(".sidebar");          // Sidebar bên trái
  const overlay = document.getElementById("overlay");          // Lớp nền mờ

  //  Bấm menu → hiện sidebar + overlay
  menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  //  Bấm overlay → đóng sidebar
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
});


// ========== Xử lý popup nhập "thành tích mục tiêu" ==========
document.getElementById("target-time-btn").addEventListener("click", () => {
  //  Bấm nút "Mode luyện tập" → hiện khung nhập thành tích
  document.getElementById("target-time-modal").style.display = "block";
});

document.getElementById("set-target-btn").addEventListener("click", () => {
  //  Lấy giá trị người dùng nhập
  const value = parseFloat(document.getElementById("target-input").value);

  //  Nếu nhập hợp lệ → lưu vào localStorage
  if (!isNaN(value)) {
    localStorage.setItem("targetTime", value);
  }

  // Ẩn popup sau khi nhập
  document.getElementById("target-time-modal").style.display = "none";
});


// ========== Chuyển giao diện sáng/tối ==========
const themeSwitch = document.getElementById('themeSwitch');
themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('light', themeSwitch.checked);
  document.getElementById("themeName").innerText =  themeSwitch.checked ? "Sáng" : "Tối"; 
});
