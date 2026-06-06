import { useCallback, useEffect, useState } from "react";
import { getLocalizedServices, type Service } from "@/data/services";
import { fetchServicesFromDb } from "@/lib/services-store";

export function useServices(locale: string) {
  const [services, setServices] = useState<Service[]>(() => getLocalizedServices(locale === "bg" ? "bg" : "en"));
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"fallback" | "database">("fallback");

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const fromDb = await fetchServicesFromDb(locale);
      if (fromDb.length > 0) {
        setServices(fromDb);
        setSource("database");
      } else {
        setServices(getLocalizedServices(locale === "bg" ? "bg" : "en"));
        setSource("fallback");
      }
    } catch {
      setServices(getLocalizedServices(locale === "bg" ? "bg" : "en"));
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { services, loading, source, refresh };
}
