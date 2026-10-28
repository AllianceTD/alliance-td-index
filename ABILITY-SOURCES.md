# Ability descriptions

Read-only verification against Game place 90647947106358 on 2026-10-29. No game sources were changed.

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
