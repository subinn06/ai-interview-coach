import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { Send, CornerDownLeft } from "lucide-react";

interface AnswerEditorProps {
  onSubmit: (answer: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function AnswerEditor({
  onSubmit,
  isLoading = false,
  disabled = false,
}: AnswerEditorProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!text.trim() || isLoading || disabled) return;
    onSubmit(text.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || disabled}
          placeholder="Type your response here... (Press Ctrl + Enter to submit)"
          className="w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none font-sans leading-relaxed"
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-3 text-[11px] font-medium text-slate-400">
          <span>{text.length} chars</span>
          <span className="hidden sm:inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-500">
            <CornerDownLeft className="w-3 h-3" /> Ctrl + Enter
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading || disabled}
          isLoading={isLoading}
          className="flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Submit Response
        </Button>
      </div>
    </div>
  );
}
