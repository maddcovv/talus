import { Button as AriaButton } from "react-aria-components";
import { Info, CheckCircle, Warning, WarningOctagon, X } from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./InlineAlert.module.css";

export type InlineAlertVariant = "info" | "success" | "warning" | "danger";

export interface InlineAlertProps {
  variant?: InlineAlertVariant;
  title?: string;
  /** Called when the dismiss button is pressed. Without it there is no dismiss button. */
  onDismiss?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const variantIcons: Record<InlineAlertVariant, React.ReactNode> = {
  info: <Info weight="fill" />,
  success: <CheckCircle weight="fill" />,
  warning: <Warning weight="fill" />,
  danger: <WarningOctagon weight="fill" />,
};

export function InlineAlert({
  variant = "info",
  title,
  onDismiss,
  children,
  className,
}: InlineAlertProps) {
  return (
    <div data-variant={variant} className={cx(styles.alert, className)}>
      <span aria-hidden className={styles.icon}>
        {variantIcons[variant]}
      </span>
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        {children && <div className={styles.body}>{children}</div>}
      </div>
      {onDismiss && (
        <AriaButton aria-label="Dismiss" className={styles.dismiss} onPress={onDismiss}>
          <X aria-hidden className={styles.dismissIcon} />
        </AriaButton>
      )}
    </div>
  );
}
