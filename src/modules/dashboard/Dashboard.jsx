import React from "react";
import { useNavigate } from "react-router-dom";
import { COLORS, styles } from "../../theme";

const MODULE = [
  {
    key: "wartung",
    icon: "📋",
    label: "Wartung",
    status: "Aktiv",
    color: COLORS.yellow,
    path: "/wartung",
  },
  {
    key: "dachpacht",
    icon: "🏢",
    label: "Dachpacht",
    status: "Aktiv",
    color: COLORS.blue,
    path: "/dachpacht",
  },
  {
    key: "freiflaeche",
    icon: "🌾",
    label: "Freifläche",
    status: "Aktiv",
    color: COLORS.green,
    path: "/freiflaeche",
  },
  {
    key: "bess",
    icon: "🔋",
    label: "BESS",
    status: "Aktiv",
    color: "#E65100",
    path: "/bess",
  },
  {
    key: "kunden",
    icon: "👥",
    label: "Kunden",
    status: "Aktiv",
    color: "#7B1FA2",
    path: "/kunden",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 920, margin: "0 auto" }}>
      {/* Begrüßung */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>
          Willkommen bei Elite PV Intern
        </h1>
        <p style={{ fontSize: 13, color: COLORS.mid, margin: 0 }}>
          Vertragsplattform für PV-Projekte
        </p>
      </div>

      {/* Modul-Kacheln */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {MODULE.map((mod) => (
          <div
            key={mod.key}
            onClick={() => navigate(mod.path)}
            style={{
              ...styles.card,
              cursor: "pointer",
              borderLeft: `4px solid ${mod.color}`,
              transition: "transform 0.15s, box-shadow 0.15s",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 1px 5px rgba(0,0,0,.05)";
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 6 }}>{mod.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              {mod.label}
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: mod.status === "Aktiv" ? COLORS.green : COLORS.mid,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: mod.status === "Aktiv" ? COLORS.green : COLORS.mid,
                }}
              />
              {mod.status}
            </div>
          </div>
        ))}
      </div>

      {/* Statistik-Platzhalter */}
      <div
        style={{
          ...styles.card,
          textAlign: "center",
          padding: "28px 22px",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
          📊 Statistiken
        </div>
        <p style={{ fontSize: 13, color: COLORS.mid, margin: 0 }}>
          Statistiken werden in Kürze verfügbar
        </p>
      </div>

      {/* Schnellzugriff */}
      <div style={{ ...styles.card, marginTop: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
          ⚡ Schnellzugriff
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {MODULE.map((mod) => (
            <button
              key={mod.key}
              onClick={() => navigate(mod.path)}
              style={{
                ...styles.btnPrimary,
                background: mod.color,
                color: mod.color === COLORS.yellow ? COLORS.dark : COLORS.white,
                fontSize: 12,
                padding: "8px 16px",
              }}
            >
              {mod.icon} {mod.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
