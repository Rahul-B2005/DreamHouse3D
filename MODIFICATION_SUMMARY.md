# DreamHome3D modification summary

This update preserves the existing MERN project structure and adds refinements to the supplied project.

## Changes made
- Improved AI prompt parsing to retain requests for up to six bedrooms and six bathrooms instead of silently capping them at three.
- Adjusted plot sizing to account for multi-storey floor area and the target building footprint.
- Made AI-generated starter room layouts adapt to the selected plot dimensions and clear an old template selection when generating a new layout.
- Added furniture rotate and four-direction nudge controls in the placed-object list; rotation is rendered by the 3D scene and saved in `designData`.
- Added a clearer guard message if a PDF report is requested before the 3D canvas is ready.
- Updated studio navigation links so Dashboard and Projects open the actual dashboard route.
- Improved login and registration forms with field labels, browser autocomplete, submit loading state, password length hints, and clear error feedback.
- Changed logout to clear only DreamHome3D's token and user values instead of all browser local storage.
- Updated README and changelog with the new behavior.

## Validation performed
- Parsed all 17 frontend JavaScript/JSX files using the installed TypeScript parser: no syntax errors found.
- Ran `node --check` across backend JavaScript and other plain JavaScript files: passed.
- A Vite production build could not be verified in this environment because the npm registry dependency download timed out and the offline npm cache does not contain the missing Vite packages. Install dependencies locally before running the app.

## Run on Windows
1. Install Node.js 20 LTS and MongoDB or prepare a MongoDB Atlas URI.
2. In PowerShell, open `DreamHome3D\server`, run `Copy-Item .env.example .env`, then set `MONGO_URI` and a unique `JWT_SECRET` in `.env`.
3. Run `npm install` and `npm run dev` in `server`.
4. In another terminal, open `DreamHome3D\client`, run `npm install` and `npm run dev`.
5. Open the Vite URL shown in the terminal. The API health endpoint is `http://localhost:8001/api/health`.
