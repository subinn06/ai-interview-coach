import { useProfile } from "../hooks/useProfile";
import ProfileHeader from "../components/ProfileHeader";
import ProfileForm from "../components/ProfileForm";
import Loader from "@/components/ui/Loader";

export default function ProfilePage() {
  const { data: user, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Candidate Profile
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your personal information and candidate credentials.
        </p>
      </div>

      <ProfileHeader user={user || null} />
      <ProfileForm user={user || null} />
    </div>
  );
}
