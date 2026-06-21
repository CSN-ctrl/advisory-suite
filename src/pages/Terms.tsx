import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { TERMS_SECTIONS } from "@/lib/legal-defaults";

const Terms = () => (
  <LegalDocumentPage
    contentPage="terms"
    title="Terms of Service"
    updatedFallback="Last updated: June 2026"
    sections={TERMS_SECTIONS}
  />
);

export default Terms;
