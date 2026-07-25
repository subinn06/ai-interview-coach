import { X } from "lucide-react";
import Sidebar from "./Sidebar";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* drawer content */}
      <div className="relative flex-1 max-w-xs w-full bg-slate-900 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar onItemClick={onClose} />
      </div>
    </div>
  );
}
