// ── SELECTORS ──
const chatList = document.querySelector(".chat-list");
const toggleThemeButton = document.getElementById("toggle-theme-button");
const deleteChatButton = document.getElementById("delete-chat-button");
const newChatButton = document.getElementById("new-chat-button");
const typingInput = document.getElementById("typing-input");
const sendButton = document.getElementById("send-button");
const suggestionCards = document.querySelectorAll(".suggestion-card");

let userMessage = null;
let isResponseGenerating = false;

// ── API CONFIGURATION ──
//const API_KEY = YOUR_API_KEY_HERE; // 🔑 key is hidden in api/chat.js, not exposed to frontend
const API_URL = "/api/chat";

// ── LOAD SAVED DATA ──
const loadLocalStorageData = () => {
    const savedChats = localStorage.getItem("savedChats");
    const isLightMode = localStorage.getItem("themeColor") === "light_mode";
    document.body.classList.toggle("light-mode", isLightMode);
    document.body.classList.toggle("dark-mode", !isLightMode);
    updateThemeButton(isLightMode);
    chatList.innerHTML = savedChats || "";
    document.body.classList.toggle("hide-header", !!savedChats);
    chatList.scrollTo(0, chatList.scrollHeight);
};
loadLocalStorageData();

function updateThemeButton(isLight) {
    toggleThemeButton.querySelector(".material-symbols-rounded").innerText = isLight ? "light_mode" : "dark_mode";
    toggleThemeButton.querySelector(".btn-label").innerText = isLight ? "Light theme" : "Dark theme";
}

// ── AUTO RESIZE TEXTAREA ──
typingInput.addEventListener("input", () => {
    typingInput.style.height = "auto";
    typingInput.style.height = Math.min(typingInput.scrollHeight, 200) + "px";
});

// ── CREATE MESSAGE ELEMENT ──
function createMessageElement(content, ...classes) {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

// ── FORMAT RESPONSE TEXT (full markdown) ──
function formatApiResponse(text) {
    // H3 headings: ### Title
    text = text.replace(/^### (.+)$/gm, '<h3 class="resp-h3">$1</h3>');
    // H2 headings: ## Title
    text = text.replace(/^## (.+)$/gm, '<h2 class="resp-h2">$1</h2>');
    // H1 headings: # Title
    text = text.replace(/^# (.+)$/gm, '<h1 class="resp-h1">$1</h1>');
    // Bold: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    text = text.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
    // Code blocks: ```code```
    text = text.replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre class="resp-pre"><code>$1</code></pre>');
    // Inline code: `code`
    text = text.replace(/`([^`]+)`/g, '<code class="resp-code">$1</code>');
    // Unordered list items: * item or - item or + item
    text = text.replace(/^[\*\-\+] (.+)$/gm, '<li>$1</li>');
    // Wrap consecutive <li> in <ul>
    text = text.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul class="resp-ul">${match}</ul>`);
    // Numbered list: 1. item
    text = text.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    // Horizontal rule: ---
    text = text.replace(/^---$/gm, '<hr class="resp-hr">');
    // Newlines to <br> (but not inside pre blocks)
    text = text.replace(/(?<!<\/pre>)\n(?!<pre)/g, '<br>');

    return text;
}

// ── TYPING EFFECT ──
function showTypingEffect(text, textElement, incomingMessageDiv) {
    const words = text.split(" ");
    let index = 0;
    const interval = setInterval(() => {
        textElement.innerHTML += (index === 0 ? "" : " ") + words[index++];
        chatList.scrollTo(0, chatList.scrollHeight);
        if (index >= words.length) {
            clearInterval(interval);
            isResponseGenerating = false;
            localStorage.setItem("savedChats", chatList.innerHTML);
        }
    }, 30);
}

// ── CALL GROQ API ──
async function generateAPIResponse(incomingMessageDiv) {
    const textElement = incomingMessageDiv.querySelector(".text");
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 1024
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Something went wrong");
        const raw = data?.choices[0]?.message?.content || "";
        showTypingEffect(formatApiResponse(raw), textElement, incomingMessageDiv);
    } catch (error) {
        isResponseGenerating = false;
        textElement.innerText = error.message;
        textElement.classList.add("error");
    } finally {
        incomingMessageDiv.classList.remove("loading");
    }
}

// ── SHOW LOADING ──
function showLoadingAnimation() {
    const html = `
        <div class="message-content">
            <div class="avatar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="18" height="18">
                    <path d="M14 2C14 2 14.5 8.5 17.5 11.5C20.5 14.5 27 14 27 14C27 14 20.5 13.5 17.5 16.5C14.5 19.5 14 26 14 26C14 26 13.5 19.5 10.5 16.5C7.5 13.5 1 14 1 14C1 14 7.5 14.5 10.5 11.5C13.5 8.5 14 2 14 2Z" fill="white"/>
                </svg>
            </div>
            <div style="flex:1">
                <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                </div>
                <p class="text"></p>
            </div>
        </div>
        <div class="message-actions">
            <button onclick="copyMessage(this)" class="action-icon material-symbols-rounded" title="Copy">content_copy</button>
        </div>`;
    const div = createMessageElement(html, "incoming", "loading");
    chatList.appendChild(div);
    chatList.scrollTo(0, chatList.scrollHeight);
    generateAPIResponse(div);
}

// ── COPY MESSAGE ──
function copyMessage(btn) {
    const text = btn.closest(".message").querySelector(".text").innerText;
    navigator.clipboard.writeText(text);
    btn.innerText = "done";
    setTimeout(() => btn.innerText = "content_copy", 1500);
}

// ── SEND MESSAGE ──
function handleOutgoingChat() {
    const val = typingInput.value.trim();
    if (!val || isResponseGenerating) return;
    userMessage = val;
    isResponseGenerating = true;

    const html = `<div class="message-content"><p class="text"></p></div>`;
    const outgoingDiv = createMessageElement(html, "outgoing");
    outgoingDiv.querySelector(".text").innerText = userMessage;
    chatList.appendChild(outgoingDiv);

    typingInput.value = "";
    typingInput.style.height = "auto";
    chatList.scrollTo(0, chatList.scrollHeight);
    document.body.classList.add("hide-header");
    setTimeout(showLoadingAnimation, 400);
}

// ── EVENT LISTENERS ──
sendButton.addEventListener("click", handleOutgoingChat);

typingInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

suggestionCards.forEach(card => {
    card.addEventListener("click", () => {
        userMessage = card.dataset.prompt;
        typingInput.value = userMessage;
        handleOutgoingChat();
    });
});

newChatButton.addEventListener("click", () => {
    if (confirm("Start a new chat? Current chat will be cleared.")) {
        localStorage.removeItem("savedChats");
        loadLocalStorageData();
        document.body.classList.remove("hide-header");
    }
});

toggleThemeButton.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode", !isLight);
    localStorage.setItem("themeColor", isLight ? "light_mode" : "dark_mode");
    updateThemeButton(isLight);
});

deleteChatButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all messages?")) {
        localStorage.removeItem("savedChats");
        loadLocalStorageData();
        document.body.classList.remove("hide-header");
    }
});