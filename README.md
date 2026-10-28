# Alliance TD Index

A responsive companion to the in-game Alliance TD index. Browse 60 units and their upgrade levels, compare up to three units, bookmark favorites, and explore crafting, materials, crates, potions, and base mode rewards. Interface languages: English and Russian.

## Website

GitHub Pages publishes the `docs/` folder from `main`. The static site needs no backend, database, build step or sign-in. All image assets are included in the repository.

## Data

The catalog is a snapshot of the Alliance TD DEV lobby taken on 28 October 2026. Updates are manual. Unit levels are inherited from the lobby's unit modules. Direct DPS includes configured main, secondary and knife attacks; conditional passives, summon collision damage, extra splash targets and external buffs are excluded.

Placement limits use the lobby index reference and need verification against the current match place. The toilet section currently lists material drop sources; complete enemy health, speed and wave data are not included. Mode rewards are base lobby values before map modifiers, passes, potions and friend bonuses.

`docs/data.json` contains the catalog. `docs/asset-map.json` maps Roblox asset IDs to the bundled public thumbnails. No player inventories, credentials or server-only game code are included.

## Development

Serve `docs/` with a static HTTP server. No dependency installation is needed. Run `node --test tools/model.test.mjs` to validate the catalog. The `tools/` folder contains the read-only Studio exporter and the public-thumbnail downloader used to prepare updates.

The game artwork belongs to its respective owners; this repository does not grant a separate license to the artwork.
