import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";

type AppRole = "admin" | "coordinator" | "faculty";

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [role, setRole] = useState<AppRole>("faculty");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      if (!fullName.trim()) {
        toast.error("Full name is required");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, {
        full_name: fullName,
        department,
        designation,
        role,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Please check your email to verify.");
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">AcadTrackAI</h1>
          <p className="text-sm text-muted-foreground mt-1">Weekly Report Management System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="border rounded-xl p-6 bg-card space-y-4">
          <h2 className="text-lg font-semibold text-center">
            {isSignUp ? "Create Account" : "Sign In"}
          </h2>

          {isSignUp && (
            <>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name *</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Department</label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. CSE, AIML" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Designation</label>
                <Input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Assistant Professor" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Role *</label>
                <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {role === "faculty" && "Can add and edit own entries."}
                  {role === "coordinator" && "Can manage entries and create weeks."}
                  {role === "admin" && "Full access: manage users, weeks, and all entries."}
                </p>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Email *</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Password *</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" className="text-primary hover:underline font-medium" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
