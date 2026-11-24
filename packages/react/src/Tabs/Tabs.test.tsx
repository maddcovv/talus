import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Tabs, TabList, Tab, TabPanel } from "./Tabs";

function OrderTabs() {
  return (
    <Tabs>
      <TabList aria-label="Order details">
        <Tab id="items">Items</Tab>
        <Tab id="shipping">Shipping</Tab>
        <Tab id="history">History</Tab>
      </TabList>
      <TabPanel id="items">Three items in this order.</TabPanel>
      <TabPanel id="shipping">Ships from the valley warehouse.</TabPanel>
      <TabPanel id="history">Placed last Tuesday.</TabPanel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("switches panels on click", async () => {
    const user = userEvent.setup();
    render(<OrderTabs />);
    expect(screen.getByText("Three items in this order.")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Shipping" }));
    expect(screen.getByText("Ships from the valley warehouse.")).toBeInTheDocument();
    expect(screen.queryByText("Three items in this order.")).not.toBeInTheDocument();
  });

  it("moves between tabs with arrow keys", async () => {
    const user = userEvent.setup();
    render(<OrderTabs />);
    const first = screen.getByRole("tab", { name: "Items" });

    await user.click(first);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Shipping" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    await user.keyboard("{ArrowLeft}");
    expect(first).toHaveAttribute("aria-selected", "true");
  });

  it("has no axe violations", async () => {
    const { container } = render(<OrderTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
