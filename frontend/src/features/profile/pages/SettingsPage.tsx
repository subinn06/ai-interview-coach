import { useState } from "react";
import { Sliders, KeyRound, AlertTriangle } from "lucide-react";
import InterviewPreferences from "../components/InterviewPreferences";
import SecuritySettings from "../components/SecuritySettings";
import DangerZone from "../components/DangerZone";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"preferences" | "security" | "danger">(
    "preferences"
  );

  const tabs = [
    { id: "preferences", label: "Interview Preferences", icon: Sliders },
    { id: "security", label: "Security & Password", icon: KeyRound },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ] as const;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Application Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize AI interview defaults, change credentials, and manage account security.
        </p>
      </div>

      {/* tabs navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* active tab content */}
      <div className="pt-2">
        {activeTab === "preferences" && <InterviewPreferences />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "danger" && <DangerZone />}
      </div>
    </div>
  );
}
