import { Link } from "react-router-dom";
import { Lock, CalendarDays, LayoutGrid, ImageIcon, Briefcase } from "lucide-react";
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
          siteTitle: "Pages Hub",
          siteDesc: "Един център за inline, canvas и visual редактори — draft, preview и publish.",
          openSite: "ОТВОРИ PAGES HUB",
          servicesTitle: "Каталог услуги",
          servicesDesc: "Редактирайте цени, bookable флагове и преводи без redeploy.",
          openServices: "УПРАВЛЕНИЕ УСЛУГИ",
          mediaTitle: "Медийна библиотека",
          mediaDesc: "Споделени изображения за всички редактори.",
          openMedia: "ОТВОРИ МЕДИЯ",
          canvasTitle: "Pages Hub",
          canvasDesc: "Inline, canvas и visual редактори — draft, preview и publish на едно място.",
          openCanvas: "ОТВОРИ PAGES HUB",
        }
      : {
          section: "Administration",
          title: "Admin Panel",
          subtitle: "Manage availability and bookings from the secure admin module.",
          availabilityTitle: "Availability & Bookings",
          availabilityDesc: "Sign in with admin credentials, add slots, and review bookings.",
          openPanel: "OPEN PANEL",
          siteTitle: "Pages Hub",
          siteDesc: "Unified hub for inline, canvas, and visual editors — draft, preview, and publish.",
          openSite: "OPEN PAGES HUB",
          servicesTitle: "Services Catalog",
          servicesDesc: "Edit prices, bookable flags, and localized copy without redeploying.",
          openServices: "MANAGE SERVICES",
          mediaTitle: "Media Library",
          mediaDesc: "Shared images for all editors — upload once, reuse everywhere.",
          openMedia: "OPEN MEDIA",
          canvasTitle: "Pages Hub",
          canvasDesc: "Inline, canvas, and visual editors — draft, preview, and publish in one place.",
          openCanvas: "OPEN PAGES HUB",
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-card border border-border p-6 md:p-8 rounded-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body mb-2">{t.availabilityTitle}</p>
                    <p className="text-sm text-muted-foreground font-body">{t.availabilityDesc}</p>
                  </div>
                  <CalendarDays className="w-5 h-5 text-accent mt-1 shrink-0" />
                </div>

                <div className="mt-6">
                  <Button asChild variant="gold" size="lg">
                    <Link to="/admin/availability">{t.openPanel}</Link>
                  </Button>
                </div>
              </div>

              <div className="bg-card border border-border p-6 md:p-8 rounded-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body mb-2">{t.canvasTitle}</p>
                    <p className="text-sm text-muted-foreground font-body">{t.canvasDesc}</p>
                  </div>
                  <LayoutGrid className="w-5 h-5 text-accent mt-1 shrink-0" />
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Button asChild variant="gold" size="lg">
                    <Link to="/admin/pages">{t.openCanvas}</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/admin/media">{t.openMedia}</Link>
                  </Button>
                </div>
              </div>

              <div className="bg-card border border-border p-6 md:p-8 rounded-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body mb-2">{t.servicesTitle}</p>
                    <p className="text-sm text-muted-foreground font-body">{t.servicesDesc}</p>
                  </div>
                  <Briefcase className="w-5 h-5 text-accent mt-1 shrink-0" />
                </div>

                <div className="mt-6">
                  <Button asChild variant="gold" size="lg">
                    <Link to="/admin/services">{t.openServices}</Link>
                  </Button>
                </div>
              </div>

              <div className="bg-card border border-border p-6 md:p-8 rounded-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body mb-2">{t.mediaTitle}</p>
                    <p className="text-sm text-muted-foreground font-body">{t.mediaDesc}</p>
                  </div>
                  <ImageIcon className="w-5 h-5 text-accent mt-1 shrink-0" />
                </div>

                <div className="mt-6">
                  <Button asChild variant="outline" size="lg">
                    <Link to="/admin/media">{t.openMedia}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Admin;
