// src/pages/Gallery.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Gallery.module.css";
import { BasicPokemon, getPokemonDetail } from "../api/pokemon";
import { useEffect } from "react";

interface GalleryProps {
  pokemons: BasicPokemon[];
}

const Gallery: React.FC<GalleryProps> = ({ pokemons }) => {
  const navigate = useNavigate();
  const [types, setTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  useEffect(() => {
    // derive set of types by fetching detail for each pokemon (lightweight for 151)
    let cancelled = false;
    async function loadTypes() {
      setLoadingTypes(true);
      try {
        const allTypes = new Set<string>();
        // fetch sequentially but small; we can limit concurrency for real app
        const promises = pokemons.map(p => getPokemonDetail(p.id));
        const details = await Promise.all(promises);
        if (cancelled) return;
        details.forEach(d => d.types.forEach(t => allTypes.add(t)));
        setTypes(Array.from(allTypes).sort());
      } finally {
        if (!cancelled) setLoadingTypes(false);
      }
    }
    loadTypes();
    return () => { cancelled = true; };
  }, [pokemons]);

  const toggleType = (t: string) => {
    setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const _filtered = useMemo(() => {
  if (selectedTypes.length === 0) return pokemons;
  return pokemons.filter(p => true); 
}, [pokemons, selectedTypes]);
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Gallery</h2>

      <div className={styles.filters}>
        <label className={styles.filterLabel}>Filter by type</label>
        <div className={styles.chips}>
          {loadingTypes ? <div className={styles.loading}>Loading types…</div> :
            types.map(t => (
              <button
                key={t}
                className={`${styles.chip} ${selectedTypes.includes(t) ? styles.chipActive : ""}`}
                onClick={() => toggleType(t)}
              >
                {t}
              </button>
            ))
          }
        </div>
      </div>

      <div className={styles.grid}>
        {pokemons.map(p => (
          <GalleryCard key={p.id} pokemon={p} selectedTypes={selectedTypes} onClick={() => navigate(`/pokemon/${p.id}`)} />
        ))}
      </div>
    </div>
  );
};

function GalleryCard({ pokemon, selectedTypes, onClick }: { pokemon: BasicPokemon; selectedTypes: string[]; onClick: () => void; }) {
  const [detailTypes, setDetailTypes] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const d = await getPokemonDetail(pokemon.id);
        if (!cancelled) setDetailTypes(d.types);
      } catch {
        if (!cancelled) setDetailTypes([]);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [pokemon.id]);

  // filter check
  if (selectedTypes.length > 0 && detailTypes) {
    const hasAll = selectedTypes.every(st => detailTypes.includes(st));
    if (!hasAll) return null;
  }
  // while detailTypes not loaded, show card (optimistic)
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.imgWrap}>
        <img src={pokemon.image} alt={pokemon.name} className={styles.img} />
      </div>
      <div className={styles.caption}>#{pokemon.id} {pokemon.name}</div>
      <div className={styles.typeRow}>
        {detailTypes ? detailTypes.map(t => <span key={t} className={styles.type}>{t}</span>) : <span className={styles.type}>…</span>}
      </div>
    </div>
  );
}

export default Gallery;
