import React, { useState } from "react";
import axios from "axios";

const AIChatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleChat = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/gemini/chat",
        {
          input,
        }
      );

      const botReply = response.data.reply; // Adjust based on the Gemini API response structure
      setMessages([
        ...messages,
        userMessage,
        { role: "bot", content: botReply },
      ]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      alert("Failed to get a response from the chatbot.");
    }

    setInput("");
  };

  return (
    <div>
      <h3>Gemini Chatbot</h3>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role === "user" ? "You:" : "Bot:"}</strong>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <button onClick={handleChat}>Send</button>
      </div>
    </div>
  );
};

export default AIChatbot;
