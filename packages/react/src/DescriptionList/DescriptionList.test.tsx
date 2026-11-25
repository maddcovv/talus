import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { MapPin } from "@phosphor-icons/react";
import { DescriptionList } from "./DescriptionList";

const items = [
  { icon: <MapPin />, label: "Location", value: "Salida, Colorado" },
  { label: "Pay", value: "$56,000 to $64,000 a year" },
];

describe("DescriptionList", () => {
  it("renders each label and value as a definition pair", () => {
    render(<DescriptionList aria-label="Key facts" items={items} />);
    const terms = screen.getAllByRole("term");
    expect(terms.map((term) => term.textContent)).toEqual(["Location", "Pay"]);
    expect(screen.getAllByRole("definition")).toHaveLength(2);
    expect(screen.getByText("Salida, Colorado")).toBeInTheDocument();
    expect(screen.getByText("$56,000 to $64,000 a year")).toBeInTheDocument();
  });

  it("hides icons from assistive tech", () => {
    const { container } = render(<DescriptionList items={items} />);
    const icon = container.querySelector("svg");
    expect(icon?.closest("[aria-hidden]")).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(<DescriptionList aria-label="Key facts" items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
