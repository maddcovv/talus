import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { FileUpload } from "./FileUpload";

describe("FileUpload", () => {
  it("shows the accepted types and size limit before upload", () => {
    render(<FileUpload label="Resume" accept={[".pdf", ".docx"]} maxSizeMb={10} />);
    expect(screen.getByText("Accepts PDF or DOCX, up to 10 MB.")).toBeInTheDocument();
  });

  it("passes a picked file to onSelect", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = render(
      <FileUpload label="Resume" accept={[".pdf"]} onSelect={onSelect} />
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["resume"], "june-halloran-resume.pdf", { type: "application/pdf" });
    await user.upload(input, file);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0][0].name).toBe("june-halloran-resume.pdf");
  });

  it("shows the error in words and retries", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <FileUpload
        label="Resume"
        status="error"
        errorMessage="That file is too big. The limit is 10 MB."
        onRetry={onRetry}
      />
    );
    expect(screen.getByText("That file is too big. The limit is 10 MB.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("has no axe violations in any state", async () => {
    const { container } = render(
      <>
        <FileUpload label="Resume" accept={[".pdf"]} maxSizeMb={10} />
        <FileUpload label="Cover letter" status="uploading" progress={40} fileName="letter.pdf" />
        <FileUpload label="Portfolio" status="success" fileName="work.pdf" onRemove={() => {}} />
        <FileUpload label="Reference" status="error" errorMessage="The upload failed." onRetry={() => {}} />
      </>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
