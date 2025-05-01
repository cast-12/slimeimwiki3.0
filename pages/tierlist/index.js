import CharacterIcon from "@/components/characterIcon";
import Divider from "@/components/divider";
import FilterBar from "@/components/filterBar";
import FilterList from "@/components/filterList";
import KeywordFilter from "@/components/keywordFilter";
import SearchBar from "@/components/searchBar";
import TextBox from "@/components/textBox";
import { Tier } from "@/components/tier";
import Toggle from "@/components/toggle";
import styles from "@/styles/Home.module.css";
import Head from "next/head";
import { useState } from "react";
import {
	GetStates,
	Groups
} from "/components/arrays";

export default function Home({ storage }) {
	const [filter, setFilter, getSort, setSort] = GetStates(storage);
	const [search, setSearch] = useState("");
	const [descriptionsToggle, setDescriptionsToggle] = useState(false);

	function AlternateCharacterIcon(props) {
		return (
			<CharacterIcon
				{...props}
				text={"None"}
			/>
		);
	}
	const props = {
		filter: filter,
		setFilter: setFilter,
		AlternateCharacterIcon: AlternateCharacterIcon,
		confirmFunction: (id) => {
			const date = characters[id]?.Release;
			if (!date) return true;
			const year = parseInt(date.split("/")[2]);
			return year > 2022;
		}
	};
	

	return (
		<>
			<Head>
				<title>Tier List - SLIMEIM.WIKI</title>
				<meta
					rel="canonical"
					href="https://www.slimeim.wiki/tierlist"
				/>
			</Head>
			<main>
				<TextBox
					style={{
						marginTop: "10px",
						borderTopLeftRadius: "5px",
						borderTopRightRadius: "5px",
					}}
				>
					<h1 style={{ fontSize: "1em", fontWeight: "normal" }}>
						<b>Source: </b>
						<span className="">The Japanese</span>
						<br />
					</h1>
				</TextBox>
				<TextBox
					style={{
						background: "linear-gradient(90deg, darkred, crimson)",
						color: "white",
						borderBottomLeftRadius: "5px",
						borderBottomRightRadius: "5px",
					}}
					text={
						<div>
							If you would like to make your own teirlist please click the link
							https://slimeimwiki.vercel.app/tierlist/create
						</div>
					}
				></TextBox>
				<Divider text={"Filters"} />
				<SearchBar search={search} setSearch={setSearch}>
					<Toggle
						text={"Search Skills"}
						toggle={descriptionsToggle}
						setToggle={setDescriptionsToggle}
					/>
				</SearchBar>
				<div className={styles.filterBar}>
					<FilterBar filter={filter} setFilter={setFilter} />
				</div>
				<div className={styles.keywordFilterList}>
					<KeywordFilter
						filter={filter}
						setFilter={setFilter}
						text={"SKILLS"}
						id={Groups.length}
					/>
					<KeywordFilter
						filter={filter}
						setFilter={setFilter}
						text={"TRAITS"}
						id={Groups.length + 1}
					/>
					<KeywordFilter
						filter={filter}
						setFilter={setFilter}
						text={"FORCES"}
						id={Groups.length + 2}
					/>
					<KeywordFilter
						filter={filter}
						setFilter={setFilter}
						text={"TOWN"}
						id={Groups.length + 3}
					/>
				</div>
				<FilterList filter={filter} setFilter={setFilter} />
				<Divider text={"TIER LIST"} />
				<div className="flex flex-col gap-1 bg-color1 rounded">
					<Tier tier={"SSS"} {...props} />
					<Tier tier={"SS"} {...props} />
					<Tier tier={"S"} {...props} />
					<Tier tier={"A"} {...props} />
					<Tier tier={"B"} {...props} />
					<Tier tier={"C"} {...props} />
				</div>
			</main>
		</>
	);
}


