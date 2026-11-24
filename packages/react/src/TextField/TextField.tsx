import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  Label,
  Input,
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
  className?: string;
}

export function TextField({
  label,
  hint,
  errorMessage,
  placeholder,
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
      <Input className={styles.input} placeholder={placeholder} />
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
