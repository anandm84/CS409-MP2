import React from 'react';
import { Pokemon } from '../../api/types';
import styles from './PokemonCard.module.css';

interface Props {
  pokemon: Pokemon;
  onClick?: () => void;
}

export default function PokemonCard({ pokemon, onClick }: Props) {
  const img = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <div className={styles.imageWrap}>
        {img ? <img src={img} alt={pokemon.name} className={styles.image} /> : <div className={styles.placeholder}>No image</div>}
      </div>
      <div className={styles.meta}>
        <div className={styles.title}>#{pokemon.id} {pokemon.name}</div>
        <div className={styles.types}>
          {pokemon.types.map(t => <span key={t.slot} className={styles.type}>{t.type.name}</span>)}
        </div>
      </div>
    </div>
  );
}
