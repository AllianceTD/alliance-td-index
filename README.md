# Alliance TD Index

A responsive companion to the in-game Alliance TD index. Browse 60 units and their upgrade levels, compare up to three units, bookmark favorites, and explore crafting, materials, crates, potions, and base mode rewards. Interface languages: English and Russian.

## Website

GitHub Pages publishes the `docs/` folder from `main`. The static site needs no backend, database, build step or sign-in. All image assets are included in the repository.

## Data

The full catalog was exported from the Alliance TD DEV lobby on 28 October 2026. The November balance patch was synchronized on 3 November from the Game/Lobby sources verified on 2 November. Those eight unit entries are marked as an upcoming patch; no live release or release date is assumed. Other catalog entries retain the earlier snapshot. Updates are manual.

Unit levels inherit earlier levels' settings. Direct DPS includes configured main, secondary and knife attacks. Conditional/average passive DPS and Helicopter squad attack DPS are displayed separately; collision damage, extra splash targets and external buffs are excluded.

Placement limits were synchronized with the verified match source on 2 November, including TV Strider's cap of six and removal of Zombie's personal cap. The overall match placement cap still applies. The toilet section lists material drop sources; complete enemy health, speed and wave data are not included. The material-death fix changes delivery of drop checks, not the configured odds. Mode rewards are base lobby values before map modifiers, passes, potions and friend bonuses.

`docs/data.json` contains the catalog. `docs/asset-map.json` maps Roblox asset IDs to the bundled public thumbnails. No player inventories, credentials or server-only game code are included.

## Development

Serve `docs/` with a static HTTP server. No dependency installation is needed. Run `npm test` to validate the catalog, balance formulas, languages, abilities, assets and update log. The `tools/` folder contains the read-only Studio exporter, public-thumbnail downloader and bounded snapshot synchronizer. `tools/game-sync-sources.json` records source paths and hashes used for the November sync; no server gameplay source is published.

The game artwork belongs to its respective owners; this repository does not grant a separate license to the artwork.
