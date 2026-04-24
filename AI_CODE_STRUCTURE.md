# AI Code Structure Guide

This document is intended to help any AI coding assistant understand the overall structure, conventions, and architecture of this project.

## Overview
- **Project Structure**: This is a React single-page application created with Create React App.
- **Main Entry Point**: `src/index.js`
- **Core Component**: `src/App.js` acts as the primary layout and state container. It connects all sub-components and persists state across sessions.

## Tech Stack
- Frontend: **React** (v19)
- Database & Persistence: **Firebase (Firestore)** 
- Styling: Inline styles + `App.css`, with an internal light/dark custom theming system (e.g. Dark Navy, Warm Cream, Midnight, etc.)
- Deployment/Hosting: React Scripts build (currently version 5)

## Directory Structure
- `src/assets/`: Houses static visual assets (e.g., `logo.svg`).
- `src/components/`: Houses modular functional components:
  - `Pomodoro.js`: Dedicated Pomodoro timer logic and view.
  - `TimeBlocks.js`: Handles daily schedule breakdown with visual color blocking.
  - `NotesLists.js`: Provides offline/online scratchpad and checklist functionality.
- `src/config/`: Houses global settings.
  - `constants.js`: Provides configuration objects (`PC`, `PALETTE`, `THEMES`, `DEFAULT_PROJECTS`, etc.).
  - `firebase.js`: Exports the raw `firebaseApp`, `db`, and the `DATA_DOC` reference.
- `src/helpers/`: Houses shared utilities.
  - `utils.js`: Exports date parsing logic (`getNow`, `nowMin`) as well as `saveToStorage` and `loadFromStorage` algorithms handling Firestore and `localStorage` syncing.

## File Highlights
1. `src/App.js` 
    - The top-level component that imports sub-components.
    - Uses `useState` and `useEffect` to manage offline cache and Firebase real-time state.
    - Exports a single daily HTML report by injecting elements to a new window.
2. `firebaseConfig` variables exist hardcoded in `src/config/firebase.js`. Ensure you do not accidentally overwrite them.
3. Fallback mechanism: Handles Firebase read/write errors by falling back gracefully to HTML5 `localStorage` (`workos_backup`).

## Rules for Modifying Code
1. **Separation of Concerns**: When adding a new piece of logic or UI block, create it in `src/components/` and import it into `App.js`.
2. **State Management**: Almost all global state variables exist at the root of `App.js` and are passed as props to children (like `blocks`, `notes`, `setBlocks`, etc.).
3. **Styling**: Stick to the pre-existing inline CSS patterns and the built-in `THEMES` constants. Avoid introducing external CSS frameworks unless requested.
4. **Dates and Timers**: Utilize the custom time parsing functions (`getNow()`, `getToday()`, `nowMin()`, `t2m()`) provided inside `src/helpers/utils.js`.
