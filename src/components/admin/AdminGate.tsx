import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/integrations/supabase/client";
import { checkIsSupabaseAdmin } from "@/lib/admin-api";
import { useAdmin } from "@/contexts/AdminContext";

interface AdminGateProps {
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  loginTitle?: string;
  fullScreen?: boolean;
}

export function AdminGate({
  children,
  backHref = "/admin",
  backLabel = "← Admin",
  loginTitle = "Sign in as admin",
  fullScreen = false,
}: AdminGateProps) {
  const { isAdminAuthenticated, setAdminAuthenticated, isAuthCheckComplete } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const client = getSupabaseBrowserClient();
      const { error: signError } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (signError) {
        toast.error(signError.message || "Sign-in failed.");
        return;
      }
      const ok = await checkIsSupabaseAdmin();
      if (!ok) {
        await client.auth.signOut();
        toast.error("Not authorized for admin.");
        return;
      }
      setAdminAuthenticated(true);
      toast.success("Welcome.");
    } catch {
      toast.error("Sign-in failed.");
    }
  };

  if (!isAuthCheckComplete) {
    return (
      <main className={fullScreen ? "flex min-h-screen items-center justify-center bg-background" : "pt-20"}>
        <p className="text-muted-foreground font-body text-sm">…</p>
      </main>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <main
        className={
          fullScreen
            ? "flex min-h-screen items-center justify-center bg-background px-4"
            : "flex min-h-[60vh] items-center justify-center px-4 pt-20"
        }
      >
        <form onSubmit={(e) => void handleLogin(e)} className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-8">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-accent" />
            <h1 className="font-serif text-2xl text-foreground">{loginTitle}</h1>
          </div>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-body"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-body"
          />
          <Button type="submit" variant="gold" className="w-full">
            Sign in
          </Button>
          <Button type="button" variant="ghost" className="w-full" asChild>
            <Link to={backHref}>{backLabel}</Link>
          </Button>
        </form>
      </main>
    );
  }

  return <>{children}</>;
}
