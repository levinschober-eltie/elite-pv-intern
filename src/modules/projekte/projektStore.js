// ============================================================
// PROJEKT STORE – localStorage CRUD
// ============================================================
const STORAGE_KEY = "elite-pv-projekte";

export function loadProjekte() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProjekte(projekte) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projekte));
    return true;
  } catch (e) {
    console.error("saveProjekte fehlgeschlagen:", e);
    return false;
  }
}

export function getProjektById(id) {
  const projekte = loadProjekte();
  return projekte.find((p) => p.id === id) || null;
}

export function addVertragToProjekt(projektId, ref) {
  // ref = { typ, datum, dateiname }
  const projekte = loadProjekte();
  const index = projekte.findIndex((p) => p.id === projektId);
  if (index === -1) return false;

  const now = new Date().toISOString();
  if (!Array.isArray(projekte[index].vertraege)) {
    projekte[index].vertraege = [];
  }
  projekte[index].vertraege.push(ref);
  projekte[index].geaendertAm = now;

  saveProjekte(projekte);
  return true;
}

export function updateProjekt(id, updates) {
  const projekte = loadProjekte();
  const index = projekte.findIndex((p) => p.id === id);
  if (index === -1) return false;

  const now = new Date().toISOString();
  projekte[index] = { ...projekte[index], ...updates, geaendertAm: now };

  saveProjekte(projekte);
  return true;
}
