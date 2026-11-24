import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Dialog, DialogTrigger, TextField } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    docs: {
      story: { inline: false, iframeHeight: 420 },
    },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DialogTrigger>
      <Button variant="danger">Remove listing</Button>
      <Dialog title="Remove this listing?">
        {({ close }) => (
          <>
            <p style={{ margin: 0 }}>
              Shoppers stop seeing it right away. Order history stays on the account.
            </p>
            <div style={{ display: "flex", gap: "var(--talus-space-2)", justifyContent: "flex-end" }}>
              <Button variant="secondary" onPress={close}>
                Keep listing
              </Button>
              <Button variant="danger" onPress={close}>
                Remove listing
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

export const WithForm: Story = {
  render: () => (
    <DialogTrigger>
      <Button>Rename shop</Button>
      <Dialog title="Rename your shop">
        {({ close }) => (
          <>
            <TextField
              label="Shop name"
              hint="Shown on your public seller page."
              defaultValue="Juniper Supply Co."
              autoFocus
            />
            <div style={{ display: "flex", gap: "var(--talus-space-2)", justifyContent: "flex-end" }}>
              <Button variant="secondary" onPress={close}>
                Cancel
              </Button>
              <Button onPress={close}>Save name</Button>
            </div>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

export const InitiallyOpen: Story = {
  render: () => (
    <DialogTrigger defaultOpen>
      <Button variant="danger">Remove listing</Button>
      <Dialog title="Remove this listing?">
        {({ close }) => (
          <>
            <p style={{ margin: 0 }}>
              Shoppers stop seeing it right away. Order history stays on the account.
            </p>
            <div style={{ display: "flex", gap: "var(--talus-space-2)", justifyContent: "flex-end" }}>
              <Button variant="secondary" onPress={close}>
                Keep listing
              </Button>
              <Button variant="danger" onPress={close}>
                Remove listing
              </Button>
            </div>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

export const Modes: Story = {
  parameters: { docs: { story: { inline: true } } },
  render: () => (
    <ModeSplit>
      <DialogTrigger>
        <Button variant="danger">Remove listing</Button>
        <Dialog title="Remove this listing?">
          {({ close }) => (
            <Button variant="secondary" onPress={close}>
              Keep listing
            </Button>
          )}
        </Dialog>
      </DialogTrigger>
    </ModeSplit>
  ),
};
