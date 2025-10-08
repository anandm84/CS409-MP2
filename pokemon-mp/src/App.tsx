// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import List from "./pages/List";
import Gallery from "./pages/Gallery";
import Detail from "./pages/Detail";
import styles from "./styles/App.module.css";
import "./App.css";
import { getPokemonList, BasicPokemon } from "./api/pokemon";

export default function App() {
  const [pokemons, setPokemons] = useState<BasicPokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const list = await getPokemonList(151);
        if (!cancelled) setPokemons(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Router>
      <div className={styles.app}>
        <header className={styles.header}>
          <h1 className={styles.title}>Pokémon Explorer</h1>
          <nav className={styles.nav}>
            <Link to="/" className={styles.link}>List</Link>
            <Link to="/gallery" className={styles.link}>Gallery</Link>
          </nav>
        </header>

        <main className={styles.main}>
          {loading ? (
            <div className={styles.loading}>Loading Pokémons…</div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={<List pokemons={pokemons} />}
              />
              <Route
                path="/gallery"
                element={<Gallery pokemons={pokemons} />}
              />
              <Route
                path="/pokemon/:idOrName"
                element={<Detail pokemons={pokemons} />}
              />
            </Routes>
          )}
        </main>

        <footer className={styles.footer}>PokeDex 2025 - Limited Edition</footer>
      </div>
    </Router>
  );
}
