import {
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  Radio as AriaRadio,
  type RadioProps as AriaRadioProps,
  Label,
  Text,
  FieldError,
} from "react-aria-components";
import { WarningCircle } from "@phosphor-icons/react";
import { cx } from "../cx";
import field from "../shared/field.module.css";
import styles from "./RadioGroup.module.css";

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, "className" | "children"> {
  /** Visible group label. */
  label: string;
  hint?: string;
  /** Error text. Setting it marks the group invalid. Shown with an icon, never color alone. */
  errorMessage?: string;
  className?: string;
  children?: React.ReactNode;
}

export function RadioGroup({
  label,
  hint,
  errorMessage,
  className,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <AriaRadioGroup
      {...props}
      isInvalid={props.isInvalid ?? (errorMessage ? true : undefined)}
      className={cx(field.field, className)}
    >
      <Label className={field.label}>{label}</Label>
      <div className={styles.options}>{children}</div>
      {hint ? (
        <Text slot="description" className={field.hint}>
          {hint}
        </Text>
      ) : null}
      <FieldError className={field.error}>
        {({ validationErrors }) => (
          <>
            <WarningCircle aria-hidden weight="fill" className={field.errorIcon} />
            {errorMessage ?? validationErrors.join(" ")}
          </>
        )}
      </FieldError>
    </AriaRadioGroup>
  );
}

export interface RadioProps extends Omit<AriaRadioProps, "className" | "children"> {
  className?: string;
  children?: React.ReactNode;
}

export function Radio({ className, children, ...props }: RadioProps) {
  return (
    <AriaRadio {...props} className={cx(styles.radio, className)}>
      <span className={styles.circle} aria-hidden />
      {children}
    </AriaRadio>
  );
}
