import axios from 'axios';
import {
  Pokemon,
  PokemonListResponse,
  NamedAPIResource
} from './types';

const BASE = 'https://pokeapi.co/api/v2';
const axiosInstance = axios.create({ baseURL: BASE, timeout: 15000 });

// simple in-memory caches used to reduce repeated network calls
const listCache = new Map<string, NamedAPIResource[]>();
const detailCache = new Map<string, Pokemon>();
const typesCache: string[] | null = null as any;

export async function fetchPokemonList(limit = 1000): Promise<NamedAPIResource[]> {
  const key = `list-${limit}`;
  if (listCache.has(key)) return listCache.get(key)!;
  const res = await axiosInstance.get<PokemonListResponse>(`/pokemon?limit=${limit}`);
  listCache.set(key, res.data.results);
  return res.data.results;
}

export async function fetchPokemonByName(nameOrId: string | number): Promise<Pokemon> {
  const key = String(nameOrId).toLowerCase();
  if (detailCache.has(key)) return detailCache.get(key)!;
  const res = await axiosInstance.get<Pokemon>(`/pokemon/${key}`);
  detailCache.set(key, res.data);
  return res.data;
}

export async function fetchTypes(): Promise<{ name: string; url: string }[]> {
  // not cached in complex structure - ok for demo
  const res = await axiosInstance.get('/type');
  return res.data.results;
}
