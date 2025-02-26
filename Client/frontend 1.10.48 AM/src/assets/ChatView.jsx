import { useState, useRef, useEffect, useContext } from "react";
import Message from "./Message";
import { ChatContext } from "../context/chatContext";
import Thinking from "./Thinking";
import { MdSend } from "react-icons/md";
import { replaceProfanities } from "no-profanity";
import axios from 'axios';

const template = [
  {
    title: "How to use",
    prompt: "Welcome to our Health Care Chatbot! Simply enter your symptoms in the chat box, and our intelligent assistant will provide possible diagnoses and helpful information. Please note, this tool is for informational purposes and not a substitute for professional medical advice. For serious concerns, consult a healthcare provider. We're here to assist you 24/7.",
  },
];

const ChatView = ({ thm }) => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [selected, setSelected] = useState(false);

  const [messages, addMessage] = useContext(ChatContext);
  const flagRef = useRef(1);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const slowScrollToBottom = () => {
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      const scrollStep = 5;
      const scrollInterval = setInterval(() => {
        if (chatContainer.scrollTop + chatContainer.clientHeight < chatContainer.scrollHeight) {
          chatContainer.scrollTop += scrollStep;
        } else {
          clearInterval(scrollInterval);
        }
      }, 16);
    }
  };

  const updateMessage = async (newValue, ai = false) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
    };
    await addMessage(newMsg);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const cleanPrompt = replaceProfanities(formValue);
    
    setThinking(true);
    setFormValue("");
    await updateMessage(cleanPrompt, false);

    try {
      const response = await axios.post('https://api-inference.huggingface.co/models/DATEXIS/CORe-clinical-diagnosis-prediction', {
        inputs: cleanPrompt,
      }, {
        headers: { Authorization: `Bearer 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` }
      });
     
      const aiResponse = response.data[0].generated_text;
      console.log(aiResponse);
      if (aiResponse) {
        await updateMessage(aiResponse, true);
      }
    } catch (err) {
      console.error('Error:', err.message);
      window.alert(`Error: ${err.message}. Please try again later.`);
    }

    setThinking(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  useEffect(() => {
    slowScrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const Compo = () => {
    return messages.map((message, index) => (
      <Message key={index} message={{ ...message }} />
    ));
  };

  return (
    <main className="w-[100vw] relative flex flex-col h-screen p-2 overflow-hidden dark:bg-light-grey">
      <section className="chat-container flex flex-col flex-grow w-full px-4 overflow-y-scroll sm:px-10 md:px-32 my-4">
        { 
          messages.length ? (
            <Compo />
          ) : (
            <div className="flex my-2 w-full">
              <div className="w-full">
                <ul className="gap-4 w-full mt-8">
                  {template.map((item, index) => (
                    <li key={index} className="p-6 border rounded-lg border-slate-300 hover:border-slate-500">
                      <p className="text-base font-semibold text-lg">{item.title}</p>
                      <p className="text-md">{item.prompt}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        }
        {thinking && <Thinking />}
        <span ref={messagesEndRef}></span>
      </section>
      <form className="flex flex-col px-10 mb-2 md:px-32 join sm:flex-row" onSubmit={sendMessage}>
        <div className="flex items-stretch justify-between w-full">
          <textarea
            ref={inputRef}
            className="w-full p-2 border rounded-lg dark:bg-light-grey"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter symptoms"
            rows="3"
            disabled={flagRef.current === 0}
          />
          <button type="submit" className="join-item btn" disabled={formValue.trim().length === 0}>
            <MdSend size={30} />
          </button>
        </div>
      </form>
    </main>
  );
};

export default ChatView;
