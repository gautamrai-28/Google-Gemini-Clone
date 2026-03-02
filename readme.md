# Google Gemini Clone 🤖✨

A modern, fully responsive **Google Gemini AI Chat Clone** built with pure HTML, CSS, and JavaScript. Features a sleek 2025 Gemini UI redesign powered by the **Groq API** (LLaMA 3.3 70B model).

---

## 🖥️ Live Demo

🔗 [View Live]((https://google-gemini-clone-rouge.vercel.app/)) 

---

## ✨ Features

- 🎨 **Modern Gemini 2025 UI** — Redesigned to match the latest Google Gemini interface
- 🌗 **Dark / Light Mode** — Toggle between themes with smooth transitions
- 💬 **Real-time AI Responses** — Powered by Groq API with LLaMA 3.3 70B model
- ⌨️ **Typing Effect** — Responses appear word by word just like the real Gemini
- 📋 **Copy Messages** — One-click copy for any AI response
- 🗂️ **Chat History** — Conversations saved in localStorage
- 🗑️ **Clear Chats** — Delete all messages with one click
- 📱 **Fully Responsive** — Works on mobile, tablet and desktop
- 🔒 **Secure API Key** — Key stored in Vercel Environment Variables, never exposed
- 💡 **Suggestion Cards** — Quick prompt suggestions on the home screen
- ↵ **Enter to Send** — Press Enter to send, Shift+Enter for new line
- 📝 **Markdown Rendering** — Supports bold, italic, headings, code blocks, lists

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Structure |
| CSS3 | Styling & Animations |
| JavaScript (ES6+) | Functionality |
| Groq API | AI responses (LLaMA 3.3 70B) |
| Vercel Serverless Functions | Secure API key handling |
| localStorage | Chat persistence |

---

## 📁 Project Structure

```
Google-Gemini-Clone/
├── api/
│   └── chat.js          # Vercel serverless function (API key protection)
├── images/
│   ├── gemin.webp        # Gemini logo
│   └── user.webp         # User avatar
├── index.html            # Main HTML file
├── style.css             # All styles
├── script.js             # All JavaScript logic
├── .gitignore            # Git ignore rules
├── requirements.txt      # Project dependencies info
└── README.md             # This file
```

---

## 🚀 Getting Started Locally

### Prerequisites
- A modern web browser
- A free [Groq API key](https://console.groq.com)
- [VS Code](https://code.visualstudio.com/) with Live Server extension *(recommended)*

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/Google-Gemini-Clone.git
cd Google-Gemini-Clone
```

**2. Add your API key**

For local development, temporarily add your key in `script.js`:
```js
const API_KEY = "gsk_your_groq_api_key_here";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
```
> ⚠️ Remember to remove it before pushing to GitHub!

**3. Run locally**

Open `index.html` with Live Server in VS Code, or simply open it in your browser.

---

## ☁️ Deployment on Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Google Gemini Clone"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Google-Gemini-Clone.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Select your **Google-Gemini-Clone** repository
4. Click **"Deploy"**

### Step 3 — Add Environment Variable
1. Go to your Vercel project → **Settings → Environment Variables**
2. Click **Add New**
3. Name: `API_KEY`
4. Value: `gsk_your_groq_api_key_here`
5. Click **Save** then **Redeploy**

---

## 🔑 Getting a Free Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free (no credit card needed)
3. Click **"API Keys"** → **"Create API Key"**
4. Copy and save your key securely

**Free tier limits:**
- 14,400 requests/day
- 30 requests/minute
- Completely free

---



## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest new features
- 🔧 Submit pull requests

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [Google Gemini](https://gemini.google.com) — UI Design Inspiration
- [Groq](https://groq.com) — Free and fast AI API
- [Meta LLaMA](https://llama.meta.com) — The underlying AI model
- [Google Fonts](https://fonts.google.com) — Material Symbols & Google Sans

---

⭐ **If you found this project helpful, please give it a star!** ⭐
