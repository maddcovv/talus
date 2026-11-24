import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { CircleNotch } from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<AriaButtonProps, "className" | "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and blocks presses. The label stays visible. */
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      {...props}
      isDisabled={isDisabled || isLoading}
      data-variant={variant}
      data-size={size}
      data-loading={isLoading || undefined}
      className={cx(styles.button, className)}
    >
      {isLoading && <CircleNotch aria-hidden className={styles.spinner} />}
      <span className={styles.label}>{children}</span>
    </AriaButton>
  );
}
