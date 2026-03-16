import React, { useState, useEffect } from "react";
import { COLORS, styles } from "../../theme";
import { DEFAULT_KLAUSELN } from "../wartung/wartungClauses";
import { DACHPACHT_KLAUSELN } from "../dachpacht/dachpachtClauses";
import { FREIFLAECHE_KLAUSELN } from "../freiflaeche/freiflaecheClauses";
import { BESS_KLAUSELN } from "../bess/bessClauses";
import { getKlauseln, setKlauseln, resetKlauseln, hatEigeneVorlagen } from "../../lib/klauselStore";
import ClauseEditor from "../../components/ClauseEditor";
import Section from "../../components/Section";
import { useToast } from "../../components/Toast";

const PASSWORT = "code1234";

const MODULE = [
  { key: "wartung", label: "Wartung", icon: "\uD83D\uDCCB", defaults: DEFAULT_KLAUSELN },
  { key: "dachpacht", label: "Dachpacht", icon: "\uD83C\uDFE2", defaults: DACHPACHT_KLAUSELN },
  { key: "freiflaeche", label: "Freifl\u00E4che", icon: "\uD83C\uDF3E", defaults: FREIFLAECHE_KLAUSELN },
  { key: "bess", label: "BESS", icon: "\uD83D\uDD0B", defaults: BESS_KLAUSELN },
];

