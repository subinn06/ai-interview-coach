import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { Send, CornerDownLeft, AlertCircle, RotateCcw } from "lucide-react";

interface AnswerEditorProps {
  onSubmit: (answer: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function AnswerEditor({
  onSubmit,
  isLoading = false,
  disabled = false,
  error = null,
  onRetry,
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
      {error && (
        <div
          role="alert"
          className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-sm text-red-700 font-medium animate-fade-in"
        >
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="truncate">{error} — Your answer is preserved below.</span>
          </div>
          {onRetry && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={onRetry}
              isLoading={isLoading}
              className="flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Submission
            </Button>
          )}
        </div>
      )}

      <div className="relative">
        <textarea
          ref={textareaRef}
          id="candidate-answer-input"
          aria-label="Type your response"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || disabled}
          placeholder="Type your response here... (Press Ctrl + Enter to submit)"
          className={`w-full px-4 py-3 text-sm bg-white border ${
            error ? "border-red-300 ring-1 ring-red-300" : "border-slate-200"
          } rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none font-sans leading-relaxed`}
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-3 text-[11px] font-medium text-slate-400">
          <span>{text.length} chars</span>
          <span className="hidden sm:inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-slate-500">
            <CornerDownLeft className="w-3 h-3" /> Ctrl + Enter
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {error && onRetry && (
          <Button
            type="button"
            variant="secondary"
            onClick={onRetry}
            disabled={isLoading || disabled}
            isLoading={isLoading}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            Retry
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading || disabled}
          isLoading={isLoading}
          loadingText="Evaluating response..."
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {error ? "Re-submit Response" : "Submit Response"}
        </Button>
      </div>
    </div>
  );
}
