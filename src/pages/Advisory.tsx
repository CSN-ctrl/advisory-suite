import { getLocalizedServices } from "@/data/services";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { EditableRichText, EditableText } from "@/components/EditableText";
import { EditableCtaButton } from "@/components/edit-mode/EditableCtaButton";
import { useAdmin } from "@/contexts/AdminContext";
import { useLocale } from "@/hooks/use-locale";
import { usePageContent } from "@/hooks/use-page-content";

const Advisory = () => {
  const [savingField, setSavingField] = useState<string | null>(null);
  const locale = useLocale();
  const { isAdminAuthenticated, isEditMode } = useAdmin();
  const { getText, updateText } = usePageContent("advisory");
  const handleSave = useCallback(
    (section: string, key: string) => async (nextValue: string) => {
      const fieldId = `${section}.${key}`;
      setSavingField(fieldId);
      try {
        await updateText(section, key, nextValue);
      } finally {
        setSavingField(null);
      }
    },
    [updateText]
  );
  const services = getLocalizedServices(locale);
  const t = locale === "bg"
    ? {
        services: "Услуги",
        title: "Консултантски",
        titleAccent: "Услуги",
        intro: "Всяка услуга е създадена да даде стратегическа яснота в ясен обхват, срок и формат.",
        whoFor: "За кого е",
        included: "Какво включва",
        format: "Формат",
        timeline: "График",
        applyNow: "КАНДИДАТСТВАЙ",
        bookNow: "РЕЗЕРВИРАЙ",
      }
    : {
        services: "Services",
        title: "Advisory",
        titleAccent: "Services",
        intro: "Each engagement is designed to deliver strategic clarity within a defined scope, timeline, and format. Select the advisory that matches your current challenge.",
        whoFor: "Who It's For",
        included: "What's Included",
        format: "Format",
        timeline: "Timeline",
        applyNow: "APPLY NOW",
        bookNow: "BOOK NOW",
      };

  return (
  <main className="pt-20">
    <section className="py-24 md:py-32 relative">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <EditableText
            as="p"
            value={getText("hero", "label", t.services)}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("hero", "label")}
            isSaving={savingField === "hero.label"}
            className="text-xs uppercase tracking-[0.3em] text-accent/70 font-body mb-4"
          />
          <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6">
            <EditableText
              as="span"
              value={getText("hero", "title", t.title)}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("hero", "title")}
              isSaving={savingField === "hero.title"}
              className="inline"
            />{" "}
            <EditableText
              as="span"
              value={getText("hero", "titleAccent", t.titleAccent)}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSave={handleSave("hero", "titleAccent")}
              isSaving={savingField === "hero.titleAccent"}
              className="inline text-gold-gradient"
            />
          </h1>
          <EditableRichText
            multiline
            as="p"
            value={getText("hero", "intro", t.intro)}
            isAdmin={isAdminAuthenticated}
            isEditMode={isEditMode}
            onSave={handleSave("hero", "intro")}
            isSaving={savingField === "hero.intro"}
            className="text-muted-foreground font-body text-lg leading-relaxed"
            rows={3}
          />
        </motion.div>
      </div>
    </section>

    {services.map((service, index) => (
      <section
        key={service.id}
        className={`py-20 md:py-24 relative ${index % 2 === 0 ? "bg-secondary/30" : ""}`}
      >
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-baseline justify-between mb-8">
              <EditableText
                as="h2"
                value={getText(`service.${service.id}`, "title", service.title)}
                isAdmin={isAdminAuthenticated}
                isEditMode={isEditMode}
                onSave={handleSave(`service.${service.id}`, "title")}
                isSaving={savingField === `service.${service.id}.title`}
                className="font-serif text-3xl md:text-4xl text-foreground"
              />
              {service.price && (
                <EditableText
                  as="span"
                  value={getText(`service.${service.id}`, "price", service.price)}
                  isAdmin={isAdminAuthenticated}
                  isEditMode={isEditMode}
                  onSave={handleSave(`service.${service.id}`, "price")}
                  isSaving={savingField === `service.${service.id}.price`}
                  className="text-gold-gradient font-body text-xl font-bold"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mb-10">
              {[
                { key: "whoFor", label: t.whoFor, value: service.whoFor },
                { key: "included", label: t.included, value: service.included },
                { key: "format", label: t.format, value: service.format },
                { key: "timeline", label: t.timeline, value: service.timeline },
              ].map((detail) => (
                <div key={detail.key}>
                  <EditableText
                    as="h4"
                    value={getText("labels", detail.key, detail.label)}
                    isAdmin={isAdminAuthenticated}
                    isEditMode={isEditMode}
                    onSave={handleSave("labels", detail.key)}
                    isSaving={savingField === `labels.${detail.key}`}
                    className="text-xs uppercase tracking-[0.2em] text-accent/60 font-body font-bold mb-3"
                  />
                  <EditableRichText
                    multiline
                    as="p"
                    value={getText(`service.${service.id}`, detail.key, detail.value)}
                    isAdmin={isAdminAuthenticated}
                    isEditMode={isEditMode}
                    onSave={handleSave(`service.${service.id}`, detail.key)}
                    isSaving={savingField === `service.${service.id}.${detail.key}`}
                    className="text-sm text-muted-foreground font-body leading-relaxed"
                    rows={3}
                  />
                </div>
              ))}
            </div>

            <EditableCtaButton
              to={service.isApply ? "/apply" : `/apply?service=${service.id}`}
              label={getText(
                `service.${service.id}`,
                "ctaLabel",
                service.ctaLabel ?? (service.isApply ? t.applyNow : t.bookNow),
              )}
              isAdmin={isAdminAuthenticated}
              isEditMode={isEditMode}
              onSaveLabel={handleSave(`service.${service.id}`, "ctaLabel")}
              isSavingLabel={savingField === `service.${service.id}.ctaLabel`}
              variant={service.isApply ? "goldOutline" : "gold"}
            />

            {index < services.length - 1 && (
              <div className="gold-line mt-20" />
            )}
          </motion.div>
        </div>
      </section>
    ))}
  </main>
  );
};

export default Advisory;
