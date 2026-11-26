import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OneTimeCodeInput } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

function Controlled(props: { errorMessage?: string; hint?: string; start?: string }) {
  const [value, setValue] = useState(props.start ?? "");
  return (
    <OneTimeCodeInput
      label="Enter the 6 digit code"
      hint={props.hint}
      errorMessage={props.errorMessage}
      value={value}
      onChange={setValue}
    />
  );
}

const meta = {
  title: "Components/OneTimeCodeInput",
  component: OneTimeCodeInput,
  args: {
    label: "Enter the 6 digit code",
    value: "",
    onChange: () => {},
  },
} satisfies Meta<typeof OneTimeCodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Controlled hint="We texted it to the number on your application." />,
};

export const PartlyFilled: Story = {
  render: () => <Controlled start="482" />,
};

export const WithError: Story = {
  render: () => (
    <Controlled
      start="111111"
      errorMessage="That code did not match. Check the newest message, or resend the code."
    />
  ),
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <Controlled start="4829" />
    </ModeSplit>
  ),
};
