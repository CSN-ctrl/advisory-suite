import { getSupabaseBrowserClient, tryGetSupabaseBrowserClient } from "@/integrations/supabase/client";

const BUCKET = "site-media";

export interface SiteMediaItem {
  name: string;
  path: string;
  publicUrl: string;
  createdAt: string | null;
  size: number | null;
}

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

export async function listSiteMedia(): Promise<SiteMediaItem[]> {
  const sb = tryGetSupabaseBrowserClient();
  if (!sb) return [];

  const { data, error } = await sb.storage.from(BUCKET).list("", {
    limit: 200,
    offset: 0,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    throw new Error(error.message || "Failed to list media");
  }

  return (data ?? [])
    .filter((item) => item.name && !item.name.endsWith("/"))
    .map((item) => {
      const path = item.name;
      const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(path);
      return {
        name: item.name,
        path,
        publicUrl: urlData.publicUrl,
        createdAt: item.created_at ?? null,
        size: item.metadata?.size ?? null,
      };
    });
}

export async function deleteSiteMedia(path: string): Promise<void> {
  const sb = getSupabaseBrowserClient();
  const { error } = await sb.storage.from(BUCKET).remove([path]);
  if (error) {
    throw new Error(error.message || "Failed to delete media");
  }
}
