import { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Camera, Save, Edit3, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: profile } = useProfile();
  
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
    username: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    dateOfBirth: "",
    gender: "",
    interests: [] as string[],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const interestOptions = [
    "Traditional Art", "Modern Art", "Digital Art", "Sculpture", "Photography",
    "Calligraphy", "Painting", "Drawing", "Crafts", "Pottery", "Jewelry Making"
  ];

  useEffect(() => {
    if (user && profile) {
      setFormData({
        displayName: profile.display_name || user.user_metadata?.display_name || "",
        username: profile.username || "",
        email: user.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        dateOfBirth: profile.date_of_birth || "",
        gender: profile.gender || "",
        interests: profile.interests || [],
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

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
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
    setIsLoading(true);
    try {
      // Here you would typically make API calls to update the profile
      // For now, we'll simulate the save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    return formData.displayName.trim() && formData.username.trim() && formData.email.trim();
  };

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
            disabled={!validateForm() || isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : "Save"}
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
                Username *
              </label>
              <div className="relative">
                <Edit3 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="username"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Only lowercase letters, numbers, and underscores</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="your@email.com"
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

        {/* Personal Details */}
        <section>
          <h3 className="text-sm font-semibold text-foreground mb-4">Personal Details</h3>
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

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </section>

        {/* Interests */}
        <section className="pb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">Art Interests</h3>
          <p className="text-sm text-muted-foreground mb-4">Select your favorite art forms to get personalized recommendations</p>
          
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.interests.includes(interest)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          
          {formData.interests.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {formData.interests.length} interest{formData.interests.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfileEdit;