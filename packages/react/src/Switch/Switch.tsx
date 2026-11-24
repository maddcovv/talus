import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components";
import { cx } from "../cx";
import styles from "./Switch.module.css";

export interface SwitchProps extends Omit<AriaSwitchProps, "className" | "children"> {
  className?: string;
  children?: React.ReactNode;
}

export function Switch({ className, children, ...props }: SwitchProps) {
  return (
    <AriaSwitch {...props} className={cx(styles.switch, className)}>
      <span className={styles.track} aria-hidden>
        <span className={styles.thumb} />
      </span>
      {children}
    </AriaSwitch>
  );
}
