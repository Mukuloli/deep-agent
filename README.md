# 🤖🧠 Deep Agent

A **Flask + LangChain + Gemini** application showcasing 5 powerful AI features in a single-page interface.

> Looking to learn how LLMs, prompt engineering, and LangChain work together? **Deep Agent** is a hands-on learning program that brings it all to life.

## Quick Install

```bash
pip install -r requirements.txt
```

## 🤔 What is this?

Deep Agent is a learning-focused web application that demonstrates how to build AI-powered features using **Google's Gemini 2.0 Flash** model through **LangChain**. Rather than a single chatbot, it showcases five distinct AI capabilities — each with tailored prompts, temperature settings, and output parsing — so you can see how the same LLM backbone powers very different experiences.

```
deep-agent/
├── app.py              # Flask backend — all 5 AI feature routes
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variable template
├── templates/
│   └── index.html      # Single-page frontend
└── static/
    ├── script.js       # Frontend interactivity & API calls
    └── style.css       # Styling & animations
```

## ✨ Features

### 💬 AI Chat
Multi-turn conversational chatbot with **context memory** (retains last 20 messages). Uses `MessagesPlaceholder` for seamless conversation history.

### 📝 Text Summarizer
Summarize long text in **3 styles**:
- `bullets` — structured bullet points
- `paragraph` — concise paragraph
- `tldr` — 1-2 sentence TL;DR + key takeaways

### 💻 Code Generator
Generate **production-quality code** from natural language prompts. Supports any programming language — Python, JavaScript, Rust, Go, and more.

### 🌐 Translator
Translate text between languages with **auto-detection** and cultural/contextual notes. Supports all major languages.

### 🔍 Content Analyzer
Analyze text for:
- **Sentiment & Tone** — emotional analysis with 1-10 rating
- **Named Entities** — people, places, organizations, dates
- **Key Topics** — ranked with confidence percentages
- **Readability** — reading level and complexity

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- A **Gemini API Key** — get one free at [Google AI Studio](https://aistudio.google.com/apikey)

### Setup

```bash
# Clone the repo
git clone https://github.com/Mukuloli/deep-agent.git
cd deep-agent

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure your API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Run

```bash
python app.py
```

The app will be live at **http://localhost:5000** 🚀

## 🔌 API Reference

All endpoints accept `POST` with JSON body and return `{ "response": "..." }`.

| Endpoint | Params | Description |
|----------|--------|-------------|
| `/api/chat` | `message` | Send a chat message |
| `/api/chat/clear` | — | Clear conversation history |
| `/api/summarize` | `text`, `style` | Summarize text |
| `/api/code` | `prompt`, `language` | Generate code |
| `/api/translate` | `text`, `source`, `target` | Translate text |
| `/api/analyze` | `text`, `type` | Analyze content |

## 📦 Dependencies

```
flask==3.1.0
langchain==0.3.20
langchain-google-genai==2.1.3
python-dotenv==1.1.0
markdown==3.7
```

## 📖 Resources

- [LangChain Docs](https://docs.langchain.com/) — LangChain documentation
- [Gemini API](https://ai.google.dev/) — Google Gemini API reference
- [Flask Docs](https://flask.palletsprojects.com/) — Flask documentation

## 💁 Contributing

Contributions are welcome! Whether it's a new AI feature, improved UI, or better documentation — feel free to open an issue or submit a PR.

---

<p align="center">
  Built with ❤️ using Flask, LangChain & Google Gemini
</p>
