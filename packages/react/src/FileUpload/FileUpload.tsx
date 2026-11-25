import { useId } from "react";
import {
  DropZone,
  FileTrigger,
  ProgressBar,
  Button as AriaButton,
} from "react-aria-components";
import {
  UploadSimple,
  FileText,
  CheckCircle,
  WarningCircle,
  ArrowClockwise,
  X,
} from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./FileUpload.module.css";
import fieldStyles from "../shared/field.module.css";

export type FileUploadStatus = "idle" | "uploading" | "success" | "error";

export interface FileUploadProps {
  /** Visible label above the drop area. */
  label: string;
  /** Accepted types as extensions or MIME types, e.g. [".pdf", ".docx"]. Shown before upload and passed to the file picker. */
  accept?: string[];
  /** Size limit in megabytes, shown before upload. Enforcing it is the caller's job. */
  maxSizeMb?: number;
  status?: FileUploadStatus;
  /** 0 to 100, used while status is "uploading". */
  progress?: number;
  /** Name of the chosen file, shown while uploading and after success. */
  fileName?: string;
  /** Plain words, e.g. "That file is a .png. This field takes PDF or Word files." */
  errorMessage?: string;
  onSelect?: (files: File[]) => void;
  onRetry?: () => void;
  onRemove?: () => void;
  className?: string;
}

const prettyTypes = (accept: string[]) =>
  accept.map((t) => t.replace(/^\./, "").toUpperCase()).join(" or ");

export function FileUpload({
  label,
  accept,
  maxSizeMb,
  status = "idle",
  progress = 0,
  fileName,
  errorMessage,
  onSelect,
  onRetry,
  onRemove,
  className,
}: FileUploadProps) {
  const labelId = useId();
  const requirementsId = useId();

  const requirements = [
    accept && accept.length > 0 ? `Accepts ${prettyTypes(accept)}` : null,
    maxSizeMb ? `up to ${maxSizeMb} MB` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const handleFiles = (files: File[]) => {
    if (files.length > 0) onSelect?.(files);
  };

  return (
    <div className={cx(fieldStyles.field, className)}>
      <span id={labelId} className={fieldStyles.label}>
        {label}
      </span>
      <DropZone
        aria-labelledby={labelId}
        aria-describedby={requirements ? requirementsId : undefined}
        className={styles.dropzone}
        data-status={status}
        onDrop={async (e) => {
          const files: File[] = [];
          for (const item of e.items) {
            if (item.kind === "file") files.push(await item.getFile());
          }
          handleFiles(files);
        }}
      >
        {status === "idle" && (
          <div className={styles.body}>
            <UploadSimple aria-hidden className={styles.bigIcon} />
            <p className={styles.prompt}>Drag a file here, or</p>
            <FileTrigger
              acceptedFileTypes={accept}
              onSelect={(list) => {
                if (list) handleFiles(Array.from(list));
              }}
            >
              <AriaButton className={styles.chooseButton}>Choose a file</AriaButton>
            </FileTrigger>
            {requirements && (
              <p id={requirementsId} className={fieldStyles.hint}>
                {requirements}.
              </p>
            )}
          </div>
        )}

        {status === "uploading" && (
          <div className={styles.body}>
            <FileText aria-hidden className={styles.bigIcon} />
            <p className={styles.fileName}>{fileName}</p>
            <ProgressBar
              aria-label={`Uploading ${fileName ?? "file"}`}
              value={progress}
              className={styles.progress}
            >
              {({ percentage }) => (
                <>
                  <div className={styles.track}>
                    <div className={styles.fill} style={{ width: `${percentage ?? 0}%` }} />
                  </div>
                  <span className={fieldStyles.hint}>{Math.round(percentage ?? 0)}% uploaded</span>
                </>
              )}
            </ProgressBar>
          </div>
        )}

        {status === "success" && (
          <div className={styles.body}>
            <CheckCircle aria-hidden weight="fill" className={cx(styles.bigIcon, styles.successIcon)} />
            <p className={styles.fileName}>{fileName}</p>
            <p className={fieldStyles.hint}>Uploaded.</p>
            {onRemove && (
              <AriaButton className={styles.chooseButton} onPress={onRemove}>
                <X aria-hidden className={styles.buttonIcon} />
                Remove
              </AriaButton>
            )}
          </div>
        )}

        {status === "error" && (
          <div className={styles.body}>
            <p className={fieldStyles.error}>
              <WarningCircle aria-hidden weight="fill" className={fieldStyles.errorIcon} />
              {errorMessage ?? "The upload failed."}
            </p>
            <div className={styles.errorActions}>
              {onRetry && (
                <AriaButton className={styles.chooseButton} onPress={onRetry}>
                  <ArrowClockwise aria-hidden className={styles.buttonIcon} />
                  Try again
                </AriaButton>
              )}
              <FileTrigger
                acceptedFileTypes={accept}
                onSelect={(list) => {
                  if (list) handleFiles(Array.from(list));
                }}
              >
                <AriaButton className={styles.chooseButton}>Choose a different file</AriaButton>
              </FileTrigger>
            </div>
          </div>
        )}
      </DropZone>
    </div>
  );
}
