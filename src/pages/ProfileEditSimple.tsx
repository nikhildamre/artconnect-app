import { useState, useEffect } from "react";
import { ArrowLeft, User, Phone, MapPin, Camera, Save, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const ProfileEditSimple = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to edit your profile");
      navigate("/auth");
      return;
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    displayName: "",
    phone: "",
    location: "",
    bio: "",
  });
  
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      setFormData({
        displayName: profile.display_name || user.user_metadata?.display_name || "",
        phone: profile.phone_number || "",
        location: profile.location || "",
        bio: profile.bio || "",
      });
      setProfileImage(profile.avatar_url || null);
    }
  }, [user, profile]);

  // Don't render anything if user is not logged in (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">Authentication Required</h2>
          <p className="text-sm text-muted-foreground">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Prepare the update data according to the actual database schema
      const updateData: any = {};
      
      if (formData.displayName.trim()) {
        updateData.display_name = formData.displayName.trim();
      }
      if (formData.bio.trim()) {
        updateData.bio = formData.bio.trim();
      }
      if (formData.location.trim()) {
        updateData.location = formData.location.trim();
      }
      if (formData.phone.trim()) {
        updateData.phone_number = formData.phone.trim();
      }
      if (profileImage) {
        updateData.avatar_url = profileImage;
      }

      console.log("User:", user);
      console.log("Updating profile with:", updateData);
      
      if (Object.keys(updateData).length === 0) {
        toast.error("Please make some changes before saving");
        return;
      }
      
      await updateProfile.mutateAsync(updateData);
      
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Profile update error:", error);
      
      // Better error handling
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else if (typeof error === 'object' && error !== null) {
        // Handle Supabase errors
        const supabaseError = error as any;
        console.error("Supabase error:", supabaseError);
        if (supabaseError.message) {
          errorMessage = supabaseError.message;
        } else if (supabaseError.error_description) {
          errorMessage = supabaseError.error_description;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const validateForm = () => {
    return formData.displayName.trim();
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="rounded-full bg-secondary/50 p-2 hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Edit Profile</h1>
              <p className="text-sm text-muted-foreground">Update your information</p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={!validateForm() || updateProfile.isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Save className="h-4 w-4" />
            {updateProfile.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-6 space-y-8">
        {/* Profile Picture */}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-4">Profile Picture</h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-muted overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h4 className="text-sm font-medium text-foreground">Change Photo</h4>
              <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </section>

        {/* Basic Information */}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Display Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange("displayName", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your display name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About You */}
        <section className="pb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">About You</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Tell us about yourself..."
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.bio.length}/200 characters</p>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfileEditSimple;