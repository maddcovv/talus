import { Button as AriaButton } from "react-aria-components";
import { Info, CheckCircle, Warning, WarningOctagon, X } from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./Toast.module.css";

export type ToastVariant = "info" | "success" | "warning" | "danger";

export interface ToastRegionProps {
  /** Accessible name for the region. */
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * The live region toasts appear in. Mount it once, near the app root, and
 * keep it mounted: a region that exists before the toast arrives is what
 * makes the announcement work.
 */
export function ToastRegion({ label = "Notifications", children, className }: ToastRegionProps) {
  return (
    <div role="region" aria-label={label} aria-live="polite" className={cx(styles.region, className)}>
      {children}
    </div>
  );
}

export interface ToastProps {
  variant?: ToastVariant;
  title?: string;
  /** Called when the dismiss button is pressed. Every toast can be dismissed. */
  onDismiss: () => void;
  children?: React.ReactNode;
  className?: string;
}

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  info: <Info weight="fill" />,
  success: <CheckCircle weight="fill" />,
  warning: <Warning weight="fill" />,
  danger: <WarningOctagon weight="fill" />,
};

export function Toast({ variant = "info", title, onDismiss, children, className }: ToastProps) {
  return (
    <div data-variant={variant} className={cx(styles.toast, className)}>
      <span aria-hidden className={styles.icon}>
        {variantIcons[variant]}
      </span>
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.body}>{children}</div>}
      </div>
      <AriaButton aria-label="Dismiss" className={styles.dismiss} onPress={onDismiss}>
        <X aria-hidden className={styles.dismissIcon} />
      </AriaButton>
    </div>
  );
}
