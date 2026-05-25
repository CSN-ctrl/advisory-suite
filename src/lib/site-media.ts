import { getSupabaseBrowserClient } from "@/integrations/supabase/client";

const BUCKET = "site-media";

export async function uploadSiteMedia(file: File): Promise<string> {
  const sb = getSupabaseBrowserClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeExt = ext.replace(/[^a-z0-9]/g, "") || "bin";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;

  const { error } = await sb.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message || "Failed to upload image");
  }

  const { data } = sb.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
