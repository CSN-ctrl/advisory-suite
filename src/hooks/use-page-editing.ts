import { useCallback, useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { contentFieldLabel, usePageContent } from "@/hooks/use-page-content";

export type EditableFieldBind = {
  value: string;
  onSave: (nextValue: string) => void | Promise<void>;
  isSaving?: boolean;
  isAdmin: boolean;
  isEditMode: boolean;
  fieldLabel?: string;
};

export function usePageEditing(page: string) {
  const [savingField, setSavingField] = useState<string | null>(null);
  const { getText, getLines, updateText, content } = usePageContent(page);
  const { isAdminAuthenticated, isEditMode } = useAdmin();

  const save = useCallback(
    (section: string, key: string) => async (nextValue: string) => {
      const fieldId = `${section}.${key}`;
      setSavingField(fieldId);
      try {
        await updateText(section, key, nextValue);
      } finally {
        setSavingField(null);
      }
    },
    [updateText],
  );

  const bind = useCallback(
    (section: string, key: string, fallback: string): EditableFieldBind => ({
      value: getText(section, key, fallback),
      onSave: save(section, key),
      isSaving: savingField === `${section}.${key}`,
      isAdmin: isAdminAuthenticated,
      isEditMode,
      fieldLabel: contentFieldLabel(section, key),
    }),
    [getText, save, savingField, isAdminAuthenticated, isEditMode],
  );

  return {
    page,
    content,
    getText,
    getLines,
    updateText,
    save,
    bind,
    isAdminAuthenticated,
    isEditMode,
    savingField,
  };
}
