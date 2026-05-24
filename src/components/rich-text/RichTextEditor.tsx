import { useCallback, useEffect, useState } from "react";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Palette,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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

function buildExtensions(placeholder: string) {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      codeBlock: false,
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      HTMLAttributes: {
        class: "underline underline-offset-2 text-gold",
      },
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    Color,
    FontFamily.configure({
      types: ["textStyle"],
    }),
    Highlight.configure({
      multicolor: true,
    }),
    Placeholder.configure({
      placeholder,
    }),
  ];
}

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
      className="h-8 w-8 shrink-0 p-0"
      data-edit-allow="true"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onClick()}
    >
      {children}
    </Button>
  );
}

function HeadingSelect({ editor }: { editor: Editor }) {
  const value = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : "p";

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next === "p") {
          editor.chain().focus().setParagraph().run();
        } else {
          const level = Number(next.replace("h", "")) as 1 | 2 | 3;
          editor.chain().focus().toggleHeading({ level }).run();
        }
      }}
    >
      <SelectTrigger className="h-8 w-[124px] text-xs" data-edit-allow="true">
        <SelectValue placeholder="Style" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="p">Paragraph</SelectItem>
        <SelectItem value="h1">Heading 1</SelectItem>
        <SelectItem value="h2">Heading 2</SelectItem>
        <SelectItem value="h3">Heading 3</SelectItem>
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
          className="h-8 w-8 shrink-0 p-0"
          title="Link"
          aria-label="Insert link"
          data-edit-allow="true"
        >
          <Link2 className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start" data-edit-allow="true">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted-foreground" htmlFor="rich-link-url">
            URL
          </label>
          <Input
            id="rich-link-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                apply();
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={apply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
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
      <SelectTrigger className="h-8 w-[148px] text-xs" data-edit-allow="true">
        <SelectValue placeholder="Font" />
      </SelectTrigger>
      <SelectContent>
        {!match && current.length > 0 ? (
          <SelectItem value={current}>
            <span style={{ fontFamily: current }}>Current</span>
          </SelectItem>
        ) : null}
        {FONT_OPTIONS.map((f) => (
          <SelectItem key={f.label} value={f.value}>
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
          className="h-8 w-8 shrink-0 p-0"
          title="Text color"
          aria-label="Text color"
          data-edit-allow="true"
        >
          <Palette className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start" data-edit-allow="true">
        <p className="text-xs text-muted-foreground mb-2">Text color</p>
        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              className="h-7 w-7 rounded-md border border-border shrink-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ backgroundColor: c }}
              onClick={() => editor.chain().focus().setColor(c).run()}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 w-full text-xs"
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
          className="h-8 w-8 shrink-0 p-0"
          title="Highlight"
          aria-label="Highlight"
          data-edit-allow="true"
        >
          <Highlighter className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start" data-edit-allow="true">
        <p className="text-xs text-muted-foreground mb-2">Highlight</p>
        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
          {["#fef08a", "#bbf7d0", "#bfdbfe", "#fecaca", "#e9d5ff"].map((c) => (
            <button
              key={c}
              type="button"
              className="h-7 w-7 rounded-md border border-border shrink-0"
              style={{ backgroundColor: c }}
              onClick={() => editor.chain().focus().toggleHighlight({ color: c }).run()}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 w-full text-xs"
          onClick={() => editor.chain().focus().unsetHighlight().run()}
        >
          Remove highlight
        </Button>
      </PopoverContent>
    </Popover>
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
    <div className="w-full max-w-full overflow-x-auto border-b border-border bg-muted/40 rounded-t-md">
      <div className="flex flex-wrap items-center gap-1 p-2 min-h-10 min-w-min" data-edit-allow="true">
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <HeadingSelect editor={editor} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Justify"
          active={editor.isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="h-3.5 w-3.5" />
        </ToolbarButton>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <LinkPopover editor={editor} />
        <FontSelect editor={editor} />
        <ColorGrid editor={editor} />
        <HighlightMenu editor={editor} />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <ToolbarButton
          title="Clear formatting"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          <RemoveFormatting className="h-3.5 w-3.5" />
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
    extensions: buildExtensions(placeholder),
    content,
    editorProps: {
      attributes: {
        class: cn(
          "tiptap prose prose-sm dark:prose-invert max-w-none focus:outline-none px-3 py-2",
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
        className={cn("rounded-md border border-input bg-muted/50 animate-pulse", className)}
        style={{ minHeight: minHeightPx }}
      />
    );
  }

  return (
    <div
      className={cn(
        "rich-text-surface rounded-md border border-input bg-background shadow-sm overflow-hidden",
        className,
      )}
      data-edit-allow="true"
    >
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
