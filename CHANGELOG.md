# DreamHome3D update notes

## Updated build
- Replaced the placeholder 2D plan with an interactive SVG floor planner that selects rooms and supports drag-to-move within the plot.
- Connected saved room layouts and placed furniture to the 3D scene; added procedural furniture models and working add/remove actions.
- Added starter-layout buttons, room position controls, actual room duplication, object list, and construction-rate input.
- Improved room-area based estimates and added contingency, energy offset, and more explicit solar assumptions.
- Improved the optional AI-compatible prompt endpoint and made the local parser work without an external AI key.
- Added API health endpoint, CORS configuration, improved API error responses, setup docs, and environment template.
- Added responsive floor plan and estimate panel styles.

## Validation
- Frontend JavaScript/JSX syntax checked across 17 files with TypeScript's parser.
- Backend JavaScript syntax checked with `node --check`.
- A complete Vite production build could not be run in the build environment because npm registry dependencies could not be downloaded; run `npm install` in `client` and `server` locally before starting the application.

## Follow-up refinements
- Standardized the API default and Vite proxy on port 8001 to match the requested local setup.
- Changed the 3D model to an open-top architectural cutaway so rooms and placed furniture remain visible, while using the selected roof color for perimeter fascia.
- Added editable room categories, room-size/position bounds, house floor count and garage/garden/pool controls.
- Fixed total floor-area calculations for multi-storey designs and made backend estimate formulas consistent with the frontend calculators.
- Restored saved theme/day-night settings when reopening a project; prevented deleting the final room.
- Improved dashboard loading/empty/error states and added safer handling for project create, duplicate and delete actions.
- Validated JSX/JavaScript syntax; a Vite production build remains unverified here because package downloads were unavailable.


## October 2026 refinement
- Added persisted furniture rotation and on-screen nudge/rotate controls for placed objects.
- Made AI-generated starter layouts plot-aware and cleared an old template selection when a newly generated design is applied.
- Corrected AI prompt counts so four-to-six bedrooms/bathrooms are preserved, and plot sizing accounts for multi-storey footprints.
- Improved login/register validation feedback, busy state, autocomplete semantics, and logout so it only clears DreamHome3D authentication keys.
- Fixed designer navigation to use application routes and added a clear message when PDF capture is attempted before the 3D preview is ready.
