import React, { useState } from "react";
import { Mic, Send, X, Sparkles, Loader2, MicOff } from "lucide-react";
import api from "@/services/api";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback({ type: "error", msg: "Voice input not supported in this browser." });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => setText(event.results[0][0].transcript);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsLoading(true);
    setFeedback(null);
    try {
      const response = await api.post("/ai/generate-project", { prompt: text });
      setFeedback({ type: "success", msg: response.data.message });
      setText("");
      setTimeout(() => setIsOpen(false), 2000);
    } catch (error) {
      setFeedback({
        type: "error",
        msg: error.response?.data?.error || "Failed to process request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* FAB */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all"
          style={{ background: "#0052cc", color: "#fff" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#0065ff"; e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0052cc"; e.currentTarget.style.transform = "scale(1)"; }}
          title="AI Project Generator"
        >
          <Sparkles size={20} />
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div
          className="w-80 rounded shadow-2xl overflow-hidden fade-in"
          style={{ background: "#172b4d", border: "1px solid #253858" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid #253858" }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={15} style={{ color: "#4c9aff" }} />
              <span className="text-sm font-bold text-white">AI Assistant</span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase"
                style={{ background: "#0052cc", color: "#b3d4ff" }}
              >
                Beta
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded transition-all"
              style={{ color: "#6b778c" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#6b778c"; }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4">
            <p className="text-xs mb-3" style={{ color: "#97a0af" }}>
              Describe your project and I'll generate tasks, stages, and structure automatically.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Build an e-commerce app with user auth, product catalog, and checkout..."
                className="w-full h-24 px-3 py-2.5 text-sm rounded resize-none outline-none"
                style={{
                  background: "#253858",
                  border: "1px solid #344563",
                  color: "#fff",
                  caretColor: "#4c9aff",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#4c9aff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#344563"; }}
                disabled={isLoading}
              />

              {feedback && (
                <p
                  className="text-xs px-2 py-1.5 rounded"
                  style={{
                    background: feedback.type === "error" ? "#ffebe6" : "#e3fcef",
                    color: feedback.type === "error" ? "#bf2600" : "#006644",
                  }}
                >
                  {feedback.msg}
                </p>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleListen}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
                  style={{
                    background: isListening ? "rgba(222,53,11,0.15)" : "rgba(255,255,255,0.08)",
                    color: isListening ? "#ff8f73" : "#97a0af",
                    border: isListening ? "1px solid rgba(222,53,11,0.3)" : "1px solid transparent",
                  }}
                >
                  {isListening ? <MicOff size={13} /> : <Mic size={13} />}
                  {isListening ? "Listening..." : "Voice"}
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !text.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "#0052cc" }}
                  onMouseEnter={(e) => { if (!isLoading && text.trim()) e.currentTarget.style.background = "#0065ff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#0052cc"; }}
                >
                  {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  {isLoading ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
