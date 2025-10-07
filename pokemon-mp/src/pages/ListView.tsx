import React, { useEffect, useMemo, useState } from 'react';
import { fetchPokemonList } from '../api/pokeApi';
import useDebouncedValue from '../hooks/useDebouncedValue';
import { NamedAPIResource } from '../api/types';
import SearchBar from '../components/SearchBar/SearchBar';
import styles from './ListView.module.css';
import { useNavigate } from 'react-router-dom';

type SortKey = 'name' | 'id';

export default function ListView() {
  const [all, setAll] = useState<NamedAPIResource[]>([]);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 150);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [ascending, setAscending] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchPokemonList(2000)
      .then(setAll)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  // build id map from URL so we can sort by id without extra network calls
  const idMap = useMemo(() => {
    const map: Record<string, number> = {};
    all.forEach(({ name, url }) => {
      const parts = url.split('/').filter(Boolean);
      const id = Number(parts[parts.length - 1]);
      if (!Number.isNaN(id)) map[name] = id;
    });
    return map;
  }, [all]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let list = all.filter((p) => p.name.includes(q));
    list = list.sort((a, b) => {
      if (sortKey === 'name') {
        return ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else {
        const ai = idMap[a.name] ?? 0;
        const bi = idMap[b.name] ?? 0;
        return ascending ? ai - bi : bi - ai;
      }
    });
    return list;
  }, [all, debouncedQuery, sortKey, ascending, idMap]);

  // persist the current visible list into sessionStorage so Detail view can use it for prev/next
  useEffect(() => {
    const names = filtered.map((p) => p.name);
    sessionStorage.setItem('mp_current_list', JSON.stringify(names));
  }, [filtered]);

  function openDetail(resource: NamedAPIResource) {
    navigate(`/pokemon/${resource.name}`);
  }

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <SearchBar value={query} onChange={setQuery} placeholder="Search Pokémon by name..." />
        <div className={styles.controlsRight}>
          <label className={styles.label}>Sort</label>
          <select className={styles.select} value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
            <option value="name">Name</option>
            <option value="id">ID</option>
          </select>
          <button className={styles.toggle} onClick={() => setAscending((s) => !s)}>
            {ascending ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      {loading ? <div className={styles.loading}>Loading Pokémon list...</div> : null}

      <ul className={styles.list}>
        {filtered.slice(0, 400).map((p) => (
          <li key={p.name} className={styles.item} onClick={() => openDetail(p)}>
            <span className={styles.id}>#{idMap[p.name] ?? '--'}</span>
            <span className={styles.name}>{p.name}</span>
          </li>
        ))}
      </ul>

      {filtered.length > 400 && <div className={styles.note}>Showing first 400 results. Use search or filters to narrow results.</div>}
    </div>
  );
}
