import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Layout, LogOut, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/integrations/supabase/client";
import { checkIsSupabaseAdmin } from "@/lib/admin-api";
import { MARKETING_PAGES } from "@/lib/marketing-pages";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { useSitePagesList } from "@/hooks/use-site-pages";

const AdminPageEditorDashboard = () => {
  const locale = useLocale();
  const navigate = useNavigate();
  const { isAdminAuthenticated, setAdminAuthenticated, isAuthCheckComplete } = useAdmin();
  const { pages: customPages, loading: customLoading } = useSitePagesList(locale);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isBg = locale === "bg";
  const t = isBg
    ? {
        loginTitle: "Вход като администратор",
        emailPh: "Имейл",
        passPh: "Парола",
        enter: "Вход",
        badPassword: "Грешна парола.",
        notAuthorized: "Нямате админ права.",
        authFail: "Неуспешен вход.",
        welcome: "Добре дошли.",
        signOut: "Изход",
        title: "Редактор на страници",
        subtitle: "Изберете страница и я редактирайте в пълен canvas — отделно от сайта.",
        marketing: "Маркетинг страници",
        marketingHint: "Начало, Услуги, Мисия и останалите основни маршрути.",
        custom: "Персонализирани canvas страници",
        openCanvas: "Отвори canvas",
        viewLive: "Виж на сайта",
        backAdmin: "← Админ",
      }
    : {
        loginTitle: "Sign in as admin",
        emailPh: "Email",
        passPh: "Password",
        enter: "Sign in",
        badPassword: "Incorrect password.",
        notAuthorized: "Not authorized for admin.",
        authFail: "Sign-in failed.",
        welcome: "Welcome.",
        signOut: "Sign out",
        title: "Page editor",
        subtitle: "Pick a page and edit it in the full canvas workspace — separate from the live site.",
        marketing: "Marketing pages",
        marketingHint: "Home, Advisory, Mission, and other built-in routes.",
        custom: "Custom canvas pages",
        openCanvas: "Open canvas",
        viewLive: "View live",
        backAdmin: "← Admin",
      };

  const canvasCustomPages = customPages.filter(
    (p) => p.editor === "canvas" && !p.slug.startsWith("layout-"),
  );

  useEffect(() => {
    if (!isAuthCheckComplete) return;
    if (!isAdminAuthenticated) return;
    void checkIsSupabaseAdmin().then((ok) => {
      if (!ok) setAdminAuthenticated(false);
    });
  }, [isAuthCheckComplete, isAdminAuthenticated, setAdminAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const client = getSupabaseBrowserClient();
      const { error: signError } = await client.auth.signInWithPassword({ email: email.trim(), password });
      if (signError) {
        toast.error(signError.message || t.badPassword);
        return;
      }
      const ok = await checkIsSupabaseAdmin();
      if (!ok) {
        await client.auth.signOut();
        toast.error(t.notAuthorized);
        return;
      }
      setAdminAuthenticated(true);
      toast.success(t.welcome);
    } catch {
      toast.error(t.authFail);
    }
  };

  const handleSignOut = async () => {
    try {
      await getSupabaseBrowserClient().auth.signOut();
    } catch {
      /* ignore */
    }
    setAdminAuthenticated(false);
  };

  if (!isAuthCheckComplete) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground font-body text-sm">…</p>
      </main>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <form onSubmit={(e) => void handleLogin(e)} className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-8">
          <h1 className="font-serif text-2xl text-foreground">{t.loginTitle}</h1>
          <input
            type="email"
            required
            placeholder={t.emailPh}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-body"
          />
          <input
            type="password"
            required
            placeholder={t.passPh}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-body"
          />
          <Button type="submit" variant="gold" className="w-full">
            {t.enter}
          </Button>
          <Button type="button" variant="ghost" className="w-full" asChild>
            <Link to="/admin">{t.backAdmin}</Link>
          </Button>
        </form>
      </main>
    );
  }

  const seenContent = new Set<string>();

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-navy px-4 py-3 text-white sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-accent">DestinyQ</p>
            <h1 className="font-serif text-xl sm:text-2xl">{t.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white" asChild>
              <Link to="/admin">{t.backAdmin}</Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white" asChild>
              <Link to="/admin/site">{isBg ? "Студио" : "Studio"}</Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-white/80 hover:bg-white/10 hover:text-white"
              onClick={() => void handleSignOut()}
            >
              <LogOut className="mr-1 h-3.5 w-3.5" />
              {t.signOut}
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-8 max-w-2xl font-body text-sm text-muted-foreground">{t.subtitle}</p>

          <div className="mb-10 flex items-center gap-2">
            <Layout className="h-4 w-4 text-accent" />
            <h2 className="font-body text-xs font-bold uppercase tracking-[0.2em] text-foreground">{t.marketing}</h2>
          </div>
          <p className="mb-6 font-body text-sm text-muted-foreground">{t.marketingHint}</p>

          <ul className="mb-14 grid gap-3 sm:grid-cols-2">
            {MARKETING_PAGES.map((page) => {
              const key = page.contentPage ?? page.id;
              if (!page.contentPage || seenContent.has(page.contentPage)) return null;
              seenContent.add(page.contentPage);
              const label = isBg ? page.labelBg : page.labelEn;
              return (
                <li
                  key={page.id}
                  className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{label}</p>
                    <code className="mt-1 block font-mono text-[11px] text-muted-foreground">{page.path}</code>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="gold" size="sm" asChild>
                      <Link to={`/admin/pages/canvas/${page.contentPage}`}>
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        {t.openCanvas}
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={page.path} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-1 h-3.5 w-3.5" />
                        {t.viewLive}
                      </a>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>

          {canvasCustomPages.length > 0 ? (
            <>
              <h2 className="mb-4 font-body text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                {t.custom}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {canvasCustomPages.map((p) => (
                  <li key={p.id} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
                    <div>
                      <p className="font-body text-sm font-medium">{p.title}</p>
                      <code className="mt-1 block font-mono text-[11px] text-muted-foreground">/pages/{p.slug}</code>
                    </div>
                    <Button variant="gold" size="sm" asChild>
                      <Link to={`/admin/editor/${p.id}`}>{t.openCanvas}</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            </>
          ) : customLoading ? (
            <p className="text-sm text-muted-foreground font-body">…</p>
          ) : null}
        </motion.div>
      </section>
    </main>
  );
};

export default AdminPageEditorDashboard;
