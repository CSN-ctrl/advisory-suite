import { useCallback, useEffect, useState } from "react";
import { BubbleMenu, EditorContent, useEditor, type Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Palette,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Subscript,
  Superscript,
  Table2,
  Underline as UnderlineIcon,
  Undo2,
  Video,
} from "lucide-react";
import { buildRichTextExtensions } from "@/components/rich-text/editor-extensions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { normalizeEditorHtml } from "@/lib/rich-text-html";

const FONT_INHERIT = "inherit";

const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: "Theme default", value: FONT_INHERIT },
  { label: "Serif (display)", value: 'Georgia, "Times New Roman", serif' },
  { label: "Sans (body)", value: '"Lato", system-ui, sans-serif' },
  { label: "Monospace", value: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" },
];

const PRESET_COLORS = [
  "#0f172a",
  "#1e3a5f",
  "#c5a46d",
  "#ffffff",
  "#64748b",
  "#b91c1c",
  "#15803d",
  "#1d4ed8",
];

/** WCAG-friendly touch targets on small screens; compact on `sm+`. */
const TOOLBAR_ICON_BTN =
  "h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 touch-manipulation p-0 sm:h-8 sm:w-8 sm:min-h-0 sm:min-w-0";

const TOOLBAR_ICON = "h-4 w-4 sm:h-3.5 sm:w-3.5";

const SELECT_TRIGGER =
  "h-11 min-h-[44px] w-[11rem] shrink-0 text-sm sm:h-8 sm:min-h-0 sm:w-[132px] sm:text-xs";

const FONT_TRIGGER =
  "h-11 min-h-[44px] w-[min(100%,12rem)] shrink-0 text-sm sm:h-8 sm:min-h-0 sm:w-[148px] sm:text-xs";

const SWATCH =
  "h-11 w-11 min-h-[44px] min-w-[44px] touch-manipulation rounded-md border border-border sm:h-7 sm:w-7 sm:min-h-0 sm:min-w-0";

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "outline"}
      size="sm"
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={TOOLBAR_ICON_BTN}
      data-edit-allow="true"
      onPointerDown={(event) => event.preventDefault()}
      onClick={() => onClick()}
    >
      {children}
    </Button>
  );
}

function HeadingSelect({ editor }: { editor: Editor }) {
  const levels = [1, 2, 3, 4, 5, 6] as const;
  const activeLevel = levels.find((level) => editor.isActive("heading", { level }));
  const value = activeLevel ? `h${activeLevel}` : "p";

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next === "p") {
          editor.chain().focus().setParagraph().run();
          return;
        }
        const level = Number(next.replace("h", "")) as 1 | 2 | 3 | 4 | 5 | 6;
        editor.chain().focus().toggleHeading({ level }).run();
      }}
    >
      <SelectTrigger className={SELECT_TRIGGER} data-edit-allow="true">
        <SelectValue placeholder="Style" />
      </SelectTrigger>
      <SelectContent position="popper" sideOffset={6} className="max-h-[min(70dvh,22rem)] w-[var(--radix-select-trigger-width)]">
        <SelectItem value="p" className="min-h-11 py-3 text-base sm:min-h-0 sm:py-1.5 sm:text-sm">
          Paragraph
        </SelectItem>
        <SelectItem value="h1" className="min-h-11 py-3 text-base sm:min-h-0 sm:py-1.5 sm:text-sm">
          Heading 1
        </SelectItem>
        <SelectItem value="h2" className="min-h-11 py-3 text-base sm:min-h-0 sm:py-1.5 sm:text-sm">
          Heading 2
        </SelectItem>
        <SelectItem value="h3" className="min-h-11 py-3 text-base sm:min-h-0 sm:py-1.5 sm:text-sm">
          Heading 3
        </SelectItem>
        <SelectItem value="h4" className="min-h-11 py-3 text-base sm:min-h-0 sm:py-1.5 sm:text-sm">
          Heading 4
        </SelectItem>
        <SelectItem value="h5" className="min-h-11 py-3 text-base sm:min-h-0 sm:py-1.5 sm:text-sm">
          Heading 5
        </SelectItem>
        <SelectItem value="h6" className="min-h-11 py-3 text-base sm:min-h-0 sm:py-1.5 sm:text-sm">
          Heading 6
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

function LinkPopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (open) {
      const prev = editor.getAttributes("link").href as string | undefined;
      setUrl(prev ?? "");
    }
  }, [open, editor]);

  const apply = () => {
    const trimmed = url.trim();
    if (trimmed.length === 0) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href: withProtocol }).run();
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={editor.isActive("link") ? "secondary" : "outline"}
          size="sm"
          className={TOOLBAR_ICON_BTN}
          title="Link"
          aria-label="Insert link"
          data-edit-allow="true"
          onPointerDown={(event) => event.preventDefault()}
        >
          <Link2 className={TOOLBAR_ICON} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(100vw-1.5rem,20rem)] max-w-[calc(100vw-1.25rem)] p-4"
        align="start"
        sideOffset={8}
        collisionPadding={12}
        data-edit-allow="true"
      >
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="rich-link-url">
            URL
          </label>
          <Input
            id="rich-link-url"
            value={url}
            className="min-h-11 text-base sm:min-h-10 sm:text-sm"
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply();
              }
            }}
          />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" className="min-h-11 w-full sm:min-h-9 sm:w-auto" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="min-h-11 w-full sm:min-h-9 sm:w-auto" onClick={apply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ImagePopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  useEffect(() => {
    if (open) {
      const attrs = editor.getAttributes("image") as { src?: string; alt?: string };
      setUrl(attrs.src ?? "");
      setAlt(attrs.alt ?? "");
    }
  }, [open, editor]);

  const apply = () => {
    const trimmed = url.trim();
    if (trimmed.length === 0) {
      setOpen(false);
      return;
    }
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    editor.chain().focus().setImage({ src: withProtocol, alt: alt.trim() || undefined }).run();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={TOOLBAR_ICON_BTN}
          title="Image from URL"
          aria-label="Insert image"
          data-edit-allow="true"
          onPointerDown={(event) => event.preventDefault()}
        >
          <ImagePlus className={TOOLBAR_ICON} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(100vw-1.5rem,22rem)] max-w-[calc(100vw-1.25rem)] p-4"
        align="start"
        sideOffset={8}
        collisionPadding={12}
        data-edit-allow="true"
      >
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="rich-image-url">
            Image URL (https)
          </label>
          <Input
            id="rich-image-url"
            value={url}
            className="min-h-11 text-base sm:min-h-10 sm:text-sm"
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply();
              }
            }}
          />
          <label className="text-sm font-medium text-muted-foreground" htmlFor="rich-image-alt">
            Alt text (optional)
          </label>
          <Input
            id="rich-image-alt"
            value={alt}
            className="min-h-11 text-base sm:min-h-10 sm:text-sm"
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the image"
          />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" className="min-h-11 w-full sm:min-h-9 sm:w-auto" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="min-h-11 w-full sm:min-h-9 sm:w-auto" onClick={apply}>
              Insert
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function YoutubePopover({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (open) {
      const attrs = editor.getAttributes("youtube") as { src?: string };
      setUrl(attrs.src ?? "");
    }
  }, [open, editor]);

  const apply = () => {
    const trimmed = url.trim();
    if (trimmed.length === 0) {
      setOpen(false);
      return;
    }
    const ok = editor.chain().focus().setYoutubeVideo({ src: trimmed }).run();
    if (ok) {
      setOpen(false);
    } else {
      toast.error("That URL is not a valid YouTube link.");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={TOOLBAR_ICON_BTN}
          title="YouTube video"
          aria-label="Insert YouTube video"
          data-edit-allow="true"
          onPointerDown={(event) => event.preventDefault()}
        >
          <Video className={TOOLBAR_ICON} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(100vw-1.5rem,22rem)] max-w-[calc(100vw-1.25rem)] p-4"
        align="start"
        sideOffset={8}
        collisionPadding={12}
        data-edit-allow="true"
      >
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="rich-youtube-url">
            YouTube link
          </label>
          <Input
            id="rich-youtube-url"
            value={url}
            className="min-h-11 text-base sm:min-h-10 sm:text-sm"
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply();
              }
            }}
          />
          <p className="text-xs text-muted-foreground">Paste a watch, youtu.be, or shorts URL.</p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" className="min-h-11 w-full sm:min-h-9 sm:w-auto" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="min-h-11 w-full sm:min-h-9 sm:w-auto" onClick={apply}>
              Insert
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TableStructureDropdown({ editor }: { editor: Editor }) {
  const [, tick] = useState(0);
  const rerender = useCallback(() => tick((n) => n + 1), []);

  useEffect(() => {
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor, rerender]);

  const inTable = editor.isActive("table");

  const run = (fn: () => boolean) => {
    fn();
    tick((n) => n + 1);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={inTable ? "secondary" : "outline"}
          size="sm"
          className={cn(TOOLBAR_ICON_BTN, "w-auto min-w-[44px] gap-1 px-2 sm:min-w-0")}
          title="Table"
          aria-label="Table tools"
          data-edit-allow="true"
          onPointerDown={(event) => event.preventDefault()}
        >
          <Table2 className={TOOLBAR_ICON} />
          <span className="hidden text-xs font-medium sm:inline">Table</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        collisionPadding={12}
        className="z-[100] max-h-[min(70dvh,28rem)] w-56 overflow-y-auto p-1"
        data-edit-allow="true"
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">Insert</DropdownMenuLabel>
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm"
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}
        >
          New 3×3 table (header row)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Structure</DropdownMenuLabel>
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm"
          disabled={!editor.can().addRowBefore()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().addRowBefore().run())}
        >
          Row above
        </DropdownMenuItem>
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm"
          disabled={!editor.can().addRowAfter()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().addRowAfter().run())}
        >
          Row below
        </DropdownMenuItem>
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm"
          disabled={!editor.can().deleteRow()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().deleteRow().run())}
        >
          Delete row
        </DropdownMenuItem>
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm"
          disabled={!editor.can().addColumnBefore()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().addColumnBefore().run())}
        >
          Column before
        </DropdownMenuItem>
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm"
          disabled={!editor.can().addColumnAfter()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().addColumnAfter().run())}
        >
          Column after
        </DropdownMenuItem>
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm"
          disabled={!editor.can().deleteColumn()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().deleteColumn().run())}
        >
          Delete column
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm"
          disabled={!editor.can().mergeCells()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().mergeCells().run())}
        >
          Merge cells
        </DropdownMenuItem>
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm"
          disabled={!editor.can().splitCell()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().splitCell().run())}
        >
          Split cell
        </DropdownMenuItem>
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm"
          disabled={!editor.can().toggleHeaderRow()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().toggleHeaderRow().run())}
        >
          Toggle header row
        </DropdownMenuItem>
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm"
          disabled={!editor.can().toggleHeaderColumn()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().toggleHeaderColumn().run())}
        >
          Toggle header column
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="min-h-10 cursor-pointer text-sm text-destructive focus:text-destructive"
          disabled={!editor.can().deleteTable()}
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => run(() => editor.chain().focus().deleteTable().run())}
        >
          Delete table
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FontSelect({ editor }: { editor: Editor }) {
  const current = (editor.getAttributes("textStyle").fontFamily as string | undefined) ?? "";
  const match = FONT_OPTIONS.find((f) => f.value === current);
  const selectValue = match ? match.value : current.length > 0 ? current : FONT_INHERIT;

  return (
    <Select
      value={selectValue}
      onValueChange={(v) => {
        if (v === FONT_INHERIT) {
          editor.chain().focus().unsetFontFamily().run();
        } else {
          editor.chain().focus().setFontFamily(v).run();
        }
      }}
    >
      <SelectTrigger className={FONT_TRIGGER} data-edit-allow="true">
        <SelectValue placeholder="Font" />
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={6}
        className="max-h-[min(70dvh,22rem)] w-[var(--radix-select-trigger-width)]"
      >
        {!match && current.length > 0 ? (
          <SelectItem value={current} className="min-h-11 py-3 text-base sm:min-h-0 sm:py-1.5 sm:text-sm">
            <span style={{ fontFamily: current }}>Current</span>
          </SelectItem>
        ) : null}
        {FONT_OPTIONS.map((f) => (
          <SelectItem
            key={f.label}
            value={f.value}
            className="min-h-11 py-3 text-base sm:min-h-0 sm:py-1.5 sm:text-sm"
          >
            <span style={f.value === FONT_INHERIT ? undefined : { fontFamily: f.value }}>{f.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ColorGrid({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={TOOLBAR_ICON_BTN}
          title="Text color"
          aria-label="Text color"
          data-edit-allow="true"
          onPointerDown={(event) => event.preventDefault()}
        >
          <Palette className={TOOLBAR_ICON} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(100vw-1.5rem,16rem)] max-w-[calc(100vw-1.25rem)] p-4"
        align="start"
        sideOffset={8}
        collisionPadding={12}
        data-edit-allow="true"
      >
        <p className="text-sm text-muted-foreground mb-3">Text color</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              className={cn(
                SWATCH,
                "shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              style={{ backgroundColor: c }}
              onClick={() => editor.chain().focus().setColor(c).run()}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          className="mt-3 w-full min-h-11 text-sm sm:min-h-9 sm:text-xs"
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          Reset color
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function HighlightMenu({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={editor.isActive("highlight") ? "secondary" : "outline"}
          size="sm"
          className={TOOLBAR_ICON_BTN}
          title="Highlight"
          aria-label="Highlight"
          data-edit-allow="true"
          onPointerDown={(event) => event.preventDefault()}
        >
          <Highlighter className={TOOLBAR_ICON} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(100vw-1.5rem,16rem)] max-w-[calc(100vw-1.25rem)] p-4"
        align="start"
        sideOffset={8}
        collisionPadding={12}
        data-edit-allow="true"
      >
        <p className="text-sm text-muted-foreground mb-3">Highlight</p>
        <div className="flex flex-wrap gap-2">
          {["#fef08a", "#bbf7d0", "#bfdbfe", "#fecaca", "#e9d5ff"].map((c) => (
            <button
              key={c}
              type="button"
              className={cn(SWATCH, "shrink-0")}
              style={{ backgroundColor: c }}
              onClick={() => editor.chain().focus().toggleHighlight({ color: c }).run()}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          className="mt-3 w-full min-h-11 text-sm sm:min-h-9 sm:text-xs"
          onClick={() => editor.chain().focus().unsetHighlight().run()}
        >
          Remove highlight
        </Button>
      </PopoverContent>
    </Popover>
  );
}

function FormatBubbleMenu({ editor }: { editor: Editor }) {
  return (
    <div className="flex max-w-[calc(100vw-20px)] flex-wrap items-center gap-0.5 rounded-lg border border-border bg-popover/95 p-1 shadow-lg backdrop-blur-sm">
      <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className={TOOLBAR_ICON} />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className={TOOLBAR_ICON} />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className={TOOLBAR_ICON} />
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className={TOOLBAR_ICON} />
      </ToolbarButton>
      <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code className={TOOLBAR_ICON} />
      </ToolbarButton>
      <ToolbarButton
        title="Superscript"
        active={editor.isActive("superscript")}
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <Superscript className={TOOLBAR_ICON} />
      </ToolbarButton>
      <ToolbarButton
        title="Subscript"
        active={editor.isActive("subscript")}
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      >
        <Subscript className={TOOLBAR_ICON} />
      </ToolbarButton>
    </div>
  );
}

function CharacterCountBar({ editor }: { editor: Editor }) {
  const storage = editor.storage.characterCount as { characters: () => number; words: () => number } | undefined;
  if (!storage) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/30 px-2 py-1.5 text-[11px] text-muted-foreground sm:text-xs">
      <span>
        {storage.characters()} characters · {storage.words()} words
      </span>
    </div>
  );
}

function EditorToolbar({ editor }: { editor: Editor }) {
  const [, tick] = useState(0);
  const rerender = useCallback(() => tick((n) => n + 1), []);

  useEffect(() => {
    editor.on("transaction", rerender);
    return () => {
      editor.off("transaction", rerender);
    };
  }, [editor, rerender]);

  return (
    <div className="rich-text-toolbar-scroll rounded-t-md w-full max-w-full overflow-x-auto overscroll-x-contain border-b border-border bg-muted/95 shadow-sm backdrop-blur-sm max-sm:touch-pan-x sm:bg-muted/40 sm:shadow-none">
      <div
        className="flex min-h-[52px] min-w-min flex-nowrap items-center gap-1.5 p-2 sm:flex-wrap sm:gap-1 sm:min-h-10"
        data-edit-allow="true"
      >
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 className={TOOLBAR_ICON} />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-0.5 hidden h-9 shrink-0 sm:block sm:h-6" />
        <HeadingSelect editor={editor} />
        <Separator orientation="vertical" className="mx-0.5 hidden h-9 shrink-0 sm:block sm:h-6" />
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className={TOOLBAR_ICON} />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-0.5 hidden h-9 shrink-0 sm:block sm:h-6" />
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton
          title="Task list"
          active={editor.isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <ListTodo className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton
          title="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton
          title="Superscript"
          active={editor.isActive("superscript")}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <Superscript className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton
          title="Subscript"
          active={editor.isActive("subscript")}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <Subscript className={TOOLBAR_ICON} />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-0.5 hidden h-9 shrink-0 sm:block sm:h-6" />
        <TableStructureDropdown editor={editor} />
        <ImagePopover editor={editor} />
        <YoutubePopover editor={editor} />
        <Separator orientation="vertical" className="mx-0.5 hidden h-9 shrink-0 sm:block sm:h-6" />
        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className={TOOLBAR_ICON} />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-0.5 hidden h-9 shrink-0 sm:block sm:h-6" />
        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className={TOOLBAR_ICON} />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className={TOOLBAR_ICON} />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-0.5 hidden h-9 shrink-0 sm:block sm:h-6" />
        <LinkPopover editor={editor} />
        <FontSelect editor={editor} />
        <ColorGrid editor={editor} />
        <HighlightMenu editor={editor} />
        <Separator orientation="vertical" className="mx-0.5 hidden h-9 shrink-0 sm:block sm:h-6" />
        <ToolbarButton
          title="Clear marks"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <RemoveFormatting className={TOOLBAR_ICON} />
        </ToolbarButton>
      </div>
    </div>
  );
}

export interface RichTextEditorProps {
  /** Raw stored value (HTML or legacy plain text). */
  initialValue: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  /** Minimum height of the editing area in pixels (avoids Tailwind JIT gaps for dynamic classes). */
  minHeightPx?: number;
}

export function RichTextEditor({
  initialValue,
  onChange,
  placeholder = "Write here…",
  className,
  editorClassName,
  minHeightPx = 160,
}: RichTextEditorProps) {
  const content = normalizeEditorHtml(initialValue);

  const editor = useEditor({
    extensions: buildRichTextExtensions(placeholder),
    content,
    editorProps: {
      attributes: {
        class: cn(
          "tiptap prose max-w-none dark:prose-invert sm:prose-sm focus:outline-none px-3 py-3 sm:py-2",
          "[&_a]:cursor-pointer",
          editorClassName,
        ),
        style: `min-height: ${minHeightPx}px`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  if (!editor) {
    return (
      <div
        className={cn(
          "rounded-md border border-input bg-muted/50 animate-pulse max-sm:min-h-[12rem]",
          className,
        )}
        style={{ minHeight: minHeightPx }}
      />
    );
  }

  return (
    <div
      className={cn(
        "rich-text-surface overflow-hidden rounded-md border border-input bg-background shadow-sm",
        "max-sm:flex max-sm:max-h-[min(78dvh,38rem)] max-sm:flex-col",
        className,
      )}
      data-edit-allow="true"
    >
      <div className="max-sm:sticky max-sm:top-0 max-sm:z-20 max-sm:shrink-0">
        <EditorToolbar editor={editor} />
      </div>
      <div className="max-sm:min-h-0 max-sm:flex-1 max-sm:overflow-y-auto max-sm:overscroll-y-contain">
        <EditorContent editor={editor} />
        <BubbleMenu
          editor={editor}
          tippyOptions={{
            duration: 120,
            placement: "top",
            maxWidth: "calc(100vw - 16px)",
            zIndex: 70,
          }}
          className="z-[70]"
        >
          <FormatBubbleMenu editor={editor} />
        </BubbleMenu>
      </div>
      <CharacterCountBar editor={editor} />
    </div>
  );
}
