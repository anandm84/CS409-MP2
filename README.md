# Pokémon MP (React + TypeScript)

This project implements the MP requirements using the public [PokéAPI](https://pokeapi.co/).
It includes:
- List view with search-as-you-type and sorting (name & id, asc/desc)
- Gallery view with images and multi-select type filters
- Detail view with a dedicated URL and previous/next navigation
- React Router for routing, Axios for API calls, TypeScript

## How to run
1. Ensure Node.js (16+) and npm are installed.
2. Create a CRA TypeScript project or use this scaffold:
   - Recommended: `npx create-react-app my-mp --template typescript`
   - Replace the `src/` in your CRA app with the `src/` folder from this zip OR copy these files into your CRA project's `src/`.
3. Install dependencies:
   ```
   npm install
   ```
4. Start the app:
   ```
   npm start
   ```
5. Open http://localhost:3000

## Notes
- The project caches list & details in memory to reduce repeated API calls.
- Session storage is used so Detail view can navigate previous/next through the result set the user was viewing.
- There is no inline styling; CSS Modules and global CSS are used.

## Files included
- src/ (React + TypeScript source)

## Source
- PokéAPI (https://pokeapi.co/)
