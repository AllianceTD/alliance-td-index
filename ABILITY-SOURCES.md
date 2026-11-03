# Ability descriptions

Read-only verification against Game place 90647947106358 on 2026-10-29. No game sources were changed.

November additions were checked against the saved Game and Lobby sources verified on 2026-11-02. Studio was closed during the website sync on 2026-11-03; this is not a fresh live-server audit. These records are labeled as prepared for the upcoming patch.

- ClassicUnitPassivesConfig and ClassicUnitPassives: White Flash, Echo, Close Combat, Titan Breaker and Lucky Strike. Base, expected and conditional DPS remain separate.
- SignalResonanceConfig / SignalResonance: same-Strider cannon bonus and screen mark duration.
- ScreenShiftConfig / ScreenShift: level 3, 10-second switch cooldown, Red/Orange/Purple multipliers, five-second burn, normal/boss slow and strongest-effect refresh behavior. Existing Strider Blink is retained. The four approved icons are bundled locally.
- CameraHelicopterConfig / HelicopterReinforcements: five squad compositions, per-ally health and attack stats, air targeting, per-Helicopter alive limits, compact models and squad replacement on upgrade. Summon DPS excludes collision damage and direct tower DPS.

Source snapshot hashes for unit levels, config and placement limits are recorded in `tools/game-sync-sources.json`.

Website descriptions live in `docs/abilities.js`. Base DPS still excludes conditional passives and active abilities.

Sources:
- HyperChargeUIConfig and HyperTitanPassive: ally proximity, charge/duration, damage/speed bonuses.
- InjuredTitanConfig, SawTitanConfig, InjuredSpeakerConfig, FatTitanConfig, ToxicTitanConfig, TitanPassives, ToxicTitanAttack and CraftTitanAttack: conditional Titan passives.
- GoldenLargeAttack: every fifth volley, boss multiplier and in-match kill Cash.
- GhostFearConfig and TowerSystem: fear on summoned ghost collisions, durations and recovery.
- PoseidonTide and PartyOverload: damage stacks and fifth-attack multiplier.
- GrimConfig, GrimAbilities and TowerAbilityConfig: execution, cap growth, souls and active boss summon.
- TowerBoosterConfig: DJ aura and best-bonus stacking.
- TowerAbilityConfig, SpeakerWomanConfig, GlitchPlungerConfig: core barrage, katana spin and charged rush.
- UpgradedCinemaConfig: leap, shift, drone toggle and spin.
- StriderConfig and StriderAbility: walking and teleport abilities.

No active button is invented for automatically enabled Toxic/Saw shoulder weapons (`AlwaysOn = true` in their current configs). The ability list is an explicit verified catalog, not an automatic exhaustive export of future game scripts. Add new records when gameplay abilities change.
