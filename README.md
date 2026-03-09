# 🤖 Deep Agent — AI Learning Program

A sleek **Flask + LangChain + Gemini** web application showcasing 5 powerful AI features in a single-page interface. Built for learning and exploring what modern AI can do.

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.1-green?logo=flask&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-2.0_Flash-orange?logo=google&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-0.3-purple)

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **💬 AI Chat** | Multi-turn conversational chatbot with context memory (last 20 messages) |
| 2 | **📝 Text Summarizer** | Summarize long text in 3 styles — bullet points, paragraph, or TL;DR |
| 3 | **💻 Code Generator** | Generate production-quality code from natural language in any language |
| 4 | **🌐 Translator** | Translate text between languages with auto-detection and cultural notes |
| 5 | **🔍 Content Analyzer** | Analyze text for sentiment, topics, named entities, and readability |

---

## 🛠️ Tech Stack

- **Backend:** Flask, Python
- **AI/LLM:** Google Gemini 2.0 Flash via LangChain
- **Frontend:** Vanilla HTML, CSS, JavaScript (single-page app)
- **Markdown Rendering:** Client-side markdown-to-HTML conversion

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- A **Google Gemini API key** — get one free at [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Mukuloli/deep-agent.git
   cd deep-agent
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv venv

   # Windows
   venv\Scripts\activate

   # macOS / Linux
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up your API key**

   Copy the example env file and add your key:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env`:

   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

5. **Run the app**

   ```bash
   python app.py
   ```

   Open **http://localhost:5000** in your browser. 🎉

---

## 📁 Project Structure

```
deep-agent/
├── app.py              # Flask backend with all API routes
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variable template
├── .gitignore          # Git ignore rules
├── templates/
│   └── index.html      # Single-page HTML frontend
└── static/
    ├── script.js       # Frontend interactivity & API calls
    └── style.css       # Styling
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Serves the main page |
| `POST` | `/api/chat` | Send a chat message (`message`) |
| `POST` | `/api/chat/clear` | Clear chat history |
| `POST` | `/api/summarize` | Summarize text (`text`, `style`) |
| `POST` | `/api/code` | Generate code (`prompt`, `language`) |
| `POST` | `/api/translate` | Translate text (`text`, `source`, `target`) |
| `POST` | `/api/analyze` | Analyze text (`text`, `type`) |

All POST endpoints accept JSON and return `{ "response": "..." }` on success or `{ "error": "..." }` on failure.

---

## 📄 License

This project is open-source and available for learning purposes.

---

<p align="center">
  Built with ❤️ using Flask, LangChain & Google Gemini
</p>
