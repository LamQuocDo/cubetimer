// Import thư viện công thức từ file có sẵn
import { CUBE_LIBRARY } from "./cube_library.js";


const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Chuyển đối tượng thư viện thành chuỗi để AI có thể đọc dữ liệu
const libraryContext = JSON.stringify(CUBE_LIBRARY);

// --- HIỆU ỨNG GÕ CHỮ MƯỢT MÀ & NHANH ---
function typeWriter(element, text, speed = 10) {
    let i = 0;
    element.textContent = ""; 
    
    function typing() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            chatWindow.scrollTop = chatWindow.scrollHeight;
            setTimeout(typing, speed);
        }
    }
    typing();
}

// --- PHẦN CHÀO HỎI BAN ĐẦU ---
window.onload = () => {
    const welcomeText = "Hello bro! Tôi là chuyên gia Rubik. Tôi có thể hỗ trợ gì cho bạn?";
    appendMessage("bot", welcomeText, true);
};

function appendMessage(role, text, isAnimated = false) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", role === "user" ? "user-msg" : "ai-msg");
    chatWindow.appendChild(msgDiv);
    
    if (isAnimated) {
        typeWriter(msgDiv, text);
    } else {
        msgDiv.textContent = text;
    }
    
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function handleChat() {
    const prompt = userInput.value.trim();
    if (!prompt) return;

    appendMessage("user", prompt);
    userInput.value = "";

    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("loading");
    loadingDiv.innerText = "...";
    chatWindow.appendChild(loadingDiv);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ 
                        text: `Bạn là chuyên gia về Rubik. 
                        Sử dụng THƯ VIỆN CÔNG THỨC sau để trả lời chính xác: ${libraryContext}. 
                        
                        QUY TẮC:
                        1. Chỉ trả lời câu hỏi liên quan đến Rubik và các khối giải đố puzzle. 
                        2. Ưu tiên lấy công thức từ thư viện được cung cấp.
                        3. Nếu người dùng hỏi chủ đề khác, hãy trả lời chính xác: 'Xin lỗi, tôi không hỗ trợ các câu hỏi ngoài phạm vi Rubik.' và tuyệt đối không giải thích gì thêm.` 
                    }]
                },
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        const data = await response.json();
        loadingDiv.remove();

        if (data.error) throw new Error(data.error.message);

        if (data.candidates && data.candidates[0].content) {
            const botResponse = data.candidates[0].content.parts[0].text;
            appendMessage("bot", botResponse, true); 
        } else {
            appendMessage("bot", "AI không phản hồi, thử lại nhé!", true);
        }
    } catch (error) {
        console.error("Lỗi:", error);
        if (loadingDiv) loadingDiv.remove();
        appendMessage("bot", "Lỗi: " + error.message, true);
    }
}

sendBtn.addEventListener("click", handleChat);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleChat();
});