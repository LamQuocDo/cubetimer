import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Cấu hình API (Thay mã của bạn vào đây)
const API_KEY = "AIzaSyD6lB9sxTl3lLfig5rp_9pWvkPmb5ja3wY";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// 2. Hàm hiển thị tin nhắn lên màn hình
function appendMessage(role, text) {
  const msgDiv = document.createElement("div");
  msgDiv.style.padding = "10px";
  msgDiv.style.borderRadius = "8px";
  msgDiv.style.maxWidth = "70%";
  
  if (role === "user") {
    msgDiv.style.alignSelf = "flex-end";
    msgDiv.style.backgroundColor = "#e1f5fe";
    msgDiv.innerText = `Bạn: ${text}`;
  } else {
    msgDiv.style.alignSelf = "flex-start";
    msgDiv.style.backgroundColor = "#f1f1f1";
    msgDiv.innerText = `Gemini: ${text}`;
  }
  
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight; // Tự động cuộn xuống dưới
}

// 3. Hàm xử lý gửi tin nhắn
async function handleChat() {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  // Hiển thị tin nhắn của người dùng
  appendMessage("user", prompt);
  userInput.value = ""; // Xóa ô nhập

  // Hiển thị trạng thái "Đang trả lời..."
  appendMessage("bot", "...");

  try {
    // Gọi API Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Xóa dòng "..." cuối cùng và thay bằng câu trả lời thật
    chatWindow.lastChild.innerText = `Gemini: ${text}`;
  } catch (error) {
    console.error("Lỗi API:", error);
    chatWindow.lastChild.innerText = "Gemini: Xin lỗi, đã có lỗi xảy ra.";
  }
}

// 4. Lắng nghe sự kiện click nút hoặc nhấn Enter
sendBtn.addEventListener("click", handleChat);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleChat();
});