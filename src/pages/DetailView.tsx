import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPokemonByName, fetchPokemonList } from '../api/pokeApi';
import { Pokemon } from '../api/types';
import styles from './DetailView.module.css';

export default function DetailView() {
  const { idOrName } = useParams<{ idOrName: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [siblings, setSiblings] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = sessionStorage.getItem('mp_current_list');
    if (data) {
      try {
        const arr: string[] = JSON.parse(data);
        setSiblings(arr);
        const i = arr.findIndex((x) => x === idOrName || String(x) === idOrName);
        setIndex(i >= 0 ? i : null);
        return;
      } catch (e) {
        // fallthrough to fetch global list
      }
    }

    // fallback: fetch global list
    fetchPokemonList(300).then((r) => {
      const arr = r.map((x) => x.name);
      setSiblings(arr);
      const i = arr.findIndex((x) => x === idOrName || String(x) === idOrName);
      setIndex(i >= 0 ? i : null);
    });
  }, [idOrName]);

  useEffect(() => {
    if (!idOrName) return;
    fetchPokemonByName(idOrName)
      .then(setPokemon)
      .catch((e) => {
        console.error(e);
        setPokemon(null);
      });
  }, [idOrName]);

  function goToOffset(offset: number) {
    if (index == null || !siblings.length) return;
    const nextIndex = (index + offset + siblings.length) % siblings.length;
    const nextName = siblings[nextIndex];
    navigate(`/pokemon/${nextName}`);
  }

  if (!pokemon) return <div className={styles.loading}>Loading Pokémon...</div>;

  const image = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>#{pokemon.id} {pokemon.name}</h2>
        <div className={styles.navBtns}>
          <button onClick={() => goToOffset(-1)} className={styles.navBtn}>Previous</button>
          <button onClick={() => goToOffset(1)} className={styles.navBtn}>Next</button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.left}>
          {image ? <img src={image} alt={pokemon.name} className={styles.image} /> : <div className={styles.placeholder}>No image</div>}
        </div>
        <div className={styles.right}>
          <div className={styles.section}>
            <h3>Types</h3>
            <div className={styles.types}>
              {pokemon.types.map(t => <span key={t.slot} className={styles.type}>{t.type.name}</span>)}
            </div>
          </div>

          <div className={styles.section}>
            <h3>Stats</h3>
            <ul>
              {pokemon.stats.map(s => <li key={s.stat.name}>{s.stat.name}: {s.base_stat}</li>)}
            </ul>
          </div>

          <div className={styles.section}>
            <h3>Other</h3>
            <div>Height: {pokemon.height}</div>
            <div>Weight: {pokemon.weight}</div>
            <div>Base XP: {pokemon.base_experience ?? '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
