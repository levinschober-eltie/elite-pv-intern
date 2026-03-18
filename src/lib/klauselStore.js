// ============================================================
// KLAUSEL-STORE – localStorage-Verwaltung für Vertragsvorlagen
// ============================================================

const STORAGE_PREFIX = "elite-pv-klauseln-";

/**
 * Gibt die gespeicherten Klauseln für ein Modul zurück.
 * Falls keine gespeichert sind, werden die Defaults zurückgegeben.
 */
export function getKlauseln(modulKey, defaults) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + modulKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Neue Klauseln aus defaults ergänzen, die im Store fehlen
        const storedIds = new Set(parsed.map((k) => k.id));
        const missing = defaults.filter((d) => !storedIds.has(d.id));
        return [...parsed, ...missing];
      }
    }
  } catch (_) {
    // Fehlerhafte Daten ignorieren
  }
  return defaults.map((k) => ({ ...k }));
}

/**
 * Speichert bearbeitete Klauseln für ein Modul.
 */
export function setKlauseln(modulKey, klauseln) {
  try {
    localStorage.setItem(STORAGE_PREFIX + modulKey, JSON.stringify(klauseln));
  } catch (_) {
    // Storage voll – ignorieren
  }
}

/**
 * Löscht gespeicherte Klauseln (Reset auf Defaults).
 */
export function resetKlauseln(modulKey) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + modulKey);
  } catch (e) {
    console.error("resetKlauseln fehlgeschlagen:", e);
  }
}

/**
 * Prüft ob für ein Modul eigene Vorlagen gespeichert sind.
 */
export function hatEigeneVorlagen(modulKey) {
  try {
    return localStorage.getItem(STORAGE_PREFIX + modulKey) !== null;
  } catch (e) {
    console.error("hatEigeneVorlagen fehlgeschlagen:", e);
    return false;
  }
}

export const MODUL_KEYS = {
  wartung: "wartung",
  dachpacht: "dachpacht",
  freiflaeche: "freiflaeche",
  bess: "bess",
  leitungsweg: "leitungsweg",
  bauleitplanung: "bauleitplanung",
};
