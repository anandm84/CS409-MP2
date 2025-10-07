export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
}

export interface PokemonSprites {
  front_default?: string | null;
  other?: {
    'official-artwork'?: { front_default?: string | null };
  };
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience?: number;
  height: number;
  weight: number;
  types: PokemonType[];
  abilities: { ability: { name: string } }[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
}
