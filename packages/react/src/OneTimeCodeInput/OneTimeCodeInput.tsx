import { useState } from "react";
import {
  TextField as AriaTextField,
  Label,
  Input,
  Text,
  FieldError,
} from "react-aria-components";
import { WarningCircle } from "@phosphor-icons/react";
import { cx } from "../cx";
import field from "../shared/field.module.css";
import styles from "./OneTimeCodeInput.module.css";

export interface OneTimeCodeInputProps {
  /** Visible label. */
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Number of digits. */
  length?: number;
  hint?: string;
  /** Error text, in words. Setting it marks the field invalid. */
  errorMessage?: string;
  /** Called once every digit is filled. */
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
}

/**
 * A one-time code as six drawn boxes over a single real input, so paste,
 * autofill (autocomplete="one-time-code") and screen readers all treat it
 * as one field. Digits only; errors come as words through errorMessage.
 */
export function OneTimeCodeInput({
  label,
  value,
  onChange,
  length = 6,
  hint,
  errorMessage,
  onComplete,
  autoFocus,
  className,
}: OneTimeCodeInputProps) {
  const [focused, setFocused] = useState(false);

  function handleChange(next: string) {
    const digits = next.replace(/\D/g, "").slice(0, length);
    onChange(digits);
    if (digits.length === length && digits !== value) onComplete?.(digits);
  }

  const activeIndex = Math.min(value.length, length - 1);

  return (
    <AriaTextField
      value={value}
      onChange={handleChange}
      isInvalid={errorMessage ? true : undefined}
      className={cx(field.field, className)}
    >
      <Label className={field.label}>{label}</Label>
      <div className={styles.wrap}>
        <Input
          className={styles.input}
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={length}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSelect={(event) => {
            // Typing appends: a plain caret is kept at the end. A real
            // selection (select all to replace the code) is left alone.
            const input = event.currentTarget;
            if (input.selectionStart === input.selectionEnd) {
              input.setSelectionRange(input.value.length, input.value.length);
            }
          }}
        />
        <div aria-hidden className={styles.boxes}>
          {Array.from({ length }, (_, index) => (
            <span
              key={index}
              className={cx(
                styles.box,
                focused && index === activeIndex && value.length < length && styles.activeBox,
              )}
            >
              {value[index] ?? ""}
            </span>
          ))}
        </div>
      </div>
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
