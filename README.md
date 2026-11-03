# Alliance TD Index

A responsive companion to the in-game Alliance TD index. Browse 62 units and their upgrade levels, compare up to three units, bookmark favorites, and explore crafting, materials, crates, potions, eight game modes, the RNG guide and the full release history. Interface languages: English and Russian.

## Website

GitHub Pages publishes the `docs/` folder from `main`. The static site needs no backend, database, build step or sign-in. All image assets are included in the repository.

## Data

The full catalog was re-exported read-only from the Alliance TD DEV lobby and Game on 3 November 2026. Both new units, current crafting/item data and all eight modes are included. Match rewards come from Game's ModeRewardConfig, rather than the older lobby preview. The eight balance-patch entries remain marked as upcoming. The next update is scheduled for 6 November at 19:00 Moscow (7:00 PM in English).

Unit levels inherit earlier levels' settings. Direct DPS includes configured main, secondary and knife attacks. Conditional/average passive DPS and Helicopter squad attack DPS are displayed separately; collision damage, extra splash targets and external buffs are excluded.

Placement limits were synchronized with the current match source, including the two new units, TV Strider's cap of six and removal of Zombie's personal cap. The overall match placement cap still applies. The toilet section lists material drop sources; complete enemy health, speed and wave data are not included. The material-death fix changes delivery of drop checks, not the configured odds. Mode rewards are base match values before map modifiers, passes, potions and friend bonuses.

The RNG guide includes all four match upgrades, wave modifiers, boss checkpoints and probabilities for the 61 currently available roll results. Its probabilities use the actual active weighted pool and the selected More Luck level, independently of lobby summon eligibility. The changelog copies every item from all 16 in-game records, including sections missing from SectionOrder, and preserves development notes separately. Duplicate official update numbers are retained as authored; each record also has a stable source ID.

`docs/data.json` contains the catalog. `docs/asset-map.json` maps Roblox asset IDs to the bundled public thumbnails. No player inventories, credentials or server-only game code are included.

## Development

Serve `docs/` with a static HTTP server. No dependency installation is needed. Run `npm test` to validate the catalog, balance formulas, RNG probabilities, languages, abilities, assets and complete update log. Full updates use `tools/sync-full-catalog.py` with a locally prepared read-only export, followed by `tools/import-game-updates.py`. Keep a confirmed releaseAt value in docs/updates.json. `tools/full-catalog-verification.json` records verification metadata; `tools/game-release-log.json` contains public changelog text. The earlier narrow snapshot importer is historical and refuses to overwrite a newer full catalog. No server gameplay source is published.

The game artwork belongs to its respective owners; this repository does not grant a separate license to the artwork.
