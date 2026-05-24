import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import StarterKit from "@tiptap/starter-kit";
import type { Extensions } from "@tiptap/core";

export function buildRichTextExtensions(placeholder: string): Extensions {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4, 5, 6] },
      codeBlock: {},
    }),
    Typography,
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
      types: ["heading", "paragraph", "tableCell", "tableHeader"],
    }),
    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: "max-h-[min(420px,70vh)] w-auto max-w-full rounded-md",
      },
    }),
    Youtube.configure({
      width: 640,
      height: 360,
      nocookie: true,
      modestBranding: true,
      HTMLAttributes: {
        class: "max-w-full overflow-hidden rounded-md",
      },
    }),
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: "border-collapse overflow-hidden rounded-md border border-border text-sm",
      },
    }),
    TableRow,
    TableHeader,
    TableCell,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    Subscript,
    Superscript,
    TextStyle,
    Color,
    FontFamily.configure({
      types: ["textStyle"],
    }),
    Highlight.configure({
      multicolor: true,
    }),
    CharacterCount.configure(),
    Placeholder.configure({
      placeholder,
    }),
  ];
}
