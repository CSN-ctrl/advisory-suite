import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { PRIVACY_SECTIONS } from "@/lib/legal-defaults";

const Privacy = () => (
  <LegalDocumentPage
    contentPage="privacy"
    title="Privacy Policy & GDPR"
    updatedFallback="Last updated: June 2026"
    sections={PRIVACY_SECTIONS}
  />
);

export default Privacy;
