import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { EditableText } from "@/components/EditableText";

describe("EditableText", () => {
  it("shows edit chrome and opens editor on click when edit mode is on", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(
      <EditableText
        value="Hello"
        isAdmin
        isEditMode
        fieldLabel="hero.title"
        onSave={onSave}
        as="h1"
      />,
    );

    const region = screen.getByText("Hello").closest("[data-editable-region]");
    expect(region).not.toBeNull();
    fireEvent.click(region!);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("Hello");

    fireEvent.change(input, { target: { value: "Updated" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith("Updated");
    });
  });

  it("renders plain text without chrome when edit mode is off", () => {
    render(
      <EditableText value="Hello" isAdmin isEditMode={false} onSave={vi.fn()} as="p" />,
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
  });
});
