import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components";
import { Check, Minus } from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./Checkbox.module.css";

export interface CheckboxProps extends Omit<AriaCheckboxProps, "className" | "children"> {
  className?: string;
  children?: React.ReactNode;
}

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox {...props} className={cx(styles.checkbox, className)}>
      {({ isIndeterminate }) => (
        <>
          <span className={styles.box} aria-hidden>
            {isIndeterminate ? (
              <Minus weight="bold" className={styles.mark} />
            ) : (
              <Check weight="bold" className={styles.mark} />
            )}
          </span>
          {children}
        </>
      )}
    </AriaCheckbox>
  );
}
