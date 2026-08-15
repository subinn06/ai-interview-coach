import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { useDeleteAccount } from "../hooks/useProfile";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getErrorMessage } from "@/lib/error-handler";

export default function DangerZone() {
  const navigate = useNavigate();
  const deleteMutation = useDeleteAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setConfirmInput("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleDelete = () => {
    if (confirmInput.trim().toUpperCase() !== "DELETE") {
      toast.error('Please type "DELETE" to confirm account deletion.');
      return;
    }

    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Account permanently deleted.");
        navigate("/login");
      },
      onError: (err: unknown) => {
        toast.error(getErrorMessage(err));
      },
    });
  };

  return (
    <Card className="p-6 space-y-4 border-rose-200 bg-rose-50/20">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-rose-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          Danger Zone
        </h3>
        <p className="text-xs text-slate-600">
          Permanently remove your candidate profile, uploaded resumes, job analyses, and AI interview records.
        </p>
      </div>

      <div className="pt-2">
        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          variant="secondary"
          className="border-rose-300 text-rose-700 hover:bg-rose-100 flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4 text-rose-600" />
          Delete Candidate Account
        </Button>
      </div>

      {/* confirmation modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="danger-zone-modal-title"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 id="danger-zone-modal-title" className="text-lg font-bold text-slate-900">
                Confirm Permanent Account Deletion
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This action <strong className="text-rose-600">cannot be undone</strong>. All your resumes, job descriptions, interview answer histories, and coaching feedback report cards will be permanently erased.
            </p>

            <div className="space-y-1.5 pt-2">
              <label htmlFor="delete-confirm-input" className="block text-xs font-semibold text-slate-700">
                Type <span className="font-mono font-bold text-rose-600">DELETE</span> to confirm:
              </label>
              <input
                id="delete-confirm-input"
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  setConfirmInput("");
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white"
                onClick={handleDelete}
                isLoading={deleteMutation.isPending}
                loadingText="Deleting account..."
                disabled={confirmInput.trim().toUpperCase() !== "DELETE"}
              >
                Confirm & Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
