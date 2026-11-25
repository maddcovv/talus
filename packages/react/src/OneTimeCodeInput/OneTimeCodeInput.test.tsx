import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { OneTimeCodeInput } from "./OneTimeCodeInput";

function Example(props: { onComplete?: (value: string) => void; errorMessage?: string }) {
  const [value, setValue] = useState("");
  return (
    <OneTimeCodeInput
      label="Enter the 6 digit code"
      value={value}
      onChange={setValue}
      {...props}
    />
  );
}

describe("OneTimeCodeInput", () => {
  it("is one labeled field that takes typed digits", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const input = screen.getByLabelText("Enter the 6 digit code");
    await user.click(input);
    await user.keyboard("4829");
    expect(input).toHaveDisplayValue("4829");
  });

  it("ignores anything that is not a digit", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const input = screen.getByLabelText("Enter the 6 digit code");
    await user.click(input);
    await user.keyboard("4a8-b2");
    expect(input).toHaveDisplayValue("482");
  });

  it("lets select all replace the whole code", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const input = screen.getByLabelText("Enter the 6 digit code");
    await user.click(input);
    await user.keyboard("111111");
    await user.keyboard("{Control>}a{/Control}{Backspace}482913");
    expect(input).toHaveDisplayValue("482913");
  });

  it("accepts a pasted code and reports completion", async () => {
    const onComplete = vi.fn();
    const user = userEvent.setup();
    render(<Example onComplete={onComplete} />);
    await user.click(screen.getByLabelText("Enter the 6 digit code"));
    await user.paste("482913");
    expect(onComplete).toHaveBeenCalledWith("482913");
  });

  it("shows errors in words and stays accessible", async () => {
    const { container } = render(<Example errorMessage="That code did not match." />);
    expect(screen.getByText("That code did not match.")).toBeInTheDocument();
    expect(screen.getByLabelText("Enter the 6 digit code")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when clean", async () => {
    const { container } = render(<Example />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
