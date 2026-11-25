import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Toast, ToastRegion, type ToastVariant } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Toast",
  component: Toast,
  args: {
    title: "Draft saved",
    onDismiss: () => {},
  },
  parameters: {
    docs: { story: { inline: false, iframeHeight: 240 } },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Press the button; the toast lands in a polite live region bottom right. */
export const Default: Story = {
  render: () => {
    const [toasts, setToasts] = useState<{ id: number; variant: ToastVariant; title: string }[]>([]);
    return (
      <>
        <Button
          onPress={() =>
            setToasts((t) => [...t, { id: Date.now(), variant: "success", title: "Draft saved" }])
          }
        >
          Save draft
        </Button>
        <ToastRegion>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              variant={t.variant}
              title={t.title}
              onDismiss={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
            />
          ))}
        </ToastRegion>
      </>
    );
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--talus-space-2)" }}>
      <Toast variant="info" title="Two Track Supply viewed your application" onDismiss={() => {}} />
      <Toast variant="success" title="Application sent" onDismiss={() => {}} />
      <Toast variant="warning" title="You are offline" onDismiss={() => {}}>
        Changes save when the connection returns.
      </Toast>
      <Toast variant="danger" title="The upload failed" onDismiss={() => {}}>
        The error also shows on the Resume step.
      </Toast>
    </div>
  ),
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <Toast variant="success" title="Application sent" onDismiss={() => {}} />
    </ModeSplit>
  ),
};
