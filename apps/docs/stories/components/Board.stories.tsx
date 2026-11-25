import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Board, BoardCard, BoardColumn, Tag } from "@talus/react";
import { ModeSplit } from "../helpers/ModeSplit";

const stages = [
  { id: "applied", title: "Applied" },
  { id: "review", title: "In review" },
  { id: "interview", title: "Interview" },
];

const seed = [
  { id: "c1", name: "June Halloran", role: "Senior Frontend Engineer", stage: "interview" },
  { id: "c2", name: "Priya Natarajan", role: "Warehouse Lead", stage: "applied" },
  { id: "c3", name: "Cole Bratton", role: "Customer Support Specialist", stage: "review" },
  { id: "c4", name: "Mara Odell", role: "Warehouse Lead", stage: "applied" },
];

const meta = {
  title: "Components/Board",
  component: Board,
} satisfies Meta<typeof Board>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Drag a card to another column, or use the arrow button on the card to move it with the keyboard. */
export const Default: Story = {
  render: () => {
    const [cards, setCards] = useState(seed);
    return (
      <Board
        aria-label="Pipeline"
        columns={stages}
        onMove={(cardId, toColumnId) =>
          setCards((all) =>
            all.map((card) => (card.id === cardId ? { ...card, stage: toColumnId } : card)),
          )
        }
      >
        {stages.map((stage) => {
          const inStage = cards.filter((card) => card.stage === stage.id);
          return (
            <BoardColumn key={stage.id} id={stage.id} title={stage.title} count={inStage.length}>
              {inStage.map((card) => (
                <BoardCard key={card.id} id={card.id} title={card.name}>
                  <Tag>{card.role}</Tag>
                </BoardCard>
              ))}
            </BoardColumn>
          );
        })}
      </Board>
    );
  },
};

export const Modes: Story = {
  render: () => (
    <ModeSplit>
      <Board aria-label="Pipeline" columns={stages.slice(0, 2)} onMove={() => {}}>
        <BoardColumn id="applied" title="Applied" count={1}>
          <BoardCard id="c1" title="June Halloran">
            <Tag>Senior Frontend Engineer</Tag>
          </BoardCard>
        </BoardColumn>
        <BoardColumn id="review" title="In review" count={0} />
      </Board>
    </ModeSplit>
  ),
};
