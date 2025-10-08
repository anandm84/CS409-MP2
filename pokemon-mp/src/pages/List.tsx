// src/pages/List.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/List.module.css";
import { BasicPokemon } from "../api/pokemon";

interface ListProps {
  pokemons: BasicPokemon[];
}

type SortField = "id" | "name";

const List: React.FC<ListProps> = ({ pokemons }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("id");
  const [ascending, setAscending] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = pokemons.filter(p => p.name.toLowerCase().includes(q) || String(p.id).includes(q));
    arr.sort((a, b) => {
      if (sortField === "id") return ascending ? a.id - b.id : b.id - a.id;
      return ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });
    return arr;
  }, [pokemons, query, sortField, ascending]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          className={styles.search}
          placeholder="Search Pokémon by name or id..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className={styles.sortRow}>
          <label>Sort:</label>
          <select value={sortField} onChange={(e) => setSortField(e.target.value as SortField)} className={styles.select}>
            <option value="id">ID</option>
            <option value="name">Name</option>
          </select>
          <button className={styles.btn} onClick={() => setAscending(s => !s)}>
            {ascending ? "Asc" : "Desc"}
          </button>
        </div>
      </div>

      <ul className={styles.list}>
        {filtered.map(p => (
          <li key={p.id} className={styles.listItem} onClick={() => navigate(`/pokemon/${p.id}`)}>
            <span className={styles.id}>#{p.id}</span>
            <span className={styles.name}>{p.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
