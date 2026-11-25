import {
  Table as AriaTable,
  TableHeader as AriaTableHeader,
  Column as AriaColumn,
  TableBody as AriaTableBody,
  Row as AriaRow,
  Cell as AriaCell,
  type SortDescriptor,
  type Selection,
  type Key,
} from "react-aria-components";
import { ArrowDown, ArrowUp, ArrowsDownUp } from "@phosphor-icons/react";
import { Checkbox } from "../Checkbox/Checkbox";
import { cx } from "../cx";
import styles from "./DataTable.module.css";

export type { SortDescriptor, Selection };

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "start" | "end";
}

export interface DataTableProps<T extends { id: Key }> {
  "aria-label": string;
  columns: DataTableColumn[];
  items: T[];
  /** Renders the content of one cell. */
  renderCell: (item: T, columnKey: string) => React.ReactNode;
  selectionMode?: "none" | "multiple";
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  isLoading?: boolean;
  loadingLabel?: string;
  /** Shown when there are no rows. */
  emptyState?: React.ReactNode;
  className?: string;
  /** Inline style for the scroll container, e.g. a max height for the sticky header. */
  style?: React.CSSProperties;
}

/**
 * Sortable, selectable table over React Aria's grid. The header sticks to the
 * top of the scroll container, row height follows the brand's density token,
 * and arrow keys move through rows and cells.
 */
export function DataTable<T extends { id: Key }>({
  columns,
  items,
  renderCell,
  selectionMode = "none",
  selectedKeys,
  onSelectionChange,
  sortDescriptor,
  onSortChange,
  isLoading = false,
  loadingLabel = "Loading",
  emptyState = "Nothing here yet.",
  className,
  style,
  ...props
}: DataTableProps<T>) {
  const hasSelection = selectionMode === "multiple";
  return (
    <div className={cx(styles.wrap, className)} style={style} aria-busy={isLoading || undefined}>
      <AriaTable
        aria-label={props["aria-label"]}
        className={styles.table}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
      >
        <AriaTableHeader className={styles.headRow}>
          {hasSelection ? (
            <AriaColumn className={cx(styles.column, styles.selectColumn)}>
              <Checkbox slot="selection" aria-label="Select all rows" />
            </AriaColumn>
          ) : null}
          {columns.map((col, index) => (
            <AriaColumn
              key={col.key}
              id={col.key}
              isRowHeader={index === 0}
              allowsSorting={col.sortable}
              data-align={col.align}
              data-sortable={col.sortable || undefined}
              className={styles.column}
            >
              {({ sortDirection }) => (
                <span className={styles.columnInner}>
                  {col.label}
                  {col.sortable ? (
                    <span className={styles.sortIcon} aria-hidden="true">
                      {sortDirection === "ascending" ? (
                        <ArrowUp className={styles.sortGlyph} />
                      ) : sortDirection === "descending" ? (
                        <ArrowDown className={styles.sortGlyph} />
                      ) : (
                        <ArrowsDownUp className={styles.sortGlyph} />
                      )}
                    </span>
                  ) : null}
                </span>
              )}
            </AriaColumn>
          ))}
        </AriaTableHeader>
        <AriaTableBody
          className={styles.body}
          items={isLoading ? [] : items}
          renderEmptyState={() =>
            isLoading ? (
              <div role="status" className={styles.empty}>
                {loadingLabel}
              </div>
            ) : (
              <div className={styles.empty}>{emptyState}</div>
            )
          }
        >
          {(item) => (
            <AriaRow id={item.id} className={styles.row}>
              {hasSelection ? (
                <AriaCell className={cx(styles.cell, styles.selectCell)}>
                  <Checkbox slot="selection" aria-label="Select row" />
                </AriaCell>
              ) : null}
              {columns.map((col) => (
                <AriaCell key={col.key} data-align={col.align} className={styles.cell}>
                  {renderCell(item, col.key)}
                </AriaCell>
              ))}
            </AriaRow>
          )}
        </AriaTableBody>
      </AriaTable>
    </div>
  );
}
