// Lấy các phần tử của form đăng nhập / đăng ký
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");

let isLogin = true; // Trạng thái hiện tại: đang ở form đăng nhập hay đăng ký

//  Nếu người dùng đã đăng nhập (đã có currentUser trong localStorage), tự động chuyển về trang chính
if (localStorage.getItem('currentUser')){
  location.href = "../index.html";
}

// Hàm cập nhật giao diện khi chuyển giữa đăng nhập và đăng ký
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

  // Cập nhật lại sự kiện click cho liên kết chuyển đổi form
  document.getElementById("toggleLink").addEventListener("click", toggle);
}

// Hàm chuyển đổi giữa form đăng nhập và đăng ký
function toggle(e) {
  e.preventDefault();
  isLogin = !isLogin;
  updateForm();
}

// Gắn sự kiện ban đầu cho liên kết chuyển đổi form
document.getElementById("toggleLink").addEventListener("click", toggle);

// =======================
//  Xử lý ĐĂNG NHẬP
// =======================
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let user = document.getElementById("login_user");
  let pass = document.getElementById("login_password");
  let valid = true;

  //  Kiểm tra độ dài username
  if (user.value.length < 6 || user.value.length > 18) {
    user.classList.add("is-invalid");
    valid = false;
  } else {
    user.classList.remove("is-invalid");
  }

  //  Kiểm tra độ dài password
  if (pass.value.length < 6 || pass.value.length > 18) {
    pass.classList.add("is-invalid");
    valid = false;
  } else {
    pass.classList.remove("is-invalid");
  }

  //  Kiểm tra tài khoản có tồn tại trong localStorage không
  const checkAccountExist = localStorage.getItem(user.value);

  if (!checkAccountExist){
    user.classList.add("is-invalid");
    alert('Tài khoản không tồn tại hoặc sai thông tin đăng nhập');
    valid = false;
  } else {
    //  Nếu tồn tại, kiểm tra mật khẩu đúng không
    if (checkAccountExist !== pass.value){
      pass.classList.add('is-invalid');
      alert('Mật khẩu không đúng');
      valid = false;
    }
  }

  //  Nếu hợp lệ hoàn toàn → đăng nhập thành công
  if (valid) {
    localStorage.setItem('currentUser', user.value);       // Ghi tên người dùng hiện tại
    localStorage.setItem("loggedIn", "true");              // Ghi trạng thái đã đăng nhập
    window.location.href = "../index.html";                // Chuyển hướng về trang chính
  }
});


// =======================
//  Xử lý ĐĂNG KÝ
// =======================
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let user = document.getElementById("reg_username");
  let email = document.getElementById("reg_email");
  let pass = document.getElementById("reg_password");
  let confirm = document.getElementById("reg_confirm");

  let valid = true;

  //  Kiểm tra username hợp lệ
  if (user.value.length < 6 || user.value.length > 18) {
    user.classList.add("is-invalid");
    valid = false;
  } else {
    user.classList.remove("is-invalid");
  }

  //  Kiểm tra định dạng email bằng Regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value)) {
    email.classList.add("is-invalid");
    valid = false;
  } else {
    email.classList.remove("is-invalid");
  }

  //  Kiểm tra mật khẩu hợp lệ
  if (pass.value.length < 6 || pass.value.length > 18) {
    pass.classList.add("is-invalid");
    valid = false;
  } else {
    pass.classList.remove("is-invalid");
  }

  //  Kiểm tra xác nhận mật khẩu trùng khớp
  if (pass.value !== confirm.value) {
    confirm.classList.add("is-invalid");
    valid = false;
  } else {
    confirm.classList.remove("is-invalid");
  }

  //  Nếu hợp lệ, lưu tài khoản vào localStorage
  if (valid) {
    localStorage.setItem(user.value, pass.value);  // Dùng username làm key, pass làm value
    alert("Đăng ký thành công");
    toggle(e); // Chuyển sang form đăng nhập
  }
});
