// DRAG-AND-DROP TIERLIST VERSION
// Replaces click-to-assign logic with react-beautiful-dnd drag-and-drop

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import characters from "@/data/characters.json";
import CharacterIcon from "@/components/characterIcon";
import { Tier } from "@/components/tier";
import Divider from "@/components/divider";
import TextBox from "@/components/textBox";
import Head from "next/head";
import styles from "@/styles/Home.module.css";
import FilterBar from "@/components/filterBar";
import FilterList from "@/components/filterList";
import KeywordFilter from "@/components/keywordFilter";
import Toggle from "@/components/toggle";
import SearchBar from "@/components/searchBar";
import {
  Groups, GetStates
} from "/components/arrays.js";

const defaultTiers = {
  SSS: [],
  SS: [],
  S: [],
  A: [],
  B: [],
  C: [],
  Unassigned: Object.keys(characters),
};

export default function DragTierList({ storage }) {
  const [tierList, setTierList] = useState(defaultTiers);
  const [filter, setFilter, getSort, setSort] = GetStates(storage);
  const [search, setSearch] = useState("");
  const [descriptionsToggle, setDescriptionsToggle] = useState(false);

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

  function confirmFunction(id) {
    const me = characters[id];
    if (!search) return true;
    if (!descriptionsToggle) return me.Name.toLowerCase().includes(search.toLowerCase());
    return JSON.stringify(Object.values(me)).toLowerCase().includes(search.toLowerCase());
  }

  return (
    <>
      <Head>
        <title>Interactive Tier List</title>
      </Head>
      <main>
        <TextBox style={{ marginTop: "10px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px" }}>
          <h1 style={{ fontSize: "1em", fontWeight: "normal" }}>
            <b>Source: </b><span>The Japanese</span>
          </h1>
        </TextBox>
        <TextBox
          style={{ background: "linear-gradient(90deg, darkred, crimson)", color: "white", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }}
          text={<div>Please be aware that not all characters have been assigned their appropriate <b>weapons</b>.</div>}
        />

        <Divider text="Filters" />
        <SearchBar search={search} setSearch={setSearch}>
          <Toggle text="Search Skills" toggle={descriptionsToggle} setToggle={setDescriptionsToggle} />
        </SearchBar>
        <div className={styles.filterBar}>
          <FilterBar filter={filter} setFilter={setFilter} />
        </div>
        <div className={styles.keywordFilterList}>
          <KeywordFilter filter={filter} setFilter={setFilter} text="SKILLS" id={Groups.length} />
          <KeywordFilter filter={filter} setFilter={setFilter} text="TRAITS" id={Groups.length + 1} />
          <KeywordFilter filter={filter} setFilter={setFilter} text="FORCES" id={Groups.length + 2} />
          <KeywordFilter filter={filter} setFilter={setFilter} text="TOWN" id={Groups.length + 3} />
        </div>
        <FilterList filter={filter} setFilter={setFilter} />

        <Divider text="TIER LIST" />

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
                    {tierList[tier].filter(confirmFunction).map((id, index) => (
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
