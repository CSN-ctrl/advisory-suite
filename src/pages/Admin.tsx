import { Link } from "react-router-dom";
import { Lock, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";

const Admin = () => {
  const locale = useLocale();

  const t =
    locale === "bg"
      ? {
          section: "Администрация",
          title: "Админ Панел",
          subtitle: "Управлявайте наличности и резервации от сигурния админ модул.",
          availabilityTitle: "Наличности и Резервации",
          availabilityDesc: "Влезте с админ данни, добавяйте часове и преглеждайте резервации.",
          openPanel: "ОТВОРИ ПАНЕЛА",
        }
      : {
          section: "Administration",
          title: "Admin Panel",
          subtitle: "Manage availability and bookings from the secure admin module.",
          availabilityTitle: "Availability & Bookings",
          availabilityDesc: "Sign in with admin credentials, add slots, and review bookings.",
          openPanel: "OPEN PANEL",
        };

  return (
    <main className="pt-20">
      <section className="py-20 md:py-28">
        <div className="container max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-accent" />
              <p className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body">{t.section}</p>
            </div>

            <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
              <span className="text-gold-gradient">{t.title}</span>
            </h1>
            <p className="text-muted-foreground font-body max-w-2xl mb-10">{t.subtitle}</p>

            <div className="bg-card border border-border p-6 md:p-8 rounded-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body mb-2">{t.availabilityTitle}</p>
                  <p className="text-sm text-muted-foreground font-body">{t.availabilityDesc}</p>
                </div>
                <CalendarDays className="w-5 h-5 text-accent mt-1" />
              </div>

              <div className="mt-6">
                <Button asChild variant="gold" size="lg">
                  <Link to="/admin/availability">{t.openPanel}</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Admin;