function PasswordGate({ onUnlock }) {
  const [eingabe, setEingabe] = useState("");
  const [fehler, setFehler] = useState(false);

  const pruefen = () => {
    if (eingabe === PASSWORT) {
      onUnlock();
    } else {
      setFehler(true);
      setTimeout(() => setFehler(false), 2000);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", textAlign: "center" }}>
      <div style={styles.card}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>{"\uD83D\uDD12"}</div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
          Vertragsvorlagen
        </div>
        <p style={{ fontSize: 13, color: COLORS.mid, marginBottom: 20 }}>
          Dieser Bereich ist passwortgesch\u00FCtzt.
          Nur berechtigte Personen d\u00FCrfen die Standard-Klauseln bearbeiten.
        </p>
        <input
          type="password"
          value={eingabe}
          onChange={(e) => setEingabe(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && pruefen()}
          placeholder="Passwort eingeben"
          style={{
            ...styles.input,
            textAlign: "center",
            fontSize: 15,
            marginBottom: 12,
            borderColor: fehler ? "#D32F2F" : undefined,
          }}
          autoFocus
        />
        {fehler && (
          <div
            role="alert"
            style={{ color: "#D32F2F", fontSize: 12, fontWeight: 600, marginBottom: 8 }}
          >
            Falsches Passwort
          </div>
        )}
        <button style={styles.btnPrimary} onClick={pruefen}>
          Entsperren
        </button>
      </div>
    </div>
  );
}

export default function Vorlagen() {
  const showToast = useToast();
  const [freigeschaltet, setFreigeschaltet] = useState(false);
  const [aktivesModul, setAktivesModul] = useState("wartung");
  const [klauselState, setKlauselState] = useState({});

  // Beim Freischalten: alle Module laden
  useEffect(() => {
    if (!freigeschaltet) return;
    const state = {};
    MODULE.forEach((m) => {
      state[m.key] = getKlauseln(m.key, m.defaults);
    });
    setKlauselState(state);
  }, [freigeschaltet]);

  if (!freigeschaltet) {
    return <PasswordGate onUnlock={() => setFreigeschaltet(true)} />;
  }

  const aktuellesModul = MODULE.find((m) => m.key === aktivesModul);
  const klauseln = klauselState[aktivesModul] || [];

  const handleSpeichern = () => {
    setKlauseln(aktivesModul, klauseln);
    showToast(`Vorlagen f\u00FCr ${aktuellesModul.label} gespeichert`, "success");
  };

  const handleReset = () => {
    resetKlauseln(aktivesModul);
    setKlauselState((prev) => ({
      ...prev,
      [aktivesModul]: aktuellesModul.defaults.map((k) => ({ ...k })),
    }));
    showToast(`${aktuellesModul.label}: Auf Standard zur\u00FCckgesetzt`, "warning");
  };

  const handleAlleZuruecksetzen = () => {
    MODULE.forEach((m) => resetKlauseln(m.key));
    const state = {};
    MODULE.forEach((m) => {
      state[m.key] = m.defaults.map((k) => ({ ...k }));
    });
    setKlauselState(state);
    showToast("Alle Vorlagen auf Standard zur\u00FCckgesetzt", "warning");
  };

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
            Vertragsvorlagen bearbeiten
          </h1>
          <span
            style={{
              background: COLORS.green,
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            FREIGESCHALTET
          </span>
        </div>
        <p style={{ fontSize: 12, color: COLORS.mid, margin: 0 }}>
          \u00C4nderungen werden f\u00FCr alle neuen Vertr\u00E4ge \u00FCbernommen. Bestehende Entw\u00FCrfe bleiben unver\u00E4ndert.
        </p>
      </div>

      {/* Modul-Tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {MODULE.map((m) => {
          const istAktiv = aktivesModul === m.key;
          const hatCustom = hatEigeneVorlagen(m.key);
          return (
            <button
              key={m.key}
              onClick={() => setAktivesModul(m.key)}
              style={{
                ...styles.btnOutline,
                background: istAktiv ? COLORS.dark : COLORS.white,
                color: istAktiv ? COLORS.white : COLORS.dark,
                borderColor: istAktiv ? COLORS.dark : "#ddd",
                fontWeight: istAktiv ? 700 : 500,
                fontSize: 12.5,
                padding: "8px 14px",
                position: "relative",
              }}
            >
              {m.icon} {m.label}
              {hatCustom && (
                <span
                  style={{
                    position: "absolute",
                    top: -3,
                    right: -3,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: COLORS.blue,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Info-Box */}
      <div
        style={{
          background: hatEigeneVorlagen(aktivesModul) ? COLORS.blue + "15" : "#f9f9f9",
          border: `1px solid ${hatEigeneVorlagen(aktivesModul) ? COLORS.blue + "40" : "#eee"}`,
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 14,
          fontSize: 12,
          color: COLORS.mid,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16 }}>{aktuellesModul.icon}</span>
        <span>
          <strong>{aktuellesModul.label}</strong> &mdash;{" "}
          {klauseln.length} Klauseln
          {hatEigeneVorlagen(aktivesModul)
            ? " (eigene Vorlagen aktiv)"
            : " (Standard)"}
        </span>
      </div>

      {/* Klausel-Editor */}
      <Section title={`${aktuellesModul.label} \u2013 Klauseln bearbeiten`} icon={aktuellesModul.icon}>
        <ClauseEditor
          klauseln={klauseln}
          setKlauseln={(updater) => {
            const neueKlauseln = typeof updater === "function" ? updater(klauseln) : updater;
            setKlauselState((prev) => ({ ...prev, [aktivesModul]: neueKlauseln }));
          }}
          defaultKlauseln={aktuellesModul.defaults}
        />
      </Section>

      {/* Aktionsleiste */}
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        <button style={styles.btnOutline} onClick={handleReset}>
          {"\u21BA"} {aktuellesModul.label} zur\u00FCcksetzen
        </button>
        <button
          style={{ ...styles.btnPrimary, fontSize: 14, padding: "10px 24px" }}
          onClick={handleSpeichern}
        >
          Vorlagen speichern
        </button>
      </div>

      {/* Alle zurücksetzen */}
      <div style={{ textAlign: "center", marginTop: 24, paddingBottom: 20 }}>
        <button
          style={{
            background: "none",
            border: "none",
            color: "#D32F2F",
            fontSize: 11.5,
            cursor: "pointer",
            textDecoration: "underline",
            fontFamily: "'DM Sans', sans-serif",
          }}
          onClick={handleAlleZuruecksetzen}
        >
          Alle Module auf Standard zur\u00FCcksetzen
        </button>
      </div>
    </div>
  );
}
