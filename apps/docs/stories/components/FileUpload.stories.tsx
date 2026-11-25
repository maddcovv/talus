import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUpload, type FileUploadStatus } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const meta = {
  title: "Components/FileUpload",
  component: FileUpload,
  args: {
    label: "Resume",
    accept: [".pdf", ".docx"],
    maxSizeMb: 10,
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Uploading: Story = {
  args: { status: "uploading", progress: 40, fileName: "june-ashby-resume.pdf" },
};

export const Success: Story = {
  args: { status: "success", fileName: "june-ashby-resume.pdf", onRemove: () => {} },
};

export const UploadError: Story = {
  args: {
    status: "error",
    errorMessage: "That file is a .png. This field takes PDF or Word files.",
    onRetry: () => {},
  },
};

/** The whole flow with real validation, in words. Pick or drop any file. */
export const Interactive: Story = {
  render: (args) => {
    const [status, setStatus] = useState<FileUploadStatus>("idle");
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>();

    const start = (files: File[]) => {
      const file = files[0];
      const okType = /\.(pdf|docx)$/i.test(file.name);
      if (!okType) {
        setStatus("error");
        setErrorMessage(`That file is ${file.name}. This field takes PDF or Word files.`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setStatus("error");
        setErrorMessage("That file is too big. The limit is 10 MB.");
        return;
      }
      setFileName(file.name);
      setStatus("uploading");
      setProgress(0);
      let p = 0;
      const tick = window.setInterval(() => {
        p += 20;
        setProgress(p);
        if (p >= 100) {
          window.clearInterval(tick);
          setStatus("success");
        }
      }, 300);
    };

    return (
      <FileUpload
        {...args}
        status={status}
        progress={progress}
        fileName={fileName}
        errorMessage={errorMessage}
        onSelect={start}
        onRetry={() => setStatus("idle")}
        onRemove={() => {
          setStatus("idle");
          setFileName(undefined);
        }}
      />
    );
  },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <FileUpload label="Resume" accept={[".pdf", ".docx"]} maxSizeMb={10} />
    </ModeSplit>
  ),
};
