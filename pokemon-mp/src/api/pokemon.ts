// src/api/pokemon.ts
import axios from "axios";

export interface BasicPokemon {
  id: number;
  name: string;
  image: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  image: string;
  types: string[]; 
  stats: { name: string; value: number }[];
  height: number;
  weight: number;
  baseXP: number;
}

const API = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export async function getPokemonList(limit = 151): Promise<BasicPokemon[]> {
  const res = await API.get(`/pokemon?limit=${limit}`);
  const results: { name: string; url: string }[] = res.data.results;

  // map and fetch ids from URL (or just use index+1)
  return results.map((r, i) => {
    const id = i + 1;
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return { id, name: capitalize(r.name), image };
  });
}

export async function getPokemonDetail(idOrName: string | number): Promise<PokemonDetail> {
  const res = await API.get(`/pokemon/${idOrName}`);
  const d = res.data;
  const types: string[] = d.types.map((t: any) => capitalize(t.type.name));
  const stats = d.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat }));
  const image = d.sprites.other["official-artwork"].front_default ?? d.sprites.front_default;
  return {
    id: d.id,
    name: capitalize(d.name),
    image,
    types,
    stats,
    height: d.height,
    weight: d.weight,
    baseXP: d.base_experience,
  };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
