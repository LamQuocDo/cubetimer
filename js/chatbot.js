const API_KEY = "AIzaSyD6lB9sxTl3lLfig5rp_9pWvkPmb5ja3wY";

const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function appendMessage(role, text) {
  const msgDiv = document.createElement("div");

  // Thêm class chung và class riêng theo vai trò
  msgDiv.classList.add("message");
  if (role === "user") {
    msgDiv.classList.add("user-msg");
    msgDiv.innerText = text; // Người dùng không cần chữ "Bạn:" nữa cho đẹp
  } else {
    msgDiv.classList.add("ai-msg");
    msgDiv.innerText = text;
  }

  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function handleChat() {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  appendMessage("user", prompt);
  userInput.value = "";

  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("loading"); // Thêm class này
  loadingDiv.innerText = "Gemini đang suy nghĩ...";
  chatWindow.appendChild(loadingDiv);
  chatWindow.appendChild(loadingDiv);

  try {
    // --- ĐỔI SANG GEMINI 2.5 FLASH ---
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    loadingDiv.remove();

    if (data.error) {
      throw new Error(`[${data.error.code}] ${data.error.message}`);
    }

    if (data.candidates && data.candidates[0].content) {
      const botText = data.candidates[0].content.parts[0].text;
      appendMessage("bot", botText);
    } else {
      appendMessage("bot", "AI không trả về nội dung, thử lại nhé bro!");
    }
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    loadingDiv.innerText = "Lỗi: " + error.message;
  }
}

// Bắt sự kiện click
sendBtn.addEventListener("click", handleChat);

// Bắt sự kiện Enter
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleChat();
});
