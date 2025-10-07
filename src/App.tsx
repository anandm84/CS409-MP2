import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListView from './pages/ListView';
import GalleryView from './pages/GalleryView';
import DetailView from './pages/DetailView';
import styles from './styles/App.module.css';

export default function App() {
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
          <Routes>
            <Route path="/" element={<ListView />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/pokemon/:idOrName" element={<DetailView />} />
          </Routes>
        </main>

        <footer className={styles.footer}>
          Built for MP — PokéAPI demo.
        </footer>
      </div>
    </Router>
  );
}
