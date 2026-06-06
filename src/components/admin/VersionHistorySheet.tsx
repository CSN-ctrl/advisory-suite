import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { History, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { restoreSitePageRevision, useSitePageRevisions, type SitePageRow } from "@/hooks/use-site-pages";
import { cn } from "@/lib/utils";

interface VersionHistorySheetProps {
  pageId: string;
  locale: string;
  /** Called after a revision is restored so the editor can reload state. */
  onRestored: (page: SitePageRow) => void;
  /** Optional trigger styling for dark editor chrome. */
  triggerClassName?: string;
}

export function VersionHistorySheet({
  pageId,
  locale,
  onRestored,
  triggerClassName,
}: VersionHistorySheetProps) {
  const isBg = locale === "bg";
  const [open, setOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const { revisions, loading, error, refresh } = useSitePageRevisions(open ? pageId : undefined);

  const pending = revisions.find((r) => r.id === pendingId);

  const handleRestore = async () => {
    if (!pendingId) return;
    setRestoring(true);
    const result = await restoreSitePageRevision(pageId, pendingId);
    setRestoring(false);
    setPendingId(null);
    if (result.error || !result.page) {
      toast.error(result.error ?? (isBg ? "Възстановяването не успя" : "Restore failed"));
      return;
    }
    onRestored(result.page);
    void refresh();
    toast.success(isBg ? "Версията е възстановена" : "Version restored");
    setOpen(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn("text-white/80 hover:bg-white/10 hover:text-white", triggerClassName)}
          >
            <History className="mr-1 h-3.5 w-3.5" />
            {isBg ? "История" : "History"}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-serif">{isBg ? "История на версиите" : "Version history"}</SheetTitle>
            <SheetDescription className="font-body text-sm">
              {isBg
                ? "Предишни запазени версии. Възстановяването заменя текущото съдържание (текущата версия се запазва преди това)."
                : "Previous saved snapshots. Restoring replaces current content (today's version is saved first)."}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="min-h-0 flex-1 pr-3">
            {loading ? (
              <p className="py-8 text-center font-body text-sm text-muted-foreground">
                {isBg ? "Зареждане…" : "Loading…"}
              </p>
            ) : error ? (
              <p className="py-8 text-center font-body text-sm text-destructive">{error}</p>
            ) : revisions.length === 0 ? (
              <p className="py-8 text-center font-body text-sm text-muted-foreground">
                {isBg ? "Няма запазени версии още." : "No saved versions yet."}
              </p>
            ) : (
              <ul className="space-y-2 py-2">
                {revisions.map((rev) => (
                  <li
                    key={rev.id}
                    className="flex items-start justify-between gap-3 rounded-md border border-border bg-card p-3"
                  >
                    <div className="min-w-0">
                      <p className="font-body text-sm font-medium text-foreground">
                        {isBg ? "Версия" : "Revision"} #{rev.revision_number}
                      </p>
                      <p className="truncate font-body text-xs text-muted-foreground">{rev.title}</p>
                      <p className="font-body text-[10px] text-muted-foreground/80">
                        {formatDistanceToNow(new Date(rev.created_at), { addSuffix: true })}
                        {rev.created_by ? ` · ${rev.created_by}` : ""}
                      </p>
                      <p className="mt-1 font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                        {rev.editor}
                        {rev.published ? (isBg ? " · публикувана" : " · published") : isBg ? " · чернова" : " · draft"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => setPendingId(rev.id)}
                    >
                      <RotateCcw className="mr-1 h-3.5 w-3.5" />
                      {isBg ? "Възстанови" : "Restore"}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <AlertDialog open={pendingId != null} onOpenChange={(v) => !v && setPendingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{isBg ? "Възстановяване на версия?" : "Restore this version?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {pending
                ? isBg
                  ? `Версия #${pending.revision_number} ще замени текущото съдържание. Текущата версия ще бъде запазена в историята.`
                  : `Revision #${pending.revision_number} will replace the current content. Your current version will be saved to history first.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoring}>{isBg ? "Отказ" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction disabled={restoring} onClick={() => void handleRestore()}>
              {restoring ? (isBg ? "Възстановяване…" : "Restoring…") : isBg ? "Възстанови" : "Restore"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
