// lấy thông tin từ html
const username = localStorage.getItem("currentUser");
const user = JSON.parse(localStorage.getItem(username));
const title = document.getElementById("name");
const showEmail = document.getElementById("email");

// thay đổi tên người dùng
if (username && user) {
  title.textContent = `Tên tài khoản: ${username}`;
  showEmail.textContent = `Email: ${user.email}`;
} else {
  alert("Bạn chưa đăng nhập!");
  window.location.href = "../index.html";
}

// khi bấm nút tra WCA
document.getElementById("sbm-btn").addEventListener("click", async () => {
  const id = document.getElementById("IDWCA").value.trim();
  if (!id) return alert("Nhập WCA ID!");

  try {
    const res = await fetch(`https://www.worldcubeassociation.org/api/v0/persons/${id}`);
    if (!res.ok) return alert("Không tìm thấy ID!");

    const data = await res.json();

    const records = data.personal_records;
    let rank = "Không có dữ liệu";

    if (records && records["333"] && records["333"].average) {
      rank = records["333"].average.world_rank;
    }

    document.getElementById("rankWCA").textContent =
      `Rank TG 3x3 trung bình: #${rank}`;

  } catch (err) {
    console.error(err);
    alert("Đã xảy ra lỗi khi lấy dữ liệu từ API!");
  }
});
