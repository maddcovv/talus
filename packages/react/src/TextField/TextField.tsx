import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  Label,
  Input,
  TextArea,
  Text,
  FieldError,
} from "react-aria-components";
import { WarningCircle } from "@phosphor-icons/react";
import { cx } from "../cx";
import field from "../shared/field.module.css";
import styles from "./TextField.module.css";

export interface TextFieldProps extends Omit<AriaTextFieldProps, "className" | "children"> {
  /** Visible label. Every input gets one. */
  label: string;
  /** Helper text under the input, tied with aria-describedby. */
  hint?: string;
  /** Error text. Setting it marks the field invalid. Shown with an icon, never color alone. */
  errorMessage?: string;
  placeholder?: string;
  /** Renders a textarea instead of a one-line input. */
  multiline?: boolean;
  /** Visible rows when multiline. */
  rows?: number;
  className?: string;
}

export function TextField({
  label,
  hint,
  errorMessage,
  placeholder,
  multiline = false,
  rows = 4,
  className,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField
      {...props}
      isInvalid={props.isInvalid ?? (errorMessage ? true : undefined)}
      className={cx(field.field, className)}
    >
      <Label className={field.label}>{label}</Label>
      {multiline ? (
        <TextArea className={cx(styles.input, styles.textarea)} placeholder={placeholder} rows={rows} />
      ) : (
        <Input className={styles.input} placeholder={placeholder} />
      )}
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
    </AriaTextField>
  );
}
