"""
Deep Agent — Learning Program
A Flask + LangChain + Gemini application showcasing 5 powerful AI features.
"""

import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

app = Flask(__name__)

# ── Gemini Model via LangChain ──────────────────────────────────────────────
def get_llm(temperature=0.7):
    """Create a LangChain ChatGoogleGenerativeAI instance."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        raise ValueError("Please set your GEMINI_API_KEY in the .env file")
    return ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=api_key,
        temperature=temperature,
        convert_system_message_to_human=True,
    )


# ── In-memory Chat History ──────────────────────────────────────────────────
chat_history: list = []


# ── Pages ───────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")


# ── Feature 1: AI Chat ─────────────────────────────────────────────────────
@app.route("/api/chat", methods=["POST"])
def chat():
    """Multi-turn conversational chat using LangChain message history."""
    global chat_history
    data = request.json
    user_msg = data.get("message", "")
    if not user_msg:
        return jsonify({"error": "Message is required"}), 400

    try:
        llm = get_llm(temperature=0.8)

        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=(
                "You are Deep Agent, a friendly and knowledgeable AI assistant. "
                "You are powered by the Gemini model via LangChain. "
                "Be helpful, concise, and engaging. Use markdown formatting in your responses."
            )),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ])

        chain = prompt | llm | StrOutputParser()

        response = chain.invoke({
            "history": chat_history,
            "input": user_msg,
        })

        # Store conversation history
        chat_history.append(HumanMessage(content=user_msg))
        chat_history.append(AIMessage(content=response))

        # Limit history to last 20 messages
        if len(chat_history) > 20:
            chat_history = chat_history[-20:]

        return jsonify({"response": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/chat/clear", methods=["POST"])
def clear_chat():
    """Clear the chat history."""
    global chat_history
    chat_history = []
    return jsonify({"status": "Chat history cleared"})


# ── Feature 2: Text Summarizer ──────────────────────────────────────────────
@app.route("/api/summarize", methods=["POST"])
def summarize():
    """Summarize long text into structured bullet points."""
    data = request.json
    text = data.get("text", "")
    style = data.get("style", "bullets")  # bullets, paragraph, tldr

    if not text:
        return jsonify({"error": "Text is required"}), 400

    style_instructions = {
        "bullets": "Summarize into clear, concise bullet points. Use markdown bullet lists.",
        "paragraph": "Write a concise summary paragraph that captures all key points.",
        "tldr": "Give a very brief TL;DR in 1-2 sentences, then list 3-5 key takeaways.",
    }

    try:
        llm = get_llm(temperature=0.3)

        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=(
                "You are an expert text summarizer. "
                f"{style_instructions.get(style, style_instructions['bullets'])} "
                "Preserve important details, names, numbers, and conclusions. "
                "Use markdown formatting."
            )),
            ("human", "Please summarize the following text:\n\n{text}"),
        ])

        chain = prompt | llm | StrOutputParser()
        response = chain.invoke({"text": text})

        return jsonify({"response": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Feature 3: Code Generator ──────────────────────────────────────────────
@app.route("/api/code", methods=["POST"])
def generate_code():
    """Generate code in any programming language from a natural language prompt."""
    data = request.json
    prompt_text = data.get("prompt", "")
    language = data.get("language", "python")

    if not prompt_text:
        return jsonify({"error": "Prompt is required"}), 400

    try:
        llm = get_llm(temperature=0.4)

        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=(
                f"You are an expert {language} programmer. "
                "Generate clean, well-commented, production-quality code. "
                "Always include:\n"
                "1. A brief explanation of the approach\n"
                "2. The complete code in a markdown code block\n"
                "3. Example usage or how to run it\n"
                "Use markdown formatting throughout."
            )),
            ("human", "Write {language} code for: {prompt}"),
        ])

        chain = prompt | llm | StrOutputParser()
        response = chain.invoke({"prompt": prompt_text, "language": language})

        return jsonify({"response": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Feature 4: Translator ──────────────────────────────────────────────────
@app.route("/api/translate", methods=["POST"])
def translate():
    """Translate text between languages."""
    data = request.json
    text = data.get("text", "")
    source_lang = data.get("source", "Auto-Detect")
    target_lang = data.get("target", "English")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    try:
        llm = get_llm(temperature=0.2)

        source_instruction = (
            "Auto-detect the source language"
            if source_lang == "Auto-Detect"
            else f"The source language is {source_lang}"
        )

        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=(
                "You are a professional multilingual translator. "
                f"{source_instruction}. Translate the text to {target_lang}. "
                "Provide:\n"
                "1. The detected source language (if auto-detect)\n"
                "2. The translation\n"
                "3. Any cultural or contextual notes if relevant\n"
                "Use markdown formatting."
            )),
            ("human", "Translate the following:\n\n{text}"),
        ])

        chain = prompt | llm | StrOutputParser()
        response = chain.invoke({"text": text})

        return jsonify({"response": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Feature 5: Content Analyzer ────────────────────────────────────────────
@app.route("/api/analyze", methods=["POST"])
def analyze():
    """Analyze text for tone, topics, entities, and insights."""
    data = request.json
    text = data.get("text", "")
    analysis_type = data.get("type", "full")  # full, sentiment, entities, topics

    if not text:
        return jsonify({"error": "Text is required"}), 400

    type_instructions = {
        "full": (
            "Perform a comprehensive analysis including:\n"
            "- **Sentiment & Tone**: Overall sentiment, emotional tone\n"
            "- **Key Topics**: Main subjects discussed\n"
            "- **Named Entities**: People, places, organizations, dates\n"
            "- **Key Insights**: Important takeaways\n"
            "- **Readability**: Reading level and complexity"
        ),
        "sentiment": "Analyze the sentiment and emotional tone in detail. Rate positivity/negativity on a scale of 1-10.",
        "entities": "Extract all named entities: people, organizations, places, dates, monetary values, and technical terms.",
        "topics": "Identify and rank the main topics discussed. For each topic, provide a confidence percentage.",
    }

    try:
        llm = get_llm(temperature=0.3)

        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=(
                "You are an expert text analyst. "
                f"{type_instructions.get(analysis_type, type_instructions['full'])} "
                "Use markdown formatting with headers, bullet points, and bold text."
            )),
            ("human", "Analyze the following text:\n\n{text}"),
        ])

        chain = prompt | llm | StrOutputParser()
        response = chain.invoke({"text": text})

        return jsonify({"response": response})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Run ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n🚀 Deep Agent is running at http://localhost:5000\n")
    app.run(debug=True, port=5000)
