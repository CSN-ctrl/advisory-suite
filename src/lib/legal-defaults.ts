export interface LegalSectionDef {
  key: string;
  heading: string;
  body: string;
}

export const PRIVACY_SECTIONS: LegalSectionDef[] = [
  {
    key: "intro",
    heading: "Introduction",
    body: "Meridian Advisory (\"we\", \"us\") respects your privacy. This Privacy Policy explains how we collect, use, and protect personal data when you use our website and advisory services, in accordance with the EU General Data Protection Regulation (GDPR) and applicable local law.",
  },
  {
    key: "controller",
    heading: "Data Controller",
    body: "The data controller is Meridian Advisory. For privacy-related requests, contact us via the LinkedIn link in the website footer.",
  },
  {
    key: "data_collected",
    heading: "Data We Collect",
    body: "We may collect: name, email address, phone number, booking and payment details you provide; messages submitted through application forms; technical data such as browser type and pages visited (essential cookies only, unless you consent to additional cookies); and admin audit metadata when authorised staff edit site content.",
  },
  {
    key: "purposes",
    heading: "How We Use Your Data",
    body: "We use personal data to: respond to advisory applications and booking requests; confirm sessions and communicate about your engagement; operate and secure our website; comply with legal obligations; and improve our services where permitted.",
  },
  {
    key: "legal_basis",
    heading: "Legal Basis (GDPR)",
    body: "We process data based on: your consent (e.g. forms, cookie preferences); performance of a contract or steps prior to entering a contract (bookings); legitimate interests in operating a professional advisory practice (balanced against your rights); and legal obligations where applicable.",
  },
  {
    key: "retention",
    heading: "Retention",
    body: "We retain personal data only as long as necessary for the purposes above, including reasonable periods for enquiries, active engagements, and legal or accounting requirements. You may request deletion where we have no overriding legal basis to retain data.",
  },
  {
    key: "processors",
    heading: "Service Providers",
    body: "We use trusted processors such as Supabase (hosting and database) and email delivery providers for booking confirmations. Processors act under contract and appropriate safeguards.",
  },
  {
    key: "rights",
    heading: "Your Rights",
    body: "Under GDPR you may have the right to access, rectify, erase, restrict or object to processing, data portability, and to withdraw consent. You may lodge a complaint with your local supervisory authority. To exercise rights, contact us via LinkedIn in the footer.",
  },
  {
    key: "cookies",
    heading: "Cookies",
    body: "We use essential cookies and local storage for site functionality (e.g. cookie consent preference, admin session). We do not use non-essential marketing analytics cookies unless disclosed and consented to separately.",
  },
  {
    key: "updates",
    heading: "Updates",
    body: "We may update this policy from time to time. The current version is always published on this page with a reasonable effective date when material changes occur.",
  },
];

export const TERMS_SECTIONS: LegalSectionDef[] = [
  {
    key: "intro",
    heading: "Agreement",
    body: "By using this website or submitting an application or booking, you agree to these Terms of Service. If you do not agree, please do not use the site.",
  },
  {
    key: "services",
    heading: "Advisory Services",
    body: "Meridian Advisory provides strategic advisory services subject to separate engagement terms. Information on this website is for general purposes and does not constitute professional advice until a formal engagement is agreed.",
  },
  {
    key: "bookings",
    heading: "Bookings & Payments",
    body: "Booking requests are subject to availability and confirmation. Payment terms, deposits, and cancellation rules are communicated at the time of booking. You are responsible for providing accurate contact and billing information.",
  },
  {
    key: "conduct",
    heading: "Acceptable Use",
    body: "You must not misuse the website, attempt unauthorised access, or submit unlawful or harmful content through our forms.",
  },
  {
    key: "liability",
    heading: "Limitation of Liability",
    body: "To the fullest extent permitted by law, we are not liable for indirect or consequential losses arising from use of the website. Nothing limits liability where it cannot be excluded by law.",
  },
  {
    key: "privacy",
    heading: "Privacy",
    body: "Our processing of personal data is described in the Privacy Policy, which forms part of these terms.",
  },
  {
    key: "law",
    heading: "Governing Law",
    body: "These terms are governed by applicable law in the jurisdiction of the data controller, without prejudice to mandatory consumer protections where you reside.",
  },
];
