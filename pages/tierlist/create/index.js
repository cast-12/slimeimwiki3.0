// DRAG-AND-DROP TIERLIST VERSION
// Replaces your click-based system with react-beautiful-dnd

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import characters from "@/data/characters.json";
import CharacterIcon from "@/components/characterIcon";
import { Tier } from "@/components/tier";
import Divider from "@/components/divider";
import TextBox from "@/components/textBox";
import Head from "next/head";

const defaultTiers = {
  SSS: [],
  SS: [],
  S: [],
  A: [],
  B: [],
  C: [],
  Unassigned: Object.keys(characters),
};

export default function DragTierList() {
  const [tierList, setTierList] = useState(defaultTiers);

  useEffect(() => {
    const saved = localStorage.getItem("tierList");
    if (saved) setTierList(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tierList", JSON.stringify(tierList));
  }, [tierList]);

  function handleDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = Array.from(tierList[source.droppableId]);
    const destList = Array.from(tierList[destination.droppableId]);

    const [moved] = sourceList.splice(source.index, 1);
    destList.splice(destination.index, 0, moved);

    setTierList({
      ...tierList,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList,
    });
  }

  return (
    <>
      <Head>
        <title>Interactive Tier List</title>
      </Head>
      <main>
        <TextBox>
          <h1>Drag and Drop Tier List</h1>
        </TextBox>
        <Divider text="Tiers" />

        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.keys(tierList).map((tier) => (
            <Droppable droppableId={tier} key={tier} direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    padding: "10px",
                    margin: "10px 0",
                    background: "#222",
                    borderRadius: "8px",
                    minHeight: "80px",
                  }}
                >
                  <strong style={{ color: "white" }}>{tier}</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {tierList[tier].map((id, index) => (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <CharacterIcon id={id} text="None" />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </main>
    </>
  );
}
