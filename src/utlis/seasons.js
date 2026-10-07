const SEASON_ORDER = ["winter", "summer", "spring", "autumn"];

const seasonLabel = (season) =>
  season ? season.charAt(0).toUpperCase() + season.slice(1) : "";

const seasonsFromProducts = (products) => {
  const found = new Set(
    products
      .map((product) => product.type?.trim().toLowerCase())
      .filter(Boolean)
  );
  const known = SEASON_ORDER.filter((season) => found.has(season));
  const extra = [...found].filter((season) => !SEASON_ORDER.includes(season)).sort();
  return [...known, ...extra];
};

export { seasonLabel, seasonsFromProducts };