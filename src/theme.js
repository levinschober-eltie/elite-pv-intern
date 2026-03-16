// ============================================================
// ELITE PV CI – Farben, Fonts, Shared Styles
// ============================================================

export const COLORS = {
  yellow: "#F5C518",
  blue: "#4AB4D4",
  dark: "#1C1C1C",
  grey: "#2D2D2D",
  mid: "#888",
  light: "#F7F8FA",
  green: "#2E7D32",
  white: "#fff",
  red: "#D32F2F",
  lightBlue: "#f0f9ff",
  warningBg: "#FFF3CD",
  warningBorder: "#F5C518",
  warningText: "#856404",
};

export const FONT = "'DM Sans', sans-serif";

// ============================================================
// SHARED STYLES
// ============================================================
export const styles = {
  // Layout
  app: {
    fontFamily: FONT,
    background: COLORS.light,
    minHeight: "100vh",
    color: COLORS.dark,
  },

  // Form-Elemente
  label: {
    display: "block",
    fontSize: 11,
    color: COLORS.mid,
    marginBottom: 2,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  input: {
    width: "100%",
    padding: "7px 9px",
    border: "1.5px solid #ddd",
    borderRadius: 6,
    fontSize: 13.5,
    fontFamily: "inherit",
    background: "#FFFEF5",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "7px 9px",
    border: "1.5px solid #ddd",
    borderRadius: 6,
    fontSize: 13.5,
    fontFamily: "inherit",
    background: "#FFFEF5",
    boxSizing: "border-box",
    appearance: "auto",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "9px 16px",
  },

  // Card / Section
  card: {
    background: COLORS.white,
    borderRadius: 11,
    padding: "18px 22px",
    marginBottom: 12,
    boxShadow: "0 1px 5px rgba(0,0,0,.05)",
    border: "1px solid #e8e8e8",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    background: COLORS.dark,
    color: COLORS.white,
    padding: "9px 14px",
    borderRadius: "9px 9px 0 0",
    margin: "-18px -22px 14px",
    fontWeight: 700,
    fontSize: 13.5,
  },

  // Buttons
  btnPrimary: {
    background: COLORS.yellow,
    color: COLORS.dark,
    border: "none",
    borderRadius: 7,
    padding: "10px 22px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
  },
  btnBlue: {
    background: COLORS.blue,
    color: COLORS.white,
    border: "none",
    borderRadius: 7,
    padding: "10px 22px",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
  },
  btnOutline: {
    background: "transparent",
    color: COLORS.dark,
    border: `2px solid ${COLORS.dark}`,
    borderRadius: 7,
    padding: "8px 18px",
    fontSize: 12.5,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },

  // Toggle
  toggle: (active) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12.5,
    fontWeight: 600,
    border: `2px solid ${active ? COLORS.blue : "#ddd"}`,
    background: active ? COLORS.blue + "15" : COLORS.white,
    color: active ? COLORS.blue : COLORS.mid,
    userSelect: "none",
  }),

  // Tab-Navigation
  tabBar: {
    display: "flex",
    gap: 0,
    background: "#e0e0e0",
    borderRadius: 9,
    padding: 2,
    marginBottom: 14,
  },
  tabItem: (active) => ({
    flex: 1,
    padding: "9px 0",
    borderRadius: 7,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 12,
    background: active ? COLORS.dark : "transparent",
    color: active ? COLORS.yellow : COLORS.mid,
    border: "none",
    fontFamily: "inherit",
    textAlign: "center",
  }),

  // Ergebnis
  resultBox: {
    background: `linear-gradient(135deg, ${COLORS.dark}, ${COLORS.grey})`,
    borderRadius: 11,
    padding: 22,
    color: COLORS.white,
  },
  resultAmount: {
    fontSize: 24,
    fontWeight: 800,
    color: COLORS.yellow,
    letterSpacing: -0.4,
  },
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 12,
  },
  resultCell: {
    background: "rgba(255,255,255,.07)",
    borderRadius: 7,
    padding: "10px 14px",
  },

  // Detail-Zeile
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 0",
    borderBottom: "1px solid #f0f0f0",
    fontSize: 12.5,
  },

  // Klauseln
  clauseBox: {
    background: COLORS.light,
    borderRadius: 7,
    padding: "10px 12px",
    marginBottom: 8,
    border: "1px solid #e4e4e4",
  },
  clauseTitle: {
    fontWeight: 700,
    fontSize: 12.5,
    color: COLORS.dark,
    marginBottom: 5,
  },
  clauseTextarea: {
    width: "100%",
    minHeight: 55,
    border: "1px solid #ddd",
    borderRadius: 5,
    padding: 7,
    fontSize: 12,
    fontFamily: "inherit",
    resize: "vertical",
    lineHeight: 1.45,
    background: COLORS.white,
    boxSizing: "border-box",
  },

  // Warnung / Fehler
  warnung: {
    background: COLORS.warningBg,
    border: `1px solid ${COLORS.warningBorder}`,
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 12,
    color: COLORS.warningText,
    marginBottom: 10,
  },
  fehler: {
    color: COLORS.red,
    fontSize: 10.5,
    marginTop: 2,
  },
};
