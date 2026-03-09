import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

const ProfileDebug = () => {
  const { user } = useAuth();
  const { data: profile, isLoading, error } = useProfile();

  if (!user) {
    return <div className="p-4 bg-red-100 text-red-800 rounded">No user logged in</div>;
  }

  if (isLoading) {
    return <div className="p-4 bg-blue-100 text-blue-800 rounded">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <strong>Error:</strong> {error instanceof Error ? error.message : JSON.stringify(error)}
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Profile Debug Info:</h3>
      <div className="text-sm space-y-1">
        <div><strong>User ID:</strong> {user.id}</div>
        <div><strong>User Email:</strong> {user.email}</div>
        <div><strong>Profile Data:</strong></div>
        <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
          {profile ? JSON.stringify(profile, null, 2) : "No profile data"}
        </pre>
      </div>
    </div>
  );
};

export default ProfileDebug;