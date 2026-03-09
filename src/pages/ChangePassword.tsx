import { useState } from "react";
import { ArrowLeft, Lock, Eye, EyeOff, Shield, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to change your password");
      navigate("/auth");
      return;
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(formData.newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!passwordValidation.isValid) {
      toast.error("Please ensure your new password meets all requirements");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically make an API call to change the password
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Password changed successfully!");
      navigate("/settings");
    } catch (error) {
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-4 py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="rounded-full bg-secondary/50 p-2 hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">Change Password</h1>
            <p className="text-sm text-muted-foreground">Update your account password</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Security Notice */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Security Notice</h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Choose a strong password to keep your account secure. We recommend using a unique password that you don't use elsewhere.
            </p>
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Current Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="mt-3 p-3 rounded-xl bg-muted/50">
                <h4 className="text-sm font-medium text-foreground mb-2">Password Requirements:</h4>
                <div className="space-y-1">
                  {[
                    { key: 'minLength', label: 'At least 8 characters' },
                    { key: 'hasUpperCase', label: 'One uppercase letter' },
                    { key: 'hasLowerCase', label: 'One lowercase letter' },
                    { key: 'hasNumbers', label: 'One number' },
                    { key: 'hasSpecialChar', label: 'One special character' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        passwordValidation[key as keyof typeof passwordValidation] 
                          ? 'bg-green-500' 
                          : 'bg-muted-foreground'
                      }`} />
                      <span className={`text-xs ${
                        passwordValidation[key as keyof typeof passwordValidation]
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-muted-foreground'
                      }`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="text-sm text-destructive mt-2">Passwords don't match</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 pb-8">
            <button
              type="submit"
              disabled={!passwordValidation.isValid || formData.newPassword !== formData.confirmPassword || !formData.currentPassword || isLoading}
              className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              {isLoading ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </main>

      <BottomNav />
    </div>
  );
};

export default ChangePassword;