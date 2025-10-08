// lấy thông tin từ html
const username = localStorage.getItem("currentUser");
const title = document.getElementById("name");
const email = localStorage.getItem("curentUser");
const showEmail = document.getElementById("email");


// thay đỏi tên người dùng
if(username){
    title.textContent = `Tên tài khoản: ${username}`; // nếu đã đăng nhập -> thay đổi tên người dùng
    showEmail.textContent = `Email: ${email}`; // thay đổi địa chỉ email
} else{
     // nếu chưa đăng nhập -> thông báo chưa đăng nhập và quay về trang home
    alert("Bạn chưa đăng nhập!");
    window.location.href = "../index.html";
}