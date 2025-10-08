// src/pages/Gallery.tsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Gallery.module.css";
import { BasicPokemon, getPokemonDetail } from "../api/pokemon";

interface GalleryProps {
  pokemons: BasicPokemon[];
}

const Gallery: React.FC<GalleryProps> = ({ pokemons }) => {
  const navigate = useNavigate();
  const [types, setTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Load all available Pokémon types (derived from details)
  useEffect(() => {
    let cancelled = false;
    async function loadTypes() {
      setLoadingTypes(true);
      try {
        const allTypes = new Set<string>();
        const details = await Promise.all(pokemons.map(p => getPokemonDetail(p.id)));
        if (cancelled) return;
        details.forEach(d => d.types.forEach(t => allTypes.add(t)));
        setTypes(Array.from(allTypes).sort());
      } finally {
        if (!cancelled) setLoadingTypes(false);
      }
    }
    loadTypes();
    return () => {
      cancelled = true;
    };
  }, [pokemons]);

  const toggleType = (t: string) => {
    setSelectedTypes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  // Filtered Pokémon list (by selected types)
  const filtered = useMemo(() => {
    if (selectedTypes.length === 0) return pokemons;
    return pokemons; // actual filtering happens inside GalleryCard
  }, [pokemons, selectedTypes]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Gallery</h2>

      <div className={styles.filters}>
        <label className={styles.filterLabel}>Filter by type</label>
        <div className={styles.chips}>
          {loadingTypes ? (
            <div className={styles.loading}>Loading types…</div>
          ) : (
            types.map(t => (
              <button
                key={t}
                className={`${styles.chip} ${
                  selectedTypes.includes(t) ? styles.chipActive : ""
                }`}
                onClick={() => toggleType(t)}
              >
                {t}
              </button>
            ))
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map(p => (
          <GalleryCard
            key={p.id}
            pokemon={p}
            selectedTypes={selectedTypes}
            onClick={() => navigate(`/pokemon/${p.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

function GalleryCard({
  pokemon,
  selectedTypes,
  onClick,
}: {
  pokemon: BasicPokemon;
  selectedTypes: string[];
  onClick: () => void;
}) {
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
    return () => {
      cancelled = true;
    };
  }, [pokemon.id]);

  // Filter check (only render if Pokémon has all selected types)
  if (selectedTypes.length > 0 && detailTypes) {
    const hasAll = selectedTypes.every(st => detailTypes.includes(st));
    if (!hasAll) return null;
  }

  return (
    <div
      className={styles.card}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.imgWrap}>
        <img src={pokemon.image} alt={pokemon.name} className={styles.img} />
      </div>
      <div className={styles.caption}>
        #{pokemon.id} {pokemon.name}
      </div>
      <div className={styles.typeRow}>
        {detailTypes ? (
          detailTypes.map(t => (
            <span key={t} className={styles.type}>
              {t}
            </span>
          ))
        ) : (
          <span className={styles.type}>…</span>
        )}
      </div>
    </div>
  );
}

export default Gallery;
