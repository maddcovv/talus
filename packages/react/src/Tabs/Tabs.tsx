import {
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
  TabList as AriaTabList,
  type TabListProps as AriaTabListProps,
  Tab as AriaTab,
  type TabProps as AriaTabProps,
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
} from "react-aria-components";
import { cx } from "../cx";
import styles from "./Tabs.module.css";

export interface TabsProps extends Omit<AriaTabsProps, "className"> {
  className?: string;
}

export function Tabs({ className, ...props }: TabsProps) {
  return <AriaTabs {...props} className={cx(styles.tabs, className)} />;
}

export interface TabListProps<T extends object> extends Omit<AriaTabListProps<T>, "className"> {
  className?: string;
}

export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return <AriaTabList {...props} className={cx(styles.tabList, className)} />;
}

export interface TabProps extends Omit<AriaTabProps, "className"> {
  className?: string;
}

export function Tab({ className, ...props }: TabProps) {
  return <AriaTab {...props} className={cx(styles.tab, className)} />;
}

export interface TabPanelProps extends Omit<AriaTabPanelProps, "className"> {
  className?: string;
}

export function TabPanel({ className, ...props }: TabPanelProps) {
  return <AriaTabPanel {...props} className={cx(styles.tabPanel, className)} />;
}
