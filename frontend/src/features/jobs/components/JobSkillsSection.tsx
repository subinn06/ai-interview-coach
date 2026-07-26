import Card from "@/components/ui/Card";
import { CheckCircle2, Star, Tag } from "lucide-react";

interface JobSkillsSectionProps {
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
}

export default function JobSkillsSection({
  requiredSkills,
  preferredSkills,
  keywords,
}: JobSkillsSectionProps) {
  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-base font-bold text-slate-900">Extracted Job Skills</h3>

      {/* required skills */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          Required Technical Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {requiredSkills.length > 0 ? (
            requiredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">None extracted</span>
          )}
        </div>
      </div>

      {/* preferred skills */}
      <div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Star className="w-4 h-4 text-purple-600" />
          Preferred / Bonus Skills
        </h4>
        <div className="flex flex-wrap gap-2">
          {preferredSkills.length > 0 ? (
            preferredSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">None specified</span>
          )}
        </div>
      </div>

      {/* key domain keywords */}
      {keywords.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-slate-500" />
            Core Domain Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw, idx) => (
              <span
                key={idx}
                className="text-xs font-medium px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
