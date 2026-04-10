import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function ChatWindow({ friend }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    api.get(`/chat/private/${friend._id}`).then((res) => setMessages(res.data));
  }, [friend._id]);

  useEffect(() => {
    if (!socket) return;
    socket.on("chat:message", (msg) => setMessages((prev) => [...prev, msg]));
    return () => socket.off("chat:message");
  }, [socket]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    socket.emit("chat:private", { senderId: user.id, receiverId: friend._id, content: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 font-semibold text-white">{friend.name}</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div key={m._id} className={`flex ${m.sender._id === user.id ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${m.sender._id === user.id ? "bg-blue-600 text-white" : "bg-gray-600 text-white"}`}>
              <p>{m.content}</p>
              <p className="text-xs opacity-60 mt-1">{new Date(m.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 flex gap-2 bg-gray-700">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 bg-gray-600 text-white rounded-lg px-3 py-2 text-sm outline-none"
        />
        <button onClick={send} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">Send</button>
      </div>
    </div>
  );
}
