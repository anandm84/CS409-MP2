// src/pages/Detail.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../styles/Detail.module.css";
import { BasicPokemon, PokemonDetail, getPokemonDetail } from "../api/pokemon";

interface DetailProps {
  pokemons: BasicPokemon[];
}

const Detail: React.FC<DetailProps> = ({ pokemons }) => {
  const { idOrName } = useParams<{ idOrName: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        if (!idOrName) return;
        const d = await getPokemonDetail(isNaN(Number(idOrName)) ? idOrName : Number(idOrName));
        if (!cancelled) setPokemon(d);
      } catch {
        if (!cancelled) setPokemon(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [idOrName]);

  const currentIndex = pokemon ? pokemons.findIndex(p => p.id === pokemon.id) : -1;

  const goPrev = () => {
    if (currentIndex > 0) navigate(`/pokemon/${pokemons[currentIndex - 1].id}`);
  };
  const goNext = () => {
    if (currentIndex >= 0 && currentIndex < pokemons.length - 1) navigate(`/pokemon/${pokemons[currentIndex + 1].id}`);
  };

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (!pokemon) return <div className={styles.notFound}>Pokémon not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.left}>
          <img src={pokemon.image} alt={pokemon.name} className={styles.image}/>
        </div>
        <div className={styles.right}>
          <h2 className={styles.title}>#{pokemon.id} {pokemon.name}</h2>

          <div className={styles.meta}>
            <div><strong>Types:</strong> {pokemon.types.join(", ")}</div>
            <div><strong>Height:</strong> {pokemon.height}</div>
            <div><strong>Weight:</strong> {pokemon.weight}</div>
            <div><strong>Base XP:</strong> {pokemon.baseXP}</div>
          </div>

          <div className={styles.stats}>
            <h4>Stats</h4>
            <ul>
              {pokemon.stats.map(s => (
                <li key={s.name}>{s.name}: {s.value}</li>
              ))}
            </ul>
          </div>

          <div className={styles.controls}>
            <button className={styles.btn} onClick={goPrev} disabled={currentIndex <= 0}>Previous</button>
            <button className={styles.btn} onClick={goNext} disabled={currentIndex === -1 || currentIndex >= pokemons.length - 1}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
