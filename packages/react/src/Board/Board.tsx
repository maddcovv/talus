import React, { createContext, useCallback, useContext, useId, useState } from "react";
import {
  Button as AriaButton,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger,
  Popover as AriaPopover,
} from "react-aria-components";
import { DotsThree } from "@phosphor-icons/react";
import { cx } from "../cx";
import styles from "./Board.module.css";
import util from "../shared/util.module.css";

const DRAG_TYPE = "application/x-talus-board-card";

export interface BoardColumnDef {
  id: string;
  title: string;
}

interface BoardContextValue {
  columns: BoardColumnDef[];
  move: (cardId: string, toColumnId: string, cardTitle: string) => void;
}

const BoardContext = createContext<BoardContextValue | null>(null);
const ColumnContext = createContext<string | null>(null);

export interface BoardProps extends React.HTMLAttributes<HTMLDivElement> {
  "aria-label": string;
  /** Every column on the board, in order. Feeds each card's "Move to" menu. */
  columns: BoardColumnDef[];
  /** Called when a card is dropped on a column or moved from its menu. */
  onMove: (cardId: string, toColumnId: string) => void;
  children: React.ReactNode;
}

/**
 * Stage columns with cards. Cards move by pointer drag and by the "Move to"
 * menu on each card, and every move is announced to screen readers.
 */
export function Board({ columns, onMove, children, className, ...props }: BoardProps) {
  const [announcement, setAnnouncement] = useState("");
  const move = useCallback(
    (cardId: string, toColumnId: string, cardTitle: string) => {
      onMove(cardId, toColumnId);
      const target = columns.find((column) => column.id === toColumnId);
      setAnnouncement(`${cardTitle} moved to ${target ? target.title : toColumnId}.`);
    },
    [columns, onMove],
  );
  return (
    <BoardContext.Provider value={{ columns, move }}>
      <div {...props} role="group" className={cx(styles.board, className)}>
        {children}
      </div>
      <div aria-live="polite" className={util.srOnly}>
        {announcement}
      </div>
    </BoardContext.Provider>
  );
}

export interface BoardColumnProps extends React.HTMLAttributes<HTMLElement> {
  /** Must match this column's id in the board's columns prop. */
  id: string;
  title: string;
  count?: number;
  /** One line under the header, e.g. total waiting time. */
  detail?: React.ReactNode;
  /** Heading level for the column title, so it fits the page's outline. */
  headingLevel?: 2 | 3 | 4;
  children?: React.ReactNode;
}

export function BoardColumn({
  id,
  title,
  count,
  detail,
  headingLevel = 3,
  children,
  className,
  ...props
}: BoardColumnProps) {
  const board = useContext(BoardContext);
  const headingId = useId();
  const [isOver, setOver] = useState(false);
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <ColumnContext.Provider value={id}>
      <section
        {...props}
        aria-labelledby={headingId}
        data-drop-target={isOver || undefined}
        className={cx(styles.column, className)}
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes(DRAG_TYPE)) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
            setOver(true);
          }
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setOver(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          const payload = event.dataTransfer.getData(DRAG_TYPE);
          if (!payload || !board) return;
          const { cardId, cardTitle } = JSON.parse(payload) as {
            cardId: string;
            cardTitle: string;
          };
          board.move(cardId, id, cardTitle);
        }}
      >
        <header className={styles.columnHeader}>
          <Heading id={headingId} className={styles.columnTitle}>
            {title}
          </Heading>
          {count !== undefined ? <span className={styles.count}>{count}</span> : null}
        </header>
        {detail ? <p className={styles.columnDetail}>{detail}</p> : null}
        <ul className={styles.cards}>{children}</ul>
      </section>
    </ColumnContext.Provider>
  );
}

export interface BoardCardProps {
  id: string;
  /** The card's one-line name, used in the move menu and announcements. */
  title: string;
  /** Opens the card's record; the title becomes a press target. */
  onOpen?: () => void;
  /** Extra lines under the title: role, days waiting, tags. */
  children?: React.ReactNode;
  className?: string;
}

export function BoardCard({ id, title, onOpen, children, className }: BoardCardProps) {
  const board = useContext(BoardContext);
  const columnId = useContext(ColumnContext);
  const [isDragging, setDragging] = useState(false);
  const targets = board ? board.columns.filter((column) => column.id !== columnId) : [];
  return (
    <li
      className={cx(styles.card, className)}
      data-dragging={isDragging || undefined}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData(DRAG_TYPE, JSON.stringify({ cardId: id, cardTitle: title }));
        event.dataTransfer.effectAllowed = "move";
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
    >
      <div className={styles.cardBody}>
        {onOpen ? (
          <p className={styles.cardTitle}>
            <button type="button" className={styles.titleButton} onClick={onOpen}>
              {title}
            </button>
          </p>
        ) : (
          <p className={styles.cardTitle}>{title}</p>
        )}
        {children}
      </div>
      <MenuTrigger>
        <AriaButton className={styles.moveButton} aria-label={`Move ${title}`}>
          <DotsThree weight="bold" className={styles.moveGlyph} aria-hidden="true" />
        </AriaButton>
        <AriaPopover className={styles.menuPopover} placement="bottom end">
          <AriaMenu
            className={styles.menu}
            aria-label={`Move ${title} to`}
            onAction={(key) => board?.move(id, String(key), title)}
          >
            {targets.map((target) => (
              <AriaMenuItem key={target.id} id={target.id} className={styles.menuItem}>
                Move to {target.title}
              </AriaMenuItem>
            ))}
          </AriaMenu>
        </AriaPopover>
      </MenuTrigger>
    </li>
  );
}
