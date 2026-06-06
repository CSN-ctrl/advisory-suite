import { newNodeId, type PageDocumentV2, type PageNode } from "@/visual-editor/schema/page-node";

export type PageTemplateId = "blank" | "about" | "landing" | "minimal";

export const PAGE_TEMPLATE_OPTIONS: {
  id: PageTemplateId;
  en: string;
  bg: string;
  descriptionEn: string;
  descriptionBg: string;
}[] = [
  {
    id: "blank",
    en: "Blank",
    bg: "Празна",
    descriptionEn: "Hero title, intro text, and a CTA button.",
    descriptionBg: "Hero заглавие, текст и CTA бутон.",
  },
  {
    id: "about",
    en: "About page",
    bg: "За нас",
    descriptionEn: "Hero, gold-dash bullets, and closing CTA.",
    descriptionBg: "Hero, gold-dash точки и CTA.",
  },
  {
    id: "landing",
    en: "Landing page",
    bg: "Landing",
    descriptionEn: "Hero, feature rows, image, and CTA strip.",
    descriptionBg: "Hero, редове с услуги, изображение и CTA.",
  },
  {
    id: "minimal",
    en: "Minimal",
    bg: "Минимална",
    descriptionEn: "Single section with title and body only.",
    descriptionBg: "Една секция с заглавие и текст.",
  },
];

function section(children: PageNode[], className: string): PageNode {
  return {
    id: newNodeId(),
    type: "section" as const,
    props: { className, padding: "4rem 1rem" },
    children,
  };
}

function text(
  content: string,
  variant: "body" | "h1" | "h2" | "h3" = "body",
  className = "font-body text-foreground",
): PageNode {
  return {
    id: newNodeId(),
    type: "text" as const,
    props: { text: content, variant, className },
  };
}

function button(label: string, href = "/apply"): PageNode {
  return {
    id: newNodeId(),
    type: "button" as const,
    props: { label, href, className: "" },
  };
}

function goldDash(content: string): PageNode {
  return {
    id: newNodeId(),
    type: "goldDash" as const,
    props: { text: content },
  };
}

function serviceRow(title: string, description: string): PageNode {
  return {
    id: newNodeId(),
    type: "serviceRow" as const,
    props: { title, description, href: "/advisory" },
  };
}

function image(src: string, alt: string): PageNode {
  return {
    id: newNodeId(),
    type: "image" as const,
    props: {
      src,
      alt,
      objectFit: "cover" as const,
      className: "rounded-lg w-full max-h-96 object-cover",
    },
  };
}

function ctaStrip(title: string, label: string, href = "/apply"): PageNode {
  return {
    id: newNodeId(),
    type: "ctaStrip" as const,
    props: { title, buttonLabel: label, href },
  };
}

export function createPageFromTemplate(templateId: PageTemplateId, locale: string): PageDocumentV2 {
  const isBg = locale === "bg";

  if (templateId === "minimal") {
    return {
      version: 2,
      editor: "visual-tree",
      root: {
        id: newNodeId(),
        type: "page",
        props: { className: "min-h-screen bg-background" },
        children: [
          section(
            [
              text(isBg ? "Заглавие" : "Page title", "h1", "font-serif text-foreground"),
              text(
                isBg ? "Кратко описание на страницата." : "A short description for this page.",
                "body",
                "font-body text-muted-foreground max-w-2xl",
              ),
            ],
            "container py-16 flex flex-col gap-6 max-w-3xl mx-auto",
          ),
        ],
      },
    };
  }

  if (templateId === "about") {
    return {
      version: 2,
      editor: "visual-tree",
      root: {
        id: newNodeId(),
        type: "page",
        props: { className: "min-h-screen bg-background" },
        children: [
          section(
            [
              text(isBg ? "За нас" : "About", "h1", "font-serif text-foreground"),
              text(
                isBg
                  ? "Кратко въведение — кой стои зад DestinyQ и какво предлагаме."
                  : "A brief introduction — who stands behind DestinyQ and what we offer.",
                "body",
                "font-body text-muted-foreground max-w-2xl",
              ),
              goldDash(isBg ? "Първи ключов принцип или ценност." : "First key principle or value."),
              goldDash(isBg ? "Втори принцип — метафизика, практика, резултат." : "Second principle — metaphysics, practice, outcome."),
              goldDash(isBg ? "Трети принцип — за кого е подходящо." : "Third principle — who this is for."),
              divider(),
              button(isBg ? "Кандидатствай" : "Apply", "/apply"),
            ],
            "container py-16 md:py-20 flex flex-col gap-8",
          ),
        ],
      },
    };
  }

  if (templateId === "landing") {
    return {
      version: 2,
      editor: "visual-tree",
      root: {
        id: newNodeId(),
        type: "page",
        props: { className: "min-h-screen bg-background" },
        children: [
          section(
            [
              text(isBg ? "Заглавие на landing страницата" : "Landing page headline", "h1", "font-serif text-foreground"),
              text(
                isBg ? "Подзаглавие с ясна стойност." : "Subheadline with a clear value proposition.",
                "body",
                "font-body text-muted-foreground max-w-xl",
              ),
              button(isBg ? "Започни" : "Get started", "/apply"),
            ],
            "container py-16 md:py-24 flex flex-col gap-6",
          ),
          section(
            [
              text(isBg ? "Какво предлагаме" : "What we offer", "h2", "font-serif text-gold-gradient"),
              serviceRow(
                isBg ? "Date Selection" : "Date Selection",
                isBg ? "Избор на благоприятни дати за важни решения." : "Choosing favourable dates for important decisions.",
              ),
              serviceRow(
                isBg ? "Advisory" : "Advisory",
                isBg ? "Стратегически консултации с метафизическа дълбочина." : "Strategic advisory with metaphysical depth.",
              ),
            ],
            "container py-12 md:py-16 flex flex-col gap-6",
          ),
          section([image("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200", isBg ? "Архитектура" : "Architecture")], "container py-8"),
          ctaStrip(
            isBg ? "Готови ли сте за следващата стъпка?" : "Ready for the next step?",
            isBg ? "Свържете се" : "Contact us",
            "/apply",
          ),
        ],
      },
    };
  }

  // blank (default)
  return {
    version: 2,
    editor: "visual-tree",
    root: {
      id: newNodeId(),
      type: "page",
      props: { className: "min-h-screen bg-background" },
      children: [
        section(
          [
            text(isBg ? "Заглавие на страницата" : "Page title", "h1", "font-serif text-foreground"),
            text(
              isBg
                ? "Добавете текст, изображения и бутони от палитрата вляво."
                : "Add text, images, and buttons from the palette on the left.",
              "body",
              "font-body text-muted-foreground max-w-xl",
            ),
            button(isBg ? "Научи повече" : "Learn more", "/"),
          ],
          "container py-16 flex flex-col gap-8",
        ),
      ],
    },
  };
}

function divider(): PageNode {
  return {
    id: newNodeId(),
    type: "divider" as const,
    props: { className: "my-4 border-t border-border" },
  };
}
