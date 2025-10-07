import React, { useEffect, useMemo, useState } from 'react';
import { fetchPokemonList, fetchPokemonByName, fetchTypes } from '../api/pokeApi';
import styles from './GalleryView.module.css';
import { Pokemon } from '../api/types';
import PokemonCard from '../components/PokemonCard/PokemonCard';
import { useNavigate } from 'react-router-dom';

export default function GalleryView() {
  const [list, setList] = useState<{ name: string; url: string }[]>([]);
  const [display, setDisplay] = useState<Pokemon[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPokemonList(300), fetchTypes()])
      .then(([results, typesRes]) => {
        setList(results);
        setTypes(typesRes.map((t: any) => t.name));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // fetch details for the first N items to show sprites and types
    let mounted = true;
    async function load() {
      const subset = list.slice(0, 120); // reduce to avoid rate-limits
      const details: Pokemon[] = [];
      for (const r of subset) {
        try {
          // sequential fetch - kinder to API
          // cached by fetchPokemonByName
          // eslint-disable-next-line no-await-in-loop
          const p = await fetchPokemonByName(r.name);
          details.push(p);
        } catch (e) {
          console.error(e);
        }
      }
      if (mounted) setDisplay(details);
    }
    if (list.length) load();
    return () => { mounted = false; };
  }, [list]);

  const filtered = useMemo(() => {
    if (!selectedTypes.length) return display;
    return display.filter((p) => p.types.some((t) => selectedTypes.includes(t.type.name)));
  }, [display, selectedTypes]);

  useEffect(() => {
    sessionStorage.setItem('mp_current_list', JSON.stringify(filtered.map((p) => p.name)));
  }, [filtered]);

  function toggleType(t: string) {
    setSelectedTypes((prev) => (prev.includes(t) ? prev.filter((s) => s !== t) : [...prev, t]));
  }

  return (
    <div>
      <h2>Gallery</h2>
      <div className={styles.filters}>
        <div className={styles.filterLabel}>Filter by type</div>
        <div className={styles.typeList}>
          {types.map((t) => (
            <button
              key={t}
              className={`${styles.typeBtn} ${selectedTypes.includes(t) ? styles.active : ''}`}
              onClick={() => toggleType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className={styles.loading}>Loading gallery...</div>}

      <div className={styles.grid}>
        {filtered.map((p) => (
          <div key={p.id} onClick={() => navigate(`/pokemon/${p.name}`)}>
            <PokemonCard pokemon={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
