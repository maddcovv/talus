import {
  DialogTrigger,
  Dialog as AriaDialog,
  Modal,
  ModalOverlay,
  Heading,
} from "react-aria-components";
import type { DialogProps as AriaDialogProps, ModalOverlayProps } from "react-aria-components";
import { cx } from "../cx";
import styles from "./Dialog.module.css";

export { DialogTrigger };

export interface DialogProps
  extends Omit<AriaDialogProps, "className" | "children">,
    Pick<ModalOverlayProps, "isOpen" | "defaultOpen" | "onOpenChange" | "isDismissable"> {
  /** Dialog heading. Wired to the dialog with aria-labelledby. */
  title: string;
  className?: string;
  children?: React.ReactNode | ((opts: { close: () => void }) => React.ReactNode);
}

/**
 * Modal dialog. Escape closes it, focus is trapped inside while open, and
 * focus returns to the trigger on close. Use inside a DialogTrigger, or
 * control it with isOpen and onOpenChange.
 */
export function Dialog({
  title,
  className,
  children,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDismissable = true,
  ...props
}: DialogProps) {
  return (
    <ModalOverlay
      className={styles.overlay}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
    >
      <Modal className={styles.modal}>
        <AriaDialog {...props} className={cx(styles.dialog, className)}>
          {({ close }) => (
            <>
              <Heading slot="title" className={styles.title}>
                {title}
              </Heading>
              {typeof children === "function" ? children({ close }) : children}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}
