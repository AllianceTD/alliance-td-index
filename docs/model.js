export const RARITIES = {
  Basic: '#b2b7bd', Uncommon: '#79d482', Rare: '#64b8ed', Epic: '#b18cef',
  Legendary: '#f5be59', Mythic: '#f47482', Exclusive: '#ee8fce', Event: '#74d6cc', Omega: '#c1a0ff',
};
export function levels(unit) { return Array.isArray(unit?.Levels) ? unit.Levels : []; }
export function levelStats(unit, index) { const list = levels(unit); return list[Math.max(0, Math.min(index, list.length - 1))] || {}; }
export function directDps(stats) {
  return ['', 'Hand', 'Knife'].reduce((sum, prefix) => {
    const damage = Number(stats[`${prefix}Damage`]);
    const cooldown = Number(stats[`${prefix}Cooldown`]);
    return sum + (Number.isFinite(damage) && Number.isFinite(cooldown) && damage > 0 && cooldown > 0 ? damage / cooldown : 0);
  }, 0);
}
export function maxDps(unit) { return directDps(levels(unit).at(-1) || {}); }
export function isSummoner(unit) {
  const stats = levels(unit).at(-1) || {};
  return !!(stats.SpawnerHp || stats.SpawnUnits || stats.SpawnUnit || stats.SpawnCooldown || stats.SpawnMaxUnits);
}
export function fmt(value, digits = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(number);
}
export function compact(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  if (n >= 1e6) return `${fmt(n / 1e6, 1)}m`;
  if (n >= 1e3) return `${fmt(n / 1e3, 1)}k`;
  return fmt(n, 1);
}
export function chance(value) { return `${fmt(Number(value) * 100, 3)}%`; }
export function filterUnits(units, { query = '', rarity = '', source = '', savedOnly = false, bookmarks = [], sort = 'rarity', orders = {} } = {}) {
  const text = query.trim().toLocaleLowerCase();
  return units.filter(unit => {
    if (text && !`${unit.DisplayName || ''} ${unit.Id} ${unit.Rarity}`.toLocaleLowerCase().includes(text)) return false;
    if (rarity && unit.Rarity !== rarity) return false;
    if (savedOnly && !bookmarks.includes(unit.Id)) return false;
    if (source === 'summon' && !unit.Settings?.IsInSummon) return false;
    if (source === 'craft' && !(unit.Sources || []).some(x => x.Kind === 'Craft')) return false;
    if (source === 'summoner' && !isSummoner(unit)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'name') return a.Id.localeCompare(b.Id);
    if (sort === 'dps') return maxDps(b) - maxDps(a) || a.Id.localeCompare(b.Id);
    if (sort === 'price') return (a.Price || 0) - (b.Price || 0) || a.Id.localeCompare(b.Id);
    return (Number(orders[b.Rarity]) || 0) - (Number(orders[a.Rarity]) || 0) || a.Id.localeCompare(b.Id);
  });
}
