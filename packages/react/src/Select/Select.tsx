import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  Button,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  Label,
  Text,
  FieldError,
} from "react-aria-components";
import { CaretDown, Check, WarningCircle } from "@phosphor-icons/react";
import { cx } from "../cx";
import field from "../shared/field.module.css";
import styles from "./Select.module.css";

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, "className" | "children"> {
  /** Visible label. */
  label: string;
  hint?: string;
  /** Error text. Setting it marks the field invalid. Shown with an icon, never color alone. */
  errorMessage?: string;
  className?: string;
  children: React.ReactNode | ((item: T) => React.ReactNode);
  items?: Iterable<T>;
}

export function Select<T extends object>({
  label,
  hint,
  errorMessage,
  className,
  children,
  items,
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect
      {...props}
      isInvalid={props.isInvalid ?? (errorMessage ? true : undefined)}
      className={cx(field.field, className)}
    >
      <Label className={field.label}>{label}</Label>
      <Button className={styles.trigger}>
        <SelectValue className={styles.value} />
        <CaretDown aria-hidden className={styles.caret} />
      </Button>
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
      <Popover className={styles.popover}>
        <ListBox className={styles.listbox} items={items}>
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export interface SelectItemProps extends Omit<ListBoxItemProps, "className" | "children"> {
  className?: string;
  children: React.ReactNode;
}

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <ListBoxItem
      {...props}
      textValue={props.textValue ?? (typeof children === "string" ? children : undefined)}
      className={cx(styles.item, className)}
    >
      {({ isSelected }) => (
        <>
          <span className={styles.itemLabel}>{children}</span>
          {isSelected ? <Check aria-hidden weight="bold" className={styles.itemCheck} /> : null}
        </>
      )}
    </ListBoxItem>
  );
}
